<!-- src/components/product/PhotographyForm.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import type { FormInst, FormRules } from 'naive-ui'
import { NButton, NDynamicTags, NForm, NFormItem, NInput, NInputNumber, NSelect } from 'naive-ui'
import type { PhotographyProduct } from '~/api/photography/type'
import { PHOTOGRAPHER_LEVEL_OPTIONS } from '~/constants/product'

const props = defineProps<{
  editMode?: boolean
  productId?: number
  productDetail?: PhotographyProduct
}>()

const emit = defineEmits<{
  (e: 'submit', formData: PhotographyProduct): void
}>()

const formRef = ref<FormInst | null>(null)
const loading = ref(false)

// 摄影师级别选项
const photographerLevelOptions = ref(PHOTOGRAPHER_LEVEL_OPTIONS)

// 拍摄地点列表
const locationsList = ref<string[]>([])

// 表单数据
const defaultFormModel: PhotographyProduct = {
  productId: props.productId || 0,
  shootingLocations: '',
  costumeCount: undefined,
  photographerLevel: '',
  photoCount: undefined,
  location: '',
  establishmentYears: undefined,
}

const formModel = ref<PhotographyProduct>({ ...defaultFormModel })

// 表单验证规则
const rules: FormRules = {
  costumeCount: [
    { type: 'number', min: 1, message: '服装套数必须大于0', trigger: 'blur' },
  ],
  photoCount: [
    { type: 'number', min: 1, message: '照片数量必须大于0', trigger: 'blur' },
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

    // 初始化拍摄地点列表
    if (newVal.shootingLocations) {
      locationsList.value = newVal.shootingLocations.split(',')
    } else {
      locationsList.value = []
    }
  }
}, { immediate: true })

// 监听 productId 变化，更新表单数据
watch(() => props.productId, (newVal) => {
  if (newVal) {
    formModel.value.productId = newVal
  }
}, { immediate: true })

// 拍摄地点列表与表单数据双向绑定
watch(locationsList, (newVal) => {
  formModel.value.shootingLocations = newVal.join(',')
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

    // 重置拍摄地点列表
    if (props.productDetail.shootingLocations) {
      locationsList.value = props.productDetail.shootingLocations.split(',')
    } else {
      locationsList.value = []
    }
  } else {
    Object.assign(formModel.value, { ...defaultFormModel, productId: props.productId || 0 })
    locationsList.value = []
  }
}
</script>

<template>
  <div class="photography-form">
    <NForm
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-placement="left"
      label-width="120px"
      require-mark-placement="right-hanging"
      size="medium"
    >
      <NFormItem label="拍摄地点" path="shootingLocations">
        <NDynamicTags v-model:value="locationsList" />
        <div class="mt-1 text-gray-500 text-xs">
          用逗号分隔添加多个拍摄地点
        </div>
      </NFormItem>

      <NFormItem label="服装套数" path="costumeCount">
        <NInputNumber
          v-model:value="formModel.costumeCount"
          :min="1"
          placeholder="请输入服装套数"
          clearable
        />
      </NFormItem>

      <NFormItem label="摄影师级别" path="photographerLevel">
        <NSelect
          v-model:value="formModel.photographerLevel"
          :options="photographerLevelOptions"
          placeholder="请选择摄影师级别"
          clearable
        />
      </NFormItem>

      <NFormItem label="照片数量" path="photoCount">
        <NInputNumber
          v-model:value="formModel.photoCount"
          :min="1"
          placeholder="请输入照片数量"
          clearable
        />
      </NFormItem>

      <NFormItem label="工作室地址" path="location">
        <NInput v-model:value="formModel.location" placeholder="请输入工作室地址" clearable />
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
