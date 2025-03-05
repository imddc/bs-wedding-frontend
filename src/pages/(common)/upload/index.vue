<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NCard, NDivider, NSpace, NSpin, NThing, NTooltip, NUpload, useMessage } from 'naive-ui'
import { CheckCircle, Copy, FileType, Link, Upload } from 'lucide-vue-next'
import { useClipboard } from '@vueuse/core'
import { uploadFile } from '~/api/file'
import type { FileUploadResponse } from '~/api/file/type'

const message = useMessage()
const uploadedFile = ref<FileUploadResponse | null>(null)
const isUploading = ref(false)
const { copy } = useClipboard()
const justCopied = ref(false)

// 上传配置
const uploadAction = '' // 实际由自定义请求方法处理，此处留空
const uploadHeaders = {}
const maxSize = 10 * 1024 * 1024 // 10MB
const maxFiles = 1
const showFileList = true

// 自定义上传方法
function handleUpload({ file, onFinish, onError }: { file: any, onFinish: () => void, onError: () => void }) {
  isUploading.value = true

  // 创建FormData并上传
  const params = {
    file: file.file as File,
    description: '通过上传页面上传',
  }

  uploadFile(params)
    .then((res) => {
      if (res.success && res.data) {
        uploadedFile.value = res.data
        message.success(`文件 ${file.name} 上传成功`)
        onFinish()
        // 自动复制链接到剪贴板
        copyFileUrl()
      } else {
        throw new Error(res.message || '上传失败')
      }
    })
    .catch((err) => {
      message.error(`文件 ${file.name} 上传失败: ${err.message}`)
      onError()
    })
    .finally(() => {
      isUploading.value = false
    })
}

// 复制文件URL到剪贴板
function copyFileUrl() {
  if (!uploadedFile.value)
    return

  const fileUrl = `http://localhost:8080/api${uploadedFile.value.fileUrl}`
  copy(fileUrl)

  justCopied.value = true
  setTimeout(() => {
    justCopied.value = false
  }, 2000)

  message.success('文件链接已复制到剪贴板')
}

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes < 1024)
    return `${bytes} B`
  if (bytes < 1024 * 1024)
    return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 flex flex-col items-center justify-center">
    <div class="w-full max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">
        文件上传中心
      </h1>

      <NCard
        class="mb-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border-0"
        :bordered="false"
      >
        <template #header>
          <div class="flex items-center px-6 py-4 bg-primary/5">
            <Upload class="text-primary mr-3" />
            <span class="text-xl font-medium">上传新文件</span>
          </div>
        </template>

        <div class="p-6">
          <div class="text-gray-500 mb-6 text-sm">
            支持单文件上传，最大限制 {{ formatFileSize(maxSize) }}
          </div>

          <NSpin :show="isUploading">
            <div
              class="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center
                    hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
            >
              <NUpload
                :action="uploadAction"
                :headers="uploadHeaders"
                :max-size="maxSize"
                :max-files="maxFiles"
                :show-file-list="showFileList"
                :custom-request="handleUpload"
                drag
              >
                <div class="flex flex-col items-center justify-center">
                  <div class="w-20 h-20 flex items-center justify-center rounded-full bg-primary/10 mb-5">
                    <Upload class="text-primary" :size="32" />
                  </div>
                  <p class="text-lg font-medium text-gray-700 mb-2">
                    拖放文件或点击上传
                  </p>
                  <p class="text-sm text-gray-500 mb-6">
                    支持各种类型文件
                  </p>
                  <NButton type="primary" size="large" class="px-8 rounded-full">
                    <template #icon>
                      <Upload />
                    </template>
                    选择文件
                  </NButton>
                </div>
              </NUpload>
            </div>
          </NSpin>
        </div>
      </NCard>

      <NCard
        v-if="uploadedFile"
        class="rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border-0"
        :bordered="false"
      >
        <template #header>
          <div class="flex items-center px-6 py-4 bg-success/5">
            <CheckCircle class="text-success mr-3" />
            <span class="text-xl font-medium">上传成功</span>
          </div>
        </template>

        <div class="p-6">
          <NThing class="p-2">
            <template #avatar>
              <div class="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10">
                <FileType class="text-primary" :size="28" />
              </div>
            </template>

            <template #header>
              <div class="text-lg font-medium text-gray-800 mb-1">
                {{ uploadedFile.originalFilename }}
              </div>
            </template>

            <template #description>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 my-3">
                <div class="bg-gray-50 rounded-lg p-3">
                  <p class="text-gray-500 text-sm mb-1">
                    文件类型
                  </p>
                  <p class="font-medium">
                    {{ uploadedFile.fileType }}
                  </p>
                </div>

                <div class="bg-gray-50 rounded-lg p-3">
                  <p class="text-gray-500 text-sm mb-1">
                    文件大小
                  </p>
                  <p class="font-medium">
                    {{ formatFileSize(uploadedFile.fileSize) }}
                  </p>
                </div>

                <div class="bg-gray-50 rounded-lg p-3 md:col-span-2">
                  <p class="text-gray-500 text-sm mb-1">
                    上传时间
                  </p>
                  <p class="font-medium">
                    {{ uploadedFile.createTime }}
                  </p>
                </div>
              </div>

              <NDivider class="my-4" />

              <div class="p-4 bg-gray-50 rounded-xl">
                <div class="text-sm text-gray-500 mb-2 flex items-center">
                  <Link :size="14" class="mr-2" />
                  文件链接
                </div>
                <div class="flex items-center">
                  <code class="text-xs sm:text-sm bg-white p-3 rounded-lg flex-1 overflow-x-auto border border-gray-100">
                    http://localhost:8080/api{{ uploadedFile.fileUrl }}
                  </code>
                </div>
              </div>
            </template>

            <template #action>
              <NSpace class="mt-5">
                <NButton
                  type="primary"
                  tag="a"
                  :href="`http://localhost:8080/api${uploadedFile.fileUrl}`"
                  target="_blank"
                  class="rounded-full px-5"
                  secondary
                >
                  <template #icon>
                    <Link />
                  </template>
                  查看链接
                </NButton>

                <NTooltip>
                  <template #trigger>
                    <NButton
                      type="success"
                      class="rounded-full px-5"
                      :secondary="justCopied"
                      @click="copyFileUrl"
                    >
                      <template #icon>
                        <Copy v-if="!justCopied" />
                        <CheckCircle v-else />
                      </template>
                      {{ justCopied ? '已复制' : '复制链接' }}
                    </NButton>
                  </template>
                  点击复制文件链接
                </NTooltip>
              </NSpace>
            </template>
          </NThing>
        </div>
      </NCard>
    </div>
  </div>
</template>
