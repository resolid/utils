import type { Readable } from "node:stream";
import type { MaybeArray } from "../../types";
import { asArray } from "../../array";
import {
  isArray,
  isFunction,
  isNull,
  isPlainObject,
  isString,
  isTruthy,
  isUndefined,
} from "../../is";
import { type QueryObject, withBase, withQuery } from "./url";

type ResponseFormats = {
  blob: Blob;
  text: string;
  arrayBuffer: ArrayBuffer;
  stream: ReadableStream<Uint8Array>;
  native: Response;
};

type ResponseFormat = keyof ResponseFormats | "json";

export type InferResponseFormat<
  R extends ResponseFormat,
  T = unknown,
> = R extends keyof ResponseFormats ? ResponseFormats[R] : T;

export type FetchOptions<R extends ResponseFormat = ResponseFormat, T = unknown> = Omit<
  RequestInit,
  "body"
> &
  FetchHooks<T, R> & {
    baseUrl?: string;
    body?: BodyInit | Readable | QueryObject[] | QueryObject | null;
    query?: QueryObject;
    responseFormat?: R;
    parseResponse?: (responseText: string) => T;
    duplex?: "half" | undefined;
    // oxlint-disable-next-line typescript/consistent-type-imports
    dispatcher?: InstanceType<typeof import("undici").Dispatcher>;
  };

type ResolvedFetchOptions<R extends ResponseFormat = ResponseFormat, T = unknown> = FetchOptions<
  R,
  T
> & {
  headers: Headers;
};

type ResponseData<R extends ResponseFormat, T> = InferResponseFormat<R, T>;

type FetchResponse<T = unknown> = Response & {
  _data?: T;
};

type FetchRequestContext<T = unknown, R extends ResponseFormat = ResponseFormat> = {
  request: RequestInfo;
  options: ResolvedFetchOptions<R, T>;
};

type FetchResponseContext<
  T = unknown,
  R extends ResponseFormat = ResponseFormat,
> = FetchRequestContext<T, R> & {
  response: FetchResponse<ResponseData<R, T>>;
};

type FetchErrorContext<
  T = unknown,
  R extends ResponseFormat = ResponseFormat,
> = FetchRequestContext<T, R> & {
  error: Error;
};

type FetchHook<C> = (context: C) => Promise<void> | void;

type FetchHooks<T = unknown, R extends ResponseFormat = ResponseFormat> = {
  onRequest?: MaybeArray<FetchHook<FetchRequestContext<T, R>>>;
  onRequestError?: MaybeArray<FetchHook<FetchErrorContext<T, R>>>;
  onResponse?: MaybeArray<FetchHook<FetchResponseContext<T, R>>>;
  onResponseError?: MaybeArray<FetchHook<FetchResponseContext<T, R>>>;
};

export type Fetch = typeof globalThis.fetch;

export type CreateFetchOptions = {
  defaults?: FetchOptions;
  fetch?: Fetch;
};

export type FetchInstance = {
  <T = unknown, R extends ResponseFormat = "json">(
    request: RequestInfo,
    options?: FetchOptions<R, T>,
  ): Promise<InferResponseFormat<R, T>>;
  native: Fetch;
  create: (defaults: FetchOptions, globalOptions?: CreateFetchOptions) => FetchInstance;
};

const noBodyStatus = new Set([101, 204, 205, 304]);

