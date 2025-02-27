<script setup lang="ts">
import { computed, defineProps, reactive, ref } from 'vue'
import type { FormInst, FormRules } from 'naive-ui'
import { NButton, NCard, NCascader, NDatePicker, NDivider, NForm, NFormItem, NInput, NInputGroup, NInputNumber, NModal, NProgress, NSelect, NStatistic, NTag, NTimeline, NTimelineItem, useMessage } from 'naive-ui'
import {
  BugIcon,
  Copy,
  Edit2,
  Heart,
  Mail,
  Share2,
} from 'lucide-vue-next'
import { WeddingPlanService } from '~/services/weddingPlanService'

// Import components
import WeddingServiceCard from '~/components/wedding/WeddingServiceCard.vue'

// Interfaces
export interface WeddingPlan {
  id: number
  name: string
  weddingDate: string
  cityName: string
  city: string[]
  budget: number
  allocatedBudget: number
  style: string
  guestCount: number
  createdTime: string
  updatedTime: string
  timeline: TimelineItem[]
  services: WeddingService[]
}

export interface TimelineItem {
  id: number
  title: string
  description: string
  date: string
  completed: boolean
}

export interface WeddingService {
  id: number
  type: 'photography' | 'hotel' | 'host' | 'other'
  name: string
  description: string
  price: number
  image: string
  status: 'pending' | 'booked' | 'completed'
  vendorId?: number
}

const props = defineProps<{
  plan: WeddingPlan | null
}>()

const message = useMessage()
const formRef = ref<FormInst | null>(null)
const loading = ref(false)

// Form data
const formValue = reactive({
  city: [] as string[],
  weddingDate: null as number | null,
  budget: 150000,
  guestCount: 100,
  style: '',
})

// Form validation rules
const rules: FormRules = {
  city: [
    { required: true, message: '请选择婚礼城市', trigger: 'blur' },
  ],
  weddingDate: [
    { required: true, message: '请选择婚礼日期', trigger: 'blur' },
  ],
  budget: [
    { required: true, message: '请输入婚礼预算', trigger: 'blur' },
    { type: 'number', min: 10000, message: '预算不能低于10,000元', trigger: 'blur' },
  ],
  guestCount: [
    { required: true, message: '请输入宾客数量', trigger: 'blur' },
    { type: 'number', min: 1, message: '宾客数量不能小于1', trigger: 'blur' },
  ],
  style: [
    { required: true, message: '请选择婚礼风格', trigger: 'blur' },
  ],
}

// Modals
const showShareModal = ref(false)
const showTimelineModal = ref(false)

// City options (simplified)
const cityOptions = [
  {
    label: '北京',
    value: 'beijing',
    children: [
      { label: '朝阳区', value: 'chaoyang' },
      { label: '海淀区', value: 'haidian' },
      { label: '东城区', value: 'dongcheng' },
      { label: '西城区', value: 'xicheng' },
    ],
  },
  {
    label: '上海',
    value: 'shanghai',
    children: [
      { label: '黄浦区', value: 'huangpu' },
      { label: '徐汇区', value: 'xuhui' },
      { label: '长宁区', value: 'changning' },
      { label: '静安区', value: 'jingan' },
    ],
  },
  {
    label: '广州',
    value: 'guangzhou',
    children: [
      { label: '天河区', value: 'tianhe' },
      { label: '越秀区', value: 'yuexiu' },
      { label: '海珠区', value: 'haizhu' },
      { label: '荔湾区', value: 'liwan' },
    ],
  },
]

// Wedding style options
const styleOptions = [
  { label: '现代简约', value: 'modern' },
  { label: '浪漫唯美', value: 'romantic' },
  { label: '中式传统', value: 'traditional' },
  { label: '户外自然', value: 'outdoor' },
  { label: '复古怀旧', value: 'vintage' },
  { label: '奢华高贵', value: 'luxury' },
]

// Disable past dates
function isDateDisabled(timestamp: number) {
  return timestamp < Date.now() - 86400000 // Don't allow dates in the past
}

// Format price
function formatPrice(price: number): string {
  return price.toLocaleString('zh-CN')
}

// Format date
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

