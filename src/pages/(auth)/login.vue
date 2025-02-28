<script setup lang="ts">
import { NButton, NCheckbox, NFlex, NForm, NFormItem, NInput } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useTemplateRef } from 'vue'
import { register } from '~/api/auth'
import { useAuthStore, useUserStore } from '~/stores'
import { createLoginRules, useAuthState } from './helper'

const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()
const { rememberMe } = storeToRefs(authStore)

const formRef = useTemplateRef<InstanceType<typeof NForm>>('formRef')
const { authType, formState, isRegister, loading, toggleAuthType } = useAuthState()

const rules = createLoginRules(formState)

async function formSubmit() {
  await formRef.value?.validate()

  loading.value = true
  try {
    if (isRegister.value) {
      // 注册逻辑
      const res = await register({
        username: formState.value.username,
        password: formState.value.password,
      })

      const { success } = res

      if (!success) {
        return
      }

      window.$message.success('注册成功，请登录')
      toggleAuthType() // 切换到登录界面
    } else {
      // 登录逻辑
      const res = await userStore.userLogin({
        username: formState.value.username,
        password: formState.value.password,
      })

      if (res) {
        const message = window.$message.success('登录成功')
        router.push('/').then(() => {
          setTimeout(() => {
            message.destroy()
          }, 1000)
        })
      }
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- 头部 -->
      <header>
        <img class="mx-auto h-24 w-auto" src="/src/assets/wedding-ring.png" alt="Logo">
        <h2 class="mt-6 text-center text-3xl font-extrabold">
          {{ authType === 'login' ? '登录到您的账户' : '注册账户' }}
        </h2>
      </header>

      <NForm
        ref="formRef"
        class="mt-8 space-y-6"
        :rules="rules"
        :model="formState"
        @submit.prevent="formSubmit"
      >
        <div class="space-y-2">
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
              show-password-on="click"
              placeholder="密码"
              clearable
              size="large"
            />
          </NFormItem>

          <template v-if="isRegister">
            <NFormItem label="确认密码" path="repeatPassword">
              <NInput
                v-model:value="formState.repeatPassword"
                name="repeatPassword"
                type="password"
                placeholder="确认密码"
                show-password-on="click"
                clearable
                size="large"
              />
            </NFormItem>
          </template>
        </div>

        <NCheckbox v-model:checked="rememberMe" label="记住我" />

        <NFlex
          vertical
          align="center"
          justify="center"
          gap="small"
        >
          <NButton
            type="primary"
            block
            attr-type="submit"
            :loading="loading"
          >
            {{ authType === 'login' ? '登 录' : '注 册' }}
          </NButton>
          <NButton block @click="toggleAuthType">
            {{ authType === 'login' ? '注 册' : '登 录' }}
          </NButton>
        </NFlex>
      </NForm>
    </div>
  </div>
</template>