export function createFetch(globalOptions: CreateFetchOptions = {}): FetchInstance {
  const { fetch = globalThis.fetch, defaults } = globalOptions;

  const onError = <T = unknown, R extends ResponseFormat = ResponseFormat>(
    ctx: FetchRequestContext<T, R>,
    error: Error | undefined,
    response: Response | undefined,
  ) => {
    const message = error?.message ?? error?.toString();
    const status = response ? `${response.status} ${response.statusText}` : "";
    const method = ((ctx.request as Request).method || ctx.options.method) ?? "GET";
    const url = (ctx.request as Request).url || String(ctx.request as string) || "/";

    const fetchError = new FetchError(
      `[${method}] ${JSON.stringify(url)}: ${status}${message ? ` ${message}` : ""}`,
      error ? { cause: error } : undefined,
    );

    // oxlint-disable-next-line typescript/no-unnecessary-condition
    if (Error.captureStackTrace) {
      Error.captureStackTrace(fetchError, fetchRaw);
    }

    throw fetchError;
  };

  const fetchRaw = async <T = unknown, R extends ResponseFormat = "json">(
    _request: RequestInfo,
    _options: FetchOptions<R, T> = {},
  ) => {
    const context: FetchRequestContext<T, R> = {
      request: _request,
      options: resolveFetchOptions<R, T>(
        _request,
        _options,
        defaults as unknown as FetchOptions<R, T>,
      ),
    };

    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }

    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
    }

    if (isString(context.request)) {
      if (context.options.baseUrl) {
        context.request = withBase(context.request, context.options.baseUrl);
      }

      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
    }

    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJsonSerializable(context.options.body)) {
        const contentType = context.options.headers.get("content-type");

        if (!isString(context.options.body)) {
          context.options.body = contentType?.startsWith("application/x-www-form-urlencoded")
            ? new URLSearchParams(context.options.body as Record<string, string>).toString()
            : JSON.stringify(context.options.body);
        }

        if (!contentType) {
          context.options.headers.set("content-type", "application/json");
        }

        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // oxlint-disable-next-line typescript/unbound-method
        isFunction((context.options.body as ReadableStream).pipeTo) ||
        // oxlint-disable-next-line typescript/unbound-method
        isFunction((context.options.body as unknown as Readable).pipe)
      ) {
        context.options.duplex ??= "half";
      }
    }

    let response;

    try {
      response = await fetch(context.request, context.options as RequestInit);
    } catch (e) {
      const errorContext: FetchErrorContext<T, R> = { ...context, error: e as Error };

      if (context.options.onRequestError) {
        await callHooks(errorContext, context.options.onRequestError);
      }

      return onError(context, errorContext.error, undefined);
    }

    const responseContext: FetchResponseContext<T, R> = { ...context, response };

    const hasBody =
      (isTruthy(response.body) || isTruthy((response as unknown as { _bodyInit: T })._bodyInit)) &&
      !noBodyStatus.has(response.status) &&
      context.options.method !== "HEAD";

    if (hasBody) {
      const responseFormat =
        (context.options.parseResponse ? "json" : context.options.responseFormat) ??
        detectResponseFormat(response.headers.get("content-type") ?? "");

      switch (responseFormat) {
        case "native": {
          responseContext.response._data = undefined;
          break;
        }

        case "json": {
          const data = await response.text();
          if (data) {
            responseContext.response._data = (context.options.parseResponse ?? JSON.parse)(
              data,
            ) as ResponseData<R, T>;
          }

          break;
        }
        case "stream": {
          responseContext.response._data = (response.body ??
            (response as unknown as { _bodyInit: T })._bodyInit) as ResponseData<R, T>;
          break;
        }
        default: {
          responseContext.response._data = (await response[responseFormat]()) as ResponseData<R, T>;
        }
      }
    }

    if (context.options.onResponse) {
      await callHooks(responseContext, context.options.onResponse);
    }

    if (response.status >= 400 && response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(responseContext, context.options.onResponseError);
      }

      return onError(context, undefined, response);
    }

    return responseContext.response;
  };

  const fetchInstance = async function $fetch(request, options) {
    const response = await fetchRaw(request, options);

    if (options?.responseFormat == "native") {
      return response;
    }

    return response._data;
  } as FetchInstance;

  fetchInstance.native = fetch;
  fetchInstance.create = (defaultOptions, customOptions = {}) =>
    createFetch({
      ...globalOptions,
      ...customOptions,
      defaults: {
        ...globalOptions.defaults,
        ...customOptions.defaults,
        ...defaultOptions,
      },
    });

  return fetchInstance;
}

export const ufetch: FetchInstance = createFetch();

const payloadMethods = new Set(["PATCH", "POST", "PUT", "DELETE"]);

function isPayloadMethod(method = "GET"): boolean {
  return payloadMethods.has(method.toUpperCase());
}

const textMimeTypes = new Set([
  "image/svg+xml",
  "application/xml",
  "application/xhtml+xml",
  "text/html",
]);

// oxlint-disable-next-line prefer-named-capture-group
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;

function detectResponseFormat(contentTypeHeader = ""): ResponseFormat {
  if (!contentTypeHeader) {
    return "json";
  }

  const contentType = contentTypeHeader.split(";")[0]?.trim().toLowerCase() ?? "";

  if (JSON_RE.test(contentType)) {
    return "json";
  }

  if (contentType === "text/event-stream") {
    return "stream";
  }

  if (textMimeTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }

  return "blob";
}

function resolveFetchOptions<R extends ResponseFormat = ResponseFormat, T = unknown>(
  request: RequestInfo,
  input: FetchOptions<R, T> | undefined,
  defaults: FetchOptions<R, T> | undefined,
): ResolvedFetchOptions<R, T> {
  const headers = new Headers(defaults?.headers);

  new Headers(input?.headers ?? (request instanceof Request ? request.headers : undefined)).forEach(
    (v, k) => {
      headers.set(k, v);
    },
  );

  let query: QueryObject | undefined;

  if (defaults?.query || input?.query) {
    query = {
      ...defaults?.query,
      ...input?.query,
    };
  }

  return {
    ...defaults,
    ...input,
    query,
    headers,
  };
}

async function callHooks<C>(
  context: C,
  hooks: MaybeArray<FetchHook<C>> | undefined,
): Promise<void> {
  if (hooks) {
    for (const hook of asArray(hooks)) {
      // oxlint-disable-next-line no-await-in-loop
      await hook(context);
    }
  }
}

export function isJsonSerializable(body: unknown): boolean {
  if (isUndefined(body)) {
    return false;
  }

  if (isNull(body)) {
    return true;
  }

  switch (typeof body) {
    case "string":
    case "number":
    case "boolean":
      return true;

    case "object":
      break;

    default:
      return false;
  }

  if (
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof Blob ||
    (typeof ReadableStream !== "undefined" && body instanceof ReadableStream) ||
    body instanceof ArrayBuffer ||
    ArrayBuffer.isView(body)
  ) {
    return false;
  }

  return isArray(body) || isPlainObject(body) || isFunction((body as { toJSON?: unknown }).toJSON);
}

export class FetchError extends Error {
  override name = "FetchError";

  constructor(message: string, opts?: { cause: unknown }) {
    super(message, opts);

    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
