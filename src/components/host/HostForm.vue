<!-- src/components/product/HostForm.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import type { FormInst, FormRules } from 'naive-ui'
import { NButton, NForm, NFormItem, NInput, NInputNumber, NSelect } from 'naive-ui'
import type { HostProduct } from '~/api/host/type'
import { HOSTING_STYLE_OPTIONS, LANGUAGE_OPTIONS } from '~/constants/product'

const props = defineProps<{
  editMode?: boolean
  productId?: number
  productDetail?: HostProduct
}>()

const emit = defineEmits<{
  (e: 'submit', formData: HostProduct): void
}>()

const formRef = ref<FormInst | null>(null)
const loading = ref(false)

// 主持风格选项
const hostingStyleOptions = ref(HOSTING_STYLE_OPTIONS)

// 语言选项
const languageOptions = ref(LANGUAGE_OPTIONS)

// 语言列表
const languagesList = ref<string[]>([])

// 表单数据
const defaultFormModel: HostProduct = {
  productId: props.productId || 0,
  hostingExperience: undefined,
  hostingStyle: '',
  languages: '',
  location: '',
  establishmentYears: undefined,
}

const formModel = ref<HostProduct>({ ...defaultFormModel })

// 表单验证规则
const rules: FormRules = {
  hostingExperience: [
    { type: 'number', min: 0, message: '主持经验不能为负数', trigger: 'blur' },
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

    // 初始化语言列表
    if (newVal.languages) {
      languagesList.value = newVal.languages.split(',')
    } else {
      languagesList.value = []
    }
  }
}, { immediate: true })

// 监听 productId 变化，更新表单数据
watch(() => props.productId, (newVal) => {
  if (newVal) {
    formModel.value.productId = newVal
  }
}, { immediate: true })

// 语言列表与表单数据双向绑定
watch(languagesList, (newVal) => {
  formModel.value.languages = newVal.join(',')
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

    // 重置语言列表
    if (props.productDetail.languages) {
      languagesList.value = props.productDetail.languages.split(',')
    } else {
      languagesList.value = []
    }
  } else {
    Object.assign(formModel.value, { ...defaultFormModel, productId: props.productId || 0 })
    languagesList.value = []
  }
}
</script>

<template>
  <div class="host-form">
    <NForm
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-placement="left"
      label-width="120px"
      require-mark-placement="right-hanging"
      size="medium"
    >
      <NFormItem label="主持经验" path="hostingExperience">
        <div class="flex items-center">
          <NInputNumber
            v-model:value="formModel.hostingExperience"
            :min="0"
            placeholder="请输入主持经验"
            clearable
            class="flex-1"
          />
          <span class="ml-2">年</span>
        </div>
      </NFormItem>

      <NFormItem label="主持风格" path="hostingStyle">
        <NSelect
          v-model:value="formModel.hostingStyle"
          :options="hostingStyleOptions"
          placeholder="请选择主持风格"
          clearable
        />
      </NFormItem>

      <NFormItem label="可用语言" path="languages">
        <NSelect
          v-model:value="languagesList"
          :options="languageOptions"
          placeholder="请选择可用语言"
          clearable
          multiple
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
