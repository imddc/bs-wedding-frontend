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
  NRadio,
  NRadioGroup,
  NSelect,
  useMessage,
} from 'naive-ui'
import {
  createUser,
  updateUser,
} from '~/api/user'
import {

  UserStatus,
  UserType,

} from '~/api/user/type'
import type { UserCreateParams, UserInfo, UserUpdateParams } from '~/api/user/type'
import { USER_TYPE_OPTIONS } from '~/constants/user'

interface FormDataProps extends Partial<UserInfo> {
  isReadOnly?: boolean
  password?: string
}

const props = defineProps<{
  formData: FormDataProps
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit'): void
  (e: 'cancel'): void
}>()

const message = useMessage()
const formRef = ref<FormInst | null>(null)
const loading = ref(false)

// 用户类型选项
const userTypeOptions = USER_TYPE_OPTIONS

// 是否为创建模式
const isCreateMode = computed(() => !props.formData.id)
// 是否为只读模式（查看详情）
const isReadOnly = computed(() => props.formData.isReadOnly === true)

// 表单数据
const form = reactive<FormDataProps>({
  id: undefined,
  username: '',
  password: '',
  realName: '',
  phone: '',
  email: '',
  userType: UserType.NORMAL,
  status: UserStatus.ACTIVE,
  createTime: '',
  updateTime: '',
})

// 表单验证规则
const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 50, message: '用户名长度必须在3-50个字符之间', trigger: 'blur' },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
      validator: (_rule, value) => isCreateMode.value ? !!value : true,
    },
    {
      min: 6,
      message: '密码长度不能少于6个字符',
      trigger: 'blur',
      validator: (_rule, value) => isCreateMode.value ? (!value || value.length >= 6) : true,
    },
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' },
  ],
  email: [
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
}

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
        if (key !== 'password') { // 不同步password字段
          // @ts-expect-error non
          form[key] = newVal[key] !== undefined ? newVal[key] : form[key]
        }
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

    if (isCreateMode.value) {
      // 创建操作
      const createData: UserCreateParams = {
        username: form.username!,
        password: form.password!,
        realName: form.realName,
        phone: form.phone,
        email: form.email,
        userType: form.userType as UserType,
        status: form.status as UserStatus,
      }

      const response = await createUser(createData)
      if (response.success) {
        window.$message.success('创建用户成功')
        emit('submit')
      } else {
        window.$message.error(response.message || '创建用户失败')
      }
    } else {
      // 更新操作
      const updateData: UserUpdateParams = {
        id: form.id!,
        realName: form.realName,
        phone: form.phone,
        email: form.email,
        userType: form.userType as UserType,
        status: form.status as UserStatus,
      }

      const response = await updateUser(updateData)
      if (response.success) {
        window.$message.success('更新用户成功')
        emit('submit')
      } else {
        window.$message.error(response.message || '更新用户失败')
      }
    }
  } catch (error) {
    console.error('提交表单出错:', error)
    window.$message.error('提交表单出错')
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
  <div class="user-form">
    <NForm
      ref="formRef"
      :model="form"
      :rules="rules"
      label-placement="left"
      label-width="80"
      require-mark-placement="right-hanging"
    >
      <NFormItem v-if="!isCreateMode" label="用户ID">
        <NInput v-model:value="form.id" disabled />
      </NFormItem>

      <NFormItem label="用户名" path="username">
        <NInput
          v-model:value="form.username"
          placeholder="请输入用户名"
          :disabled="!isCreateMode || isReadOnly"
        />
      </NFormItem>

      <NFormItem v-if="isCreateMode" label="密码" path="password">
        <NInput
          v-model:value="form.password"
          type="password"
          show-password-on="click"
          placeholder="请输入密码"
          :disabled="isReadOnly"
        />
      </NFormItem>

      <NFormItem label="真实姓名" path="realName">
        <NInput
          v-model:value="form.realName"
          placeholder="请输入真实姓名"
          :disabled="isReadOnly"
        />
      </NFormItem>

      <NFormItem label="手机号" path="phone">
        <NInput
          v-model:value="form.phone"
          placeholder="请输入手机号"
          :disabled="isReadOnly"
        />
      </NFormItem>

      <NFormItem label="邮箱" path="email">
        <NInput
          v-model:value="form.email"
          placeholder="请输入邮箱"
          :disabled="isReadOnly"
        />
      </NFormItem>

      <NFormItem label="用户类型" path="userType">
        <NSelect
          v-model:value="form.userType"
          :options="userTypeOptions"
          placeholder="请选择用户类型"
          :disabled="isReadOnly"
        />
      </NFormItem>

      <NFormItem label="状态" path="status">
        <NRadioGroup v-model:value="form.status" :disabled="isReadOnly">
          <NRadio :value="1">
            正常
          </NRadio>
          <NRadio :value="0">
            禁用
          </NRadio>
        </NRadioGroup>
      </NFormItem>

      <template v-if="!isCreateMode">
        <NFormItem label="创建时间">
          {{ formatDate(form.createTime) }}
        </NFormItem>

        <NFormItem label="更新时间">
          {{ formatDate(form.updateTime) }}
        </NFormItem>
      </template>

      <div class="flex justify-end mt-4 space-x-2">
        <NButton
          v-if="!isReadOnly"
          type="primary"
          :loading="loading"
          @click="handleSubmit"
        >
          {{ isCreateMode ? '创建' : '更新' }}
        </NButton>
        <NButton @click="handleCancel">
          {{ isReadOnly ? '关闭' : '取消' }}
        </NButton>
      </div>
    </NForm>
  </div>
</template>

<style scoped>
.user-form {
  padding: 16px;
}
</style>
