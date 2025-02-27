<script setup lang="ts">
import { computed, defineEmits, defineProps, onMounted, ref, watch } from 'vue'
import type { FormInst, FormRules } from 'naive-ui'
import { NButton, NButtonGroup, NCard, NDivider, NForm, NFormItem, NInput, NModal, NPagination, NSelect, NSpace, NTag, NUpload, useLoadingBar, useMessage } from 'naive-ui'
import { OrderService } from '~/services/orderService'

// Define interfaces
interface Order {
  id: number
  orderNo: string
  type: string
  listingName?: string
  productName?: string
  productImage: string
  hasReview: boolean
}

interface Review {
  id: number
  orderId: number
  rating: number
  content: string
  images: string[]
  anonymous: boolean
  createdTime: string
  reply?: string
  replyTime?: string
}

const props = defineProps<{
  show: boolean
  order: Order | null
}>()

const emit = defineEmits<{
  'update:show': [value: boolean]
  'review-success': [orderId: number]
}>()

const message = useMessage()
const formRef = ref<FormInst | null>(null)

// Internal show state
const showInternal = computed({
  get: () => props.show,
  set: value => emit('update:show', value),
})

// Form state
const reviewForm = ref({
  rating: 5,
  content: '',
  images: [] as string[],
  anonymous: false,
})

const submitting = ref(false)
const existingReview = ref<Review | null>(null)

// Form validation rules
const rules: FormRules = {
  rating: [
    { required: true, message: '请评分', trigger: 'change' },
  ],
  content: [
    { required: true, message: '请输入评价内容', trigger: 'blur' },
    { min: 5, max: 500, message: '评价内容长度在5-500个字符之间', trigger: 'blur' },
  ],
}

