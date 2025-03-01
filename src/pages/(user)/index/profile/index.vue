<!-- src/views/UserProfile.vue -->
<script setup lang="ts">
import { h, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  NAvatar,
  NButton,
  NForm,
  NFormItem,
  NInput,
  NList,
  NListItem,
  NMenu,
  NTabPane,
  NTabs,
  NTag,
} from 'naive-ui'
import type { FormInst, FormRules, MenuOption } from 'naive-ui'
import {
  Camera,
  CheckCircle,
  Clock,
  Edit2,
  Heart,
  Home,
  Loader,
  LogOut,
  Mic,
  Settings,
  ShoppingBag,
  User,
} from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { getUserById, updateUser } from '~/api/user'
import type { UserInfo, UserUpdateParams } from '~/api/user/type'
import { useUserStore } from '~/stores'
import { USER_TYPE_MAP } from '~/constants/user'

const router = useRouter()
const userStore = useUserStore()
const { isAdmin } = storeToRefs(userStore)
const loading = ref(false)
const activeKey = ref('profile')
const editMode = ref(false)

// 表单引用
const formRef = ref<FormInst | null>(null)

// 初始化用户信息
const userInfo = ref<UserInfo>({
  id: 0,
  username: '',
  realName: '',
  phone: '',
  email: '',
  userType: 0,
  status: 1,
  statusName: '',
  createTime: '',
  updateTime: '',
})

// 编辑表单
const userForm = reactive<UserUpdateParams>({
  id: 0,
  realName: '',
  phone: '',
  email: '',
})

// 表单校验规则
const rules: FormRules = {
  realName: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
}

// 菜单选项
const menuOptions = ref<MenuOption[]>([
  {
    label: '基本信息',
    key: 'profile',
    icon: () => h(User, { size: 16 }),
  },
  {
    label: '我的订单',
    key: 'orders',
    icon: () => h(ShoppingBag, { size: 16 }),
  },
  {
    label: '我的收藏',
    key: 'favorites',
    icon: () => h(Heart, { size: 16 }),
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: () => h(LogOut, { size: 16 }),
  },
])

// 模拟订单数据
const orders = ref([
  {
    id: 1,
    orderNo: 'ORD20240301001',
    productName: '森系婚纱摄影套餐',
    amount: 4999,
    status: 1,
    statusName: '待支付',
  },
  {
    id: 2,
    orderNo: 'ORD20240220002',
    productName: '豪华酒店婚宴',
    amount: 12800,
    status: 2,
    statusName: '已支付',
  },
  {
    id: 3,
    orderNo: 'ORD20240115003',
    productName: '资深婚礼司仪服务',
    amount: 3200,
    status: 3,
    statusName: '已完成',
  },
])

// 模拟收藏数据
const favorites = ref({
  photography: [
    {
      id: 1,
      name: '韩式小清新风格婚纱摄影',
      price: 5680,
      image: '/src/assets/photo1.jpg',
    },
  ],
  hotel: [],
  host: [],
})

// 获取用户信息
async function fetchUserInfo() {
  try {
    // 这里应该从存储中获取当前用户ID
    const response = await getUserById(userStore.userInfo?.id || 1)

    if (response.success) {
      userInfo.value = response.data

      // 初始化编辑表单
      initUserForm()
    } else {
      window.$message.error('获取用户信息失败')
    }
  } catch (error) {
    console.error('获取用户信息错误:', error)
    window.$message.error('获取用户信息失败')
  }
}

// 初始化用户编辑表单
function initUserForm() {
  userForm.id = userInfo.value.id
  userForm.realName = userInfo.value.realName
  userForm.phone = userInfo.value.phone
  userForm.email = userInfo.value.email
}

// 保存个人资料
function handleSaveProfile() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      loading.value = true
      try {
        const response = await updateUser(userForm)
        if (response.success) {
          window.$message.success('保存成功')
          editMode.value = false
          // 重新获取用户信息
          await fetchUserInfo()
        } else {
          window.$message.error('保存失败')
        }
      } catch (error) {
        console.error('保存个人资料错误:', error)
        window.$message.error('保存失败')
      } finally {
        loading.value = false
      }
    }
  })
}

// 处理菜单变更
function handleMenuChange(key: string) {
  if (key === 'logout') {
    // 处理登出逻辑
    window.$dialog.info({
      title: '提示',
      content: '确定要退出登录吗？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        // 清除用户信息并跳转到登录页
        router.push('/login')
      },
    })
    // 恢复选中状态
    activeKey.value = 'profile'
  }
}

// 跳转到管理后台
function goToAdmin() {
  router.push('/admin')
}

// 查看详情
function viewDetail(type: string, id: number) {
  router.push(`/${type}/${id}`)
}

