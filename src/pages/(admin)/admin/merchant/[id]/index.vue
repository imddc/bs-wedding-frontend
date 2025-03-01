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
  NEmpty,
  NGi,
  NGrid,
  NImage,
  NSpin,
  NTag,
} from 'naive-ui'
import {
  ArrowLeftIcon,
  EditIcon,
  ListIcon,
} from 'lucide-vue-next'
import { getMerchantById } from '~/api/merchant'
import type { MerchantInfo } from '~/api/merchant/type'
import MerchantForm from '~/components/merchant/admin/MerchantForm.vue'

const route = useRoute()
const router = useRouter()

// 商家ID
const merchantId = ref<number>(Number(route.params.id) || 0)

// 商家信息
const merchantInfo = reactive<MerchantInfo>({
  id: 0,
  userId: 0,
  merchantName: '',
  logo: '',
  description: '',
  address: '',
  city: '',
  contactPhone: '',
  contactPerson: '',
  favoriteCount: 0,
  merchantType: 1,
  merchantTypeName: '',
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

// 格式化日期
function formatDate(dateString?: string) {
  if (!dateString)
    return '-'
  return dateString.replace('T', ' ').substring(0, 19)
}

// 获取商家详情
async function fetchMerchantDetail() {
  loading.value = true
  try {
    const response = await getMerchantById(merchantId.value)
    if (response.success) {
      // 更新商家信息
      Object.assign(merchantInfo, response.data)
    } else {
      window.$message.error(response.message || '获取商家详情失败')
    }
  } catch (error) {
    console.error('获取商家详情出错:', error)
    window.$message.error('获取商家详情出错')
  } finally {
    loading.value = false
  }
}

// 编辑商家
function handleEdit() {
  drawerVisible.value = true
}

// 表单提交回调
async function handleSubmit() {
  drawerVisible.value = false
  await fetchMerchantDetail()
}

// 初始化
onMounted(() => {
  if (merchantId.value) {
    fetchMerchantDetail()
  } else {
    window.$message.error('商家ID不能为空')
    router.push('/admin/merchant')
  }
})
</script>

<template>
  <div class="merchant-detail p-4">
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center">
        <NButton quaternary circle @click="router.back()">
          <template #icon>
            <ArrowLeftIcon />
          </template>
        </NButton>
        <h1 class="text-xl font-bold ml-2">
          商家详情
        </h1>
      </div>
      <div class="flex-center gap-4">
        <NButton type="primary" class="mr-2" @click="handleEdit">
          <template #icon>
            <EditIcon class="mr-1" />
          </template>
          编辑
        </NButton>
        <NButton @click="router.push('/admin/merchant')">
          <template #icon>
            <ListIcon class="mr-1" />
          </template>
          商家列表
        </NButton>
      </div>
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
              <NDescriptionsItem label="商家ID">
                {{ merchantInfo.id }}
              </NDescriptionsItem>
              <NDescriptionsItem label="商家名称">
                {{ merchantInfo.merchantName }}
              </NDescriptionsItem>
              <NDescriptionsItem label="商家类型">
                {{ merchantInfo.merchantTypeName }}
              </NDescriptionsItem>
              <NDescriptionsItem label="状态">
                <NTag :type="merchantInfo.status === 1 ? 'success' : 'warning'">
                  {{ merchantInfo.statusName }}
                </NTag>
              </NDescriptionsItem>
              <NDescriptionsItem label="收藏数量">
                {{ merchantInfo.favoriteCount }}
              </NDescriptionsItem>
              <NDescriptionsItem label="创建时间">
                {{ formatDate(merchantInfo.createTime) }}
              </NDescriptionsItem>
              <NDescriptionsItem label="更新时间">
                {{ formatDate(merchantInfo.updateTime) }}
              </NDescriptionsItem>
            </NDescriptions>
          </NCard>
        </NGi>

        <NGi span="24" :lg-span="12">
          <NCard title="联系信息" size="small">
            <NDivider />
            <NDescriptions :column="1" label-placement="left" bordered>
              <NDescriptionsItem label="联系人">
                {{ merchantInfo.contactPerson || '-' }}
              </NDescriptionsItem>
              <NDescriptionsItem label="联系电话">
                {{ merchantInfo.contactPhone || '-' }}
              </NDescriptionsItem>
              <NDescriptionsItem label="城市">
                {{ merchantInfo.city || '-' }}
              </NDescriptionsItem>
              <NDescriptionsItem label="地址">
                {{ merchantInfo.address || '-' }}
              </NDescriptionsItem>
              <NDescriptionsItem label="关联用户ID">
                {{ merchantInfo.userId }}
              </NDescriptionsItem>
            </NDescriptions>
          </NCard>
        </NGi>

        <NGi span="24">
          <NCard title="商家Logo" size="small">
            <NDivider />
            <div class="flex justify-center p-4">
              <NImage
                v-if="merchantInfo.logo"
                :src="merchantInfo.logo"
                object-fit="contain"
                width="200"
                preview-disabled
                fallback-src="https://via.placeholder.com/200x100?text=无图片"
              />
              <NEmpty v-else description="暂无Logo" />
            </div>
          </NCard>
        </NGi>

        <NGi span="24">
          <NCard title="商家描述" size="small">
            <NDivider />
            <div class="p-4">
              <NEmpty v-if="!merchantInfo.description" description="暂无描述" />
              <div v-else class="whitespace-pre-wrap">
                {{ merchantInfo.description }}
              </div>
            </div>
          </NCard>
        </NGi>
      </NGrid>
    </div>

    <!-- 编辑抽屉 -->
    <NDrawer
      v-model:show="drawerVisible"
      :width="500"
      title="编辑商家"
      placement="right"
    >
      <NDrawerContent>
        <MerchantForm
          :form-data="{ ...merchantInfo, isEditing: true }"
          :loading="formLoading"
          @submit="handleSubmit"
          @cancel="drawerVisible = false"
        />
      </NDrawerContent>
    </NDrawer>
  </div>
</template>
