<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInst, FormRules } from 'naive-ui'
import { NButton, NCard, NCheckbox, NDivider, NForm, NFormItem, NInput, NModal } from 'naive-ui'
import {
  BugIcon,
  Lock,
  Mail,
  Shield,
  User,
  XIcon,
} from 'lucide-vue-next'

// Import auth service
import { AuthService } from '~/services/authService'

const emit = defineEmits<{
  success: []
  cancel: []
}>()

const formRef = ref<FormInst | null>(null)
const submitting = ref(false)

// Modal controls
const showTerms = ref(false)
const showPrivacy = ref(false)

// Form data
const formValue = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
})

// Form validation rules
const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 6, max: 20, message: '用户名长度应为6-20个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入电子邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的电子邮箱地址', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 9, max: 20, message: '密码长度应为9-20个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value) => {
        return value === formValue.password || new Error('两次输入的密码不一致')
      },
      trigger: 'blur',
    },
  ],
  agreeTerms: [
    {
      validator: (rule, value) => {
        return value === true || new Error('请阅读并同意用户协议和隐私政策')
      },
      trigger: 'change',
    },
  ],
}

// Submit form
function handleSubmit() {
  formRef.value?.validate(async (errors) => {
    if (errors) {
      return
    }

    submitting.value = true

    try {
      const { data } = await AuthService.register({
        username: formValue.username,
        email: formValue.email,
        password: formValue.password,
      })

      if (data.code === 200) {
        window.$message.success('注册成功，欢迎加入！')
        emit('success')
      } else {
        window.$message.error(data.message || '注册失败，请稍后重试')
      }
    } catch (error) {
      window.$message.error('注册失败，请检查网络连接')
      console.error('Registration error:', error)
    } finally {
      submitting.value = false
    }
  })
}

// Show login form
function showLoginForm() {
  // Navigate to login or show login modal
  emit('cancel') // For now, just emit cancel to close this modal
}

// Social login methods
function loginWithWechat() {
  window.$message.info('微信登录功能开发中')
}

function loginWithWeibo() {
  window.$message.info('微博登录功能开发中')
}

function loginWithQQ() {
  window.$message.info('QQ登录功能开发中')
}
</script>

