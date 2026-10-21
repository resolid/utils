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

export type TypedArray = NumberTypedArray | BigInt64Array | BigUint64Array;

export type Uint8Array_ = ReturnType<Uint8Array["slice"]>;

export function toUint8Array(data: string | ArrayBuffer | NumberTypedArray): Uint8Array_ {
  if (typeof data === "string") {
    return new TextEncoder().encode(data);
  }
  return new Uint8Array(data);
}
