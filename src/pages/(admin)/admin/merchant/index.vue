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
  useMessage,
} from 'naive-ui'
import {
  EditIcon,
  EyeIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  ToggleLeftIcon,
  ToggleRightIcon,
  Trash2Icon,
} from 'lucide-vue-next'
import type { DataTableColumns } from 'naive-ui'
import {
  deleteMerchant,
  getMerchantById,
  pageMerchants,
  updateMerchantStatus,
} from '~/api/merchant'
import {
  MerchantStatus,
  MerchantType,
} from '~/api/merchant/type'
import type { MerchantInfo, MerchantQueryParams } from '~/api/merchant/type'
import MerchantForm from '~/components/merchant/admin/MerchantForm.vue'
import { router } from '~/plugins'

const message = useMessage()

// 商家类型选项
const merchantTypeOptions = [
  { label: '婚纱摄影', value: MerchantType.PHOTOGRAPHY },
  { label: '婚宴酒店', value: MerchantType.HOTEL },
  { label: '司仪主持', value: MerchantType.HOST },
]

// 状态选项
const statusOptions = [
  { label: '上架', value: MerchantStatus.ONLINE },
  { label: '下架', value: MerchantStatus.OFFLINE },
]

// 查询参数
const queryParams = reactive<MerchantQueryParams>({
  merchantName: '',
  city: '',
  merchantType: undefined,
  status: undefined,
  pageNum: 1,
  pageSize: 10,
})

// 表格数据和加载状态
const merchantList = ref<MerchantInfo[]>([])
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
const formData = ref<Partial<MerchantInfo>>({})
const formTitle = computed(() => formData.value.id ? '编辑商家' : '添加商家')

