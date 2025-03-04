<script setup lang="ts">
import { computed, h, onMounted, reactive, ref } from 'vue'
import {
  NButton,
  NCard,
  NDataTable,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NModal,
  NSpace,
  NSwitch,
  useMessage,
} from 'naive-ui'
import type { DataTableColumns, FormInst } from 'naive-ui'
import { AlertCircleIcon, DeleteIcon, EyeIcon, PlusIcon } from 'lucide-vue-next'
import {
  createPriceRange,
  deletePriceRange,
  listPriceRanges,
  updatePriceRange,
} from '~/api/priceRange'
import type { PriceRangeDTO, PriceRangeParams } from '~/api/priceRange/type'

// 消息提示
const message = useMessage()

// 表格数据
const priceRanges = ref<PriceRangeDTO[]>([])
const loading = ref(false)
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 50],
  onChange: (page: number) => {
    pagination.page = page
    fetchPriceRanges()
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    fetchPriceRanges()
  },
})

// 表单相关
const formRef = ref<FormInst | null>(null)
const showModal = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const formModel = reactive<PriceRangeParams>({
  code: '',
  name: '',
  minPrice: null,
  maxPrice: null,
  sortOrder: 0,
  isEnabled: true,
})

// 删除相关
const showDeleteModal = ref(false)
const currentId = ref<number | null>(null)

// 表单校验规则
const rules = {
  code: [
    { required: true, message: '请输入价格范围代码', trigger: 'blur' },
    { max: 50, message: '价格范围代码最多50个字符', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '请输入价格范围名称', trigger: 'blur' },
    { max: 50, message: '价格范围名称最多50个字符', trigger: 'blur' },
  ],
  minPrice: [
    { type: 'number', message: '请输入有效的价格', trigger: 'blur' },
  ],
  maxPrice: [
    { type: 'number', message: '请输入有效的价格', trigger: 'blur' },
    {
      validator: (_: any, value: number | null) => {
        if (value !== null && formModel.minPrice !== null && value < formModel.minPrice) {
          return new Error('最高价格不能低于最低价格')
        }
        return true
      },
      trigger: 'blur',
    },
  ],
}

// 表格列定义
const columns = computed<DataTableColumns<PriceRangeDTO>>(() => [
  {
    title: 'ID',
    key: 'id',
    width: 80,
  },
  {
    title: '价格范围代码',
    key: 'code',
    width: 150,
  },
  {
    title: '价格范围名称',
    key: 'name',
    width: 150,
  },
  {
    title: '价格区间',
    key: 'priceRange',
    render(row) {
      if (row.minPrice === null && row.maxPrice === null) {
        return '不限'
      } else if (row.minPrice === null) {
        return `≤ ¥${row.maxPrice}`
      } else if (row.maxPrice === null) {
        return `≥ ¥${row.minPrice}`
      } else {
        return `¥${row.minPrice} - ¥${row.maxPrice}`
      }
    },
  },
  {
    title: '排序',
    key: 'sortOrder',
    width: 80,
  },
  {
    title: '状态',
    key: 'isEnabled',
    width: 100,
    render(row) {
      return h(
        NSwitch,
        {
          value: row.isEnabled,
          disabled: true,
          size: 'small',
        },
      )
    },
  },
  {
    title: '创建时间',
    key: 'createdAt',
    width: 170,
    render(row) {
      return new Date(row.createdAt).toLocaleString()
    },
  },
  {
    title: '更新时间',
    key: 'updatedAt',
    width: 170,
    render(row) {
      return new Date(row.updatedAt).toLocaleString()
    },
  },
  {
    title: '操作',
    key: 'actions',
    width: 120,
    fixed: 'right',
    render(row) {
      return h('div', { class: 'flex gap-2' }, [
        h(
          NButton,
          {
            size: 'small',
            type: 'info',
            quaternary: true,
            onClick: () => handleEdit(row),
          },
          {
            default: () => h(EyeIcon, { size: 16 }),
          },
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'warning',
            quaternary: true,
            onClick: () => handleDelete(row.id),
          },
          {
            default: () => h(DeleteIcon, { size: 16 }),
          },
        ),
      ])
    },
  },
])

const rowKey = (row: PriceRangeDTO) => row.id

// 生命周期钩子
onMounted(() => {
  fetchPriceRanges()
})

