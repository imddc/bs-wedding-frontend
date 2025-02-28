export interface RequestConfig {
  baseURL: string
}

export interface DataType<T = any> {
  success: boolean
  message: string
  data: T
  code: number
}

export interface PageData<T = any> extends DataType {
  data: {
    records: T[]
    total: number
    size: number
    current: number
    pages: number
  }
}
