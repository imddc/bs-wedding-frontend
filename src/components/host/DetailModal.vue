<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import type {
  FormInst,
  FormRules,
  UploadCustomRequestOptions,
  UploadFileInfo,
} from 'naive-ui'
import {
  NButton,
  NDivider,
  NDynamicInput,
  NDynamicTags,
  NForm,
  NFormItem,
  NImage,
  NInput,
  NInputNumber,
  NModal,
  NRate,
  NSelect,
  NTabPane,
  NTabs,
  NUpload,
  useMessage,
} from 'naive-ui'
import { UploadIcon } from 'lucide-vue-next'
import { createProduct, updateProduct } from '~/api/product'
import { PRODUCT_STATUS_OPTIONS, ProductStatus, ProductType } from '~/api/product/type'
import type { HostProduct, SelectOption } from '~/api/product/type'

// Props & Emits
const props = defineProps<{
  show: boolean
  host: HostProduct | null
  isEdit: boolean
}>()

const emit = defineEmits<{
  (e: 'update:show', show: boolean): void
  (e: 'refresh'): void
}>()

// Refs
const formRef = ref<FormInst | null>(null)
const activeTab = ref('basic')
const submitting = ref(false)
const basicServices = ref<string[]>([])
const valueAddedServices = ref<string[]>([])
const categoryOptions = ref<SelectOption[]>([])
const merchantOptions = ref<SelectOption[]>([])
const mainImageFileList = ref<UploadFileInfo[]>([])
const subImagesFileList = ref<UploadFileInfo[]>([])
const message = useMessage()

// Computed
const showModal = computed({
  get: () => props.show,
  set: value => emit('update:show', value),
})

const viewMode = computed(() => !props.isEdit)

const modalTitle = computed(() => {
  if (viewMode.value)
    return '查看司仪详情'
  return props.host?.id ? '编辑司仪' : '新增司仪'
})

// Form data
const formData = reactive<HostProduct>({
  merchantId: 0,
  productName: '',
  categoryId: 0,
  productType: ProductType.HOST,
  price: 0,
  status: ProductStatus.OFF,
  tagsList: [],
  subImagesList: [],
  languagesList: [],
})

// Validation rules
const rules = reactive<FormRules>({
  productName: [
    { required: true, message: '请输入司仪名称', trigger: 'blur' },
  ],
  categoryId: [
    { required: true, message: '请选择分类', trigger: 'change' },
  ],
  merchantId: [
    { required: true, message: '请选择所属商家', trigger: 'change' },
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '价格必须大于0', trigger: 'blur' },
  ],
  detail: [
    { required: true, message: '请输入详细描述', trigger: 'blur' },
  ],
})

// Watches
watch(() => props.host, (newHost) => {
  if (newHost) {
    resetForm()
    Object.assign(formData, newHost)

    // 处理服务内容
    if (newHost.servicesMap) {
      basicServices.value = newHost.servicesMap['基础服务'] || []
      valueAddedServices.value = newHost.servicesMap['增值服务'] || []
    }

    // 处理主图文件列表
    if (newHost.mainImage) {
      mainImageFileList.value = [{
        id: 'mainImage',
        name: getFileNameFromUrl(newHost.mainImage),
        status: 'finished',
        url: newHost.mainImage,
      }]
    }

    // 处理附加图片文件列表
    if (newHost.subImagesList && newHost.subImagesList.length > 0) {
      subImagesFileList.value = newHost.subImagesList.map((url, index) => ({
        id: `subImage_${index}`,
        name: getFileNameFromUrl(url),
        status: 'finished',
        url,
      }))
    }
  }
}, { immediate: true })

// Lifecycle
onMounted(async () => {
  await Promise.all([
  ])
})

