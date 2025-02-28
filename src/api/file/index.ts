// src/file/index.ts
import { request } from '~/plugins/http'
import type { DataType } from '~/plugins/http/type'
import type {
  BatchFileUploadParams,
  FileListParams,
  FileListResponse,
  FileUploadParams,
  FileUploadResponse,
} from './type'

/**
 * 上传单个文件
 * @param params 文件上传参数
 */
export async function uploadFile(params: FileUploadParams) {
  const formData = new FormData()
  formData.append('file', params.file)

  if (params.uploadUserId) {
    formData.append('uploadUserId', params.uploadUserId.toString())
  }

  if (params.description) {
    formData.append('description', params.description)
  }

  return request.post<DataType<FileUploadResponse>>({
    url: '/files',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * 批量上传文件
 * @param params 批量文件上传参数
 */
export async function uploadBatchFiles(params: BatchFileUploadParams) {
  const formData = new FormData()

  params.files.forEach((file) => {
    formData.append('files', file)
  })

  if (params.uploadUserId) {
    formData.append('uploadUserId', params.uploadUserId.toString())
  }

  return request.post<DataType<FileUploadResponse[]>>({
    url: '/files/batch',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * 获取文件列表
 * @param params 分页参数
 */
export async function getFileList(params: FileListParams) {
  return request.get<DataType<FileListResponse>>({
    url: '/files',
    params,
  })
}

/**
 * 获取文件详情
 * @param id 文件ID
 */
export async function getFileDetail(id: number) {
  return request.get<DataType<FileUploadResponse>>({
    url: `/files/${id}`,
  })
}

/**
 * 删除文件
 * @param id 文件ID
 */
export async function deleteFile(id: number) {
  return request.delete<DataType<boolean>>({
    url: `/files/${id}`,
  })
}

/**
 * 生成文件预览URL
 * @param storedFilename 存储的文件名
 */
export function getFilePreviewUrl(storedFilename: string): string {
  return `/files/preview/${storedFilename}`
}

/**
 * 生成文件下载URL
 * @param id 文件ID
 */
export function getFileDownloadUrl(id: number): string {
  return `/files/download/${id}`
}
