import { Readable } from "node:stream";
import { serve } from "srvx";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { retry, withTimeout } from "../../promise";
import { ufetch } from "../lib/fetch";
import { parseQuery } from "../lib/url";

describe("ufetch", () => {
  let listener: ReturnType<typeof serve>;

  const getUrl = (url: string = "/") => listener.url! + (url.replace(/^\//, "") || "");

  const fetch = vi.spyOn(globalThis, "fetch");

  beforeAll(async () => {
    listener = await serve({
      async fetch(request) {
        const url = new URL(request.url);

        if (url.pathname === "/ok") {
          return new Response("ok");
        }

        if (url.pathname === "/params") {
          return Response.json(Object.fromEntries(url.searchParams));
        }

        if (url.pathname.startsWith("/url/")) {
          return new Response(url.pathname + url.search);
        }

        if (url.pathname === "/echo") {
          return Response.json({
            path: url.pathname + url.search,
            body: request.method === "POST" ? await request.text() : undefined,
            headers: Object.fromEntries(request.headers),
          });
        }

        if (url.pathname === "/post") {
          let body: unknown;
          const contentType = request.headers.get("content-type") ?? "";

          if (contentType.includes("multipart/form-data")) {
            body = await request.text();
          } else {
            const text = await request.text();

            if (!text) {
              body = undefined;
            } else {
              if (contentType.startsWith("application/x-www-form-urlencoded")) {
                body = parseQuery(text);
              } else {
                try {
                  body = JSON.parse(text);
                } catch {
                  return new Response("Invalid JSON body", {
                    status: 400,
                    statusText: "Bad Request",
                  });
                }
              }
            }
          }

          return Response.json({
            body,
            headers: Object.fromEntries(request.headers),
          });
        }

        if (url.pathname === "/binary") {
          return new Response(new Blob(["binary"]), {
            headers: {
              "content-type": "application/octet-stream",
            },
          });
        }

        if (url.pathname === "/403") {
          return new Response("Forbidden", {
            status: 403,
            statusText: "Forbidden",
          });
        }

        if (url.pathname === "/408") {
          return new Response(null, {
            status: 408,
          });
        }

        if (url.pathname === "/204") {
          return new Response(null, {
            status: 204,
          });
        }

        if (url.pathname === "/timeout") {
          await new Promise((resolve) => {
            setTimeout(resolve, 5000);
          });

          return new Response(null, {
            status: 408,
          });
        }

        return new Response(null, {
          status: 404,
          statusText: "Not Found",
        });
      },
    }).ready();
  });

  afterAll(() => {
    listener.close().catch(console.error);
  });

  beforeEach(() => {
    fetch.mockClear();
  });

  it("should return plain text response", async () => {
    expect(await ufetch(getUrl("ok"))).to.equal("ok");
  });

  it("should use custom parseResponse", async () => {
    let called = 0;

    const parser = (r: string) => {
      called++;
      return `C${r}`;
    };
    expect(await ufetch(getUrl("ok"), { parseResponse: parser })).to.equal("Cok");

    expect(called).to.equal(1);
  });

  it("should support explicit responseFormat", async () => {
    expect(await ufetch(getUrl("params?test=true"), { responseFormat: "json" })).to.deep.equal({
      test: "true",
    });

    expect(await ufetch(getUrl("params?test=true"), { responseFormat: "blob" })).to.be.instanceOf(
      Blob,
    );

    expect(
      JSON.parse(await ufetch(getUrl("params?test=true"), { responseFormat: "text" })),
    ).to.deep.equal({
      test: "true",
    });

    expect(
      await ufetch(getUrl("params?test=true"), { responseFormat: "arrayBuffer" }),
    ).to.be.instanceOf(ArrayBuffer);
  });

  it("should return Blob for binary content-type", async () => {
    expect(await ufetch(getUrl("binary"))).to.be.instanceOf(Blob);
  });

  it("should resolve relative URL with baseUrl", async () => {
    expect(await ufetch("x?foo=123", { baseUrl: getUrl("url/") })).to.equal("/url/x?foo=123");
  });

  it("should automatically stringify JSON request body", async () => {
    const { body } = await ufetch<{ body: object }>(getUrl("post"), {
      method: "POST",
      body: { num: 42 },
    });

    expect(body).to.deep.eq({ num: 42 });

    const body2 = (
      await ufetch<{ body: { num: number }[] }>(getUrl("post"), {
        method: "POST",
        body: [{ num: 42 }, { num: 43 }],
      })
    ).body;
    expect(body2).to.deep.eq([{ num: 42 }, { num: 43 }]);

    let body3;

    await ufetch(getUrl("post"), {
      method: "POST",
      body: { num: 42 },
      onResponse(ctx) {
        body3 = ctx.options.body;
      },
    });

    expect(JSON.parse(body3! as string)).toMatchObject({ num: 42 });

    const headerFetches = [
      [["X-header", "1"]],
      { "x-header": "1" },
      new Headers({ "x-header": "1" }),
    ];

    for (const sentHeaders of headerFetches) {
      // oxlint-disable-next-line no-await-in-loop
      const { headers } = await ufetch<{ headers: HeadersInit }>(getUrl("post"), {
        method: "POST",
        body: { num: 42 },
        headers: sentHeaders as HeadersInit,
      });

      expect(headers).to.include({ "x-header": "1" });
      expect(headers).to.include({ accept: "application/json" });
    }
  });

  it("should not stringify body when content-type is not JSON", async () => {
    const message = '"Hallo von Pascal"';

    const { body } = await ufetch<{ body: string }>(getUrl("echo"), {
      method: "POST",
      body: message,
      headers: { "Content-Type": "text/plain" },
    });

    expect(body).to.deep.eq(message);
  });

  it("should send Buffer body without serialization", async () => {
    const message = "Hallo von Pascal";

    const { body } = await ufetch<{ body: BufferConstructor }>(getUrl("echo"), {
      method: "POST",
      body: Buffer.from("Hallo von Pascal"),
      headers: { "Content-Type": "text/plain" },
    });

    expect(body).to.deep.eq(message);
  });

  it("should send ReadableStream body", async () => {
    const message = "Hallo von Pascal";

    const { body } = await ufetch<{ body: ReadableStream }>(getUrl("echo"), {
      method: "POST",
      headers: {
        "content-length": "16",
      },
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(message));
          controller.close();
        },
      }),
    });

    expect(body).to.deep.eq(message);
  });

  it("should send Node Readable body", async () => {
    const message = "Hallo von Pascal";

    const { body } = await ufetch<{ body: Readable }>(getUrl("echo"), {
      method: "POST",
      headers: {
        "content-length": "16",
      },
      body: new Readable({
        read() {
          this.push(message);
          this.push(null);
        },
      }),
    });
    expect(body).to.deep.eq(message);
  });

  it("should bypass FormData serialization", async () => {
    const data = new FormData();
    data.append("foo", "bar");

    const { body } = await ufetch<{ body: typeof data }>(getUrl("post"), {
      method: "POST",
      body: data,
    });

    expect(body).to.include('form-data; name="foo"');
  });

  it("should bypass URLSearchParams serialization", async () => {
    const data = new URLSearchParams({ foo: "bar" });

    const { body } = await ufetch<{ body: typeof data }>(getUrl("post"), {
      method: "POST",
      body: data,
    });

    expect(body).toMatchObject({ foo: "bar" });
  });

  it("should return undefined for 204 response", async () => {
    const error = (await ufetch(getUrl("404")).catch((e) => e)) as Error;

    expect(error.toString()).toBe(`FetchError: [GET] "${getUrl("404")}": 404 Not Found`);
  });

  it("should return undefined for no body status", async () => {
    expect(await ufetch(getUrl("204"))).toBe(undefined);
  });

  it("should return undefined for HEAD request", async () => {
    expect(await ufetch(getUrl("/ok"), { method: "HEAD" })).toBeUndefined();
  });

  it("should abort request on timeout", async () => {
    const noTimeout = ufetch(getUrl("timeout")).catch(() => "no timeout");
    const timeout = withTimeout(ufetch(getUrl("timeout")), 100).catch(() => "timeout");
    const race = await Promise.race([noTimeout, timeout]);

    expect(race).to.equal("timeout");
  });

  it("should preserve TimeoutError as cause when aborted by timeout", async () => {
    await withTimeout(ufetch(getUrl("timeout")), 100).catch((error) => {
      expect(error.name).to.equal("TimeoutError");
    });
  });

  it("should respect numeric retry delay", async () => {
    const slow = retry(
      () => {
        return ufetch<string>(getUrl("408"));
      },
      { retries: 2, delay: 100 },
    ).catch(() => "slow");

    const fast = retry(
      () => {
        return ufetch<string>(getUrl("408"));
      },
      { retries: 2, delay: 1 },
    ).catch(() => "fast");

    const race = await Promise.race([slow, fast]);
    expect(race).to.equal("fast");
  });

  it("should abort retries when signal is aborted", async () => {
    const controller = new AbortController();

    async function abortHandle() {
      controller.abort();
      await retry(() => ufetch("ok"), { retries: 3, signal: controller.signal });
    }

    await expect(abortHandle()).rejects.toThrow(/aborted/);
  });

  it("should deeply merge request options with defaults", async () => {
    const _customFetch = ufetch.create({
      query: {
        a: 0,
        b: 2,
      },
      headers: {
        "x-header-a": "0",
        "x-header-b": "2",
      },
    });
    const { headers, path } = await _customFetch<{ headers: unknown; path: string }>(
      getUrl("echo"),
      {
        query: {
          a: 1,
          c: 3,
        },
        headers: {
          "Content-Type": "text/plain",
          "x-header-a": "1",
          "x-header-c": "3",
        },
      },
    );

    expect(headers).to.include({
      "x-header-a": "1",
      "x-header-b": "2",
      "x-header-c": "3",
    });

    const parseParams = (str: string) =>
      Object.fromEntries(new URL(str, "http://_").searchParams.entries());

    expect(parseParams(path)).toMatchObject({ a: "1", b: "2", c: "3" });
  });

  it("should preserve headers from Request instance", async () => {
    expect(
      await ufetch<{ headers: unknown }>(
        new Request(getUrl("echo"), { headers: { foo: "1" } }),
        {},
      ).then((r) => r.headers),
    ).toMatchObject({ foo: "1" });

    expect(
      await ufetch<{ headers: unknown }>(new Request(getUrl("echo"), { headers: { foo: "1" } }), {
        headers: { foo: "2", bar: "3" },
      }).then((r) => r.headers),
    ).toMatchObject({ foo: "2", bar: "3" });
  });

  it("should propagate errors thrown by hooks", async () => {
    // onRequest
    await expect(
      ufetch(getUrl("/ok"), {
        onRequest: () => {
          throw new Error("error in onRequest");
        },
      }),
    ).rejects.toThrow("error in onRequest");

    // onRequestError
    await expect(
      ufetch("/", {
        onRequestError: () => {
          throw new Error("error in onRequestError");
        },
      }),
    ).rejects.toThrow("error in onRequestError");

    // onResponse
    await expect(
      ufetch(getUrl("/ok"), {
        onResponse: () => {
          throw new Error("error in onResponse");
        },
      }),
    ).rejects.toThrow("error in onResponse");

    await expect(
      ufetch(getUrl("/403"), {
        onResponseError: () => {
          throw new Error("error in onResponseError");
        },
      }),
    ).rejects.toThrow("error in onResponseError");
  });

  it("should call hooks in the correct lifecycle", async () => {
    const onRequest = vi.fn();
    const onRequestError = vi.fn();
    const onResponse = vi.fn();
    const onResponseError = vi.fn();

    await ufetch(getUrl("/ok"), {
      onRequest,
      onRequestError,
      onResponse,
      onResponseError,
    });

    expect(onRequest).toHaveBeenCalledOnce();
    expect(onRequestError).not.toHaveBeenCalled();
    expect(onResponse).toHaveBeenCalledOnce();
    expect(onResponseError).not.toHaveBeenCalled();

    onRequest.mockReset();
    onRequestError.mockReset();
    onResponse.mockReset();
    onResponseError.mockReset();

    await ufetch(getUrl("/403"), {
      onRequest,
      onRequestError,
      onResponse,
      onResponseError,
    }).catch((error) => error);

    expect(onRequest).toHaveBeenCalledOnce();
    expect(onRequestError).not.toHaveBeenCalled();
    expect(onResponse).toHaveBeenCalledOnce();
    expect(onResponseError).toHaveBeenCalledOnce();

    onRequest.mockReset();
    onRequestError.mockReset();
    onResponse.mockReset();
    onResponseError.mockReset();

    await ufetch(getUrl("/ok"), {
      onRequest: [onRequest, onRequest],
      onRequestError: [onRequestError, onRequestError],
      onResponse: [onResponse, onResponse],
      onResponseError: [onResponseError, onResponseError],
    });

    expect(onRequest).toHaveBeenCalledTimes(2);
    expect(onRequestError).not.toHaveBeenCalled();
    expect(onResponse).toHaveBeenCalledTimes(2);
    expect(onResponseError).not.toHaveBeenCalled();

    onRequest.mockReset();
    onRequestError.mockReset();
    onResponse.mockReset();
    onResponseError.mockReset();

    await ufetch(getUrl("/403"), {
      onRequest: [onRequest, onRequest],
      onRequestError: [onRequestError, onRequestError],
      onResponse: [onResponse, onResponse],
      onResponseError: [onResponseError, onResponseError],
    }).catch((error) => error);

    expect(onRequest).toHaveBeenCalledTimes(2);
    expect(onRequestError).not.toHaveBeenCalled();
    expect(onResponse).toHaveBeenCalledTimes(2);
    expect(onResponseError).toHaveBeenCalledTimes(2);
  });
});