// Format timeline date
function formatTimelineDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const weddingDate = props.plan ? new Date(props.plan.weddingDate) : now

  // If the date is the wedding date
  if (date.toDateString() === weddingDate.toDateString()) {
    return '婚礼当天'
  }

  // Calculate difference in days
  const diffTime = date.getTime() - weddingDate.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return `婚礼前 ${Math.abs(diffDays)} 天`
  } else if (diffDays > 0) {
    return `婚礼后 ${diffDays} 天`
  } else {
    return '婚礼当天'
  }
}

// Check if date is overdue
function isOverdue(dateString: string): boolean {
  const date = new Date(dateString)
  const now = new Date()
  return date < now
}

// Check if date is upcoming (within 7 days)
function isUpcoming(dateString: string): boolean {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
  return diffDays >= 0 && diffDays <= 7
}

// Get timeline item status
function getTimelineItemStatus(item: TimelineItem): 'success' | 'warning' | 'error' | 'info' {
  if (item.completed) {
    return 'success'
  } else if (isOverdue(item.date)) {
    return 'error'
  } else if (isUpcoming(item.date)) {
    return 'warning'
  } else {
    return 'info'
  }
}

// Create wedding plan
function createPlan() {
  formRef.value?.validate(async (errors) => {
    if (errors) {
      message.error('请检查表单中的错误')
      return
    }

    loading.value = true

    try {
      const { data } = await WeddingPlanService.createPlan({
        city: formValue.city,
        weddingDate: formValue.weddingDate ? new Date(formValue.weddingDate).toISOString() : '',
        budget: formValue.budget,
        guestCount: formValue.guestCount,
        style: formValue.style,
      })

      if (data.code === 200) {
        message.success('婚礼方案已创建')
        // Refresh the page to load the new plan
        window.location.reload()
      } else {
        message.error(data.message || '创建婚礼方案失败')
      }
    } catch (error) {
      message.error('创建婚礼方案失败，请检查网络连接')
      console.error('Error creating wedding plan:', error)
    } finally {
      loading.value = false
    }
  })
}

// Edit plan
function editPlan() {
  if (!props.plan)
    return

  // Redirect to edit page
  window.location.href = `/wedding-plan/edit/${props.plan.id}`
}

// View full timeline
function viewFullTimeline() {
  showTimelineModal.value = true
}

// Mark task as completed
async function markAsCompleted(taskId: number) {
  if (!props.plan)
    return

  try {
    const { data } = await WeddingPlanService.markTaskCompleted(props.plan.id, taskId)

    if (data.code === 200) {
      // Update local state
      const task = props.plan.timeline.find(t => t.id === taskId)
      if (task) {
        task.completed = true
      }

      message.success('任务已标记为完成')
    } else {
      message.error(data.message || '操作失败')
    }
  } catch (error) {
    message.error('操作失败，请检查网络连接')
    console.error('Error marking task as completed:', error)
  }
}

// Mark task as incomplete
async function markAsIncomplete(taskId: number) {
  if (!props.plan)
    return

  try {
    const { data } = await WeddingPlanService.markTaskIncomplete(props.plan.id, taskId)

    if (data.code === 200) {
      // Update local state
      const task = props.plan.timeline.find(t => t.id === taskId)
      if (task) {
        task.completed = false
      }

      message.success('任务已标记为未完成')
    } else {
      message.error(data.message || '操作失败')
    }
  } catch (error) {
    message.error('操作失败，请检查网络连接')
    console.error('Error marking task as incomplete:', error)
  }
}

// Share plan
function sharePlan() {
  showShareModal.value = true
}

// Share URL
const shareUrl = computed(() => {
  if (!props.plan)
    return ''
  return `${window.location.origin}/wedding-plan/share/${props.plan.id}`
})

// Copy share URL
function copyShareUrl() {
  navigator.clipboard.writeText(shareUrl.value)
    .then(() => {
      message.success('链接已复制到剪贴板')
    })
    .catch(() => {
      message.error('复制失败，请手动复制')
    })
}

// Share to WeChat
function shareToWechat() {
  // Implement WeChat sharing here
  message.info('微信分享功能开发中')
}

// Share to Weibo
function shareToWeibo() {
  // Implement Weibo sharing here
  message.info('微博分享功能开发中')
}

