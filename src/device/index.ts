/**
 * 获取当前设备的语言区域标识符
 *
 * `Intl.DateTimeFormat().resolvedOptions().locale`
 */
export function deviceLocale(): string {
  return Intl.DateTimeFormat().resolvedOptions().locale;
}

/**
 * 获取当前设备的时区标识符
 *
 * `Intl.DateTimeFormat().resolvedOptions().timeZone`
 * * 如果未设置环境变量 TZ，则可能返回 undefined
 */
export function deviceTimezone(): string | undefined {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
