<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { CalendarRangeIcon, Heart, LayoutDashboard, MessageCircle, ShoppingCart, Store, User } from 'lucide-vue-next'
import { NLayout, NLayoutContent, NLayoutSider, NMenu } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { h, ref, watchEffect } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

useHead({
  titleTemplate: 'wedding admin',
})

const route = useRoute()
const activeKey = ref('dashboard')

// 监听路由变化，更新菜单选中项
watchEffect(() => {
  const path = route.path
  // 从路径中提取关键字，例如 /admin/hotel -> hotel
  const key = path.split('/').pop() || 'dashboard'
  activeKey.value = key
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
  // {
  //   label: () => renderLabel('dashboard', '/admin'),
  //   key: 'dashboard',
  //   icon: () => h(LayoutDashboard),
  // },
  {
    label: () => renderLabel('商品管理', '/admin/product'),
    key: 'product',
    icon: () => h(Store),
  },
  {
    label: () => renderLabel('订单管理', '/admin/order'),
    key: 'order',
    icon: () => h(ShoppingCart),
  },
  // {
  //   label: () => renderLabel('消息管理', '/admin/message'),
  //   key: 'message',
  //   icon: () => h(MessageCircle),
  // },
  {
    label: () => renderLabel('收藏管理', '/admin/favorite'),
    key: 'favorite',
    icon: () => h(Heart),
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
    icon: () => h(LayoutDashboard),
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
        :value="activeKey"
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
