import { partition } from "../transform";

/**
 * 计算两个数组的差集，返回在 arr 中存在、但不在 excluded 中的元素。
 *
 * @typeParam T - 数组元素类型
 * @param arr - 源数组
 * @param excluded - 需要排除的元素所在的数组
 * @returns 由 arr 中不在 excluded 里的元素组成的新数组
 *
 * @see {@link differenceWith} 需要自定义相等逻辑（无法用 key 表示）时使用
 */
export function difference<T>(arr: readonly T[], excluded: readonly T[]): T[] {
  const excludedSet = new Set(excluded);

  return arr.filter((item) => !excludedSet.has(item));
}

/**
 * 先通过 mapper 映射元素，再计算两个数组的差集，返回 arr 中映射后的 key 不在 excluded 映射结果里的元素。
 *
 * @typeParam T - arr 的元素类型
 * @typeParam U - excluded 的元素类型
 * @param arr - 源数组
 * @param excluded - 需要排除的元素所在的数组，两个数组中 mapper 返回值相同的元素视为同一个
 * @param mapper - 映射函数，把元素转换成用于比较的 key，同时作用于 arr 和 excluded 的元素
 * @returns 由 arr 中映射后的 key 不在 excluded 中的元素组成的新数组
 */
export function differenceBy<T, U>(
  arr: readonly T[],
  excluded: readonly U[],
  mapper: (value: T | U) => unknown,
): T[] {
  const excludedKeys: Set<unknown> = new Set();

  for (const item of excluded) {
    excludedKeys.add(mapper(item));
  }

  return arr.filter((item) => !excludedKeys.has(mapper(item)));
}

/**
 * 使用自定义的相等函数计算两个数组的差集，返回 arr 中与 excluded 里任何元素都不相等的元素。
 *
 * @typeParam T - arr 的元素类型
 * @typeParam U - excluded 的元素类型
 * @param arr - 源数组
 * @param excluded - 需要排除的元素所在的数组
 * @param areItemsEqual - 相等函数，参数依次为 arr 中的元素和 excluded 中的元素，返回 true 表示两者相等
 * @returns 由 arr 中与 excluded 里所有元素都不相等的元素组成的新数组
 *
 * @see {@link differenceBy} 相等关系可以用 key 表示时，性能更好
 */
export function differenceWith<T, U>(
  arr: readonly T[],
  excluded: readonly U[],
  areItemsEqual: (x: T, y: U) => boolean,
): T[] {
  return arr.filter((item) => !excluded.some((excludedItem) => areItemsEqual(item, excludedItem)));
}

/**
 * 原地删除数组中满足 predicate 的所有元素，返回被删除的元素。
 *
 * @typeParam T - 数组元素类型
 * @param arr - 需要修改的数组
 * @param predicate - 判断函数，返回真值表示删除该元素，参数依次为元素、下标和原数组
 * @returns 被删除的元素组成的新数组
 *
 * @see {@link removeAll} 按值删除
 * @see {@link removeAt} 按下标删除
 */
export function removeWhere<T>(
  arr: T[],
  predicate: (item: T, index: number, arr: readonly T[]) => unknown,
): T[] {
  const [removed, kept] = partition(arr, predicate);

  if (removed.length === 0) {
    return removed;
  }

  arr.length = 0;

  for (const item of kept) {
    arr.push(item);
  }

  return removed;
}

/**
 * 原地删除数组中所有出现在 values 里的元素，返回被删除的元素。
 *
 * @typeParam T - 数组元素类型
 * @param arr - 需要修改的数组
 * @param values - 需要删除的值
 * @returns 被删除的元素组成的新数组，顺序与它们在原数组中的顺序一致；没有元素被删除时返回 []
 *
 * @see {@link removeWhere} 按条件删除
 * @see {@link removeAt} 按下标删除
 * @see {@link difference} 不修改原数组，返回新数组
 */
export function removeAll<T>(arr: T[], values: readonly unknown[]): T[] {
  const valueSet = new Set(values);

  return removeWhere(arr, (item) => valueSet.has(item));
}

/**
 * 原地删除数组中指定下标的元素，返回被删除的元素。
 *
 * @typeParam T - 数组元素类型
 * @param arr - 需要修改的数组
 * @param indices - 需要删除的元素下标
 * @returns 被删除的元素组成的新数组
 *
 * @see {@link removeWhere} 按条件删除
 * @see {@link removeAll} 按值删除
 */
export function removeAt<T>(arr: T[], indices: readonly number[]): T[] {
  const { length } = arr;

  const indexSet: Set<number> = new Set();

  for (const raw of indices) {
    let index = Math.trunc(raw) || 0;

    if (index < 0) {
      index += length;
    }

    if (index >= 0 && index < length) {
      indexSet.add(index);
    }
  }

  return removeWhere(arr, (_, index) => indexSet.has(index));
}
