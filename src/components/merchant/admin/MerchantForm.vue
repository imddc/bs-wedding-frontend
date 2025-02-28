<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type {
  FormInst,
  FormRules,
} from 'naive-ui'
import {
  NButton,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NRadio,
  NRadioGroup,
  NSelect,
  useMessage,
} from 'naive-ui'
import {
  createMerchant,
  updateMerchant,
} from '~/api/merchant'
import {

  MerchantStatus,
  MerchantType,

} from '~/api/merchant/type'
import type { MerchantCreateParams, MerchantInfo, MerchantUpdateParams } from '~/api/merchant/type'

const props = defineProps<{
  formData: Partial<MerchantInfo> & { isEditing: boolean }
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit'): void
  (e: 'cancel'): void
}>()

const message = useMessage()
const formRef = ref<FormInst | null>(null)
const loading = ref(false)

// 商家类型选项
const merchantTypeOptions = [
  { label: '婚纱摄影', value: MerchantType.PHOTOGRAPHY },
  { label: '婚宴酒店', value: MerchantType.HOTEL },
  { label: '司仪主持', value: MerchantType.HOST },
]

// 表单数据
const form = reactive<Partial<MerchantInfo>>({
  id: undefined,
  userId: undefined,
  merchantName: '',
  logo: '',
  description: '',
  address: '',
  city: '',
  contactPhone: '',
  contactPerson: '',
  merchantType: undefined,
  status: MerchantStatus.ONLINE,
})

// 表单验证规则
const rules: FormRules = {
  userId: [
    { required: true, message: '请输入用户ID', trigger: 'blur' },
    { type: 'number', message: '用户ID必须为数字', trigger: 'blur' },
  ],
  merchantName: [
    { required: true, message: '请输入商家名称', trigger: 'blur' },
    { max: 100, message: '商家名称长度不能超过100个字符', trigger: 'blur' },
  ],
  merchantType: [
    { required: true, message: '请选择商家类型', trigger: 'change' },
  ],
  logo: [
    { max: 255, message: 'LOGO地址长度不能超过255个字符', trigger: 'blur' },
  ],
  address: [
    { max: 255, message: '地址长度不能超过255个字符', trigger: 'blur' },
  ],
  city: [
    { max: 50, message: '城市长度不能超过50个字符', trigger: 'blur' },
  ],
  contactPhone: [
    { pattern: /^1[3-9]\d{9}$/, message: '联系电话格式不正确', trigger: 'blur' },
    { max: 20, message: '联系电话长度不能超过20个字符', trigger: 'blur' },
  ],
  contactPerson: [
    { max: 50, message: '联系人长度不能超过50个字符', trigger: 'blur' },
  ],
}

// 是否为查看模式
const viewMode = computed(() => {
  // 如果有id且有createTime表示为查看模式
  return !!(props.formData.id && props.formData.createTime && !props.formData.isEditing)
})

// 格式化日期
function formatDate(dateString?: string) {
  if (!dateString)
    return '-'
  return dateString.replace('T', ' ').substring(0, 19)
}

// 监听props变化，更新表单数据
watch(
  () => props.formData,
  (newVal) => {
    if (newVal) {
      Object.keys(form).forEach((key) => {
        // @ts-expect-error non
        form[key] = newVal[key] !== undefined ? newVal[key] : form[key]
      })
    }
  },
  { immediate: true, deep: true },
)

