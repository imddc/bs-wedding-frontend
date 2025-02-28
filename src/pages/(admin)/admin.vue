<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { CalendarRangeIcon, Camera, Hotel, LayoutDashboard, Mic2, PopsicleIcon, Store, User } from 'lucide-vue-next'
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
  {
    label: () => renderLabel('用户', '/admin/user'),
    key: 'user',
    icon: () => h(User),
  },
  {
    label: () => renderLabel('商家', '/admin/merchant'),
    key: 'merchant',
    icon: () => h(Store),
  },
  {
    label: () => renderLabel('区域', '/admin/district'),
    key: 'district',
    icon: () => h(PopsicleIcon),
  },
  {
    label: () => renderLabel('价格区间', '/admin/priceRange'),
    key: 'priceRange',
    icon: () => h(CalendarRangeIcon),
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