// Image upload
const uploadUrl = `${import.meta.env.VITE_API_BASE_URL || '/api'}/user/upload-image`
const uploadHeaders = computed(() => {
  const token = localStorage.getItem('authToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
})

// Check if form is valid
const isFormValid = computed(() => {
  return reviewForm.value.rating > 0 && reviewForm.value.content.trim().length >= 5
})

// Handle images change
function handleImagesChange(options: { fileList: any[] }) {
  // Extract URLs from uploaded images
  const urls: string[] = []

  options.fileList.forEach((file) => {
    if (file.status === 'finished' && file.url) {
      urls.push(file.url)
    }
  })

  reviewForm.value.images = urls
}

// Get order type text
function getOrderTypeText(type: string): string {
  switch (type) {
    case 'photography': return '婚纱摄影'
    case 'hotel': return '婚宴酒店'
    case 'host': return '司仪主持'
    default: return '其他服务'
  }
}

// Format date
function formatDate(dateString: string): string {
  if (!dateString)
    return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

// Submit review
async function submitReview() {
  if (!props.order)
    return

  formRef.value?.validate(async (errors) => {
    if (errors) {
      message.error('请检查表单中的错误')
      return
    }

    submitting.value = true

    try {
      // Prepare form data for multipart/form-data
      const formData = new FormData()
      formData.append('rating', reviewForm.value.rating.toString())
      formData.append('content', reviewForm.value.content)
      formData.append('anonymous', reviewForm.value.anonymous ? '1' : '0')

      // Add images
      reviewForm.value.images.forEach((url, index) => {
        formData.append(`images[${index}]`, url)
      })

      const { data } = await OrderService.submitReview(props.order.id, formData)

      if (data.code === 200) {
        message.success('评价提交成功')
        emit('review-success', props.order.id)
      } else {
        message.error(data.message || '评价提交失败')
      }
    } catch (error) {
      message.error('评价提交失败，请检查网络连接')
      console.error('Error submitting review:', error)
    } finally {
      submitting.value = false
    }
  })
}

// Load existing review
async function loadExistingReview() {
  if (!props.order || !props.order.hasReview) {
    existingReview.value = null
    return
  }

  try {
    const { data } = await OrderService.getOrderReview(props.order.id)

    if (data.code === 200) {
      existingReview.value = data.data
    } else {
      message.error(data.message || '获取评价失败')
    }
  } catch (error) {
    console.error('Error loading review:', error)
  }
}

// Reset form when order changes
watch(() => props.order, () => {
  if (props.order) {
    reviewForm.value = {
      rating: 5,
      content: '',
      images: [],
      anonymous: false,
    }

    // Load existing review if available
    if (props.order.hasReview) {
      loadExistingReview()
    } else {
      existingReview.value = null
    }
  }
}, { immediate: true })

// Reset form when modal opens
watch(() => props.show, (newVal) => {
  if (newVal && props.order) {
    // Load existing review if available
    if (props.order.hasReview) {
      loadExistingReview()
    }
  }
})
</script>

<template>
  <NModal
    v-model:show="showInternal"
    preset="card"
    title="评价服务"
    style="width: 600px;"
    :mask-closable="false"
  >
    <div v-if="order">
      <div class="flex mb-4">
        <div class="w-16 h-16 flex-shrink-0">
          <img
            :src="order.productImage"
            alt="商品图片"
            class="w-full h-full object-cover rounded"
          >
        </div>

        <div class="ml-4">
          <h3 class="text-lg font-medium">
            {{ order.listingName || order.productName }}
          </h3>
          <p class="text-gray-500">
            {{ getOrderTypeText(order.type) }}
          </p>
          <p class="text-gray-500 text-sm">
            订单号: {{ order.orderNo }}
          </p>
        </div>
      </div>

      <NDivider />

      <div v-if="!order.hasReview">
        <NForm
          ref="formRef"
          :model="reviewForm"
          :rules="rules"
          label-placement="left"
          label-width="auto"
        >
          <NFormItem label="服务评分" path="rating">
            <n-rate v-model:value="reviewForm.rating" size="large" />
          </NFormItem>

          <NFormItem label="评价内容" path="content">
            <NInput
              v-model:value="reviewForm.content"
              type="textarea"
              placeholder="请分享您的使用体验和建议..."
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </NFormItem>

          <NFormItem label="上传照片">
            <NUpload
              list-type="image-card"
              :max="5"
              :action="uploadUrl"
              :headers="uploadHeaders"
              :default-upload="false"
              @change="handleImagesChange"
            >
              点击或拖动图片到此处上传
            </NUpload>
            <template #help>
              <div class="text-xs text-gray-500">
                最多上传5张照片
              </div>
            </template>
          </NFormItem>

          <NFormItem label="匿名评价">
            <n-switch v-model:value="reviewForm.anonymous" />
            <template #help>
              <div class="text-xs text-gray-500">
                开启后，您的用户名将不会显示在评价中
              </div>
            </template>
          </NFormItem>
        </NForm>

        <div class="flex justify-end mt-4">
          <NSpace>
            <NButton @click="showInternal = false">
              取消
            </NButton>
            <NButton
              type="primary"
              :disabled="!isFormValid"
              :loading="submitting"
              @click="submitReview"
            >
              提交评价
            </NButton>
          </NSpace>
        </div>
      </div>

      <div v-else>
        <div v-if="existingReview">
          <div class="mb-4">
            <div class="flex items-center mb-2">
              <n-rate :value="existingReview.rating" readonly />
              <span class="ml-2">{{ existingReview.rating.toFixed(1) }}</span>
              <NTag v-if="existingReview.anonymous" size="small" class="ml-3">
                匿名评价
              </NTag>
            </div>

            <p class="mb-3">
              {{ existingReview.content }}
            </p>

            <div v-if="existingReview.images && existingReview.images.length > 0" class="flex flex-wrap gap-2 mt-3">
              <n-image
                v-for="(image, index) in existingReview.images"
                :key="index"
                :src="image"
                width="80"
                height="80"
                object-fit="cover"
                class="rounded"
              />
            </div>

            <div class="text-xs text-gray-500 mt-2">
              评价时间: {{ formatDate(existingReview.createdTime) }}
            </div>
          </div>

          <NDivider />

          <div v-if="existingReview.reply" class="mb-4">
            <div class="text-sm text-gray-700 font-medium mb-1">
              商家回复:
            </div>
            <p class="text-sm">
              {{ existingReview.reply }}
            </p>
            <div class="text-xs text-gray-500 mt-1">
              回复时间: {{ formatDate(existingReview.replyTime) }}
            </div>
          </div>
        </div>

        <div v-else class="text-center py-6">
          <div class="text-gray-500">
            正在加载评价信息...
          </div>
        </div>

        <div class="flex justify-end mt-4">
          <NButton @click="showInternal = false">
            关闭
          </NButton>
        </div>
      </div>
    </div>
  </NModal>
</template>
