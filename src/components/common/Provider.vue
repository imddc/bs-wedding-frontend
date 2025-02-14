<script setup lang="ts">
import { useDark } from '@vueuse/core'
import { darkTheme, lightTheme, NConfigProvider } from 'naive-ui'
import { computed } from 'vue'
import Theme from '../Theme.vue'

defineSlots<{
  default: () => any
}>()

const isDark = useDark()
const theme = computed(() => isDark.value ? darkTheme : lightTheme)
</script>

<template>
  <NConfigProvider :theme="theme">
    <Theme />
    <slot name="default" />
  </NConfigProvider>
</template>

<style scoped>

</style>