// Methods
function resetForm() {
  Object.assign(formData, {
    merchantId: 0,
    productName: '',
    categoryId: 0,
    productType: ProductType.HOST,
    price: 0,
    status: ProductStatus.OFF,
    location: '',
    establishmentYears: undefined,
    rating: undefined,
    mainImage: '',
    description: '',
    detail: '',
    tagsList: [],
    subImagesList: [],
    hostingExperience: undefined,
    hostingStyle: '',
    languagesList: [],
  })

  basicServices.value = []
  valueAddedServices.value = []
  mainImageFileList.value = []
  subImagesFileList.value = []

  if (formRef.value) {
    formRef.value.restoreValidation()
  }
}

function handleClose() {
  showModal.value = false
}

function getFileNameFromUrl(url: string): string {
  const parts = url.split('/')
  return parts[parts.length - 1]
}

function handleRemoveMainImage() {
  formData.mainImage = ''
  mainImageFileList.value = []
}

function handleRemoveSubImage(file: UploadFileInfo) {
  if (!formData.subImagesList)
    return

  const index = formData.subImagesList.findIndex(url => url === file.url)
  if (index !== -1) {
    formData.subImagesList.splice(index, 1)
  }
}

function prepareFormData() {
  // 服务内容处理
  formData.servicesMap = {
    基础服务: basicServices.value,
    增值服务: valueAddedServices.value,
  }

  // 处理语言列表
  if (formData.languagesList && formData.languagesList.length > 0) {
    formData.languages = formData.languagesList.join(',')
  }

  // 标签处理
  if (formData.tagsList && formData.tagsList.length > 0) {
    formData.tags = formData.tagsList.join(',')
  }

  // 子图处理
  if (formData.subImagesList && formData.subImagesList.length > 0) {
    formData.subImages = JSON.stringify(formData.subImagesList)
  }
}

async function handleSubmit() {
  formRef.value?.validate(async (errors) => {
    if (errors) {
      return
    }

    try {
      submitting.value = true
      prepareFormData()

      if (props.host?.id) {
        // 更新
        const response = await updateProduct(props.host.id, formData)
        if (response.success) {
          message.success('更新成功')
          emit('refresh')
          handleClose()
        } else {
          message.error(response.message || '更新失败')
        }
      } else {
        // 创建
        const response = await createProduct(formData)
        if (response.success) {
          message.success('创建成功')
          emit('refresh')
          handleClose()
        } else {
          message.error(response.message || '创建失败')
        }
      }
    } catch (error) {
      console.error('提交失败', error)
      message.error('提交失败，请稍后重试')
    } finally {
      submitting.value = false
    }
  })
}
</script>