// 提交表单
async function handleSubmit() {
  loading.value = true
  try {
    await formRef.value?.validate()

    if (form.id) {
      // 更新操作
      const updateData: MerchantUpdateParams = {
        id: form.id,
        userId: form.userId!,
        merchantName: form.merchantName!,
        logo: form.logo,
        description: form.description,
        address: form.address,
        city: form.city,
        contactPhone: form.contactPhone,
        contactPerson: form.contactPerson,
        merchantType: form.merchantType as MerchantType,
        status: form.status as MerchantStatus,
      }

      const response = await updateMerchant(updateData)
      if (response.success) {
        message.success('更新商家成功')
        emit('submit')
      } else {
        message.error(response.message || '更新商家失败')
      }
    } else {
      // 创建操作
      const createData: MerchantCreateParams = {
        userId: form.userId!,
        merchantName: form.merchantName!,
        logo: form.logo,
        description: form.description,
        address: form.address,
        city: form.city,
        contactPhone: form.contactPhone,
        contactPerson: form.contactPerson,
        merchantType: form.merchantType as MerchantType,
        status: form.status as MerchantStatus,
      }

      const response = await createMerchant(createData)
      if (response.success) {
        message.success('创建商家成功')
        emit('submit')
      } else {
        message.error(response.message || '创建商家失败')
      }
    }
  } catch (error) {
    console.error('提交表单出错:', error)
    message.error('提交表单出错')
  } finally {
    loading.value = false
  }
}

// 取消操作
function handleCancel() {
  emit('cancel')
}
</script>

<template>
  <div class="merchant-form">
    <NForm
      ref="formRef"
      :model="form"
      :rules="rules"
      label-placement="left"
      label-width="80"
      require-mark-placement="right-hanging"
    >
      <NFormItem label="用户ID" path="userId">
        <NInputNumber
          v-model:value="form.userId"
          placeholder="请输入用户ID"
          :disabled="viewMode"
          class="w-full"
        />
      </NFormItem>

      <NFormItem label="商家名称" path="merchantName">
        <NInput
          v-model:value="form.merchantName"
          placeholder="请输入商家名称"
          :disabled="viewMode"
        />
      </NFormItem>

      <NFormItem label="商家类型" path="merchantType">
        <NSelect
          v-model:value="form.merchantType"
          :options="merchantTypeOptions"
          placeholder="请选择商家类型"
          :disabled="viewMode"
        />
      </NFormItem>

      <NFormItem label="商家LOGO" path="logo">
        <NInput
          v-model:value="form.logo"
          placeholder="请输入商家LOGO地址"
          :disabled="viewMode"
        />
      </NFormItem>

      <NFormItem label="联系人" path="contactPerson">
        <NInput
          v-model:value="form.contactPerson"
          placeholder="请输入联系人"
          :disabled="viewMode"
        />
      </NFormItem>

      <NFormItem label="联系电话" path="contactPhone">
        <NInput
          v-model:value="form.contactPhone"
          placeholder="请输入联系电话"
          :disabled="viewMode"
        />
      </NFormItem>

      <NFormItem label="城市" path="city">
        <NInput
          v-model:value="form.city"
          placeholder="请输入城市"
          :disabled="viewMode"
        />
      </NFormItem>

      <NFormItem label="地址" path="address">
        <NInput
          v-model:value="form.address"
          placeholder="请输入地址"
          :disabled="viewMode"
        />
      </NFormItem>

      <NFormItem label="状态" path="status">
        <NRadioGroup v-model:value="form.status" :disabled="viewMode">
          <NRadio :value="1">
            上架
          </NRadio>
          <NRadio :value="0">
            下架
          </NRadio>
        </NRadioGroup>
      </NFormItem>

      <NFormItem label="描述" path="description">
        <NInput
          v-model:value="form.description"
          type="textarea"
          placeholder="请输入商家描述"
          :rows="3"
          :disabled="viewMode"
        />
      </NFormItem>

      <template v-if="viewMode">
        <NFormItem label="收藏数量">
          {{ form.favoriteCount }}
        </NFormItem>

        <NFormItem label="创建时间">
          {{ formatDate(form.createTime) }}
        </NFormItem>

        <NFormItem label="更新时间">
          {{ formatDate(form.updateTime) }}
        </NFormItem>
      </template>

      <div class="flex justify-end mt-4 space-x-2">
        <NButton
          v-if="!viewMode"
          type="primary"
          :loading="loading"
          @click="handleSubmit"
        >
          {{ form.id ? '更新' : '创建' }}
        </NButton>
        <NButton @click="handleCancel">
          {{ viewMode ? '关闭' : '取消' }}
        </NButton>
      </div>
    </NForm>
  </div>
</template>

<style scoped>
.merchant-form {
  padding: 16px;
}
</style>
