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
import { Edit2 } from 'lucide-vue-next'
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
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-3xl mx-auto">
        <!-- 页面标题 -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-800 font-serif">
            个人信息
          </h1>
          <p class="text-gray-600 mt-2">
            查看和管理您的个人资料
          </p>
        </div>

        <!-- 主要内容区 -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <!-- 用户资料卡片 -->
          <div class="p-6 bg-gradient-to-r from-red-50 to-pink-50 border-b border-gray-200">
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
              <div class="flex items-center gap-2">
                <p class="text-sm text-gray-500">
                  {{ USER_TYPE_MAP[userInfo.userType] }}
                </p>
                <NButton
                  v-if="userInfo.userType === 1"
                  size="tiny"
                  type="primary"
                  text
                  @click="router.push('/admin/')"
                >
                  商家管理
                </NButton>
                <NTag
                  v-else
                  type="success"
                  size="small"
                  round
                >
                  商家认证
                </NTag>
              </div>
            </div>
          </div>

          <!-- 个人信息内容 -->
          <div class="p-6">
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
                <template #icon>
                  <Edit2 class="mr-1" :size="14" />
                </template>
                编辑资料
              </NButton>
            </div>

            <!-- 查看模式 -->
            <div v-if="!editMode" class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    注册时间
                  </div>
                  <div class="font-medium">
                    {{ formatDate(userInfo.createTime) }}
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
</style>
