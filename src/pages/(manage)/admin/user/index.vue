<script setup lang="ts">
import { computed, h, onMounted, reactive, ref } from 'vue'
import {
  NButton,
  NDataTable,
  NDrawer,
  NDrawerContent,
  NForm,
  NFormItem,
  NInput,
  NPopconfirm,
  NSelect,
  NSpace,
  NTag,
} from 'naive-ui'
import {
  EyeIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  ToggleLeftIcon,
  ToggleRightIcon,
  Trash2Icon,
} from 'lucide-vue-next'
import type { DataTableColumns } from 'naive-ui'
import { useRouter } from 'vue-router'
import {
  deleteUser,
  pageUsers,
  updateUserStatus,
} from '~/api/user'
import {

  UserStatus,
  UserType,
} from '~/api/user/type'
import type { UserInfo, UserQueryParams } from '~/api/user/type'
import {
  STATUS_TAG_TYPE,
  USER_STATUS_OPTIONS,
  USER_TYPE_OPTIONS,
} from '~/constants/user'
import UserForm from '~/components/profile/admin/UserForm.vue'
import PasswordForm from '~/components/profile/admin/PasswordForm.vue'

const router = useRouter()

// 用户类型选项
const userTypeOptions = USER_TYPE_OPTIONS

// 状态选项
const statusOptions = USER_STATUS_OPTIONS

// 查询参数
const queryParams = reactive<UserQueryParams>({
  username: '',
  realName: '',
  phone: '',
  email: '',
  userType: undefined,
  status: undefined,
  pageNum: 1,
  pageSize: 10,
})

// 表格数据和加载状态
const userList = ref<UserInfo[]>([])
const loading = ref(false)
const total = ref(0)

// 分页设置
const pagination = computed(() => ({
  page: queryParams.pageNum,
  pageSize: queryParams.pageSize,
  itemCount: total.value,
  onChange: (page: number) => {
    queryParams.pageNum = page
  },
  onUpdatePageSize: (pageSize: number) => {
    queryParams.pageSize = pageSize
  },
}))

// 表单相关
const drawerVisible = ref(false)
const formLoading = ref(false)
const formData = ref<Partial<UserInfo>>({})
const formTitle = computed(() => formData.value.id ? '编辑用户' : '添加用户')

// 密码表单相关
const passwordDrawerVisible = ref(false)
const passwordFormLoading = ref(false)
const selectedUserId = ref<number>(0)

// 表格列定义
const columns = ref<DataTableColumns<UserInfo>>([
  { title: '用户ID', key: 'id', width: 80 },
  { title: '用户名', key: 'username', width: 120 },
  { title: '真实姓名', key: 'realName', width: 120 },
  { title: '手机号', key: 'phone', width: 120 },
  { title: '邮箱', key: 'email', width: 180 },
  {
    title: '用户类型',
    key: 'userTypeName',
    width: 100,
    render(row) {
      return h(
        NTag,
        {
          type: row.userType === UserType.MERCHANT ? 'info' : 'default',
          bordered: false,
        },
        { default: () => row.userTypeName },
      )
    },
  },
  {
    title: '状态',
    key: 'status',
    width: 80,
    render(row) {
      return h(
        NTag,
        {
          type: STATUS_TAG_TYPE[row.status],
          bordered: false,
        },
        { default: () => row.statusName },
      )
    },
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 160,
    render(row) {
      return row.createTime ? row.createTime.substring(0, 19).replace('T', ' ') : '-'
    },
  },
  {
    title: '操作',
    key: 'actions',
    width: 220,
    fixed: 'right',
    render(row) {
      return h('div', { class: 'space-x-2' }, [
        h(
          NButton,
          {
            size: 'small',
            type: 'info',
            quaternary: true,
            onClick: () => handleView(row.id),
          },
          { default: () => h(EyeIcon, { size: 16 }) },
        ),
        h(
          NPopconfirm,
          {
            onPositiveClick: () => handleDelete(row.id),
          },
          {
            default: () => '确认删除该用户吗？',
            trigger: () => h(
              NButton,
              {
                size: 'small',
                type: 'error',
                quaternary: true,
              },
              { default: () => h(Trash2Icon, { size: 16 }) },
            ),
          },
        ),
        h(
          NPopconfirm,
          {
            onPositiveClick: () => handleStatusChange(row.id, row.status === UserStatus.ACTIVE ? UserStatus.DISABLED : UserStatus.ACTIVE),
          },
          {
            default: () => row.status === UserStatus.ACTIVE ? '确认禁用该用户吗？' : '确认启用该用户吗？',
            trigger: () => h(
              NButton,
              {
                size: 'small',
                type: row.status === UserStatus.ACTIVE ? 'success' : 'error',
                quaternary: true,
              },
              {
                default: () => row.status === UserStatus.ACTIVE
                  ? h(ToggleRightIcon, { size: 16 })
                  : h(ToggleLeftIcon, { size: 16 }),
              },
            ),
          },
        ),
      ])
    },
  },
])

// 初始化加载数据
onMounted(() => {
  fetchUserList()
})

