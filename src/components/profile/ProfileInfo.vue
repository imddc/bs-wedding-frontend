<script setup lang="ts">
import { computed, defineEmits, defineProps, reactive, ref } from 'vue'
import type { FormInst, FormRules, UploadFileInfo } from 'naive-ui'
import { NAvatar, NButton, NCard, NDivider, NForm, NFormItem, NInput, NModal, NSelect, NSpace, NUpload, useLoadingBar, useMessage } from 'naive-ui'
import type { UserInfo } from '~/services/userService'
import { UserService } from '~/services/userService'

const props = defineProps<{
  userInfo: UserInfo
}>()

const emit = defineEmits<{
  update: [updatedInfo: Partial<UserInfo>]
}>()

const message = useMessage()
const loadingBar = useLoadingBar()

// Form refs
const formRef = ref<FormInst | null>(null)
const passwordFormRef = ref<FormInst | null>(null)
const phoneFormRef = ref<FormInst | null>(null)
const emailFormRef = ref<FormInst | null>(null)

// Form values - Create a reactive copy of the user info
const formValue = reactive({
  ...props.userInfo,
  vendorType: props.userInfo.vendorType || null,
  vendorDescription: props.userInfo.vendorDescription || '',
})

// Check if user is a vendor
const isVendor = computed(() => props.userInfo.userType === 1)

// Vendor type options
const vendorTypeOptions = [
  { label: '婚纱摄影', value: 'photography' },
  { label: '婚宴酒店', value: 'hotel' },
  { label: '司仪主持', value: 'host' },
]

// Form validation rules
const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 6, max: 20, message: '用户名长度在6-20个字符之间', trigger: 'blur' },
  ],
  email: [
    { type: 'email', message: '请输入有效的电子邮箱', trigger: 'blur' },
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' },
  ],
}

// Password change
const showPasswordModal = ref(false)
const passwordLoading = ref(false)
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const passwordRules: FormRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 9, max: 20, message: '密码长度在9-20个字符之间', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value) => {
        return value === passwordForm.newPassword || new Error('两次输入的密码不一致')
      },
      trigger: 'blur',
    },
  ],
}

// Phone binding
const showPhoneModal = ref(false)
const phoneLoading = ref(false)
const countDown = ref(0)
const phoneForm = reactive({
  phone: '',
  verificationCode: '',
})

const phoneRules: FormRules = {
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' },
  ],
  verificationCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度为6位', trigger: 'blur' },
  ],
}

// Email binding
const showEmailModal = ref(false)
const emailLoading = ref(false)
const emailCountDown = ref(0)
const emailForm = reactive({
  email: '',
  verificationCode: '',
})

const emailRules: FormRules = {
  email: [
    { required: true, message: '请输入电子邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的电子邮箱', trigger: 'blur' },
  ],
  verificationCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度为6位', trigger: 'blur' },
  ],
}

// Handle avatar upload
async function handleAvatarChange(options: { fileList: UploadFileInfo[] }) {
  const file = options.fileList[0].file
  if (!file)
    return

  try {
    const { data } = await UserService.updateAvatar(file)

    if (data.code === 200) {
      formValue.avatar = data.data.url
      message.success('头像上传成功')
    } else {
      message.error(data.message || '头像上传失败')
    }
  } catch (error) {
    message.error('头像上传失败，请检查网络连接')
    console.error('Error uploading avatar:', error)
  }
}

// Submit form
function handleSubmit() {
  formRef.value?.validate((errors) => {
    if (errors) {
      message.error('请检查表单中的错误')
      return
    }

    loadingBar.start()
    const updatedInfo = { ...formValue }

    emit('update', updatedInfo)
    loadingBar.finish()
  })
}

// Reset form
function resetForm() {
  formRef.value?.restoreValidation()
  Object.assign(formValue, props.userInfo)
  message.info('表单已重置')
}

// Change password
function changePassword() {
  passwordFormRef.value?.validate(async (errors) => {
    if (errors) {
      message.error('请检查表单中的错误')
      return
    }

    try {
      passwordLoading.value = true
      const { data } = await UserService.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
      )

      if (data.code === 200) {
        message.success('密码修改成功')
        showPasswordModal.value = false
        passwordForm.currentPassword = ''
        passwordForm.newPassword = ''
        passwordForm.confirmPassword = ''
      } else {
        message.error(data.message || '密码修改失败')
      }
    } catch (error) {
      message.error('密码修改失败，请检查网络连接')
      console.error('Error changing password:', error)
    } finally {
      passwordLoading.value = false
    }
  })
}

// Send verification code
async function sendVerificationCode() {
  if (!phoneForm.phone) {
    message.warning('请先输入手机号码')
    return
  }

  try {
    const { data } = await UserService.sendPhoneVerificationCode(phoneForm.phone)

    if (data.code === 200) {
      message.success('验证码已发送')
      startPhoneCountDown()
    } else {
      message.error(data.message || '验证码发送失败')
    }
  } catch (error) {
    message.error('验证码发送失败，请检查网络连接')
    console.error('Error sending verification code:', error)
  }
}

