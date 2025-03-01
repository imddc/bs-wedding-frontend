<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import type { FormInst } from 'naive-ui'
import { PHOTOGRAPHY_RULES } from '~/constants/product'
import type { PhotographyProductDTO } from '~/api/product/type'
import BaseProductForm from './BaseProductForm.vue'

interface Props {
  modelValue: Partial<PhotographyProductDTO>
  merchantOptions: Array<{ label: string, value: number }>
  categoryOptions: Array<{ label: string, value: number }>
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const formRef = ref<FormInst | null>(null)
const formData = reactive<Partial<PhotographyProductDTO>>({
  id: undefined,
  merchantId: undefined,
  productName: '',
  categoryId: undefined,
  location: '',
  establishmentYears: 0,
  price: 0,
  mainImage: '',
  subImages: [],
  description: '',
  tags: '',
  services: [],
  detail: '',
  stock: 0,
  shootingLocations: '',
  costumeCount: 1,
  photographerLevel: '',
  photoCount: 0,
})

// Options for dropdown menus
const photographerLevelOptions = [
  { label: '初级摄影师', value: '初级摄影师' },
  { label: '中级摄影师', value: '中级摄影师' },
  { label: '高级摄影师', value: '高级摄影师' },
  { label: '资深摄影师', value: '资深摄影师' },
  { label: '首席摄影师', value: '首席摄影师' },
]

// Initialize form data
onMounted(() => {
  if (props.modelValue) {
    Object.assign(formData, props.modelValue)
  }
})

// Validate and return form data
defineExpose({
  validate: () => {
    return new Promise((resolve, reject) => {
      formRef.value?.validate((errors) => {
        if (errors) {
          reject(errors)
        } else {
          resolve(formData)
        }
      })
    })
  },
})
</script>

<template>
  <NForm
    ref="formRef"
    :model="formData"
    :rules="PHOTOGRAPHY_RULES"
    label-placement="left"
    label-width="120"
    require-mark-placement="right-hanging"
  >
    <NGrid :cols="24" :x-gap="24">
      <NGridItem :span="24">
        <BaseProductForm
          v-model="formData"
          :merchant-options="merchantOptions"
          :category-options="categoryOptions"
        />
      </NGridItem>
    </NGrid>
  </NForm>
</template>

            <NGridItem :span="12">
        <NFormItem label="拍摄地点" path="shootingLocations">
          <NInput
            v-model:value="formData.shootingLocations"
            type="textarea"
            placeholder="请输入拍摄地点，多个地点用逗号分隔"
          />
        </NFormItem>
      </NGridItem>

      <NGridItem :span="12">
        <NFormItem label="服装套数" path="costumeCount">
          <NInputNumber
            v-model:value="formData.costumeCount"
            placeholder="请输入服装套数"
            :min="1"
          />
        </NFormItem>
      </NGridItem>

      <NGridItem :span="12">
        <NFormItem label="摄影师级别" path="photographerLevel">
          <NSelect
            v-model:value="formData.photographerLevel"
            placeholder="请选择摄影师级别"
            :options="photographerLevelOptions"
          />
        </NFormItem>
      </NGridItem>

      <NGridItem :span="12">
        <NFormItem label="精修照片数量" path="photoCount">
          <NInputNumber
            v-model:value="formData.photoCount"
            placeholder="请输入精修照片数量"
            :min="1"
          />
        </NFormItem>
      </NGridItem>