<template>
  <NCard
    title="注册账号"
    class="max-w-md mx-auto rounded-lg"
    size="huge"
    :bordered="false"
    style="box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);"
  >
    <template #header-extra>
      <NButton text @click="$emit('cancel')">
        <template #icon>
          <XIcon size="18" />
        </template>
      </NButton>
    </template>

    <div class="text-center mb-6">
      <div class="text-gray-600 mb-4">
        注册即可获得¥500优惠券礼包
      </div>
      <div class="flex justify-center gap-4">
        <NButton
          quaternary
          circle
          size="large"
          @click="loginWithWechat"
        >
          <template #icon>
            <BugIcon class="text-[#07C160] w-6 h-6" />
          </template>
        </NButton>

        <NButton
          quaternary
          circle
          size="large"
          @click="loginWithWeibo"
        >
          <template #icon>
            <BugIcon class="text-[#E6162D] w-6 h-6" />
          </template>
        </NButton>

        <NButton
          quaternary
          circle
          size="large"
          @click="loginWithQQ"
        >
          <template #icon>
            <BugIcon class="text-[#12B7F5] w-6 h-6" />
          </template>
        </NButton>
      </div>

      <NDivider>或使用邮箱注册</NDivider>
    </div>

    <NForm
      ref="formRef"
      :model="formValue"
      :rules="rules"
      size="large"
      label-placement="top"
    >
      <NFormItem path="username" label="用户名">
        <NInput
          v-model:value="formValue.username"
          placeholder="请输入用户名（6-20个字符）"
        >
          <template #prefix>
            <User size="18" />
          </template>
        </NInput>
      </NFormItem>

      <NFormItem path="email" label="电子邮箱">
        <NInput
          v-model:value="formValue.email"
          placeholder="请输入电子邮箱"
        >
          <template #prefix>
            <Mail size="18" />
          </template>
        </NInput>
      </NFormItem>

      <NFormItem path="password" label="密码">
        <NInput
          v-model:value="formValue.password"
          type="password"
          placeholder="请输入密码（9-20个字符）"
          show-password-on="click"
        >
          <template #prefix>
            <Lock size="18" />
          </template>
        </NInput>
      </NFormItem>

      <NFormItem path="confirmPassword" label="确认密码">
        <NInput
          v-model:value="formValue.confirmPassword"
          type="password"
          placeholder="请再次输入密码"
          show-password-on="click"
        >
          <template #prefix>
            <Shield size="18" />
          </template>
        </NInput>
      </NFormItem>

      <NFormItem path="agreeTerms">
        <NCheckbox v-model:checked="formValue.agreeTerms">
          我已阅读并同意
          <NButton
            text
            type="primary"
            size="tiny"
            @click.stop="showTerms = true"
          >
            用户协议
          </NButton>
          和
          <NButton
            text
            type="primary"
            size="tiny"
            @click.stop="showPrivacy = true"
          >
            隐私政策
          </NButton>
        </NCheckbox>
      </NFormItem>

      <NButton
        type="primary"
        size="large"
        block
        :loading="submitting"
        @click="handleSubmit"
      >
        注册账号
      </NButton>

      <div class="text-center mt-4">
        <span class="text-gray-600">已有账号？</span>
        <NButton text type="primary" @click="showLoginForm">
          立即登录
        </NButton>
      </div>
    </NForm>

    <!-- Terms Modal -->
    <NModal
      v-model:show="showTerms"
      preset="card"
      title="用户协议"
      style="max-width: 600px"
    >
      <div class="max-h-96 overflow-y-auto">
        <h3 class="text-lg font-medium mb-2">
          1. 服务条款
        </h3>
        <p class="text-sm text-gray-600 mb-4">
          欢迎使用我们的婚礼服务平台。本协议是您与本平台之间关于使用本平台服务所订立的协议。使用本平台即表示您已充分阅读、理解并同意本协议的所有条款。
        </p>

        <h3 class="text-lg font-medium mb-2">
          2. 账号注册
        </h3>
        <p class="text-sm text-gray-600 mb-4">
          您需要注册账号才能使用平台的全部功能。注册时，您需要提供真实、准确、完整的个人资料，并及时更新相关信息。您需对账号安全负责，包括妥善保管密码和账号信息。
        </p>

        <h3 class="text-lg font-medium mb-2">
          3. 服务内容
        </h3>
        <p class="text-sm text-gray-600 mb-4">
          本平台提供婚礼相关服务的在线预订，包括但不限于婚纱摄影、婚宴酒店、司仪主持等服务。平台有权根据实际情况调整服务内容和范围。
        </p>

        <h3 class="text-lg font-medium mb-2">
          4. 订单与支付
        </h3>
        <p class="text-sm text-gray-600 mb-4">
          用户需按照平台规定的流程完成订单创建和支付。平台会根据实际情况向商家转达用户需求，但最终服务质量取决于商家执行。
        </p>

        <h3 class="text-lg font-medium mb-2">
          5. 免责声明
        </h3>
        <p class="text-sm text-gray-600">
          平台不对第三方服务商提供的服务质量直接负责，仅作为用户与服务商的中介平台。平台会尽力确保信息的准确性，但不对因信息错误导致的问题承担责任。
        </p>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <NButton @click="showTerms = false">
            关闭
          </NButton>
        </div>
      </template>
    </NModal>

    <!-- Privacy Modal -->
    <NModal
      v-model:show="showPrivacy"
      preset="card"
      title="隐私政策"
      style="max-width: 600px"
    >
      <div class="max-h-96 overflow-y-auto">
        <h3 class="text-lg font-medium mb-2">
          1. 信息收集
        </h3>
        <p class="text-sm text-gray-600 mb-4">
          我们会收集您在注册和使用过程中提供的个人信息，包括但不限于姓名、联系方式、地址等。我们也会收集您使用服务时的设备信息和行为数据，用于改进服务。
        </p>

        <h3 class="text-lg font-medium mb-2">
          2. 信息使用
        </h3>
        <p class="text-sm text-gray-600 mb-4">
          我们使用您的信息来提供、维护和改进我们的服务，处理您的交易，以及与您沟通。我们可能会使用您的联系信息向您发送服务通知和促销信息。
        </p>

        <h3 class="text-lg font-medium mb-2">
          3. 信息分享
        </h3>
        <p class="text-sm text-gray-600 mb-4">
          我们不会出售您的个人信息。我们可能与服务提供商共享必要的信息以完成您请求的服务，例如与婚纱摄影师共享您的联系方式。
        </p>

        <h3 class="text-lg font-medium mb-2">
          4. 信息安全
        </h3>
        <p class="text-sm text-gray-600 mb-4">
          我们采取合理的安全措施保护您的个人信息不被未经授权访问、使用或披露。然而，互联网传输不能保证100%的安全性。
        </p>

        <h3 class="text-lg font-medium mb-2">
          5. Cookie使用
        </h3>
        <p class="text-sm text-gray-600">
          我们使用Cookie和类似技术来记住您的偏好，了解您如何使用我们的服务，并提供个性化的体验。您可以通过浏览器设置控制Cookie。
        </p>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <NButton @click="showPrivacy = false">
            关闭
          </NButton>
        </div>
      </template>
    </NModal>
  </NCard>
</template>