// Send email verification code
async function sendEmailVerificationCode() {
  if (!emailForm.email) {
    message.warning('请先输入电子邮箱')
    return
  }

  try {
    const { data } = await UserService.sendEmailVerificationCode(emailForm.email)

    if (data.code === 200) {
      message.success('验证码已发送')
      startEmailCountDown()
    } else {
      message.error(data.message || '验证码发送失败')
    }
  } catch (error) {
    message.error('验证码发送失败，请检查网络连接')
    console.error('Error sending email verification code:', error)
  }
}

// Start count down for phone verification
function startPhoneCountDown() {
  countDown.value = 60
  const interval = setInterval(() => {
    countDown.value--
    if (countDown.value <= 0) {
      clearInterval(interval)
    }
  }, 1000)
}

// Start count down for email verification
function startEmailCountDown() {
  emailCountDown.value = 60
  const interval = setInterval(() => {
    emailCountDown.value--
    if (emailCountDown.value <= 0) {
      clearInterval(interval)
    }
  }, 1000)
}

// Bind phone
function bindPhone() {
  phoneFormRef.value?.validate(async (errors) => {
    if (errors) {
      message.error('请检查表单中的错误')
      return
    }

    try {
      phoneLoading.value = true
      const { data } = await UserService.bindPhone(
        phoneForm.phone,
        phoneForm.verificationCode,
      )

      if (data.code === 200) {
        message.success('手机号码绑定成功')
        formValue.phone = phoneForm.phone
        showPhoneModal.value = false
        phoneForm.phone = ''
        phoneForm.verificationCode = ''
      } else {
        message.error(data.message || '手机号码绑定失败')
      }
    } catch (error) {
      message.error('手机号码绑定失败，请检查网络连接')
      console.error('Error binding phone:', error)
    } finally {
      phoneLoading.value = false
    }
  })
}

// Bind email
function bindEmail() {
  emailFormRef.value?.validate(async (errors) => {
    if (errors) {
      message.error('请检查表单中的错误')
      return
    }

    try {
      emailLoading.value = true
      const { data } = await UserService.bindEmail(
        emailForm.email,
        emailForm.verificationCode,
      )

      if (data.code === 200) {
        message.success('邮箱绑定成功')
        formValue.email = emailForm.email
        showEmailModal.value = false
        emailForm.email = ''
        emailForm.verificationCode = ''
      } else {
        message.error(data.message || '邮箱绑定失败')
      }
    } catch (error) {
      message.error('邮箱绑定失败，请检查网络连接')
      console.error('Error binding email:', error)
    } finally {
      emailLoading.value = false
    }
  })
}

