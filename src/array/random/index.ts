import { randomInt } from "../../math";

/**
 * 随机打乱数组，返回新数组。
 *
 * @typeParam T - 数组元素类型
 * @param arr - 待打乱的只读数组
 * @returns 打乱顺序后的新数组；空数组返回 []
 *
 * @see {@link https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm Fisher-Yates 洗牌算法}
 * @see {@link sample} 随机取一个元素
 */
export function shuffle<T>(arr: readonly T[]): T[] {
  const result = [...arr];

  for (let i = result.length - 1; i >= 1; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    const temp = result[i] as T;
    result[i] = result[j] as T;
    result[j] = temp;
  }

  return result;
}

/**
 * 从数组中随机取一个元素。
 *
 * @typeParam T - 数组元素类型
 * @param arr - 源数组
 * @returns 随机选中的元素；数组为空时返回 undefined
 *
 */
export function sample<T>(arr: readonly T[]): T | undefined {
  // Math.random() 的范围是 [0, 1)，所以下标不会越界；空数组时下标为 0，取到 undefined
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 从数组中随机取出 count 个不重复的元素。
 *
 * @typeParam T - 数组元素类型
 * @param arr - 源数组
 * @param count - 需要取出的元素个数，必须是不超过数组长度的非负整数
 * @returns 随机取出的元素组成的新数组；count 为 0 时返回 []
 * @throws {RangeError} count 不是非负整数，或大于数组长度时抛出
 *
 * @see {@link sample} 随机取一个元素
 * @see {@link shuffle} 随机打乱整个数组
 */
export function sampleSize<T>(arr: readonly T[], count: number): T[] {
  if (!Number.isInteger(count) || count < 0) {
    throw new RangeError("Count must be a non-negative integer.");
  }

  if (count > arr.length) {
    throw new RangeError("Count must be less than or equal to the length of the array.");
  }

  const result: T[] = [];
  const selected: Set<number> = new Set();

  for (let step = arr.length - count; step < arr.length; step++) {
    let index = randomInt(0, step + 1);

    if (selected.has(index)) {
      index = step;
    }

    selected.add(index);

    result.push(arr[index] as T);
  }

  return result;
}
