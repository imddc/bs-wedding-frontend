<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import type {
  FormInst,
  FormRules,
} from 'naive-ui'
import {
  NButton,
  NDivider,
  NDynamicInput,
  NDynamicTags,
  NForm,
  NFormItem,
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
import { createProduct, getCategoryList, getMerchantList, updateProduct } from '~/api/product'
import type { CategoryOption, Product } from '~/api/product/type'
import { PRODUCT_STATUS_OPTIONS, PRODUCT_TYPE_OPTIONS } from '~/api/product/type'

// Props & Emits
const props = defineProps<{
  show: boolean
  product: Product | null
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
const categoryOptions = ref<{ label: string, value: number }[]>([])
const merchantOptions = ref<{ label: string, value: number }[]>([])

// Computed
const showModal = computed({
  get: () => props.show,
  set: value => emit('update:show', value),
})

const viewMode = computed(() => !props.isEdit)

const modalTitle = computed(() => {
  if (viewMode.value)
    return '查看商品详情'
  return props.product?.id ? '编辑商品' : '新增商品'
})

// Form data
const formData = reactive<Product>({
  merchantId: 0,
  productName: '',
  categoryId: 0,
  productType: 1,
  price: 0,
  status: 1,
  tagsList: [],
  subImagesList: [],
})

const typeSpecificTabTitle = computed(() => {
  switch (formData.productType) {
    case 1:
      return '摄影特有属性'
    case 2:
      return '酒店特有属性'
    case 3:
      return '司仪特有属性'
    default:
      return '特有属性'
  }
})

const filteredCategoryOptions = computed(() => {
  if (!formData.productType)
    return []
  return categoryOptions.value.filter(
    (option: any) => option.merchantType === formData.productType,
  )
})

// Validation rules
const rules = reactive<FormRules>({
  productName: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
  ],
  productType: [
    { required: true, message: '请选择商品类型', trigger: 'change' },
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

// Message
const message = useMessage()

// Watches
watch(() => props.product, (newProduct) => {
  if (newProduct) {
    resetForm()
    Object.assign(formData, newProduct)

    // 处理服务内容
    if (newProduct.servicesMap) {
      basicServices.value = newProduct.servicesMap['基础服务'] || []
      valueAddedServices.value = newProduct.servicesMap['增值服务'] || []
    }
  }
}, { immediate: true })

// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchCategoryList(),
    fetchMerchantList(),
  ])
})

// Methods
function resetForm() {
  formData.merchantId = 0
  formData.productName = ''
  formData.categoryId = 0
  formData.productType = 1
  formData.price = 0
  formData.status = 1
  formData.location = ''
  formData.establishmentYears = undefined
  formData.rating = undefined
  formData.mainImage = ''
  formData.description = ''
  formData.detail = ''
  formData.tagsList = []
  formData.subImagesList = []

  // 特有字段
  // 摄影
  formData.shootingLocationsList = []
  formData.costumeCount = undefined
  formData.photographerLevel = ''
  formData.photoCount = undefined

  // 酒店
  formData.venueSize = undefined
  formData.maxTables = undefined
  formData.minTables = undefined
  formData.cateringStyleList = []

  // 司仪
  formData.hostingExperience = undefined
  formData.hostingStyle = ''
  formData.languagesList = []

  // 服务内容
  basicServices.value = []
  valueAddedServices.value = []

  if (formRef.value) {
    formRef.value.restoreValidation()
  }
}

async function fetchCategoryList() {
  try {
    const response = await getCategoryList()
    if (response.code === 200) {
      const categories = response.data
      const formatCategories = (items: CategoryOption[]): { label: string, value: number }[] => {
        return items.map(item => ({
          label: item.name,
          value: item.id,
          merchantType: item.merchantType,
          ...(item.children && item.children.length > 0
            ? { children: formatCategories(item.children) }
            : {}),
        }))
      }
      categoryOptions.value = formatCategories(categories)
    }
  } catch (error) {
    console.error('获取分类列表失败', error)
    message.error('获取分类列表失败')
  }
}

