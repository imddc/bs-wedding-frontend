<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { Camera, Hotel, LayoutDashboard, Mic2 } from 'lucide-vue-next'
import { NLayout, NLayoutContent, NLayoutSider, NMenu } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { h } from 'vue'
import { RouterLink } from 'vue-router'

useHead({
  titleTemplate: 'wedding admin',
})

function renderLabel(label: string, path: string) {
  return h(
    RouterLink,
    {
      to: {
        path,
      },
    },
    { default: () => label },
  )
}

// 侧边栏菜单配置
const menuOptions: MenuOption[] = [
  {
    label: () => renderLabel('dashboard', '/admin'),
    key: 'dashboard',
    icon: () => h(LayoutDashboard),
  },
  {
    label: () => renderLabel('hotel', '/admin/hotel'),
    key: 'hotel',
    icon: () => h(Hotel),
  },
  {
    label: () => renderLabel('婚纱摄影', '/admin/photography'),
    key: 'photography',
    icon: () => h(Camera),
  },
  {
    label: () => renderLabel('司仪', '/admin/siyi'),
    key: 'siyi',
    icon: () => h(Mic2),
  },
]

function clickMenu() {
}
</script>

<template>
  <NLayout class="h-screen" has-sider>
    <NLayoutSider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      show-trigger
      class="h-screen"
    >
      <NMenu
        :options="menuOptions"
        default-value="dashboard"
        @click="clickMenu"
      />
    </NLayoutSider>
    <NLayoutContent :native-scrollbar="false" class="p-4">
      <RouterView #default="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </NLayoutContent>
  </NLayout>
</template>