// 查询用户列表
async function fetchUserList() {
  loading.value = true
  try {
    const response = await pageUsers(queryParams)
    if (response.success) {
      userList.value = response.data.records || []
      total.value = response.data.total || 0
    } else {
      window.$message.error(response.message || '获取用户列表失败')
    }
  } catch (error) {
    console.error('获取用户列表出错:', error)
    window.$message.error('获取用户列表出错')
  } finally {
    loading.value = false
  }
}

// 查询按钮点击
function handleSearch() {
  queryParams.pageNum = 1
  fetchUserList()
}

// 重置查询条件
function resetQuery() {
  Object.assign(queryParams, {
    username: '',
    realName: '',
    phone: '',
    email: '',
    userType: undefined,
    status: undefined,
    pageNum: 1,
    pageSize: 10,
  })
  fetchUserList()
}

// 分页变化
function handlePageChange(page: number) {
  queryParams.pageNum = page
  fetchUserList()
}

// 添加用户
function handleAdd() {
  formData.value = {}
  drawerVisible.value = true
}

// 查看用户详情
async function handleView(id: number) {
  router.push(`/admin/user/${id}`)
}

// 删除用户
async function handleDelete(id: number) {
  try {
    const response = await deleteUser(id)
    if (response.success) {
      window.$message.success('删除用户成功')
      fetchUserList()
    } else {
      window.$message.error(response.message || '删除用户失败')
    }
  } catch (error) {
    console.error('删除用户出错:', error)
    window.$message.error('删除用户出错')
  }
}

// 修改用户状态
async function handleStatusChange(id: number, status: UserStatus) {
  try {
    const response = await updateUserStatus({ id, status })
    if (response.success) {
      window.$message.success(status === UserStatus.ACTIVE ? '用户启用成功' : '用户禁用成功')
      fetchUserList()
    } else {
      window.$message.error(response.message || '修改用户状态失败')
    }
  } catch (error) {
    console.error('修改用户状态出错:', error)
    window.$message.error('修改用户状态出错')
  }
}

// 表单提交回调
function handleSubmit() {
  drawerVisible.value = false
  fetchUserList()
}

// 密码表单提交回调
function handlePasswordSubmit() {
  passwordDrawerVisible.value = false
  window.$message.success('密码修改成功')
}
</script>

<template>
  <div class="user-list">
    <div class="mb-4 flex justify-between items-center">
      <div class="text-xl font-bold">
        用户管理
      </div>
      <NButton type="primary" @click="handleAdd">
        <template #icon>
          <PlusIcon class="mr-1" />
        </template>
        添加用户
      </NButton>
    </div>

    <!-- 查询表单 -->
    <div class="search-form bg-white p-4 rounded shadow-sm mb-4">
      <NForm
        :model="queryParams"
        label-placement="left"
        label-width="auto"
      >
        <div class="flex items-center gap-4">
          <NFormItem label="用户名">
            <NInput
              v-model:value="queryParams.username"
              placeholder="请输入用户名"
              clearable
            />
          </NFormItem>
          <NFormItem label="真实姓名">
            <NInput
              v-model:value="queryParams.realName"
              placeholder="请输入真实姓名"
              clearable
            />
          </NFormItem>
          <NFormItem label="手机号">
            <NInput
              v-model:value="queryParams.phone"
              placeholder="请输入手机号"
              clearable
            />
          </NFormItem>
          <NFormItem label="邮箱">
            <NInput
              v-model:value="queryParams.email"
              placeholder="请输入邮箱"
              clearable
            />
          </NFormItem>
        </div>

        <div class="flex-between gap-4">
          <div class="w-1/3 flex items-center">
            <NFormItem label="用户类型" class="flex-1">
              <NSelect
                v-model:value="queryParams.userType"
                :options="userTypeOptions"
                placeholder="请选择用户类型"
                clearable
              />
            </NFormItem>
            <NFormItem label="状态" class="flex-1">
              <NSelect
                v-model:value="queryParams.status"
                :options="statusOptions"
                placeholder="请选择状态"
                clearable
              />
            </NFormItem>
          </div>
          <NSpace>
            <NButton
              type="primary"
              class="mr-2"
              @click="handleSearch"
            >
              <template #icon>
                <SearchIcon class="mr-1" />
              </template>
              查询
            </NButton>
            <NButton @click="resetQuery">
              <template #icon>
                <RefreshCwIcon class="mr-1" />
              </template>
              重置
            </NButton>
          </NSpace>
        </div>
      </NForm>
    </div>

    <!-- 数据表格 -->
    <div class="data-table bg-white p-4 rounded shadow-sm">
      <NDataTable
        remote
        :columns="columns"
        :data="userList"
        :loading="loading"
        :pagination="pagination"
        :row-key="(row) => row.id"
        @update:page="handlePageChange"
      />
    </div>

    <!-- 表单抽屉 -->
    <NDrawer
      v-model:show="drawerVisible"
      :width="500"
      :title="formTitle"
      placement="right"
    >
      <NDrawerContent>
        <UserForm
          :form-data="formData"
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
          :user-id="selectedUserId"
          :loading="passwordFormLoading"
          @submit="handlePasswordSubmit"
          @cancel="passwordDrawerVisible = false"
        />
      </NDrawerContent>
    </NDrawer>
  </div>
</template>

<style scoped>
.user-list {
  padding: 16px;
}
</style>
