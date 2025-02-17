<script setup lang="ts">
import { NButton } from 'naive-ui'
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen text-center">
    <h1 class="text-9xl font-bold text-primary mb-8">
      404
    </h1>
    <p class="text-xl mb-8">
      抱歉,您要查找的页面不存在。
    </p>
    <NButton type="primary" @click="goHome">
      返回首页
    </NButton>
  </div>
</template>
