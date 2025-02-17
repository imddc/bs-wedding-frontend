<script setup lang="ts">
import { AppleIcon } from 'lucide-vue-next'
import { NLayoutHeader, NMenu } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useNavStore } from '~/stores/navStore'

const router = useRouter()
const navStore = useNavStore()
const { navList } = storeToRefs(navStore)

function handleSelect(key: string) {
  const target = navList.value.find(nav => nav.path === key)
  if (target) {
    router.push(target.path)
  }
}
</script>

<template>
  <NLayoutHeader bordered class="px-4 h-16">
    <div class="flex-between h-full">
      <div class="text-xl font-bold">
        <AppleIcon />
      </div>
      <NMenu
        mode="horizontal"
        :options="navList.map(nav => ({
          label: nav.label,
          key: nav.path,
        }))"
        @update:value="handleSelect"
      />
    </div>
  </NLayoutHeader>
</template>

<style scoped>
</style>
