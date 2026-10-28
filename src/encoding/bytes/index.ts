/**
 * 元素类型为 `number` 的 TypedArray 联合类型。
 *
 * 不包含 `BigInt64Array` 和 `BigUint64Array`，因为该函数只接受元素为 number 的 TypedArray。
 */
export type NumberTypedArray =
  | Uint8Array
  | Uint8ClampedArray
  | Int8Array
  | Uint16Array
  | Int16Array
  | Uint32Array
  | Int32Array
  | Float32Array
  | Float64Array;

/**
 * 所有 TypedArray 的联合类型，包含元素为 BigInt 的 `BigInt64Array` 和 `BigUint64Array`。
 */
export type TypedArray = NumberTypedArray | BigInt64Array | BigUint64Array;

/**
 * 由非共享 `ArrayBuffer` 支撑的 `Uint8Array`。
 *
 * 与 `Uint8Array["slice"]` 的返回类型保持一致，避免 `SharedArrayBuffer` 引起的类型不兼容。
 */
export type Uint8Array_ = ReturnType<Uint8Array["slice"]>;

/**
 * 将字符串、`ArrayBuffer` 或 TypedArray 转换为 `Uint8Array`。
 *
 * - 字符串按 UTF-8 编码。
 * - `ArrayBuffer` 会被包装成视图，与原始缓冲区共享内存，不复制数据。
 * - TypedArray 会按底层字节重新解释并复制到新的缓冲区；多字节类型（如 `Uint16Array`、`Float64Array`）会展开成完整的字节序列。
 *
 * 多字节 TypedArray 的字节序与运行环境一致，主流 JavaScript 引擎均为小端。
 *
 * @param data - 待转换的字符串、`ArrayBuffer` 或元素为 number 的 TypedArray
 * @returns 转换后的 `Uint8Array`
 * @throws {TypeError} 传入 `BigInt64Array` 或 `BigUint64Array` 时抛出
 *
 * @see {@link hexEncode} 将字节编码为十六进制字符串
 */
export function toUint8Array(data: string | ArrayBuffer | NumberTypedArray): Uint8Array_ {
  if (typeof data === "string") {
    return new TextEncoder().encode(data);
  }

  if (ArrayBuffer.isView(data)) {
    if (data instanceof BigInt64Array || data instanceof BigUint64Array) {
      throw new TypeError("BigInt typed arrays cannot be converted to Uint8Array.");
    }

    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength).slice();
  }

  return new Uint8Array(data);
}
