<script setup lang="ts">
import { reactive, ref } from 'vue'
import type {
  FormInst,
  FormRules,
} from 'naive-ui'
import {
  NButton,
  NForm,
  NFormItem,
  NInput,
  useMessage,
} from 'naive-ui'
import { updatePassword } from '~/api/user'
import type { PasswordUpdateParams } from '~/api/user/type'

const props = defineProps<{
  userId: number
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit'): void
  (e: 'cancel'): void
}>()

const message = useMessage()
const formRef = ref<FormInst | null>(null)
const loading = ref(false)

// 表单数据
const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 表单验证规则
const rules: FormRules = {
  oldPassword: [
    { required: true, message: '请输入旧密码', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (_, value) => {
        return value === form.newPassword
      },
      message: '两次输入的密码不一致',
      trigger: 'blur',
    },
  ],
}

// 提交表单
async function handleSubmit() {
  loading.value = true
  try {
    await formRef.value?.validate()

    const passwordData: PasswordUpdateParams = {
      id: props.userId,
      oldPassword: form.oldPassword,
      newPassword: form.newPassword,
    }

    const response = await updatePassword(passwordData)
    if (response.success) {
      message.success('密码修改成功')
      emit('submit')
    } else {
      message.error(response.message || '密码修改失败')
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
  <div class="password-form">
    <NForm
      ref="formRef"
      :model="form"
      :rules="rules"
      label-placement="left"
      label-width="80"
      require-mark-placement="right-hanging"
    >
      <NFormItem label="旧密码" path="oldPassword">
        <NInput
          v-model:value="form.oldPassword"
          type="password"
          show-password-on="click"
          placeholder="请输入旧密码"
        />
      </NFormItem>

      <NFormItem label="新密码" path="newPassword">
        <NInput
          v-model:value="form.newPassword"
          type="password"
          show-password-on="click"
          placeholder="请输入新密码"
        />
      </NFormItem>

      <NFormItem label="确认密码" path="confirmPassword">
        <NInput
          v-model:value="form.confirmPassword"
          type="password"
          show-password-on="click"
          placeholder="请再次输入新密码"
        />
      </NFormItem>

      <div class="flex justify-end mt-4 space-x-2">
        <NButton
          type="primary"
          :loading="loading"
          @click="handleSubmit"
        >
          确认修改
        </NButton>
        <NButton @click="handleCancel">
          取消
        </NButton>
      </div>
    </NForm>
  </div>
</template>

<style scoped>
.password-form {
  padding: 16px;
}
</style>