<template>
  <NModal
    v-model:show="showModal"
    preset="card"
    :title="modalTitle"
    :style="{ width: '80%', maxWidth: '900px' }"
    size="huge"
    :bordered="false"
    @close="handleClose"
  >
    <NForm
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-placement="left"
      label-width="120px"
      require-mark-placement="right-hanging"
      size="medium"
    >
      <NTabs v-model:value="activeTab" type="line" animated>
        <!-- 基本信息 Tab -->
        <NTabPane name="basic" tab="基本信息">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NFormItem label="司仪名称" path="productName" required>
              <NInput v-model:value="formData.productName" :disabled="viewMode" />
            </NFormItem>

            <NFormItem label="分类" path="categoryId" required>
              <NSelect
                v-model:value="formData.categoryId"
                :options="categoryOptions"
                :disabled="viewMode"
              />
            </NFormItem>

            <NFormItem label="价格" path="price" required>
              <NInputNumber
                v-model:value="formData.price"
                :disabled="viewMode"
                min="0"
                :precision="2"
                :step="0.01"
                style="width: 100%"
              />
            </NFormItem>

            <NFormItem label="所属商家" path="merchantId" required>
              <NSelect
                v-model:value="formData.merchantId"
                :options="merchantOptions"
                :disabled="viewMode"
              />
            </NFormItem>

            <NFormItem label="状态" path="status">
              <NSelect
                v-model:value="formData.status"
                :options="PRODUCT_STATUS_OPTIONS"
                :disabled="viewMode"
              />
            </NFormItem>

            <NFormItem label="评分" path="rating">
              <NRate v-model:value="formData.rating" allow-half :disabled="viewMode" />
            </NFormItem>

            <NFormItem label="位置" path="location" :span="2">
              <NInput v-model:value="formData.location" :disabled="viewMode" />
            </NFormItem>

            <NFormItem label="简短描述" path="description" :span="2">
              <NInput
                v-model:value="formData.description"
                type="textarea"
                :rows="2"
                :disabled="viewMode"
              />
            </NFormItem>
          </div>
        </NTabPane>

        <!-- 司仪特有属性 Tab -->
        <NTabPane name="attributes" tab="司仪特性">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NFormItem label="主持经验(年)" path="hostingExperience">
              <NInputNumber
                v-model:value="formData.hostingExperience"
                :disabled="viewMode"
                min="0"
                :precision="0"
                style="width: 100%"
              />
            </NFormItem>

            <NFormItem label="主持风格" path="hostingStyle">
              <NInput v-model:value="formData.hostingStyle" :disabled="viewMode" />
            </NFormItem>

            <NFormItem label="可用语言" path="languagesList">
              <NDynamicTags
                v-model:value="formData.languagesList"
                :disabled="viewMode"
                placeholder="输入语言后按Enter添加"
              />
            </NFormItem>

            <NFormItem label="成立年限" path="establishmentYears">
              <NInputNumber
                v-model:value="formData.establishmentYears"
                :disabled="viewMode"
                min="0"
                :precision="0"
                style="width: 100%"
              />
            </NFormItem>
          </div>
        </NTabPane>

        <!-- 图片素材 Tab -->
        <NTabPane name="media" tab="图片素材">
          <div class="grid grid-cols-1 gap-4">
            <NFormItem label="主图" path="mainImage">
              <div v-if="viewMode && formData.mainImage" class="w-full">
                <NImage
                  :src="formData.mainImage"
                  class="max-w-md max-h-64 object-contain border rounded"
                  object-fit="contain"
                />
              </div>
            </NFormItem>

            <NFormItem label="附加图片" path="subImagesList">
              <div v-if="viewMode && formData.subImagesList?.length" class="grid grid-cols-3 gap-2">
                <div v-for="(img, index) in formData.subImagesList" :key="index" class="w-full">
                  <NImage
                    :src="img"
                    class="max-w-full max-h-40 object-contain border rounded"
                    object-fit="contain"
                  />
                </div>
              </div>
            </NFormItem>
          </div>
        </NTabPane>

        <!-- 标签和服务 Tab -->
        <NTabPane name="tags" tab="标签和服务">
          <div class="grid grid-cols-1 gap-4">
            <NFormItem label="标签" path="tagsList">
              <NDynamicTags
                v-model:value="formData.tagsList"
                :disabled="viewMode"
                placeholder="输入标签后按Enter添加"
              />
            </NFormItem>

            <NDivider>基础服务</NDivider>
            <div class="pl-6">
              <NDynamicInput
                v-model:value="basicServices"
                :disabled="viewMode"
                placeholder="输入基础服务项目"
              >
                <template #create-button-default>
                  添加基础服务
                </template>
              </NDynamicInput>
            </div>

            <NDivider>增值服务</NDivider>
            <div class="pl-6">
              <NDynamicInput
                v-model:value="valueAddedServices"
                :disabled="viewMode"
                placeholder="输入增值服务项目"
              >
                <template #create-button-default>
                  添加增值服务
                </template>
              </NDynamicInput>
            </div>
          </div>
        </NTabPane>

        <!-- 详细描述 Tab -->
        <NTabPane name="detail" tab="详细描述">
          <NFormItem label="详细描述" required>
            <NInput
              v-model:value="formData.detail"
              type="textarea"
              :autosize="{ minRows: 6, maxRows: 12 }"
              :disabled="viewMode"
            />
          </NFormItem>
        </NTabPane>
      </NTabs>

      <div class="flex justify-end space-x-2 mt-6">
        <NButton @click="handleClose">
          取消
        </NButton>
        <NButton
          v-if="!viewMode"
          type="primary"
          :loading="submitting"
          @click="handleSubmit"
        >
          提交
        </NButton>
      </div>
    </NForm>
  </NModal>
</template>
