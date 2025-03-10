<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  NButton, 
  NCard, 
  NForm, 
  NFormItem, 
  NInputNumber, 
  NSelect, 
  NSpace, 
  NStep, 
  NSteps, 
  NSpin,
  NResult,
  NDescriptions,
  NDescriptionsItem
} from 'naive-ui'
import { createWeddingPackage } from '~/api/weddingPackage'
import type { WeddingPackageParams } from '~/api/weddingPackage/type'
import { CityOptions } from '~/constants/weddingPackage'
import { Gift, ArrowRight, Check } from 'lucide-vue-next'
import { useUserStore } from '~/stores'

const userStore = useUserStore()
const router = useRouter()

// 当前步骤
const currentStep = ref(0)

// 表单数据
const formData = reactive<Partial<WeddingPackageParams>>({
  budget: 100000, // 默认预算10万
  location: undefined
})

// 表单规则
const rules = {
  budget: [
    { required: true, message: '请输入预算', trigger: 'blur', type: 'number' },
    { type: 'number', min: 10000, message: '预算不能低于1万', trigger: 'blur' }
  ],
  location: [
    { required: true, message: '请选择地区', trigger: 'blur' }
  ]
}

// 表单引用
const formRef = ref(null)

// 加载状态
const loading = ref(false)

// 创建结果
const createResult = ref({
  success: false,
  packageId: 0
})

// 提交表单
async function handleSubmit() {
  if (!formRef.value) return
  
  try {
    await (formRef.value as any).validate()
    
    loading.value = true
    const response = await createWeddingPackage({
      ...formData,
      userId: userStore.userInfo?.id
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

// 返回列表
function backToList() {
  router.push('/weddingPackage')
}

// 查看详情
function viewDetails() {
  router.push(`/weddingPackage/${createResult.value.packageId}`)
}

// 格式化预算显示
function formatBudget(budget: number): string {
  if (budget >= 10000) {
    return `${(budget / 10000).toFixed(1)}万`
  }
  return `${budget}元`
}
</script>

<template>
  <div class="wedding-package-create-container">
    <div class="container mx-auto px-4 py-8">
      <NCard class="max-w-3xl mx-auto">
        <template #header>
          <div class="flex items-center justify-between">
            <h1 class="text-xl font-bold text-pink-800">创建婚礼方案</h1>
            <NButton text @click="backToList">
              返回列表
            </NButton>
          </div>
        </template>
        
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
            
            <div class="flex justify-center mt-8">
              <NButton 
                type="primary" 
                color="#DB2777"
                size="large"
                :loading="loading"
                @click="handleSubmit"
              >
                开始智能匹配
                <template #icon>
                  <ArrowRight class="ml-1" :size="16" />
                </template>
              </NButton>
            </div>
          </NForm>
        </div>
        
        <!-- 第二步：智能匹配中 -->
        <div v-else-if="currentStep === 1" class="py-12 flex flex-col items-center">
          <NSpin size="large" />
          <p class="mt-4 text-lg">正在为您智能匹配最适合的婚礼方案...</p>
          <p class="text-gray-500 mt-2">根据您的预算和地区，我们正在精选优质服务</p>
          
          <!-- 此处实际应用中可能有一些匹配进度的展示 -->
          <div class="mt-8">
            <NButton 
              type="primary" 
              color="#DB2777"
              @click="nextStep" 
              class="mt-4"
            >
              匹配完成，查看结果
            </NButton>
          </div>
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
            
            <template #footer>
              <NSpace>
                <NButton @click="backToList">
                  返回列表
                </NButton>
                <NButton type="primary" color="#DB2777" @click="viewDetails">
                  查看方案详情
                </NButton>
              </NSpace>
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
          </NResult>
        </div>
      </NCard>
    </div>
  </div>
</template>

<style scoped>
.wedding-package-create-container {
  background-color: #f9f8f6;
  min-height: 100vh;
}
</style>
