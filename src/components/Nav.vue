<script setup lang="ts">
import { NLayoutHeader } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useNavStore } from '~/stores/navStore'
import type { Nav } from '~/stores/navStore'

const router = useRouter()
const navStore = useNavStore()
const { navList } = storeToRefs(navStore)

function clickLogo() {
  console.log('clickLogo')
}

function clickNav(nav: Nav) {
  const target = navList.value.find(n => n.path === nav.path)
  if (target) {
    router.push(target.path)
  }
}
</script>

<template>
  <NLayoutHeader bordered class="h-16">
    <div class="container mx-auto h-full px-4 flex items-center gap-4">
      <div class="flex-center cursor-pointer" @click="clickLogo">
        <img class="mx-auto h-12 w-auto" src="/src/assets/wedding-ring.png" alt="Logo">
      </div>
      <div class="flex items-center gap-4">
        <div
          v-for="nav in navList"
          :key="nav.path"
          class="cursor-pointer"
          @click="() => clickNav(nav)"
        >
          {{ nav.label }}
        </div>
      </div>
    </div>
  </NLayoutHeader>
</template>
