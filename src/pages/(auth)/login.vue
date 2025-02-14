<script setup lang="ts">
import { NButton, NCheckbox, NForm, NFormItem, NInput } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const { rememberMe } = storeToRefs(authStore)

const formState = reactive({
  username: '',
  password: '',
})

function login() {
  // todo: 实现登录逻辑
  const message = window.$message.success('登录成功')
  router.push('/').then(() => {
    setTimeout(() => {
      message.destroy()
    }, 1000)
  })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <!--
          <img class="mx-auto h-12 w-auto" src="/logo.svg" alt="Logo">
        -->
        <h2 class="mt-6 text-center text-3xl font-extrabold">
          登录到您的账户
        </h2>
      </div>
      <NForm class="mt-8 space-y-6" @submit.prevent="login">
        <div class="space-y-4">
          <NFormItem label="用户名" path="username">
            <NInput
              v-model:value="formState.username"
              name="username"
              placeholder="用户名"
              clearable
              size="large"
            />
          </NFormItem>
          <NFormItem label="密码" path="password">
            <NInput
              v-model:value="formState.password"
              name="password"
              type="password"
              placeholder="密码"
              clearable
              size="large"
            />
          </NFormItem>
        </div>

        <div class="flex-between">
          <NCheckbox v-model:checked="rememberMe" label="记住我" />
          <div class="text-sm">
            <RouterLink to="/register" class="font-medium">
              注册账户
            </RouterLink>
          </div>
        </div>

        <NButton type="primary" block attr-type="submit">
          登 录
        </NButton>
      </NForm>
    </div>
  </div>
</template>