// 格式化日期
function formatDate(dateString: string) {
  if (!dateString)
    return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 获取订单状态标签类型
function getOrderStatusTag(status: number) {
  switch (status) {
    case 1: return 'warning'
    case 2: return 'info'
    case 3: return 'success'
    default: return 'default'
  }
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<template>
  <div class="profile-container">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-5xl mx-auto">
        <!-- 页面标题 -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-800 font-serif">
            个人中心
          </h1>
          <p class="text-gray-600 mt-2">
            管理您的个人信息和婚礼服务
          </p>
        </div>

        <!-- 主要内容区 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <!-- 左侧导航 -->
          <div class="md:col-span-1">
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              <!-- 用户资料卡片 -->
              <div class="p-4 bg-gradient-to-r from-red-50 to-pink-50 border-b border-gray-200">
                <div class="flex flex-col items-center">
                  <NAvatar
                    :src="userInfo.avatar || ''"
                    round
                    size="large"
                    fallback-src="/src/assets/avatar-placeholder.png"
                  />
                  <h3 class="mt-2 font-bold text-gray-800">
                    {{ userInfo.realName || userInfo.username }}
                  </h3>
                  <p class="text-sm text-gray-500">
                    {{ USER_TYPE_MAP[userInfo.userType] }}
                  </p>

                  <!-- 管理员入口 -->
                  <div v-if="isAdmin" class="mt-3 w-full">
                    <NButton
                      type="primary"
                      secondary
                      block
                      @click="goToAdmin"
                    >
                      <template #icon>
                        <Settings class="mr-1" :size="16" />
                      </template>
                      进入管理后台
                    </NButton>
                  </div>
                </div>
              </div>

              <!-- 导航菜单 -->
              <div class="p-2">
                <NMenu
                  v-model:value="activeKey"
                  :options="menuOptions"
                  @update:value="handleMenuChange"
                />
              </div>
            </div>
          </div>

          <!-- 右侧内容区 -->
          <div class="md:col-span-3">
            <div class="bg-white rounded-lg shadow-md p-6">
              <!-- 基本信息 -->
              <div v-if="activeKey === 'profile'">
                <div class="flex justify-between items-center mb-6">
                  <h2 class="text-xl font-bold text-gray-800">
                    基本信息
                  </h2>
                  <NButton
                    v-if="!editMode"
                    type="primary"
                    size="small"
                    @click="editMode = true"
                  >
                    <Edit2 class="mr-1" :size="14" />
                    编辑资料
                  </NButton>
                </div>

                <div v-if="!editMode">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                      <div>
                        <div class="text-sm text-gray-500">
                          用户名
                        </div>
                        <div class="font-medium">
                          {{ userInfo.username }}
                        </div>
                      </div>
                      <div>
                        <div class="text-sm text-gray-500">
                          姓名
                        </div>
                        <div class="font-medium">
                          {{ userInfo.realName || '未设置' }}
                        </div>
                      </div>
                      <div>
                        <div class="text-sm text-gray-500">
                          手机号码
                        </div>
                        <div class="font-medium">
                          {{ userInfo.phone || '未设置' }}
                        </div>
                      </div>
                    </div>
                    <div class="space-y-4">
                      <div>
                        <div class="text-sm text-gray-500">
                          邮箱
                        </div>
                        <div class="font-medium">
                          {{ userInfo.email || '未设置' }}
                        </div>
                      </div>
                      <div>
                        <div class="text-sm text-gray-500">
                          用户类型
                        </div>
                        <div class="font-medium">
                          {{ userInfo.userTypeName }}
                        </div>
                      </div>
                      <div>
                        <div class="text-sm text-gray-500">
                          注册时间
                        </div>
                        <div class="font-medium">
                          {{ formatDate(userInfo.createTime) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 编辑表单 -->
                <div v-else>
                  <NForm
                    ref="formRef"
                    :model="userForm"
                    :rules="rules"
                    label-placement="left"
                    label-width="80"
                  >
                    <NFormItem label="姓名" path="realName">
                      <NInput v-model:value="userForm.realName" placeholder="请输入姓名" />
                    </NFormItem>
                    <NFormItem label="手机号码" path="phone">
                      <NInput v-model:value="userForm.phone" placeholder="请输入手机号码" />
                    </NFormItem>
                    <NFormItem label="邮箱" path="email">
                      <NInput v-model:value="userForm.email" placeholder="请输入邮箱" />
                    </NFormItem>
                    <div class="flex justify-end gap-2 mt-4">
                      <NButton @click="editMode = false">
                        取消
                      </NButton>
                      <NButton type="primary" :loading="loading" @click="handleSaveProfile">
                        保存
                      </NButton>
                    </div>
                  </NForm>
                </div>
              </div>

              <!-- 我的订单 -->
              <div v-if="activeKey === 'orders'">
                <h2 class="text-xl font-bold text-gray-800 mb-6">
                  我的订单
                </h2>

                <NTabs type="line" animated>
                  <NTabPane name="all" tab="全部订单">
                    <div v-if="orders.length === 0" class="py-16 text-center text-gray-500">
                      <ShoppingBag class="mx-auto mb-4 text-gray-300" :size="48" />
                      <p>暂无订单记录</p>
                    </div>
                    <NList v-else>
                      <NListItem v-for="order in orders" :key="order.id">
                        <div class="w-full">
                          <div class="flex justify-between mb-2">
                            <div class="font-medium">
                              {{ order.productName }}
                            </div>
                            <div class="text-red-600 font-bold">
                              ¥{{ order.amount.toFixed(2) }}
                            </div>
                          </div>
                          <div class="flex justify-between text-sm">
                            <div class="text-gray-500">
                              订单号: {{ order.orderNo }}
                            </div>
                            <div>
                              <NTag :type="getOrderStatusTag(order.status)">
                                {{ order.statusName }}
                              </NTag>
                            </div>
                          </div>
                        </div>
                      </NListItem>
                    </NList>
                  </NTabPane>
                  <NTabPane name="pending" tab="待支付">
                    <div class="py-16 text-center text-gray-500">
                      <Clock class="mx-auto mb-4 text-gray-300" :size="48" />
                      <p>暂无待支付订单</p>
                    </div>
                  </NTabPane>
                  <NTabPane name="processing" tab="进行中">
                    <div class="py-16 text-center text-gray-500">
                      <Loader class="mx-auto mb-4 text-gray-300" :size="48" />
                      <p>暂无进行中订单</p>
                    </div>
                  </NTabPane>
                  <NTabPane name="completed" tab="已完成">
                    <div class="py-16 text-center text-gray-500">
                      <CheckCircle class="mx-auto mb-4 text-gray-300" :size="48" />
                      <p>暂无已完成订单</p>
                    </div>
                  </NTabPane>
                </NTabs>
              </div>

              <!-- 我的收藏 -->
              <div v-if="activeKey === 'favorites'">
                <h2 class="text-xl font-bold text-gray-800 mb-6">
                  我的收藏
                </h2>

                <NTabs type="line" animated>
                  <NTabPane name="photography" tab="婚纱摄影">
                    <div v-if="favorites.photography.length === 0" class="py-16 text-center text-gray-500">
                      <Camera class="mx-auto mb-4 text-gray-300" :size="48" />
                      <p>暂无收藏的摄影服务</p>
                    </div>
                    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        v-for="item in favorites.photography"
                        :key="item.id"
                        class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div class="h-40 bg-gray-100">
                          <img
                            v-if="item.image"
                            :src="item.image"
                            :alt="item.name"
                            class="w-full h-full object-cover"
                          >
                          <div v-else class="w-full h-full flex items-center justify-center">
                            <Camera class="text-gray-300" :size="32" />
                          </div>
                        </div>
                        <div class="p-4">
                          <h3 class="font-medium mb-2 line-clamp-1">
                            {{ item.name }}
                          </h3>
                          <div class="flex justify-between items-center">
                            <div class="text-red-600 font-bold">
                              ¥{{ item.price.toFixed(2) }}
                            </div>
                            <NButton
                              size="small"
                              type="primary"
                              color="#D32029"
                              @click="viewDetail('photography', item.id)"
                            >
                              查看详情
                            </NButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </NTabPane>
                  <NTabPane name="hotel" tab="婚宴酒店">
                    <div v-if="favorites.hotel.length === 0" class="py-16 text-center text-gray-500">
                      <Home class="mx-auto mb-4 text-gray-300" :size="48" />
                      <p>暂无收藏的酒店场地</p>
                    </div>
                  </NTabPane>
                  <NTabPane name="host" tab="司仪主持">
                    <div v-if="favorites.host.length === 0" class="py-16 text-center text-gray-500">
                      <Mic class="mx-auto mb-4 text-gray-300" :size="48" />
                      <p>暂无收藏的司仪主持</p>
                    </div>
                  </NTabPane>
                </NTabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  background-color: #f9f8f6;
  min-height: 100vh;
}

.font-serif {
  font-family: 'STZhongsong', 'SimSun', serif;
}

/* 自定义导航菜单样式 */
:deep(.n-menu-item-content) {
  padding: 12px 14px;
}

:deep(.n-menu-item-content--selected) {
  color: #e11d48;
  background-color: #fff1f2;
}

:deep(.n-menu-item-content:hover) {
  color: #e11d48;
}

:deep(.n-menu-item-content-icon) {
  margin-right: 10px;
}

/* 标签页样式 */
:deep(.n-tabs-tab.n-tabs-tab--active) {
  color: #e11d48;
}

:deep(.n-tabs-tab:hover) {
  color: #f43f5e;
}

:deep(.n-tabs-bar) {
  background-color: #e11d48;
}
</style>
