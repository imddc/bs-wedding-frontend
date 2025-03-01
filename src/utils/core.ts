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

// Format price to display with currency symbol
export function formatPrice(price: number | undefined): string {
  if (!price && price !== 0)
    return '--'
  return `¥${price.toFixed(2)}`
}

// Format date from ISO string to localized format
export function formatDate(dateStr: string | undefined): string {
  if (!dateStr)
    return '--'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Convert string tags to array
export function tagsToArray(tags: string | undefined): string[] {
  if (!tags)
    return []
  return tags.split(',').filter(tag => tag.trim() !== '')
}

// Convert array of tags to comma-separated string
export function arrayToTags(tagArray: string[]): string {
  return tagArray.join(',')
}

// Deep clone an object
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

// Validate required form fields
export function validateRequired(value: any, fieldName: string): string | true {
  if (value === null || value === undefined || value === '') {
    return `${fieldName}不能为空`
  }
  return true
}

// Validate price format
export function validatePrice(value: any): string | true {
  if (value === null || value === undefined || value === '') {
    return '价格不能为空'
  }

  const price = Number(value)
  if (Number.isNaN(price) || price <= 0) {
    return '请输入有效的价格(大于0)'
  }

  return true
}
