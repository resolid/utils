import type { MaybeArray } from "../../types";
import { isArray } from "../../is";

/**
 * 将任意值转换为数组形式。
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
 * 将数组按固定长度拆分成多个子数组。
 *
 * 最后一组的长度可能小于 size。
 * 不会修改原数组，每个子数组都是通过 slice 得到的浅拷贝。
 *
 * @typeParam T - 数组元素类型
 * @param arr - 待拆分的只读数组
 * @param size - 每组的长度，必须是大于 0 的整数
 * @returns 拆分后的二维数组；空数组返回 []
 * @throws {RangeError} size 不是正整数（包括 0、负数、小数、NaN、Infinity）时抛出
 */
export function chunk<T>(arr: readonly T[], size: number): T[][] {
  if (!Number.isInteger(size) || size <= 0) {
    throw new RangeError("Size must be an integer greater than zero.");
  }

  const result: T[][] = [];

  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }

  return result;
}

/**
 * 将数组拆分为多个分组，每组由具有相同 key 的连续元素组成。
 *
 * @typeParam T - 数组元素类型
 * @param arr - 待分组的只读数组，不会被修改
 * @param mapper - 分组函数，返回值作为元素的 key，每个元素只会调用一次
 * @returns 分组后的二维数组，分组顺序与元素在原数组中的顺序一致；空数组返回 []
 */
export function chunkBy<T>(arr: readonly T[], mapper: (value: T) => unknown): T[][] {
  const result: T[][] = [];

  let current: T[] | undefined;
  let prevKey: unknown;

  for (const value of arr) {
    const key = mapper(value);

    if (current && key === prevKey) {
      current.push(value);
    } else {
      current = [value];
      result.push(current);
    }

    prevKey = key;
  }

  return result;
}

type NotFalsey<T> = Exclude<T, false | null | 0 | 0n | "" | undefined>;

/**
 * 移除数组中所有的假值（false、null、0、-0、0n、""、undefined、NaN）
 *
 * 不会修改原数组，返回新数组，元素顺序保持不变。
 * 只做真值判断，不会递归处理嵌套数组，空数组和空对象属于真值，会被保留。
 *
 * @typeParam T - 数组元素类型
 * @param arr - 待过滤的只读数组
 * @returns 只包含真值的新数组，类型会自动排除假值类型
 */
export function compact<T>(arr: readonly T[]): NotFalsey<T>[] {
  const result: NotFalsey<T>[] = [];

  for (const item of arr) {
    if (item) {
      result.push(item as NotFalsey<T>);
    }
  }

  return result;
}

/**
 * 根据 predicate 的结果把数组拆成两组：满足条件的和不满足条件的。
 *
 * @typeParam T - 数组元素类型
 * @param arr - 待拆分的只读数组
 * @param predicate - 判断函数，参数依次为元素、下标和原数组，返回真值时归入第一组
 * @returns 二元组 [满足条件的元素, 不满足条件的元素]；空数组返回 [[], []]
 */
export function partition<T>(
  arr: readonly T[],
  predicate: (item: T, index: number, arr: readonly T[]) => unknown,
): [truthy: T[], falsy: T[]] {
  const truthy: T[] = [];
  const falsy: T[] = [];

  let index = 0;

  for (const item of arr) {
    if (predicate(item, index, arr)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }

    index++;
  }

  return [truthy, falsy];
}

export interface WindowedOptions {
  /**
   * 是否保留末尾不足 size 的部分窗口，默认为 false
   *
   * 默认只返回完整窗口，末尾凑不满一个窗口的元素会被忽略。
   * 设为 true 后，末尾不足 size 的窗口也会保留。
   */
  partialWindows?: boolean;
}

/**
 * 把数组切成多个长度为 size 的子数组（窗口），窗口之间可以重叠。
 *
 * @typeParam T - 数组元素类型
 * @param arr - 待切分的只读数组
 * @param size - 每个窗口的长度，必须是大于 0 的整数
 * @param step - 相邻窗口起点之间的间隔，必须是大于 0 的整数，默认为 1
 * @param options - 配置项
 * @param options.partialWindows - 是否保留末尾不足 size 的部分窗口，默认为 false
 * @returns 窗口组成的二维数组
 * @throws {RangeError} size 或 step 不是正整数时抛出
 *
 * @see {@link chunk} 窗口不重叠的切分
 */
export function windowed<T>(
  arr: readonly T[],
  size: number,
  step = 1,
  { partialWindows = false }: WindowedOptions = {},
): T[][] {
  if (!Number.isInteger(size) || size <= 0) {
    throw new RangeError("Size must be a positive integer.");
  }

  if (!Number.isInteger(step) || step <= 0) {
    throw new RangeError("Step must be a positive integer.");
  }

  const result: T[][] = [];

  const end = partialWindows ? arr.length : arr.length - size + 1;

  for (let start = 0; start < end; start += step) {
    result.push(arr.slice(start, start + size));
  }

  return result;
}
