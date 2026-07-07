const UNITS = ["Bytes", "KB", "MB", "GB", "TB"] as const;

type Unit = (typeof UNITS)[number];

/**
 * 将字节数格式化为带单位的可读字符串
 *
 * @param bytes - 字节数
 * @param precision - 小数点后的精度位数，默认值为 2
 * @param unit - 可选的强制单位, 默认进行自动单位计算
 *
 * @returns 格式化后的字符串
 */
export function formatBytes(bytes: number, precision = 2, unit: Unit | null = null): string {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const k = 1024;
  const d = Math.max(0, precision);

  const i = unit
    ? Math.max(0, UNITS.indexOf(unit))
    : Math.min(UNITS.length - 1, Math.floor(Math.log(bytes) / Math.log(k)));

  const value = (bytes / k ** i).toFixed(d);

  return `${value} ${UNITS[i]}`;
}

/**
 * 检查文件是否匹配 accept 规则
 *
 * @param fileName - 文件名
 * @param mimeType - 文件的 MIME 类型
 * @param accept - 接受的文件类型规则
 *
 * @returns 如果文件匹配任一规则则返回 true,否则返回 false
 */
export function matchesAccept(fileName: string, mimeType: string, accept: string): boolean {
  if (accept == "*") {
    return true;
  }

  const accepts = accept.split(",").map((type) => type.trim());

  const parts = fileName.split(/[\\/]/);
  const basename = parts.at(-1)!;

  const lastDotIndex = basename.lastIndexOf(".");
  const extension = lastDotIndex > 0 ? basename.slice(lastDotIndex + 1) : "";

  return accepts.some((type) => {
    if (type.startsWith(".")) {
      return extension.toLowerCase() === type.slice(1).toLowerCase();
    }

    if (type.endsWith("/*")) {
      const [baseType] = type.split("/");

      return mimeType.startsWith(`${baseType}/`);
    }

    return mimeType === type;
  });
}
