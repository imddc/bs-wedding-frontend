<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { NButton, NModal, NProgress } from 'naive-ui'
import { ChevronLeft, ChevronRight, Eye, PlusCircle, Trash } from 'lucide-vue-next'
import { uploadFile } from '~/api/file'
import { handleImgUrl } from '~/utils/core'

// 定义组件属性
interface Props {
  // 是否只读模式（仅展示，不可上传或删除）
  readOnly?: boolean

  // 初始图片列表
  initialImages?: string[]

  // 最大上传数量，0表示不限制
  maxImages?: number

  // 允许的文件类型
  accept?: string

  // 是否允许多选文件
  enableMultiple?: boolean

  // 上传用户ID
  uploadUserId?: number

  // 是否自动上传（选择文件后立即上传）
  autoUpload?: boolean

  // 文件名前缀（用于标识不同业务场景）
  filePrefix?: string
}

// 定义默认值
const props = withDefaults(defineProps<Props>(), {
  readOnly: false,
  initialImages: () => [],
  maxImages: 0,
  accept: 'image/*',
  enableMultiple: true,
  uploadUserId: undefined,
  autoUpload: true,
  filePrefix: '',
})

// 定义事件
const emit = defineEmits<{
  // 图片列表变化
  (e: 'update:images', images: string[]): void
  // 上传成功
  (e: 'uploadSuccess', images: string[]): void
  // 删除图片
  (e: 'remove', image: string, index: number): void
}>()

// 状态
const fileInputRef = ref<HTMLInputElement | null>(null)
const imageList = ref<string[]>([...props.initialImages])
const uploading = ref(false)
const uploadProgress = ref(0)

// 预览相关
const previewVisible = ref(false)
const previewImageUrl = ref('')
const previewIndex = ref(0)
const previewTitle = computed(() => {
  const filename = getFilenameFromUrl(imageList.value[previewIndex.value] || '')
  return filename || '图片预览'
})

// 监听初始图片列表变化
watch(() => props.initialImages, (newImages) => {
  imageList.value = [...newImages]
}, { deep: true })

// 从URL中获取文件名
function getFilenameFromUrl(url: string): string {
  if (!url)
    return ''

  // 尝试从URL中提取文件名
  const parts = url.split('/')
  let filename = parts[parts.length - 1]

  // 如果包含查询参数，去掉
  if (filename.includes('?')) {
    filename = filename.split('?')[0]
  }

  return filename
}

// 处理图片预览
function handlePreviewImage(image: string) {
  const index = imageList.value.findIndex(img => img === image)
  if (index !== -1) {
    previewIndex.value = index
    previewImageUrl.value = handleImgUrl(image)
    previewVisible.value = true
  }
}

// 预览导航
function navigatePreview(direction: number) {
  const newIndex = previewIndex.value + direction
  if (newIndex >= 0 && newIndex < imageList.value.length) {
    previewIndex.value = newIndex
    previewImageUrl.value = handleImgUrl(imageList.value[newIndex])
  }
}

// 处理移除图片
function handleRemoveImage(index: number) {
  const removedImage = imageList.value[index]
  imageList.value.splice(index, 1)
  emit('update:images', imageList.value)
  emit('remove', removedImage, index)
}

// 处理点击上传按钮
function handleUploadClick() {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

// 处理文件选择变化
async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files

  if (!files || files.length === 0)
    return

  // 检查是否超过最大数量
  if (props.maxImages > 0 && imageList.value.length + files.length > props.maxImages) {
    window.$message.warning(`最多只能上传${props.maxImages}张图片`)
    // 重置文件输入框
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
    return
  }

  // 自动上传模式
  if (props.autoUpload) {
    await uploadFiles(files)
  }

  // 重置文件输入框，以便于下次选择相同文件时也能触发change事件
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

// 上传文件
async function uploadFiles(files: FileList) {
  if (files.length === 0)
    return

  try {
    uploading.value = true
    uploadProgress.value = 0

    // 模拟进度
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 200)

    const uploadedImages: string[] = []

    // 逐个上传文件
    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // 添加文件前缀（如果有）
      let fileToUpload = file
      if (props.filePrefix) {
        // 创建一个新的File对象，添加前缀到文件名
        const newFilename = `${props.filePrefix}_${file.name}`
        fileToUpload = new File([file], newFilename, { type: file.type })
      }

      const response = await uploadFile({
        file: fileToUpload,
        uploadUserId: props.uploadUserId,
      })

      if (response.success) {
        // fileUrl
        uploadedImages.push(response.data.fileUrl)
      } else {
        window.$message.error(`文件 ${file.name} 上传失败`)
      }
    }

    // 上传完成
    clearInterval(progressInterval)
    uploadProgress.value = 100

    // 更新图片列表
    if (uploadedImages.length > 0) {
      imageList.value = [...imageList.value, ...uploadedImages]
      emit('update:images', imageList.value)
      emit('uploadSuccess', uploadedImages)
      window.$message.success('图片上传成功')
    }
  } catch (error) {
    window.$message.error('上传过程中发生错误')
    console.error('上传错误:', error)
  } finally {
    // 延迟重置上传状态，让进度条有时间显示100%
    setTimeout(() => {
      uploading.value = false
      uploadProgress.value = 0
    }, 500)
  }
}

