/**
 * 根据 mapper 的返回值（key）统计数组中各分类出现的次数。
 *
 * @typeParam T - 数组元素类型
 * @typeParam K - 计数 key 的类型，必须是 string、number 或 symbol
 * @param arr - 待统计的只读数组
 * @param mapper - 映射函数，返回元素对应的 key，参数依次为元素、下标和原数组
 * @returns 以 key 为属性名、出现次数为值的对象；空数组返回空对象
 */
export function countBy<T, K extends PropertyKey>(
  arr: readonly T[],
  mapper: (item: T, index: number, array: readonly T[]) => K,
): Record<K, number> {
  const result = Object.create(null) as Record<K, number>;

  for (let i = 0; i < arr.length; i++) {
    const key = mapper(arr[i] as T, i, arr);

    result[key] = (result[key] ?? 0) + 1;
  }

  return result;
}

/**
 * 根据 mapper 生成的 key，把数组转换成以 key 为属性名、元素为值的对象。
 *
 * @typeParam T - 数组元素类型
 * @typeParam K - key 的类型，必须是 string、number 或 symbol
 * @param arr - 待转换的只读数组
 * @param mapper - 生成 key 的函数，参数依次为元素、下标和原数组
 * @returns 以 key 为属性名、对应元素为值的对象；空数组返回空对象
 */
export function keyBy<T, K extends PropertyKey>(
  arr: readonly T[],
  mapper: (item: T, index: number, arr: readonly T[]) => K,
): Record<K, T> {
  const result = Object.create(null) as Record<K, T>;

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i] as T;

    result[mapper(item, i, arr)] = item;
  }

  return result;
}

/**
 * 找出数组中 mapper 返回值最大的元素，空数组返回 undefined。
 *
 * @typeParam T - 数组元素类型
 * @param arr - 待查找的数组，可以为空
 * @param mapper - 把元素转换成用于比较的数值，参数依次为元素、下标和原数组
 * @returns mapper 返回值最大的元素；数组为空时返回 undefined
 *
 * @see {@link minBy} 找出最小值对应的元素
 */
export function maxBy<T>(
  arr: readonly T[],
  mapper: (item: T, index: number, arr: readonly T[]) => number,
): T | undefined {
  if (arr.length === 0) {
    return undefined;
  }

  let maxItem = arr[0] as T;
  let max = -Infinity;

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i] as T;
    const value = mapper(item, i, arr);

    if (Number.isNaN(value)) {
      return item;
    }

    if (value > max) {
      max = value;
      maxItem = item;
    }
  }

  return maxItem;
}

/**
 * 找出数组中 mapper 返回值最小的元素，空数组返回 undefined。
 *
 * @typeParam T - 数组元素类型
 * @param arr - 待查找的数组，可以为空
 * @param mapper - 把元素转换成用于比较的数值，参数依次为元素、下标和原数组
 * @returns mapper 返回值最小的元素；数组为空时返回 undefined
 *
 * @see {@link maxBy} 找出最大值对应的元素
 */
export function minBy<T>(
  arr: readonly T[],
  mapper: (item: T, index: number, arr: readonly T[]) => number,
): T | undefined {
  if (arr.length === 0) {
    return undefined;
  }

  let minItem = arr[0] as T;
  let min = Infinity;

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i] as T;
    const value = mapper(item, i, arr);

    if (Number.isNaN(value)) {
      return item;
    }

    if (value < min) {
      min = value;
      minItem = item;
    }
  }

  return minItem;
}
