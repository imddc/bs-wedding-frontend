<script setup lang="ts">
import { computed, h, onMounted, reactive, ref } from 'vue'
import {
  NButton,
  NCard,
  NDataTable,
  NInput,
  NPopconfirm,
  NSpace,
  NTag,
} from 'naive-ui'
import {
  RefreshCcwIcon,
  SearchIcon,
  TrashIcon,
} from 'lucide-vue-next'
import {
  deleteMessage,
  pageMessages,
} from '~/api/message'
import type {
  ChatMessage,
  ChatMessageQueryParams,
} from '~/api/message/type'
import {
  INITIAL_QUERY_PARAMS,
  MESSAGE_TABLE_COLUMNS,
  PAGINATION_CONFIG,
} from '~/constants/message'

// Table state
const tableRef = ref(null)
const loading = ref(false)
const tableData = ref<ChatMessage[]>([])
const total = ref(0)
const selectedRowKeys = ref<Array<number | string>>([])

// Query params
const queryParams = reactive<ChatMessageQueryParams>({
  ...INITIAL_QUERY_PARAMS,
})

// Pagination
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  pageSizes: PAGINATION_CONFIG.pageSizes,
  showSizePicker: PAGINATION_CONFIG.showSizePicker,
  showQuickJumper: PAGINATION_CONFIG.showQuickJumper,
  pageSlot: PAGINATION_CONFIG.pageSlot,
  onChange: (page: number) => {
    pagination.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
  },
})

// Row key function
const rowKey = (row: ChatMessage) => row.id

// Format functions
function formatDateTime(dateTime: string): string {
  if (!dateTime)
    return '-'
  return new Date(dateTime).toLocaleString()
}

function formatReadStatus(isRead: boolean): string {
  return isRead ? '已读' : '未读'
}

// Action column
const mergedColumns = computed(() => {
  const columns = [...MESSAGE_TABLE_COLUMNS]

  // Customize isRead column
  const isReadColumn = columns.find(col => col.key === 'isRead')
  if (isReadColumn) {
    isReadColumn.render = (row: ChatMessage) => {
      return h(
        NTag,
        {
          type: row.isRead ? 'success' : 'warning',
          size: 'small',
        },
        { default: () => formatReadStatus(row.isRead) },
      )
    }
  }

  // Customize createTime column
  const createTimeColumn = columns.find(col => col.key === 'createTime')
  if (createTimeColumn) {
    createTimeColumn.render = (row: ChatMessage) => {
      return formatDateTime(row.createTime)
    }
  }

  // Find the actions column and customize it
  const actionsColumn = columns.find(col => col.key === 'actions')
  if (actionsColumn) {
    actionsColumn.render = (row: ChatMessage) => {
      return h('div', { class: 'flex gap-2' }, [
        h(
          NPopconfirm,
          {
            onPositiveClick: () => handleDeleteMessage(row.id),
          },
          {
            trigger: () =>
              h(
                NButton,
                {
                  size: 'small',
                  type: 'error',
                },
                {
                  default: () => '删除',
                  icon: () => h(TrashIcon, { class: 'h-4 w-4 mr-1' }),
                },
              ),
            default: () => '确认删除该消息？',
          },
        ),
      ])
    }
  }

  return columns
})

// Fetch data
async function fetchData() {
  loading.value = true
  try {
    const { current, size, senderId, receiverId, content } = queryParams
    const response = await pageMessages({
      current,
      size,
      senderId,
      receiverId,
      content,
    })

    if (response.success) {
      const pageData = response.data
      tableData.value = pageData.records
      total.value = pageData.total
      pagination.itemCount = pageData.total
    } else {
      window.$message.error(response.message || '获取消息列表失败')
    }
  } catch (error) {
    console.error('Failed to fetch messages:', error)
    window.$message.error('获取消息列表失败')
  } finally {
    loading.value = false
  }
}

// Methods
function handleSearch() {
  queryParams.current = 1
  fetchData()
}

function resetSearch() {
  queryParams.senderId = undefined
  queryParams.receiverId = undefined
  queryParams.content = undefined
  queryParams.current = 1
  fetchData()
}

function handlePageChange(page: number) {
  queryParams.current = page
  fetchData()
}

function handlePageSizeChange(pageSize: number) {
  queryParams.size = pageSize
  queryParams.current = 1
  fetchData()
}

function handleCheckRowKeys(keys: Array<number | string>) {
  selectedRowKeys.value = keys
}

async function handleDeleteMessage(id: number) {
  loading.value = true
  try {
    const response = await deleteMessage(id)
    if (response.success) {
      window.$message.success('删除成功')
      fetchData()
    } else {
      window.$message.error(response.message || '删除失败')
    }
  } catch (error) {
    console.error('Failed to delete message:', error)
    window.$message.error('删除失败')
  } finally {
    loading.value = false
  }
}

async function handleBatchDelete() {
  if (selectedRowKeys.value.length === 0)
    return

  loading.value = true
  try {
    // In a real application, you would have a batch endpoint
    // Here we're handling each message individually as a workaround
    const promises = selectedRowKeys.value.map(id => deleteMessage(Number(id)))
    const results = await Promise.all(promises)

    const success = results.every(res => res.success)
    if (success) {
      window.$message.success('批量删除成功')
      fetchData()
    } else {
      window.$message.error('部分消息删除失败')
    }
  } catch (error) {
    console.error('Failed to delete messages:', error)
    window.$message.error('删除失败')
  } finally {
    loading.value = false
  }
}

// Initialize
onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="message-management-container">
    <NCard title="消息管理">
      <div class="search-container grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <div class="mb-1">
            发送者ID
          </div>
          <NInput
            v-model:value="queryParams.senderId"
            type="number"
            placeholder="请输入发送者ID"
            clearable
          />
        </div>
        <div>
          <div class="mb-1">
            接收者ID
          </div>
          <NInput
            v-model:value="queryParams.receiverId"
            type="number"
            placeholder="请输入接收者ID"
            clearable
          />
        </div>
        <div>
          <div class="mb-1">
            消息内容
          </div>
          <NInput
            v-model:value="queryParams.content"
            placeholder="请输入消息内容"
            clearable
          />
        </div>
      </div>

      <NSpace justify="end" class="mb-6 w-full">
        <div class="flex space-x-2">
          <NButton type="primary" @click="handleSearch">
            <template #icon>
              <SearchIcon class="mr-1" />
            </template>
            搜索
          </NButton>
          <NButton class="ml-4" @click="resetSearch">
            <template #icon>
              <RefreshCcwIcon class="mr-1" />
            </template>
            重置
          </NButton>
        </div>
      </NSpace>

      <NDataTable
        ref="tableRef"
        :columns="mergedColumns"
        :data="tableData"
        :loading="loading"
        :pagination="pagination"
        :row-key="rowKey"
        :scroll-x="1200"
        @update:checked-row-keys="handleCheckRowKeys"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </NCard>
  </div>
</template>