// Share to QQ
function shareToQQ() {
  // Implement QQ sharing here
  message.info('QQ分享功能开发中')
}

// Share by email
function shareByEmail() {
  const subject = `婚礼方案: ${props.plan?.name || '我的婚礼'}`
  const body = `我想与你分享我的婚礼方案，请点击以下链接查看详情：\n${shareUrl.value}`

  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

// View service details
function viewServiceDetails(service: WeddingService) {
  if (!service.vendorId)
    return

  let path = ''
  switch (service.type) {
    case 'photography':
      path = `/photography/${service.vendorId}`
      break
    case 'hotel':
      path = `/hotel/${service.vendorId}`
      break
    case 'host':
      path = `/host/${service.vendorId}`
      break
    default:
      path = `/vendor/${service.vendorId}`
  }

  window.location.href = path
}

// Book service
function bookService(service: WeddingService) {
  if (!service.vendorId)
    return

  window.location.href = `/order/create?type=${service.type}&vendorId=${service.vendorId}`
}
</script>

<template>
  <div>
    <NCard title="我的婚礼方案" class="mb-4">
      <div v-if="!plan" class="py-6">
        <div class="text-center mb-6">
          <Heart class="mx-auto mb-4 text-pink-300" :size="48" />
          <h3 class="text-lg font-medium mb-2">
            还没有婚礼方案
          </h3>
          <p class="text-gray-500">
            创建一个专属于您的完美婚礼方案
          </p>
        </div>

        <NForm
          ref="formRef"
          :model="formValue"
          :rules="rules"
          label-placement="left"
          label-width="100px"
        >
          <NFormItem label="婚礼城市" path="city">
            <NCascader
              v-model:value="formValue.city"
              placeholder="请选择城市"
              :options="cityOptions"
              check-strategy="child"
            />
          </NFormItem>

          <NFormItem label="婚礼日期" path="weddingDate">
            <NDatePicker
              v-model:value="formValue.weddingDate"
              type="date"
              clearable
              :is-date-disabled="isDateDisabled"
              placeholder="请选择婚礼日期"
              style="width: 100%"
            />
          </NFormItem>

          <NFormItem label="婚礼预算" path="budget">
            <NInputGroup>
              <NInputNumber
                v-model:value="formValue.budget"
                :min="0"
                :step="10000"
                style="width: 100%"
              />
              <NButton type="primary" ghost>
                元
              </NButton>
            </NInputGroup>
          </NFormItem>

          <NFormItem label="宾客数量" path="guestCount">
            <NInputNumber
              v-model:value="formValue.guestCount"
              :min="1"
              :max="1000"
              placeholder="请输入宾客数量"
            />
          </NFormItem>

          <NFormItem label="婚礼风格" path="style">
            <NSelect
              v-model:value="formValue.style"
              :options="styleOptions"
              placeholder="请选择婚礼风格"
            />
          </NFormItem>

          <NFormItem>
            <div class="flex justify-center">
              <NButton
                type="primary"
                :loading="loading"
                size="large"
                @click="createPlan"
              >
                生成我的婚礼方案
              </NButton>
            </div>
          </NFormItem>
        </NForm>
      </div>

      <div v-else>
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-xl font-bold">
              {{ plan.name }}
            </h2>
            <div class="text-gray-500 mt-1">
              创建于 {{ formatDate(plan.createdTime) }} ·
              最后更新 {{ formatDate(plan.updatedTime) }}
            </div>
          </div>

          <div class="flex">
            <NButton class="mr-2" @click="editPlan">
              <template #icon>
                <Edit2 size="16" />
              </template>
              编辑方案
            </NButton>
            <NButton quaternary @click="sharePlan">
              <template #icon>
                <Share2 size="16" />
              </template>
              分享方案
            </NButton>
          </div>
        </div>

        <NDivider />

        <!-- Plan Summary -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <NStatistic label="婚礼日期" :value="formatDate(plan.weddingDate)" />
          <NStatistic label="城市" :value="plan.cityName" />
          <NStatistic label="总预算" :value="`¥${formatPrice(plan.budget)}`" />
          <NStatistic label="已分配" :value="`¥${formatPrice(plan.allocatedBudget)}`" />
        </div>

        <NProgress
          type="line"
          :percentage="Math.round((plan.allocatedBudget / plan.budget) * 100)"
          :processing="plan.allocatedBudget < plan.budget"
          :status="plan.allocatedBudget > plan.budget ? 'error' : 'success'"
          indicator-placement="inside"
        />

        <div
          v-if="plan.allocatedBudget > plan.budget"
          class="text-error text-sm mt-1"
        >
          预算超出 ¥{{ formatPrice(plan.allocatedBudget - plan.budget) }}
        </div>

        <NDivider />

        <!-- Timeline -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium">
              婚礼准备时间线
            </h3>
            <NButton text type="primary" @click="viewFullTimeline">
              查看完整时间线
            </NButton>
          </div>

          <NTimeline>
            <NTimelineItem
              v-for="item in plan.timeline.slice(0, 3)"
              :key="item.id"
              :time="formatTimelineDate(item.date)"
              :type="getTimelineItemStatus(item)"
              :title="item.title"
              :content="item.description"
            />
          </NTimeline>
        </div>

        <NDivider />

        <!-- Categories -->
        <div>
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium">
              婚礼服务预订
            </h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <WeddingServiceCard
              v-for="service in plan.services"
              :key="service.id"
              :service="service"
              @view="viewServiceDetails"
              @book="bookService"
            />
          </div>
        </div>
      </div>
    </NCard>

    <!-- Share Plan Modal -->
    <NModal
      v-model:show="showShareModal"
      preset="card"
      title="分享婚礼方案"
      style="width: 500px"
    >
      <div>
        <p class="mb-4">
          将您的婚礼方案分享给家人和朋友
        </p>

        <NInput
          :value="shareUrl"
          readonly
          class="mb-4"
        >
          <template #suffix>
            <NButton text @click="copyShareUrl">
              <template #icon>
                <Copy size="16" />
              </template>
            </NButton>
          </template>
        </NInput>

        <div class="grid grid-cols-4 gap-4 mt-6">
          <NButton
            quaternary
            circle
            class="mx-auto"
            @click="shareToWechat"
          >
            <template #icon>
              <BugIcon />
            </template>
          </NButton>

          <NButton
            quaternary
            circle
            class="mx-auto"
            @click="shareToWeibo"
          >
            <template #icon>
              <BugIcon />
            </template>
          </NButton>

          <NButton
            quaternary
            circle
            class="mx-auto"
            @click="shareToQQ"
          >
            <template #icon>
              <BugIcon />
            </template>
          </NButton>

          <NButton
            quaternary
            circle
            class="mx-auto"
            @click="shareByEmail"
          >
            <template #icon>
              <Mail size="20" />
            </template>
          </NButton>
        </div>
      </div>
    </NModal>

    <!-- Timeline Modal -->
    <NModal
      v-model:show="showTimelineModal"
      preset="card"
      title="婚礼准备时间线"
      style="width: 700px; max-width: 90vw;"
    >
      <NTimeline v-if="plan">
        <NTimelineItem
          v-for="item in plan.timeline"
          :key="item.id"
          :time="formatTimelineDate(item.date)"
          :type="getTimelineItemStatus(item)"
          :title="item.title"
          :content="item.description"
        >
          <template #footer>
            <div class="flex justify-between items-center mt-2">
              <div>
                <NTag
                  v-if="item.completed"
                  type="success"
                  size="small"
                >
                  已完成
                </NTag>
                <NTag
                  v-else-if="isOverdue(item.date)"
                  type="error"
                  size="small"
                >
                  已逾期
                </NTag>
                <NTag
                  v-else-if="isUpcoming(item.date)"
                  type="warning"
                  size="small"
                >
                  即将到期
                </NTag>
              </div>

              <div>
                <NButton
                  v-if="!item.completed"
                  size="small"
                  @click="markAsCompleted(item.id)"
                >
                  标记为已完成
                </NButton>
                <NButton
                  v-else
                  size="small"
                  @click="markAsIncomplete(item.id)"
                >
                  标记为未完成
                </NButton>
              </div>
            </div>
          </template>
        </NTimelineItem>
      </NTimeline>
    </NModal>
  </div>
</template>