// 获取价格范围列表
async function fetchPriceRanges() {
  loading.value = true
  try {
    const response = await listPriceRanges({
      page: pagination.page,
      size: pagination.pageSize,
    })

    if (response.success) {
      const pageData = response.data
      priceRanges.value = pageData.records
      pagination.itemCount = pageData.total
    } else {
      message.error(response.message || '获取价格范围列表失败')
    }
  } catch (error) {
    message.error('获取价格范围列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 处理翻页
function handlePageChange(page: number) {
  pagination.page = page
  fetchPriceRanges()
}

// 添加价格范围
function handleAdd() {
  isEdit.value = false
  resetForm()
  showModal.value = true
}

// 编辑价格范围
function handleEdit(row: PriceRangeDTO) {
  isEdit.value = true
  currentId.value = row.id
  Object.assign(formModel, {
    code: row.code,
    name: row.name,
    minPrice: row.minPrice,
    maxPrice: row.maxPrice,
    sortOrder: row.sortOrder,
    isEnabled: row.isEnabled,
  })
  showModal.value = true
}

// 处理删除
function handleDelete(id: number) {
  currentId.value = id
  showDeleteModal.value = true
}

// 确认删除
async function confirmDelete() {
  if (currentId.value === null)
    return

  try {
    const response = await deletePriceRange(currentId.value)

    if (response.success) {
      message.success('删除成功')
      fetchPriceRanges()
    } else {
      message.error(response.message || '删除失败')
    }
  } catch (error) {
    message.error('删除失败')
    console.error(error)
  } finally {
    showDeleteModal.value = false
    currentId.value = null
  }
}

// 提交表单
function handleSubmit() {
  formRef.value?.validate(async (errors) => {
    if (errors)
      return

    submitting.value = true
    try {
      const submitData: PriceRangeParams = {
        code: formModel.code,
        name: formModel.name,
        minPrice: formModel.minPrice,
        maxPrice: formModel.maxPrice,
        sortOrder: formModel.sortOrder,
        isEnabled: formModel.isEnabled,
      }

      let response
      if (isEdit.value && currentId.value !== null) {
        response = await updatePriceRange(currentId.value, submitData)
      } else {
        response = await createPriceRange(submitData)
      }

      if (response.success) {
        message.success(isEdit.value ? '更新成功' : '创建成功')
        showModal.value = false
        fetchPriceRanges()
      } else {
        message.error(response.message || (isEdit.value ? '更新失败' : '创建失败'))
      }
    } catch (error) {
      message.error(isEdit.value ? '更新失败' : '创建失败')
      console.error(error)
    } finally {
      submitting.value = false
    }
  })
}

// 重置表单
function resetForm() {
  currentId.value = null
  formModel.code = ''
  formModel.name = ''
  formModel.minPrice = null
  formModel.maxPrice = null
  formModel.sortOrder = 0
  formModel.isEnabled = true

  if (formRef.value) {
    formRef.value.restoreValidation()
  }
}
</script>

<template>
  <div class="p-6">
    <div class="mb-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold">
        价格范围管理
      </h1>
      <NButton type="primary" @click="handleAdd">
        <template #icon>
          <PlusIcon class="mr-1" :size="16" />
        </template>
        添加价格范围
      </NButton>
    </div>

    <!-- 数据表格 -->
    <NCard>
      <NDataTable
        :columns="columns"
        :data="priceRanges"
        :loading="loading"
        :pagination="pagination"
        :row-key="rowKey"
        @update:page="handlePageChange"
      />
    </NCard>

    <!-- 编辑/新增对话框 -->
    <NModal
      v-model:show="showModal"
      :mask-closable="false"
      preset="card"
      :title="isEdit ? '编辑价格范围' : '新增价格范围'"
      class="max-w-2xl"
    >
      <NForm
        ref="formRef"
        :model="formModel"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
      >
        <NFormItem label="价格范围代码" path="code">
          <NInput v-model:value="formModel.code" placeholder="请输入价格范围代码" />
        </NFormItem>
        <NFormItem label="价格范围名称" path="name">
          <NInput v-model:value="formModel.name" placeholder="请输入价格范围名称" />
        </NFormItem>
        <NFormItem label="最低价格" path="minPrice">
          <NInputNumber
            v-model:value="formModel.minPrice"
            placeholder="请输入最低价格"
            :precision="2"
            class="w-full"
          />
        </NFormItem>
        <NFormItem label="最高价格" path="maxPrice">
          <NInputNumber
            v-model:value="formModel.maxPrice"
            placeholder="请输入最高价格"
            :precision="2"
            class="w-full"
          />
        </NFormItem>
        <NFormItem label="排序顺序" path="sortOrder">
          <NInputNumber
            v-model:value="formModel.sortOrder"
            placeholder="请输入排序顺序"
            :precision="0"
            class="w-full"
          />
        </NFormItem>
        <NFormItem label="是否启用" path="isEnabled">
          <NSwitch v-model:value="formModel.isEnabled" />
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace>
          <NButton @click="showModal = false">
            取消
          </NButton>
          <NButton type="primary" :loading="submitting" @click="handleSubmit">
            确定
          </NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 删除确认对话框 -->
    <NModal
      v-model:show="showDeleteModal"
      preset="dialog"
      title="确认删除"
      positive-text="确认"
      negative-text="取消"
      @positive-click="confirmDelete"
      @negative-click="showDeleteModal = false"
    >
      <template #icon>
        <AlertCircleIcon class="text-red-500" />
      </template>
      确定要删除该价格范围吗？此操作不可恢复。
    </NModal>
  </div>
</template>
