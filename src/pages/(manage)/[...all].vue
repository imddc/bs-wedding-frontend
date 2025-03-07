<!-- src/views/error/404.vue -->
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { NButton } from 'naive-ui'
import { LayoutDashboard } from 'lucide-vue-next'

const router = useRouter()

function navigateToDashboard() {
  router.push('/admin/user')
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-lg px-8 py-12 bg-white rounded-lg shadow-lg text-center">
      <div class="flex flex-col items-center">
        <div class="mb-8">
          <h1 class="text-9xl font-bold text-blue-600 mb-4">
            404
          </h1>
          <h2 class="text-3xl font-semibold text-gray-800 mb-3">
            页面不存在
          </h2>
          <p class="text-gray-600 mb-8">
            抱歉，您要查找的页面不存在或已被移除。
          </p>
        </div>

        <NButton
          type="primary"
          size="large"
          class="flex items-center"
          @click="navigateToDashboard"
        >
          <LayoutDashboard class="mr-2" :size="18" />
          返回控制台
        </NButton>
      </div>
    </div>
  </div>
</template>
