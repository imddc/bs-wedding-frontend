<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  NButton,
  NDescriptions,
  NDescriptionsItem,
  NForm,
  NFormItem,
  NInputNumber,
  NModal,
  NResult,
  NSelect,
  NSpace,
  NSpin,
  NStep,
  NSteps,
} from 'naive-ui'
import { ArrowRight, Check, Gift } from 'lucide-vue-next'
import { createWeddingPackage } from '~/api/weddingPackage'
import type { WeddingPackageParams } from '~/api/weddingPackage/type'
import { CityOptions } from '~/constants/weddingPackage'
import { useUserStore } from '~/stores'

const show = defineModel<boolean>('show', { required: true })

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'success', packageId: number): void
}>()

const userStore = useUserStore()

// 当前步骤
const currentStep = ref(0)

// 表单数据
const formData = reactive<Partial<WeddingPackageParams>>({
  budget: 100000,
  location: undefined,
})

// 表单规则
const rules = {
  budget: [
    { required: true, message: '请输入预算', trigger: 'blur', type: 'number' },
    { type: 'number', min: 10000, message: '预算不能低于1万', trigger: 'blur' },
  ],
  location: [
    { required: true, message: '请选择地区', trigger: 'blur' },
  ],
}

const formRef = ref(null)
const loading = ref(false)
const createResult = ref({
  success: false,
  packageId: 0,
})

// 提交表单
async function handleSubmit() {
  if (!formRef.value)
    return

  try {
    await (formRef.value as any).validate()

    loading.value = true
    const response = await createWeddingPackage({
      ...formData,
      userId: userStore.userInfo?.id,
    } as WeddingPackageParams)

    if (response.success) {
      createResult.value.success = true
      createResult.value.packageId = response.data
      nextStep()
    } else {
      window.$message.error(response.message || '创建婚礼方案失败')
    }
  } catch (error) {
    window.$message.error('表单验证失败，请检查输入')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 下一步
function nextStep() {
  currentStep.value++
}

// 关闭弹窗
function handleClose() {
  emit('update:show', false)
  // 重置状态
  setTimeout(() => {
    currentStep.value = 0
    formData.budget = 100000
    formData.location = undefined
    createResult.value = {
      success: false,
      packageId: 0,
    }
  }, 300)
}

// 完成创建
function handleComplete() {
  emit('success', createResult.value.packageId)
  handleClose()
}

// 格式化预算显示
function formatBudget(budget: number): string {
  return budget >= 10000 ? `${(budget / 10000).toFixed(1)}万` : `${budget}元`
}
</script>

<template>
  <NModal
    v-model:show="show"
    preset="card"
    style="max-width: 800px; width: 90%"
    title="创建婚礼方案"
    :mask-closable="false"
    :close-on-esc="false"
  >
    <div class="mb-8">
      <NSteps :current="currentStep" size="small">
        <NStep title="填写基本信息" />
        <NStep title="智能匹配商品" />
        <NStep title="完成" />
      </NSteps>
    </div>

    <!-- 第一步：填写基本信息 -->
    <div v-if="currentStep === 0">
      <NForm
        ref="formRef"
        :model="formData"
        :rules="rules as any"
        label-placement="left"
        label-width="80"
        require-mark-placement="right-hanging"
      >
        <NFormItem label="预算" path="budget" required>
          <NInputNumber
            v-model:value="formData.budget"
            :min="10000"
            :step="10000"
            style="width: 100%"
          >
            <template #prefix>
              ¥
            </template>
          </NInputNumber>
          <div class="text-xs text-gray-500 mt-1">
            提示：建议预算至少10万元，以确保获得优质服务
          </div>
        </NFormItem>

        <NFormItem label="地区" path="location" required>
          <NSelect
            v-model:value="formData.location"
            :options="CityOptions"
            placeholder="请选择城市"
            filterable
          />
        </NFormItem>
      </NForm>

      <div class="flex justify-end gap-2 mt-6">
        <NButton @click="handleClose">
          取消
        </NButton>
        <NButton
          type="primary"
          color="#DB2777"
          :loading="loading"
          @click="handleSubmit"
        >
          开始智能匹配
          <template #icon>
            <ArrowRight class="ml-1" :size="16" />
          </template>
        </NButton>
      </div>
    </div>

    <!-- 第二步：智能匹配中 -->
    <div v-else-if="currentStep === 1" class="py-8 flex flex-col items-center">
      <NSpin size="large" />
      <p class="mt-4 text-lg">
        正在为您智能匹配最适合的婚礼方案...
      </p>
      <p class="text-gray-500 mt-2">
        根据您的预算和地区，我们正在精选优质服务
      </p>

      <NButton
        type="primary"
        color="#DB2777"
        class="mt-8"
        @click="nextStep"
      >
        匹配完成，查看结果
      </NButton>
    </div>

    <!-- 第三步：完成 -->
    <div v-else class="py-4">
      <NResult
        status="success"
        title="婚礼方案创建成功"
        description="我们已为您智能匹配了最适合的婚纱摄影、婚宴酒店和司仪主持服务"
      >
        <template #icon>
          <div class="rounded-full bg-pink-100 p-4 inline-flex">
            <Gift :size="40" class="text-pink-600" />
          </div>
        </template>

        <div class="bg-pink-50 p-4 rounded-lg my-4">
          <NDescriptions title="方案基本信息" bordered>
            <NDescriptionsItem label="预算">
              {{ formatBudget(formData.budget || 0) }}
            </NDescriptionsItem>
            <NDescriptionsItem label="地区">
              {{ formData.location }}
            </NDescriptionsItem>
            <NDescriptionsItem label="方案ID">
              {{ createResult.packageId }}
            </NDescriptionsItem>
          </NDescriptions>

          <div class="mt-4 text-center">
            <p class="text-pink-800">
              <Check :size="16" class="inline-block mr-1" /> 我们已为您匹配了3种婚礼必备服务
            </p>
          </div>
        </div>

        <template #footer>
          <NSpace>
            <NButton @click="handleClose">
              返回列表
            </NButton>
            <NButton type="primary" color="#DB2777" @click="handleComplete">
              查看方案详情
            </NButton>
          </NSpace>
        </template>
      </NResult>
    </div>
  </NModal>
</template>