// 表格列定义
const columns = ref<DataTableColumns<MerchantInfo>>([
  { title: '商家ID', key: 'id', width: 80 },
  { title: '商家名称', key: 'merchantName', width: 180 },
  { title: '城市', key: 'city', width: 100 },
  {
    title: '商家类型',
    key: 'merchantTypeName',
    width: 100,
    render(row) {
      const type = merchantTypeOptions.find(item => item.value === row.merchantType)
      return type ? type.label : '-'
    },
  },
  { title: '联系人', key: 'contactPerson', width: 100 },
  { title: '联系电话', key: 'contactPhone', width: 120 },
  { title: '收藏数', key: 'favoriteCount', width: 80 },
  {
    title: '状态',
    key: 'status',
    width: 80,
    render(row) {
      return h(
        NButton,
        {
          size: 'small',
          type: row.status === MerchantStatus.ONLINE ? 'success' : 'default',
          quaternary: true,
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
          NButton,
          {
            size: 'small',
            type: 'primary',
            quaternary: true,
            onClick: () => handleEdit(row.id),
          },
          { default: () => h(EditIcon, { size: 16 }) },
        ),
        h(
          NPopconfirm,
          {
            onPositiveClick: () => handleDelete(row.id),
          },
          {
            default: () => '确认删除该商家吗？',
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
            onPositiveClick: () => handleStatusChange(row.id, row.status === MerchantStatus.ONLINE ? MerchantStatus.OFFLINE : MerchantStatus.ONLINE),
          },
          {
            default: () => row.status === MerchantStatus.ONLINE ? '确认下架该商家吗？' : '确认上架该商家吗？',
            trigger: () => h(
              NButton,
              {
                size: 'small',
                type: row.status === MerchantStatus.ONLINE ? 'success' : 'warning',
                quaternary: true,
              },
              {
                default: () => row.status === MerchantStatus.ONLINE
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
  fetchMerchantList()
})

// 查询商家列表
async function fetchMerchantList() {
  loading.value = true
  try {
    const response = await pageMerchants(queryParams)
    if (response.success) {
      merchantList.value = response.data.records || []
      total.value = response.data.total || 0
    } else {
      message.error(response.message || '获取商家列表失败')
    }
  } catch (error) {
    console.error('获取商家列表出错:', error)
    message.error('获取商家列表出错')
  } finally {
    loading.value = false
  }
}

// 查询按钮点击
function handleSearch() {
  queryParams.pageNum = 1
  fetchMerchantList()
}

// 重置查询条件
function resetQuery() {
  Object.assign(queryParams, {
    merchantName: '',
    city: '',
    merchantType: undefined,
    status: undefined,
    pageNum: 1,
    pageSize: 10,
  })
  fetchMerchantList()
}

// 分页变化
function handlePageChange(page: number) {
  queryParams.pageNum = page
  fetchMerchantList()
}

// 添加商家
function handleAdd() {
  formData.value = {}
  drawerVisible.value = true
}

// 查看商家详情
async function handleView(id: number) {
  router.push(`/admin/merchant/${id}`)
}

// 编辑商家
async function handleEdit(id: number) {
  formLoading.value = true
  try {
    const response = await getMerchantById(id)
    if (response.success) {
      formData.value = { ...response.data }
      drawerVisible.value = true
    } else {
      message.error(response.message || '获取商家详情失败')
    }
  } catch (error) {
    console.error('获取商家详情出错:', error)
    message.error('获取商家详情出错')
  } finally {
    formLoading.value = false
  }
}

// 删除商家
async function handleDelete(id: number) {
  try {
    const response = await deleteMerchant(id)
    if (response.success) {
      message.success('删除商家成功')
      fetchMerchantList()
    } else {
      message.error(response.message || '删除商家失败')
    }
  } catch (error) {
    console.error('删除商家出错:', error)
    message.error('删除商家出错')
  }
}

// 修改商家状态
async function handleStatusChange(id: number, status: MerchantStatus) {
  try {
    const response = await updateMerchantStatus({ id, status })
    if (response.success) {
      message.success(status === MerchantStatus.ONLINE ? '商家上架成功' : '商家下架成功')
      fetchMerchantList()
    } else {
      message.error(response.message || '修改商家状态失败')
    }
  } catch (error) {
    console.error('修改商家状态出错:', error)
    message.error('修改商家状态出错')
  }
}

// 表单提交回调
function handleSubmit() {
  drawerVisible.value = false
  fetchMerchantList()
}
</script>

<template>
  <div class="merchant-list">
    <div class="mb-4 flex justify-between items-center">
      <div class="text-xl font-bold">
        商家管理
      </div>
      <NButton type="primary" @click="handleAdd">
        <template #icon>
          <PlusIcon class="mr-1" />
        </template>
        添加商家
      </NButton>
    </div>

    <!-- 查询表单 -->
    <div class="search-form bg-white p-4 rounded shadow-sm mb-4">
      <NForm
        :model="queryParams"
        label-placement="left"
        label-width="auto"
        class=""
      >
        <div class="flex items-center gap-4">
          <NFormItem label="商家名称">
            <NInput
              v-model:value="queryParams.merchantName"
              placeholder="请输入商家名称"
              clearable
            />
          </NFormItem>
          <NFormItem label="城市">
            <NInput
              v-model:value="queryParams.city"
              placeholder="请输入城市"
              clearable
            />
          </NFormItem>
        </div>

        <div class="flex">
          <div class="flex items-center gap-4 w-2/5">
            <NFormItem label="商家类型" class="flex-1">
              <NSelect
                v-model:value="queryParams.merchantType"
                :options="merchantTypeOptions"
                placeholder="请选择商家类型"
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

          <NSpace justify="end" class="ml-auto">
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
        :data="merchantList"
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
        <MerchantForm
          :form-data="formData"
          :loading="formLoading"
          @submit="handleSubmit"
          @cancel="drawerVisible = false"
        />
      </NDrawerContent>
    </NDrawer>
  </div>
</template>

<style scoped>
.merchant-list {
  padding: 16px;
}
</style>
