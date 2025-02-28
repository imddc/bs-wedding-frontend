export interface FileUploadParams {
  file: File
  uploadUserId?: number
  description?: string
}

export interface FileUploadResponse {
  id: number
  originalFilename: string
  fileType: string
  fileSize: number
  fileUrl: string
  createTime: string
}

export interface BatchFileUploadParams {
  files: File[]
  uploadUserId?: number
}

export interface FileListParams {
  current: number
  size: number
}

export interface FileListResponse {
  records: FileUploadResponse[]
  total: number
  size: number
  current: number
}
