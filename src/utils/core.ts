/**
 * 处理图片路径
 * @param src
 * @returns string
 */
export function handleImgUrl(src: string) {
  if (src.startsWith('/files/preview/')) {
    return `http://localhost:9527/server-api/${src}`
  }

  return src
}
