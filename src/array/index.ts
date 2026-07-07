import type { MaybeArray } from "../types";
import { isArray } from "../is";

/**
 * 将任意值转换为数组形式
 *
 * - 如果传入的值本身就是数组，则原样返回。
 * - 如果传入的是单个值，则包装成单元素数组返回。
 *
 * @param input - 单个值或数组
 * @returns 始终返回一个数组
 */
export function asArray<T>(input: MaybeArray<T>): T[] {
  return isArray(input) ? input : [input];
}

/**
 * 将数组按指定大小分块
 *
 * @template T 数组元素类型
 * @param arr 要分块的数组
 * @param size 每块的最大长度
 * @returns 分块后的二维数组
 */
export function chunk<T>(arr: readonly T[], size: number): T[][] {
  const result: T[][] = [];

  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }

  return result;
}

/**
 * 在指定位置插入一个元素，返回一个新的数组（不会修改原数组）
 *
 * @param input - 原始数组
 * @param index - 要插入的位置索引（从 0 开始）
 * @param item - 要插入的元素
 * @returns 一个包含新元素的新数组
 *
 */
export function insert<T>(input: T[], index: number, item: T): T[] {
  return [...input.slice(0, index), item, ...input.slice(index)];
}

/**
 * 从数组中移除指定的元素
 *
 * @template T - 数组元素的类型
 * @param {T[]} input - 要操作的数组
 * @param {T} item - 需要移除的元素
 * @returns {boolean} - 如果数组中存在该元素并成功移除返回 true，否则返回 false
 */
export function remove<T>(input: T[], item: T): boolean {
  const index = input.indexOf(item);

  if (index === -1) {
    return false;
  }

  input.splice(index, 1);

  return true;
}

/**
 * 将一个数组按条件函数（predicate）分成两组
 *
 * @param input - 要处理的数组（只读，不会被修改）
 * @param predicate - 判断函数，返回 true 的元素会放入第一组，否则放入第二组
 * @returns [符合条件的数组, 不符合条件的数组]
 */
export function partition<T>(input: T[], predicate: (element: T) => boolean): [T[], T[]] {
  const left: T[] = [];
  const right: T[] = [];

  for (const element of input) {
    if (predicate(element)) {
      left.push(element);
    } else {
      right.push(element);
    }
  }

  return [left, right];
}
