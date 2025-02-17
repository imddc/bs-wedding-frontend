<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { NLayout, NLayoutContent } from 'naive-ui'
import Nav from '~/components/Nav.vue'

useHead({
  title: 'Home',
})
</script>

<template>
  <NLayout class="flex flex-col h-full">
    <Nav />
    <NLayoutContent embedded class="grow h-[calc(100vh-4rem)] p-4">
      <RouterView #default="{ Component }">
        <component :is="Component" />
      </RouterView>
    </NLayoutContent>
  </NLayout>
</template>
