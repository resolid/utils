/**
 * 将一个数值限制在指定范围内（支持 number 与 bigint）。
 *
 * @param value 要限制的数值
 * @param min 最小值（可选）
 * @param max 最大值（可选）
 * @returns 如果 value 小于 min，则返回 min；如果大于 max，则返回 max；否则返回 value 本身
 */
export function clamp<T extends number | bigint>(value: T, min?: T | null, max?: T | null): T {
  if (max != null && min != null && min > max) {
    throw new Error("invalid clamp range");
  }

  if (max != null && value > max) {
    return max;
  }

  if (min != null && value < min) {
    return min;
  }

  return value;
}

/**
 * 生成一个从 start 到 end（包含 end）的整数数组。
 *
 * @param start - 起始值（包含）
 * @param end - 结束值（包含）
 * @returns 包含从 start 到 end 的整数数组，如果 start > end，则返回空数组
 */
export function range(start: number, end: number): number[] {
  if (start > end) {
    return [];
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * 生成 [min, max) 范围内的随机浮点数（包含 min，不包含 max）。
 *
 * @param min - 下界（包含）；只传一个参数时，它表示上界（不包含）
 * @param max - 上界（不包含），省略时 min 作为上界、下界取 0
 * @returns 范围内的随机数，可能是整数也可能是小数
 * @throws {RangeError} 上界不大于下界，或者任一边界是 NaN、Infinity 时抛出
 *
 * @see {@link randomInt} 生成随机整数
 */
export function randomFloat(min: number, max?: number): number {
  const lower = max === undefined ? 0 : min;
  const upper = max ?? min;
  const span = upper - lower;

  if (!(span > 0 && Number.isFinite(span))) {
    throw new RangeError("The maximum must be greater than the minimum, and both must be finite.");
  }

  return lower + Math.random() * span;
}

/**
 * 生成 [min, max) 范围内的随机整数（包含 min，不包含 max）。
 *
 * @param min - 下界（包含）；只传一个参数时，它表示上界（不包含）
 * @param max - 上界（不包含），省略时 min 作为上界、下界取 0
 * @returns 范围内的随机整数
 * @throws {RangeError} 区间内没有整数（包括上界不大于下界），或者任一边界是 NaN、Infinity 时抛出
 *
 * @see {@link randomFloat} 生成随机浮点数
 */
export function randomInt(min: number, max?: number): number {
  const lower = Math.ceil(max === undefined ? 0 : min);
  const upper = Math.ceil(max ?? min);
  const span = upper - lower;

  if (!(span > 0 && Number.isFinite(span))) {
    throw new RangeError("No integer exists in the range, or the range is not finite.");
  }

  return lower + Math.floor(Math.random() * span);
}
