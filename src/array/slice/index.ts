/**
 * 丢弃数组开头的 count 个元素，返回剩余元素组成的新数组。
 *
 * @typeParam T - 数组元素类型
 * @param arr - 源数组
 * @param count - 需要从开头丢弃的元素个数
 * @returns 丢弃开头元素后的新数组
 *
 * @see {@link dropLast} 从末尾丢弃
 * @see {@link dropWhile} 按条件从开头丢弃
 */
export function drop<T>(arr: readonly T[], count: number): T[] {
  return arr.slice(Math.max(count, 0));
}

/**
 * 从数组开头开始丢弃元素，直到 predicate 第一次返回 false，返回剩余元素组成的新数组。
 *
 * @typeParam T - 数组元素类型
 * @param arr - 源数组
 * @param predicate - 判断函数，返回 true 表示继续丢弃，参数依次为元素、下标和原数组
 * @returns 丢弃开头满足条件的元素后的新数组
 *
 * @see {@link drop} 从开头丢弃
 */
export function dropWhile<T>(
  arr: readonly T[],
  predicate: (item: T, index: number, arr: readonly T[]) => boolean,
): T[] {
  const startIndex = arr.findIndex((item, index, source) => !predicate(item, index, source));

  if (startIndex === -1) {
    return [];
  }

  return arr.slice(startIndex);
}

/**
 * 丢弃数组末尾的 count 个元素，返回剩余元素组成的新数组。
 *
 * @typeParam T - 数组元素类型
 * @param arr - 源数组
 * @param count - 需要从末尾丢弃的元素个数
 * @returns 丢弃末尾元素后的新数组
 *
 * @see {@link drop} 从开头丢弃
 * @see {@link dropLastWhile} 从末尾按条件丢弃
 */
export function dropLast<T>(arr: readonly T[], count: number): T[] {
  const dropCount = Math.trunc(count);

  if (!(dropCount > 0)) {
    return [...arr];
  }

  return arr.slice(0, -dropCount);
}

/**
 * 从数组末尾开始丢弃元素，直到 predicate 第一次返回 false，返回剩余元素组成的新数组。
 *
 * @typeParam T - 数组元素类型
 * @param arr - 源数组
 * @param predicate - 判断函数，返回 true 表示继续丢弃，参数依次为元素、下标和原数组，调用顺序是从末尾向前
 * @returns 丢弃末尾满足条件的元素后的新数组
 *
 * @see {@link dropWhile} 从开头按条件丢弃
 * @see {@link dropLast} 从末尾按个数丢弃
 */
export function dropLastWhile<T>(
  arr: readonly T[],
  predicate: (item: T, index: number, arr: readonly T[]) => boolean,
): T[] {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (!predicate(arr[i] as T, i, arr)) {
      return arr.slice(0, i + 1);
    }
  }

  return [];
}

/**
 * 取数组开头的 count 个元素，返回新数组。
 *
 * @typeParam T - 数组元素类型
 * @param arr - 源数组
 * @param count - 需要从开头取的元素个数
 * @returns 开头 count 个元素组成的新数组
 *
 * @see {@link takeLast} 从末尾取
 * @see {@link takeWhile} 按条件从开头取
 * @see {@link drop} 丢弃开头的元素，与 take 互补
 */
export function take<T>(arr: readonly T[], count: number): T[] {
  return arr.slice(0, Math.max(count, 0));
}

/**
 * 取数组末尾的 count 个元素，返回新数组。
 *
 * @typeParam T - 数组元素类型
 * @param arr - 源数组
 * @param count - 需要从末尾取的元素个数
 * @returns 末尾 count 个元素组成的新数组
 *
 * @see {@link take} 从开头取
 * @see {@link takeLastWhile} 按条件从末尾取
 * @see {@link dropLast} 丢弃末尾的元素，与 takeLast 互补
 */
export function takeLast<T>(arr: readonly T[], count: number): T[] {
  const takeCount = Math.trunc(count);

  if (!(takeCount > 0)) {
    return [];
  }

  return arr.slice(-takeCount);
}

/**
 * 从数组开头开始取元素，直到 predicate 第一次返回假值，返回取到的元素。
 *
 * @typeParam T - 数组元素类型
 * @param arr - 源数组
 * @param predicate - 判断函数，返回真值表示继续取，参数依次为元素、下标和原数组
 * @returns 开头连续满足条件的元素组成的新数组
 *
 * @see {@link takeLastWhile} 从末尾按条件取
 * @see {@link take} 按个数从开头取
 * @see {@link dropWhile} 丢弃开头满足条件的元素，与 takeWhile 互补
 */
export function takeWhile<T>(
  arr: readonly T[],
  predicate: (item: T, index: number, arr: readonly T[]) => unknown,
): T[] {
  const endIndex = arr.findIndex((item, index, source) => !predicate(item, index, source));

  if (endIndex === -1) {
    return [...arr];
  }

  return arr.slice(0, endIndex);
}

/**
 * 从数组末尾开始取元素，直到 predicate 第一次返回假值，返回取到的元素。
 *
 * @typeParam T - 数组元素类型
 * @param arr - 源数组
 * @param predicate - 判断函数，返回真值表示继续取，参数依次为元素、下标和原数组
 * @returns 末尾连续满足条件的元素组成的新数组
 *
 * @see {@link takeWhile} 从开头按条件取
 * @see {@link takeLast} 按个数从末尾取
 * @see {@link dropLastWhile} 丢弃末尾满足条件的元素，与 takeLastWhile 互补
 */
export function takeLastWhile<T>(
  arr: readonly T[],
  predicate: (item: T, index: number, arr: readonly T[]) => unknown,
): T[] {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (!predicate(arr[i] as T, i, arr)) {
      return arr.slice(i + 1);
    }
  }

  return [...arr];
}