async function fetchMerchantList() {
  try {
    const response = await getMerchantList()
    if (response.code === 200) {
      merchantOptions.value = response.data.map((item: any) => ({
        label: item.merchantName,
        value: item.id,
      }))
    }
  } catch (error) {
    console.error('获取商家列表失败', error)
    message.error('获取商家列表失败')
  }
}

function handleProductTypeChange() {
  // 切换商品类型时，重置分类
  formData.categoryId = 0
}

function handleClose() {
  showModal.value = false
}

function handleBeforeUpload() {
  // 这里应该有图片上传前的逻辑
  return true
}

function handleUploadFinish({ file }: any) {
  // 模拟上传成功，实际应该从后端返回
  setTimeout(() => {
    formData.mainImage = URL.createObjectURL(file.file)
  }, 500)
}

function handleSubImagesUploadFinish({ file }: any) {
  // 模拟上传成功，实际应该从后端返回
  setTimeout(() => {
    if (!formData.subImagesList) {
      formData.subImagesList = []
    }
    formData.subImagesList.push(URL.createObjectURL(file.file))
  }, 500)
}

function prepareFormData() {
  // 服务内容处理
  formData.servicesMap = {
    基础服务: basicServices.value,
    增值服务: valueAddedServices.value,
  }

  // 处理类型特有字段
  if (formData.productType === 1) { // 婚纱摄影
    if (formData.shootingLocationsList && formData.shootingLocationsList.length > 0) {
      formData.shootingLocations = formData.shootingLocationsList.join(',')
    }
  } else if (formData.productType === 2) { // 婚宴酒店
    if (formData.cateringStyleList && formData.cateringStyleList.length > 0) {
      formData.cateringStyle = formData.cateringStyleList.join(',')
    }
  } else if (formData.productType === 3) { // 司仪主持
    if (formData.languagesList && formData.languagesList.length > 0) {
      formData.languages = formData.languagesList.join(',')
    }
  }

  // 标签处理
  if (formData.tagsList && formData.tagsList.length > 0) {
    formData.tags = formData.tagsList.join(',')
  }

  // 子图处理
  if (formData.subImagesList && formData.subImagesList.length > 0) {
    // 实际情况应该是提交URL列表给后端，这里简化处理
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

      if (props.product?.id) {
        // 更新
        const response = await updateProduct(props.product.id, formData)
        if (response.code === 200) {
          message.success('更新成功')
          emit('refresh')
          handleClose()
        } else {
          message.error(response.message || '更新失败')
        }
      } else {
        // 创建
        const response = await createProduct(formData)
        if (response.code === 200) {
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
      label-width="100px"
      require-mark-placement="right-hanging"
      size="medium"
    >
      <NTabs v-model:value="activeTab" type="line" animated>
        <!-- 基本信息 Tab -->
        <NTabPane name="basic" tab="基本信息">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NFormItem label="商品类型" path="productType" required>
              <NSelect
                v-model:value="formData.productType"
                :options="PRODUCT_TYPE_OPTIONS"
                :disabled="viewMode"
                @update:value="handleProductTypeChange"
              />
            </NFormItem>

            <NFormItem label="分类" path="categoryId" required>
              <NSelect
                v-model:value="formData.categoryId"
                :options="filteredCategoryOptions"
                :disabled="viewMode"
              />
            </NFormItem>

            <NFormItem label="商品名称" path="productName" required>
              <NInput v-model:value="formData.productName" :disabled="viewMode" />
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

            <NFormItem label="成立年限" path="establishmentYears">
              <NInputNumber
                v-model:value="formData.establishmentYears"
                :disabled="viewMode"
                min="0"
                :precision="0"
                style="width: 100%"
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

        <!-- 图片素材 Tab -->
        <NTabPane name="media" tab="图片素材">
          <div class="grid grid-cols-1 gap-4">
            <NFormItem label="主图" path="mainImage">
              <div v-if="viewMode && formData.mainImage" class="w-full">
                <img
                  :src="formData.mainImage"
                  class="max-w-md max-h-64 object-contain border rounded"
                  alt="商品主图"
                >
              </div>
              <NUpload
                v-else
                list-type="image-card"
                :max="1"
                :default-upload="false"
                :on-before-upload="handleBeforeUpload"
                :on-finish="handleUploadFinish"
                :disabled="viewMode"
              >
                <div v-if="!formData.mainImage" class="flex justify-center items-center flex-col">
                  <UploadIcon class="mb-1" />
                  <span>上传图片</span>
                </div>
              </NUpload>
            </NFormItem>

            <NFormItem label="附加图片" path="subImagesList">
              <div v-if="viewMode && formData.subImagesList?.length" class="grid grid-cols-3 gap-2">
                <div v-for="(img, index) in formData.subImagesList" :key="index" class="w-full">
                  <img
                    :src="img"
                    class="max-w-full max-h-40 object-contain border rounded"
                    alt="附加图片"
                  >
                </div>
              </div>
              <NUpload
                v-else
                list-type="image-card"
                multiple
                :default-upload="false"
                :on-before-upload="handleBeforeUpload"
                :on-finish="handleSubImagesUploadFinish"
                :disabled="viewMode"
              >
                <div v-if="!formData.subImagesList?.length" class="flex justify-center items-center flex-col">
                  <UploadIcon class="mb-1" />
                  <span>上传图片</span>
                </div>
              </NUpload>
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

        <!-- 类型特有属性 Tab -->
        <NTabPane name="typeSpecific" :tab="typeSpecificTabTitle">
          <!-- 婚纱摄影特有字段 -->
          <div v-if="formData.productType === 1" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NFormItem label="拍摄地点" path="shootingLocationsList">
              <NDynamicTags
                v-model:value="formData.shootingLocationsList"
                :disabled="viewMode"
                placeholder="输入拍摄地点后按Enter添加"
              />
            </NFormItem>

            <NFormItem label="服装套数" path="costumeCount">
              <NInputNumber
                v-model:value="formData.costumeCount"
                :disabled="viewMode"
                min="0"
                :precision="0"
                style="width: 100%"
              />
            </NFormItem>

            <NFormItem label="摄影师级别" path="photographerLevel">
              <NInput v-model:value="formData.photographerLevel" :disabled="viewMode" />
            </NFormItem>

            <NFormItem label="精修照片数量" path="photoCount">
              <NInputNumber
                v-model:value="formData.photoCount"
                :disabled="viewMode"
                min="0"
                :precision="0"
                style="width: 100%"
              />
            </NFormItem>
          </div>

          <!-- 婚宴酒店特有字段 -->
          <div v-else-if="formData.productType === 2" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NFormItem label="场地大小(㎡)" path="venueSize">
              <NInputNumber
                v-model:value="formData.venueSize"
                :disabled="viewMode"
                min="0"
                :precision="0"
                style="width: 100%"
              />
            </NFormItem>

            <NFormItem label="最大桌数" path="maxTables">
              <NInputNumber
                v-model:value="formData.maxTables"
                :disabled="viewMode"
                min="0"
                :precision="0"
                style="width: 100%"
              />
            </NFormItem>

            <NFormItem label="最小起订桌数" path="minTables">
              <NInputNumber
                v-model:value="formData.minTables"
                :disabled="viewMode"
                min="0"
                :precision="0"
                style="width: 100%"
              />
            </NFormItem>

            <NFormItem label="餐饮风格" path="cateringStyleList">
              <NDynamicTags
                v-model:value="formData.cateringStyleList"
                :disabled="viewMode"
                placeholder="输入餐饮风格后按Enter添加"
              />
            </NFormItem>
          </div>

          <!-- 司仪主持特有字段 -->
          <div v-else-if="formData.productType === 3" class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
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
