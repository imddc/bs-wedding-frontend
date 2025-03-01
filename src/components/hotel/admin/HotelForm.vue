<!-- src/components/product/HotelForm.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import type { FormInst, FormRules } from 'naive-ui'
import { NButton, NForm, NFormItem, NInput, NInputNumber, NSelect } from 'naive-ui'
import type { HotelProduct } from '~/api/hotel/type'
import { CATERING_STYLE_OPTIONS } from '~/constants/product'

const props = defineProps<{
  editMode?: boolean
  productId?: number
  productDetail?: HotelProduct
}>()

const emit = defineEmits<{
  (e: 'submit', formData: HotelProduct): void
}>()

const formRef = ref<FormInst | null>(null)
const loading = ref(false)

// 餐饮风格选项
const cateringStyleOptions = ref(CATERING_STYLE_OPTIONS)

// 餐饮风格列表
const cateringStyleList = ref<string[]>([])

// 表单数据
const defaultFormModel: HotelProduct = {
  productId: props.productId || 0,
  venueSize: undefined,
  maxTables: undefined,
  minTables: undefined,
  cateringStyle: '',
  location: '',
  establishmentYears: undefined,
}

const formModel = ref<HotelProduct>({ ...defaultFormModel })

// 表单验证规则
const rules: FormRules = {
  venueSize: [
    { type: 'number', min: 1, message: '场地大小必须大于0', trigger: 'blur' },
  ],
  maxTables: [
    { type: 'number', min: 1, message: '最大桌数必须大于0', trigger: 'blur' },
  ],
  minTables: [
    { type: 'number', min: 1, message: '最小起订桌数必须大于0', trigger: 'blur' },
  ],
  location: [
    { max: 255, message: '地址不能超过255个字符', trigger: 'blur' },
  ],
  establishmentYears: [
    { type: 'number', min: 0, message: '成立年限不能为负数', trigger: 'blur' },
  ],
}

// 监听 productDetail 变化，初始化表单数据
watch(() => props.productDetail, (newVal) => {
  if (newVal) {
    Object.assign(formModel.value, newVal)

    // 初始化餐饮风格列表
    if (newVal.cateringStyle) {
      cateringStyleList.value = newVal.cateringStyle.split(',')
    } else {
      cateringStyleList.value = []
    }
  }
}, { immediate: true })

// 监听 productId 变化，更新表单数据
watch(() => props.productId, (newVal) => {
  if (newVal) {
    formModel.value.productId = newVal
  }
}, { immediate: true })

// 餐饮风格列表与表单数据双向绑定
watch(cateringStyleList, (newVal) => {
  formModel.value.cateringStyle = newVal.join(',')
}, { deep: true })

// 提交表单
async function handleSubmit() {
  try {
    await formRef.value?.validate()

    loading.value = true
    formModel.value.productId = props.productId || 0
    emit('submit', formModel.value)
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    loading.value = false
  }
}

// 重置表单
function handleReset() {
  formRef.value?.restoreValidation()
  if (props.editMode && props.productDetail) {
    Object.assign(formModel.value, props.productDetail)

    // 重置餐饮风格列表
    if (props.productDetail.cateringStyle) {
      cateringStyleList.value = props.productDetail.cateringStyle.split(',')
    } else {
      cateringStyleList.value = []
    }
  } else {
    Object.assign(formModel.value, { ...defaultFormModel, productId: props.productId || 0 })
    cateringStyleList.value = []
  }
}
</script>

<template>
  <div class="hotel-form">
    <NForm
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-placement="left"
      label-width="120px"
      require-mark-placement="right-hanging"
      size="medium"
    >
      <NFormItem label="场地大小" path="venueSize">
        <div class="flex items-center">
          <NInputNumber
            v-model:value="formModel.venueSize"
            :min="1"
            placeholder="请输入场地大小"
            clearable
            class="flex-1"
          />
          <span class="ml-2">平方米</span>
        </div>
      </NFormItem>

      <NFormItem label="最大桌数" path="maxTables">
        <NInputNumber
          v-model:value="formModel.maxTables"
          :min="1"
          placeholder="请输入最大桌数"
          clearable
        />
      </NFormItem>

      <NFormItem label="最小起订桌数" path="minTables">
        <NInputNumber
          v-model:value="formModel.minTables"
          :min="1"
          placeholder="请输入最小起订桌数"
          clearable
        />
      </NFormItem>

      <NFormItem label="餐饮风格" path="cateringStyle">
        <NSelect
          v-model:value="cateringStyleList"
          :options="cateringStyleOptions"
          placeholder="请选择餐饮风格"
          clearable
          multiple
        />
      </NFormItem>

      <NFormItem label="酒店地址" path="location">
        <NInput v-model:value="formModel.location" placeholder="请输入酒店地址" clearable />
      </NFormItem>

      <NFormItem label="成立年限" path="establishmentYears">
        <NInputNumber
          v-model:value="formModel.establishmentYears"
          :min="0"
          placeholder="请输入成立年限"
          clearable
        />
      </NFormItem>

      <NFormItem>
        <NButton type="primary" :loading="loading" @click="handleSubmit">
          提交
        </NButton>
        <NButton class="ml-4" @click="handleReset">
          重置
        </NButton>
      </NFormItem>
    </NForm>
  </div>
</template>
