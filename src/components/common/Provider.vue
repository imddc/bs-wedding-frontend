<script setup lang="ts">
import { useDark } from '@vueuse/core'
import {
  darkTheme,
  lightTheme,
  NConfigProvider,
  NDialogProvider,
  NLoadingBarProvider,
  NMessageProvider,
  NModalProvider,
  NNotificationProvider,
  useDialog,
  useLoadingBar,
  useMessage,
  useModal,
  useNotification,
} from 'naive-ui'
import { computed, defineComponent, h } from 'vue'
import { useThemeOverrides } from '~/composables/useThemeOverrides'

defineSlots<{
  default: () => any
}>()

const isDark = useDark()
const theme = computed(() => isDark.value ? darkTheme : lightTheme)
const { themeOverrides } = useThemeOverrides()

function setupProviders() {
  window.$message = useMessage()
  window.$dialog = useDialog()
  window.$loadingBar = useLoadingBar()
  window.$modal = useModal()
  window.$notification = useNotification()
}

const NaiveProviderContent = defineComponent({
  setup() {
    setupProviders()
    return () => h('div', { className: 'main-tools' })
  },
})
</script>

<template>
  <NConfigProvider :theme="theme" :theme-overrides="themeOverrides" class="h-full">
    <NMessageProvider>
      <NDialogProvider>
        <NLoadingBarProvider>
          <NModalProvider>
            <NNotificationProvider>
              <slot name="default" />
              <NaiveProviderContent />
            </NNotificationProvider>
          </NModalProvider>
        </NLoadingBarProvider>
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>