// Mask phone number for privacy
function maskPhone(phone: string): string {
  if (!phone)
    return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// Mask email for privacy
function maskEmail(email: string): string {
  if (!email)
    return ''
  const [username, domain] = email.split('@')
  if (!username || !domain)
    return email

  let maskedUsername = username
  if (username.length > 3) {
    maskedUsername = `${username.slice(0, 3)}****`
  }

  return `${maskedUsername}@${domain}`
}
</script>

<template>
  <div>
    <NCard title="个人资料" class="mb-4">
      <NForm
        ref="formRef"
        :model="formValue"
        :rules="rules"
        label-placement="left"
        label-width="100px"
        require-mark-placement="right-hanging"
      >
        <NFormItem label="头像" path="avatar">
          <div class="flex items-center">
            <NAvatar
              :size="64"
              :src="formValue.avatar || ''"
              class="mr-4"
            />
            <NUpload
              :default-upload="false"
              :max="1"
              accept="image/*"
              @change="handleAvatarChange"
            >
              <NButton>更换头像</NButton>
            </NUpload>
          </div>
        </NFormItem>

        <NFormItem label="用户名" path="username">
          <NInput v-model:value="formValue.username" placeholder="请输入用户名" />
        </NFormItem>

        <NFormItem label="电子邮箱" path="email">
          <NInput v-model:value="formValue.email" placeholder="请输入电子邮箱" />
        </NFormItem>

        <NFormItem label="手机号码" path="phone">
          <NInput v-model:value="formValue.phone" placeholder="请输入手机号码" />
        </NFormItem>

        <NFormItem label="地址" path="address">
          <NInput v-model:value="formValue.address" placeholder="请输入地址" />
        </NFormItem>

        <NFormItem v-if="isVendor" label="商家类型" path="vendorType">
          <NSelect
            v-model:value="formValue.vendorType"
            :options="vendorTypeOptions"
            placeholder="请选择商家类型"
          />
        </NFormItem>

        <NFormItem v-if="isVendor" label="商家简介" path="vendorDescription">
          <NInput
            v-model:value="formValue.vendorDescription"
            type="textarea"
            placeholder="请输入商家简介"
            :autosize="{ minRows: 3, maxRows: 5 }"
          />
        </NFormItem>

        <NFormItem>
          <NSpace>
            <NButton type="primary" @click="handleSubmit">
              保存修改
            </NButton>
            <NButton @click="resetForm">
              重置
            </NButton>
          </NSpace>
        </NFormItem>
      </NForm>
    </NCard>

    <NCard title="账号安全" class="mb-4">
      <NSpace vertical>
        <div class="flex justify-between items-center py-2">
          <div>
            <div class="text-base font-medium">
              修改密码
            </div>
            <div class="text-sm text-gray-500">
              定期修改密码可以保护您的账号安全
            </div>
          </div>
          <NButton @click="showPasswordModal = true">
            修改
          </NButton>
        </div>

        <NDivider />

        <div class="flex justify-between items-center py-2">
          <div>
            <div class="text-base font-medium">
              手机绑定
            </div>
            <div class="text-sm text-gray-500">
              {{ formValue.phone ? `已绑定手机：${maskPhone(formValue.phone)}` : '未绑定手机号码' }}
            </div>
          </div>
          <NButton @click="showPhoneModal = true">
            {{ formValue.phone ? '更换' : '绑定' }}
          </NButton>
        </div>

        <NDivider />

        <div class="flex justify-between items-center py-2">
          <div>
            <div class="text-base font-medium">
              邮箱绑定
            </div>
            <div class="text-sm text-gray-500">
              {{ formValue.email ? `已绑定邮箱：${maskEmail(formValue.email)}` : '未绑定邮箱' }}
            </div>
          </div>
          <NButton @click="showEmailModal = true">
            {{ formValue.email ? '更换' : '绑定' }}
          </NButton>
        </div>
      </NSpace>
    </NCard>

    <!-- Change Password Modal -->
    <NModal
      v-model:show="showPasswordModal"
      preset="card"
      title="修改密码"
      style="width: 500px"
    >
      <NForm
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-placement="left"
        label-width="100px"
      >
        <NFormItem label="当前密码" path="currentPassword">
          <NInput
            v-model:value="passwordForm.currentPassword"
            type="password"
            placeholder="请输入当前密码"
            show-password-on="click"
          />
        </NFormItem>

        <NFormItem label="新密码" path="newPassword">
          <NInput
            v-model:value="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码（9-20位）"
            show-password-on="click"
          />
        </NFormItem>

        <NFormItem label="确认新密码" path="confirmPassword">
          <NInput
            v-model:value="passwordForm.confirmPassword"
            type="password"
            placeholder="请确认新密码"
            show-password-on="click"
          />
        </NFormItem>

        <div class="flex justify-end pt-4">
          <NSpace>
            <NButton @click="showPasswordModal = false">
              取消
            </NButton>
            <NButton type="primary" :loading="passwordLoading" @click="changePassword">
              确认修改
            </NButton>
          </NSpace>
        </div>
      </NForm>
    </NModal>

    <!-- Phone Binding Modal -->
    <NModal
      v-model:show="showPhoneModal"
      preset="card"
      title="手机绑定"
      style="width: 500px"
    >
      <NForm
        ref="phoneFormRef"
        :model="phoneForm"
        :rules="phoneRules"
        label-placement="left"
        label-width="100px"
      >
        <NFormItem label="手机号码" path="phone">
          <NInput v-model:value="phoneForm.phone" placeholder="请输入手机号码" />
        </NFormItem>

        <NFormItem label="验证码" path="verificationCode">
          <div class="flex">
            <NInput v-model:value="phoneForm.verificationCode" placeholder="请输入验证码" />
            <NButton class="ml-2" :disabled="countDown > 0" @click="sendVerificationCode">
              {{ countDown > 0 ? `${countDown}秒后重新获取` : '获取验证码' }}
            </NButton>
          </div>
        </NFormItem>

        <div class="flex justify-end pt-4">
          <NSpace>
            <NButton @click="showPhoneModal = false">
              取消
            </NButton>
            <NButton type="primary" :loading="phoneLoading" @click="bindPhone">
              确认绑定
            </NButton>
          </NSpace>
        </div>
      </NForm>
    </NModal>

    <!-- Email Binding Modal -->
    <NModal
      v-model:show="showEmailModal"
      preset="card"
      title="邮箱绑定"
      style="width: 500px"
    >
      <NForm
        ref="emailFormRef"
        :model="emailForm"
        :rules="emailRules"
        label-placement="left"
        label-width="100px"
      >
        <NFormItem label="电子邮箱" path="email">
          <NInput v-model:value="emailForm.email" placeholder="请输入电子邮箱" />
        </NFormItem>

        <NFormItem label="验证码" path="verificationCode">
          <div class="flex">
            <NInput v-model:value="emailForm.verificationCode" placeholder="请输入验证码" />
            <NButton class="ml-2" :disabled="emailCountDown > 0" @click="sendEmailVerificationCode">
              {{ emailCountDown > 0 ? `${emailCountDown}秒后重新获取` : '获取验证码' }}
            </NButton>
          </div>
        </NFormItem>

        <div class="flex justify-end pt-4">
          <NSpace>
            <NButton @click="showEmailModal = false">
              取消
            </NButton>
            <NButton type="primary" :loading="emailLoading" @click="bindEmail">
              确认绑定
            </NButton>
          </NSpace>
        </div>
      </NForm>
    </NModal>
  </div>
</template>
