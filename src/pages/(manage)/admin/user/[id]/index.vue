<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NButton,
  NCard,
  NDescriptions,
  NDescriptionsItem,
  NDivider,
  NDrawer,
  NDrawerContent,
  NGi,
  NGrid,
  NSpace,
  NSpin,
  NTag,
} from 'naive-ui'
import {
  ArrowLeftIcon,
  EditIcon,
  KeyIcon,
  ListIcon,
} from 'lucide-vue-next'
import { getUserById } from '~/api/user'
import type { UserInfo } from '~/api/user/type'
import UserForm from '~/components/profile/admin/UserForm.vue'
import PasswordForm from '~/components/profile/admin/PasswordForm.vue'

const route = useRoute()
const router = useRouter()

// 用户ID
const userId = ref<number>(Number(route.params.id) || 0)

// 用户信息
const userInfo = reactive<UserInfo>({
  id: 0,
  username: '',
  realName: '',
  phone: '',
  email: '',
  userType: 0,
  userTypeName: '',
  status: 1,
  statusName: '',
  createTime: '',
  updateTime: '',
})

// 加载状态
const loading = ref(true)

// 表单相关
const drawerVisible = ref(false)
const formLoading = ref(false)

// 密码表单相关
const passwordDrawerVisible = ref(false)
const passwordFormLoading = ref(false)

// 格式化日期
function formatDate(dateString?: string) {
  if (!dateString)
    return '-'
  return dateString.replace('T', ' ').substring(0, 19)
}

// 获取用户详情
async function fetchUserDetail() {
  loading.value = true
  try {
    const response = await getUserById(userId.value)
    if (response.success) {
      // 更新用户信息
      Object.assign(userInfo, response.data)
    } else {
      window.$message.error(response.message || '获取用户详情失败')
    }
  } catch (error) {
    console.error('获取用户详情出错:', error)
    window.$message.error('获取用户详情出错')
  } finally {
    loading.value = false
  }
}

// 编辑用户
function handleEdit() {
  drawerVisible.value = true
}

// 修改密码
function handleResetPassword() {
  passwordDrawerVisible.value = true
}

// 表单提交回调
async function handleSubmit() {
  drawerVisible.value = false
  await fetchUserDetail()
}

// 密码表单提交回调
function handlePasswordSubmit() {
  passwordDrawerVisible.value = false
}

// 初始化
onMounted(() => {
  if (userId.value) {
    fetchUserDetail()
  } else {
    window.$message.error('用户ID不能为空')
    router.push('/admin/user')
  }
})
</script>

<template>
  <div class="user-detail p-4">
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center">
        <NButton quaternary circle @click="router.back()">
          <template #icon>
            <ArrowLeftIcon />
          </template>
        </NButton>
        <h1 class="text-xl font-bold ml-2">
          用户详情
        </h1>
      </div>
      <NSpace>
        <NButton type="warning" class="mr-2" @click="handleResetPassword">
          <template #icon>
            <KeyIcon class="mr-1" />
          </template>
          修改密码
        </NButton>
        <NButton type="primary" class="mr-2" @click="handleEdit">
          <template #icon>
            <EditIcon class="mr-1" />
          </template>
          编辑
        </NButton>
        <NButton @click="router.push('/admin/user')">
          <template #icon>
            <ListIcon class="mr-1" />
          </template>
          用户列表
        </NButton>
      </NSpace>
    </div>

    <div v-if="loading" class="flex justify-center p-8">
      <NSpin size="large" />
    </div>

    <div v-else class="bg-white rounded shadow-sm p-6">
      <NGrid :cols="24" :x-gap="16" :y-gap="16">
        <NGi span="24" :lg-span="12">
          <NCard title="基本信息" size="small">
            <NDivider />
            <NDescriptions :column="1" label-placement="left" bordered>
              <NDescriptionsItem label="用户ID">
                {{ userInfo.id }}
              </NDescriptionsItem>
              <NDescriptionsItem label="用户名">
                {{ userInfo.username }}
              </NDescriptionsItem>
              <NDescriptionsItem label="真实姓名">
                {{ userInfo.realName || '-' }}
              </NDescriptionsItem>
              <NDescriptionsItem label="用户类型">
                <NTag :type="userInfo.userType === 1 ? 'info' : 'default'">
                  {{ userInfo.userTypeName }}
                </NTag>
              </NDescriptionsItem>
              <NDescriptionsItem label="状态">
                <NTag :type="userInfo.status === 1 ? 'success' : 'error'">
                  {{ userInfo.statusName }}
                </NTag>
              </NDescriptionsItem>
              <NDescriptionsItem label="创建时间">
                {{ formatDate(userInfo.createTime) }}
              </NDescriptionsItem>
              <NDescriptionsItem label="更新时间">
                {{ formatDate(userInfo.updateTime) }}
              </NDescriptionsItem>
            </NDescriptions>
          </NCard>
        </NGi>

        <NGi span="24" :lg-span="12">
          <NCard title="联系信息" size="small">
            <NDivider />
            <NDescriptions :column="1" label-placement="left" bordered>
              <NDescriptionsItem label="手机号">
                {{ userInfo.phone || '-' }}
              </NDescriptionsItem>
              <NDescriptionsItem label="邮箱">
                {{ userInfo.email || '-' }}
              </NDescriptionsItem>
            </NDescriptions>
          </NCard>
        </NGi>
      </NGrid>
    </div>

    <!-- 编辑抽屉 -->
    <NDrawer
      v-model:show="drawerVisible"
      :width="500"
      title="编辑用户"
      placement="right"
    >
      <NDrawerContent>
        <UserForm
          :form-data="{ ...userInfo, isReadOnly: false }"
          :loading="formLoading"
          @submit="handleSubmit"
          @cancel="drawerVisible = false"
        />
      </NDrawerContent>
    </NDrawer>

    <!-- 密码修改抽屉 -->
    <NDrawer
      v-model:show="passwordDrawerVisible"
      :width="500"
      title="修改密码"
      placement="right"
    >
      <NDrawerContent>
        <PasswordForm
          :user-id="userInfo.id"
          :loading="passwordFormLoading"
          @submit="handlePasswordSubmit"
          @cancel="passwordDrawerVisible = false"
        />
      </NDrawerContent>
    </NDrawer>
  </div>
</template>
