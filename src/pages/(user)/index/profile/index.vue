<!-- src/views/UserProfile.vue -->
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import {
  NAvatar,
  NButton,
  NForm,
  NFormItem,
  NInput,
  NTag,
} from 'naive-ui'
import type { FormInst, FormRules } from 'naive-ui'
import {
  Award,
  Clock,
  Edit2,
  IdCard,
  LayoutDashboard,
  Mail,
  Phone,
  User,
  UserCircle,
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { getUserById, updateUser } from '~/api/user'
import type { UserInfo, UserUpdateParams } from '~/api/user/type'
import { useUserStore } from '~/stores'
import { USER_TYPE_MAP } from '~/constants/user'

const userStore = useUserStore()
const router = useRouter()
const loading = ref(false)
const editMode = ref(false)
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

// 获取用户信息
async function fetchUserInfo() {
  try {
    const response = await getUserById(userStore.userInfo?.id || 1)
    if (response.success) {
      userInfo.value = response.data
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

onMounted(() => {
  fetchUserInfo()
})
</script>

<template>
  <div class="profile-container">
    <div class="container mx-auto px-4 py-8 md:py-12">
      <div class="max-w-4xl mx-auto">
        <!-- 页面标题 -->
        <div class="text-center mb-10">
          <h1 class="text-3xl md:text-4xl font-bold text-gray-800 font-serif">
            个人信息
          </h1>
          <p class="text-gray-600 mt-2 max-w-md mx-auto">
            查看和管理您的个人资料信息
          </p>
        </div>

        <!-- 主要内容区 -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          <!-- 用户资料卡片 -->
          <div class="p-8 bg-gradient-to-br from-indigo-50 to-blue-50 border-b border-gray-100">
            <div class="flex flex-col items-center">
              <div class="relative group">
                <NAvatar
                  :src="userInfo.avatar || ''"
                  round
                  :size="80"
                  fallback-src="/src/assets/avatar-placeholder.png"
                  class="border-4 border-white shadow-md transition-transform duration-300 group-hover:scale-105"
                />
                <div class="absolute bottom-0 right-0 bg-primary-500 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Edit2 :size="14" class="text-white" />
                </div>
              </div>
              <h3 class="mt-4 text-xl font-bold text-gray-800">
                {{ userInfo.realName || userInfo.username }}
              </h3>
              <div class="flex items-center gap-2 mt-2">
                <NTag
                  :type="userInfo.userType === 1 ? 'info' : 'default'"
                  size="small"
                  round
                  class="px-3"
                >
                  {{ USER_TYPE_MAP[userInfo.userType] }}
                </NTag>
                <NButton
                  v-if="userInfo.userType === 1"
                  size="tiny"
                  type="primary"
                  quaternary
                  class="flex items-center"
                  @click="router.push('/admin/user')"
                >
                  <template #icon>
                    <LayoutDashboard class="mr-1" :size="14" />
                  </template>
                  商家管理
                </NButton>
                <NButton
                  v-else
                  size="tiny"
                  type="success"
                  quaternary
                  class="flex items-center"
                >
                  <template #icon>
                    <Award class="mr-1" :size="14" />
                  </template>
                  商家认证
                </NButton>
              </div>
            </div>
          </div>

          <!-- 个人信息内容 -->
          <div class="p-8">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold text-gray-800 flex items-center">
                <UserCircle class="mr-2 text-primary-500" :size="20" />
                基本信息
              </h2>
              <NButton
                v-if="!editMode"
                type="primary"
                size="small"
                class="rounded-full px-4"
                ghost
                @click="editMode = true"
              >
                <template #icon>
                  <Edit2 class="mr-1" :size="14" />
                </template>
                编辑资料
              </NButton>
            </div>

            <!-- 查看模式 -->
            <div v-if="!editMode" class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-6">
                <div class="info-item">
                  <div class="text-sm text-gray-500 flex items-center">
                    <User class="mr-1 text-gray-400" :size="16" />
                    用户名
                  </div>
                  <div class="font-medium text-gray-800 mt-1">
                    {{ userInfo.username }}
                  </div>
                </div>
                <div class="info-item">
                  <div class="text-sm text-gray-500 flex items-center">
                    <IdCard class="mr-1 text-gray-400" :size="16" />
                    姓名
                  </div>
                  <div class="font-medium text-gray-800 mt-1">
                    {{ userInfo.realName || '未设置' }}
                  </div>
                </div>
                <div class="info-item">
                  <div class="text-sm text-gray-500 flex items-center">
                    <Phone class="mr-1 text-gray-400" :size="16" />
                    手机号码
                  </div>
                  <div class="font-medium text-gray-800 mt-1">
                    {{ userInfo.phone || '未设置' }}
                  </div>
                </div>
              </div>
              <div class="space-y-6">
                <div class="info-item">
                  <div class="text-sm text-gray-500 flex items-center">
                    <Mail class="mr-1 text-gray-400" :size="16" />
                    邮箱
                  </div>
                  <div class="font-medium text-gray-800 mt-1">
                    {{ userInfo.email || '未设置' }}
                  </div>
                </div>
                <div class="info-item">
                  <div class="text-sm text-gray-500 flex items-center">
                    <Clock class="mr-1 text-gray-400" :size="16" />
                    注册时间
                  </div>
                  <div class="font-medium text-gray-800 mt-1">
                    {{ formatDate(userInfo.createTime) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 编辑表单 -->
            <div v-else class="bg-gray-50 p-6 rounded-xl">
              <NForm
                ref="formRef"
                :model="userForm"
                :rules="rules"
                label-placement="left"
                label-width="80"
              >
                <NFormItem label="姓名" path="realName">
                  <NInput v-model:value="userForm.realName" placeholder="请输入姓名" class="rounded-lg" />
                </NFormItem>
                <NFormItem label="手机号码" path="phone">
                  <NInput v-model:value="userForm.phone" placeholder="请输入手机号码" class="rounded-lg" />
                </NFormItem>
                <NFormItem label="邮箱" path="email">
                  <NInput v-model:value="userForm.email" placeholder="请输入邮箱" class="rounded-lg" />
                </NFormItem>
                <div class="flex justify-end gap-3 mt-6">
                  <NButton class="rounded-full px-5" @click="editMode = false">
                    取消
                  </NButton>
                  <NButton
                    type="primary"
                    class="rounded-full px-5"
                    :loading="loading"
                    @click="handleSaveProfile"
                  >
                    保存
                  </NButton>
                </div>
              </NForm>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  background-color: #f5f7fa;
  min-height: 100vh;
  background-image: radial-gradient(circle at 50% 50%, rgba(63, 94, 251, 0.03) 0%, rgba(255, 255, 255, 0) 70%);
}

.font-serif {
  font-family: 'STZhongsong', 'SimSun', serif;
}

.info-item {
  padding-bottom: 0.75rem;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
}

.info-item:hover {
  transform: translateX(4px);
  border-bottom-color: rgba(99, 102, 241, 0.3);
}

:deep(.n-button) {
  transition: all 0.3s ease;
}

:deep(.n-avatar) {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}
</style>