// 公开方法 - 手动触发上传
function triggerUpload() {
  handleUploadClick()
}

// 公开方法 - 获取当前图片列表
function getImages() {
  return [...imageList.value]
}

// 公开方法 - 清空图片列表
function clearImages() {
  imageList.value = []
  emit('update:images', [])
}

// 公开方法 - 设置图片列表
function setImages(images: string[]) {
  imageList.value = [...images]
  emit('update:images', imageList.value)
}

// 暴露公共方法
defineExpose({
  triggerUpload,
  getImages,
  clearImages,
  setImages,
})

// 组件初始化
onMounted(() => {
  // 确保初始图片列表同步
  if (props.initialImages && props.initialImages.length > 0) {
    imageList.value = [...props.initialImages]
  }
})
</script>

<template>
  <div class="image-upload-preview">
    <!-- 图片预览区域 -->
    <div class="flex items-center gap-4">
      <!-- 已上传图片项 -->
      <div
        v-for="(image, index) in imageList"
        :key="index"
        class="relative group rounded-md border border-gray-200/80 overflow-hidden"
      >
        <div class="w-32 aspect-square">
          <img
            :src="handleImgUrl(image)"
            class="object-cover cursor-pointer"
            alt="已上传图片"
            @click="handlePreviewImage(image)"
          >
        </div>

        <!-- 操作按钮 -->
        <div class="image-actions absolute inset-0 bg-black/20 bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <NButton
            quaternary
            circle
            type="primary"
            size="small"
            class="mr-2"
            @click="handlePreviewImage(image)"
          >
            <template #icon>
              <Eye :size="16" />
            </template>
          </NButton>

          <!-- 仅在可编辑模式下显示删除按钮 -->
          <NButton
            v-if="!readOnly"
            quaternary
            circle
            type="error"
            size="small"
            @click="handleRemoveImage(index)"
          >
            <template #icon>
              <Trash :size="16" />
            </template>
          </NButton>
        </div>
      </div>

      <!-- 上传按钮 -->
      <div
        v-if="!readOnly && (maxImages === 0 || imageList.length < maxImages)"
        class="image-upload-item flex items-center justify-center border border-dashed border-gray-300 rounded-md h-32 cursor-pointer hover:border-primary transition-colors"
        @click="handleUploadClick"
      >
        <div class="flex flex-col items-center text-gray-500 hover:text-primary">
          <PlusCircle :size="24" />
          <span class="mt-2 text-sm">上传图片</span>
        </div>

        <!-- 隐藏的文件输入 -->
        <input
          ref="fileInputRef"
          type="file"
          class="hidden"
          :accept="accept"
          :multiple="enableMultiple"
          @change="handleFileChange"
        >
      </div>
    </div>

    <!-- 上传进度 -->
    <div v-if="uploading" class="mt-4">
      <NProgress
        type="line"
        :percentage="uploadProgress"
        :processing="uploadProgress < 100"
        indicator-placement="inside"
        :height="12"
      />
    </div>

    <!-- 图片预览模态框 -->
    <NModal
      v-model:show="previewVisible"
      preset="card"
      :title="previewTitle"
      class="image-preview-modal"
      style="max-width: 800px; width: 90vw"
    >
      <div class="flex justify-center">
        <img :src="previewImageUrl" class="max-w-full max-h-[70vh]">
      </div>

      <!-- 预览导航 (仅当有多张图片时显示) -->
      <div v-if="imageList.length > 1" class="flex justify-between mt-4">
        <NButton
          secondary
          :disabled="previewIndex <= 0"
          @click="navigatePreview(-1)"
        >
          <template #icon>
            <ChevronLeft />
          </template>
          上一张
        </NButton>

        <div class="text-center">
          {{ previewIndex + 1 }} / {{ imageList.length }}
        </div>

        <NButton
          secondary
          :disabled="previewIndex >= imageList.length - 1"
          @click="navigatePreview(1)"
        >
          下一张
          <template #icon>
            <ChevronRight />
          </template>
        </NButton>
      </div>
    </NModal>
  </div>
</template>

<style scoped>
.image-upload-preview {
  width: 100%;
}

.image-upload-item {
  aspect-ratio: 1 / 1;
}

.image-actions {
  transition: opacity 0.2s ease;
}
</style>
