export function toCamelCase(str: string) {
  const firstChar = str[0].charAt(0)
  if (firstChar.toUpperCase() == firstChar) return str

  return str
    .split('-') // 按連字符分割
    .map((word, index) =>
      index === 0
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // 首單詞首字母大寫
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // 其他單詞首字母大寫
    )
    .join(''); // 合併為單個字符串
}