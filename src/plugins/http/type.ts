export interface RequestConfig {
  baseURL: string
}

export interface DataType<T = any> {
  success: boolean
  message: string
  data: T
  code: number
}

export interface ListType<T = any> extends DataType {
  data: {
    list: T[]
    total: number
    totalPages: number
    page: number
    pageSize: number
  }
}
