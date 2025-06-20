export const toKebabCase = (str: string) => {
  return str
    .replace(/([A-Z])/g, '-$1') // 在大寫字母前添加連字符
    .toLowerCase() // 全部轉為小寫
    .replace(/^-/, ''); // 移除開頭的連字符（如果有）
}