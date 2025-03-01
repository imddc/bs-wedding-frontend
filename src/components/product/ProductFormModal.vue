<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import type {
  FormInst,
  FormRules,
} from 'naive-ui'
import {
  NButton,
  NDivider,
  NForm,
  NFormItem,
  NGrid,
  NGridItem,
  NImage,
  NInput,
  NInputNumber,
  NModal,
  NRadio,
  NRadioGroup,
  NSelect,
} from 'naive-ui'
import {
  createHostProduct,
  createHotelProduct,
  createPhotographyProduct,
  createProduct,
  getHostProduct,
  getHotelProduct,
  getPhotographyProduct,
  getProduct,
  updateHostProduct,
  updateHotelProduct,
  updatePhotographyProduct,
  updateProduct,
} from '~/api/product'
import {
  COMMON_FORM_RULES,
  DEFAULT_HOST_PRODUCT,
  DEFAULT_HOTEL_PRODUCT,
  DEFAULT_PHOTOGRAPHY_PRODUCT,
  DEFAULT_PRODUCT,
  PRODUCT_STATUS_OPTIONS,
  PRODUCT_TYPE,
  PRODUCT_TYPE_OPTIONS,
} from '~/constants/product'
import type {
  HostProductParams,
  HotelProductParams,
  PhotographyProductParams,
  ProductCreateParams,
} from '~/api/product/type'

const props = defineProps<{
  show: boolean
  formType: 'create' | 'update' | 'view'
  productId: number | null
  productType: number | null
}>()

const emit = defineEmits<{
  (e: 'update:show', v: boolean): void
  (e: 'success'): void
}>()

// 表单引用和表单数据
const formRef = ref<FormInst | null>(null)
const formData = reactive<any>({
  ...DEFAULT_PRODUCT,
})

// 弹窗控制
const modalVisible = computed({
  get: () => props.show,
  set: value => emit('update:show', value),
})

// 预览图片
const showPreview = ref(false)
const previewUrl = ref('')

// 弹窗标题
const modalTitle = computed(() => {
  const actionText = {
    create: '新增',
    update: '编辑',
    view: '查看',
  }[props.formType]

  const typeText = {
    [PRODUCT_TYPE.PHOTOGRAPHY]: '婚纱摄影',
    [PRODUCT_TYPE.HOTEL]: '婚宴酒店',
    [PRODUCT_TYPE.HOST]: '司仪主持',
  }[formData.productType] || ''

  return `${actionText}${typeText}商品`
})

// 表单验证规则
// @ts-expect-error non
const formRules = computed<FormRules>(() => {
  const rules = { ...COMMON_FORM_RULES }

  // 根据商品类型添加特定规则
  if (formData.productType === PRODUCT_TYPE.PHOTOGRAPHY) {
    // 添加婚纱摄影特定规则
  } else if (formData.productType === PRODUCT_TYPE.HOTEL) {
    // 添加婚宴酒店特定规则
  } else if (formData.productType === PRODUCT_TYPE.HOST) {
    // 添加司仪主持特定规则
  }

  return rules
})

// 商品类型变更处理
function handleProductTypeChange(value: number) {
  // 根据选择的商品类型重置表单数据
  if (value === PRODUCT_TYPE.PHOTOGRAPHY) {
    Object.assign(formData, DEFAULT_PHOTOGRAPHY_PRODUCT)
  } else if (value === PRODUCT_TYPE.HOTEL) {
    Object.assign(formData, DEFAULT_HOTEL_PRODUCT)
  } else if (value === PRODUCT_TYPE.HOST) {
    Object.assign(formData, DEFAULT_HOST_PRODUCT)
  }
}

// 加载商品数据
async function loadProductData() {
  if (!props.productId)
    return

  try {
    let res: any

    // 根据商品类型调用不同的接口
    if (props.productType === PRODUCT_TYPE.PHOTOGRAPHY) {
      res = await getPhotographyProduct(props.productId)
    } else if (props.productType === PRODUCT_TYPE.HOTEL) {
      res = await getHotelProduct(props.productId)
    } else if (props.productType === PRODUCT_TYPE.HOST) {
      res = await getHostProduct(props.productId)
    } else {
      res = await getProduct(props.productId)
    }

    if (res.success) {
      Object.assign(formData, res.data)
    } else {
      window.$message.error(res.message || '获取商品信息失败')
    }
  } catch (error) {
    console.error('获取商品信息出错', error)
    window.$message.error('获取商品信息出错')
  }
}

// 提交表单
function submitForm() {
  formRef.value?.validate(async (errors) => {
    if (errors) {
      return
    }

    try {
      let res: any

      if (props.formType === 'create') {
        delete formData.id
        // 创建商品
        if (formData.productType === PRODUCT_TYPE.PHOTOGRAPHY) {
          res = await createPhotographyProduct(formData as PhotographyProductParams)
        } else if (formData.productType === PRODUCT_TYPE.HOTEL) {
          res = await createHotelProduct(formData as HotelProductParams)
        } else if (formData.productType === PRODUCT_TYPE.HOST) {
          res = await createHostProduct(formData as HostProductParams)
        } else {
          res = await createProduct(formData as ProductCreateParams)
        }
      } else {
        // 更新商品
        if (props.productType === PRODUCT_TYPE.PHOTOGRAPHY) {
          res = await updatePhotographyProduct(props.productId!, formData as PhotographyProductParams)
        } else if (props.productType === PRODUCT_TYPE.HOTEL) {
          res = await updateHotelProduct(props.productId!, formData as HotelProductParams)
        } else if (props.productType === PRODUCT_TYPE.HOST) {
          res = await updateHostProduct(props.productId!, formData as HostProductParams)
        } else {
          res = await updateProduct(props.productId!, formData as ProductCreateParams)
        }
      }

      if (res.success) {
        window.$message.success(`${props.formType === 'create' ? '创建' : '更新'}成功`)
        closeModal()
        emit('success')
      } else {
        window.$message.error(res.message || `${props.formType === 'create' ? '创建' : '更新'}失败`)
      }
    } catch (error) {
      console.error(`${props.formType === 'create' ? '创建' : '更新'}商品出错`, error)
      window.$message.error(`${props.formType === 'create' ? '创建' : '更新'}商品出错`)
    }
  })
}

// 关闭弹窗
function closeModal() {
  modalVisible.value = false
}

// 重置表单
function resetForm() {
  // 根据商品类型重置表单
  if (props.productType === PRODUCT_TYPE.PHOTOGRAPHY) {
    Object.assign(formData, DEFAULT_PHOTOGRAPHY_PRODUCT)
  } else if (props.productType === PRODUCT_TYPE.HOTEL) {
    Object.assign(formData, DEFAULT_HOTEL_PRODUCT)
  } else if (props.productType === PRODUCT_TYPE.HOST) {
    Object.assign(formData, DEFAULT_HOST_PRODUCT)
  } else {
    Object.assign(formData, DEFAULT_PRODUCT)
  }

  // 如果传入了商品类型，则设置该类型
  if (props.productType) {
    formData.productType = props.productType
  }

  nextTick(() => {
    formRef.value?.restoreValidation()
  })
}

// 监听弹窗显示状态
watch(
  () => modalVisible.value,
  (visible, oldVisible) => {
    if (visible) {
      if (props.formType === 'create') {
        resetForm()
      } else {
        loadProductData()
      }
    } else if (oldVisible) {
      // 当弹窗关闭时重置表单数据
      resetForm()
    }
  },
)

// 监听商品类型变化
watch(
  () => props.productType,
  (type) => {
    if (type && props.formType === 'create') {
      resetForm()
    }
  },
)
</script>

<template>
  <NModal
    v-model:show="modalVisible"
    :title="modalTitle"
    preset="card"
    :style="{ width: '60%' }"
    :mask-closable="false"
  >
    <NForm
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-placement="left"
      :label-width="120"
      :disabled="formType === 'view'"
    >
      <!-- 基础信息 -->
      <NDivider>基础信息</NDivider>
      <NGrid :cols="24" :x-gap="24">
        <NGridItem :span="12">
          <NFormItem label="商品名称" path="productName">
            <NInput v-model:value="formData.productName" placeholder="请输入商品名称" />
          </NFormItem>
        </NGridItem>
        <NGridItem :span="12">
          <NFormItem label="商品类型" path="productType">
            <NSelect
              v-model:value="formData.productType"
              :options="PRODUCT_TYPE_OPTIONS"
              placeholder="请选择商品类型"
              :disabled="!!productType || formType !== 'create'"
              @update:value="handleProductTypeChange"
            />
          </NFormItem>
        </NGridItem>
        <NGridItem :span="12">
          <NFormItem label="商家id" path="merchantId">
            <NInput v-model:value="formData.merchantId" placeholder="请输入商家id" />
          </NFormItem>
        </NGridItem>
        <NGridItem :span="12">
          <NFormItem label="价格" path="price">
            <NInputNumber
              v-model:value="formData.price"
              :min="0"
              :precision="2"
              placeholder="请输入价格"
              style="width: 100%"
            >
              <template #prefix>
                ￥
              </template>
            </NInputNumber>
          </NFormItem>
        </NGridItem>
        <NGridItem :span="12">
          <NFormItem label="评分" path="rating">
            <NInputNumber
              v-model:value="formData.rating"
              :min="1"
              :max="5"
              :precision="1"
              placeholder="请输入评分(1-5分)"
              style="width: 100%"
            />
          </NFormItem>
        </NGridItem>
        <NGridItem :span="12">
          <NFormItem label="库存" path="stock">
            <NInputNumber
              v-model:value="formData.stock"
              :min="0"
              placeholder="请输入库存"
              style="width: 100%"
            />
          </NFormItem>
        </NGridItem>
        <NGridItem :span="12">
          <NFormItem label="销量" path="sales">
            <NInputNumber
              v-model:value="formData.sales"
              :min="0"
              placeholder="销量"
              disabled
              style="width: 100%"
            />
          </NFormItem>
        </NGridItem>
        <NGridItem :span="12">
          <NFormItem label="地址" path="location">
            <NInput v-model:value="formData.location" placeholder="请输入地址" />
          </NFormItem>
        </NGridItem>
        <NGridItem :span="12">
          <NFormItem label="成立年限" path="establishmentYears">
            <NInputNumber
              v-model:value="formData.establishmentYears"
              :min="0"
              placeholder="请输入成立年限"
              style="width: 100%"
            />
          </NFormItem>
        </NGridItem>
        <NGridItem :span="12">
          <NFormItem label="主图" path="mainImage">
            <NInput v-model:value="formData.mainImage" placeholder="请输入主图" />
          </NFormItem>
        </NGridItem>
        <NGridItem :span="12">
          <NFormItem label="子图" path="subImages">
            <NInput v-model:value="formData.subImages" placeholder="多个路径以英文逗号分隔" />
          </NFormItem>
        </NGridItem>
        <NGridItem :span="12">
          <NFormItem label="标签" path="tags">
            <NInput v-model:value="formData.tags" placeholder="多个标签以英文逗号分隔" />
          </NFormItem>
        </NGridItem>
        <NGridItem :span="12">
          <NFormItem label="状态" path="status">
            <NRadioGroup v-model:value="formData.status">
              <NRadio
                v-for="option in PRODUCT_STATUS_OPTIONS"
                :key="option.value"
                :value="option.value"
                :label="option.label"
              />
            </NRadioGroup>
          </NFormItem>
        </NGridItem>
        <NGridItem :span="24">
          <NFormItem label="简短描述" path="description">
            <NInput
              v-model:value="formData.description"
              type="textarea"
              placeholder="请输入简短描述"
              :autosize="{ minRows: 2, maxRows: 5 }"
            />
          </NFormItem>
        </NGridItem>
        <NGridItem :span="24">
          <NFormItem label="服务内容" path="services">
            <NInput
              v-model:value="formData.services"
              type="textarea"
              placeholder="格式：服务名称:描述,服务名称:描述"
              :autosize="{ minRows: 2, maxRows: 5 }"
            />
          </NFormItem>
        </NGridItem>
        <NGridItem :span="24">
          <NFormItem label="详细描述" path="detail">
            <NInput
              v-model:value="formData.detail"
              type="textarea"
              placeholder="请输入详细描述"
              :autosize="{ minRows: 4, maxRows: 8 }"
            />
          </NFormItem>
        </NGridItem>
      </NGrid>

      <!-- 商品类型特定字段 -->
      <template v-if="formData.productType === PRODUCT_TYPE.PHOTOGRAPHY">
        <NDivider>婚纱摄影特定信息</NDivider>
        <NGrid :cols="24" :x-gap="24">
          <NGridItem :span="12">
            <NFormItem label="拍摄地点" path="shootingLocations">
              <NInput
                v-model:value="formData.shootingLocations"
                placeholder="多个地点以英文逗号分隔"
              />
            </NFormItem>
          </NGridItem>
          <NGridItem :span="12">
            <NFormItem label="服装套数" path="costumeCount">
              <NInputNumber
                v-model:value="formData.costumeCount"
                :min="0"
                placeholder="请输入服装套数"
                style="width: 100%"
              />
            </NFormItem>
          </NGridItem>
          <NGridItem :span="12">
            <NFormItem label="摄影师级别" path="photographerLevel">
              <NInput v-model:value="formData.photographerLevel" placeholder="请输入摄影师级别" />
            </NFormItem>
          </NGridItem>
          <NGridItem :span="12">
            <NFormItem label="精修照片数量" path="photoCount">
              <NInputNumber
                v-model:value="formData.photoCount"
                :min="0"
                placeholder="请输入精修照片数量"
                style="width: 100%"
              />
            </NFormItem>
          </NGridItem>
        </NGrid>
      </template>

      <template v-if="formData.productType === PRODUCT_TYPE.HOTEL">
        <NDivider>婚宴酒店特定信息</NDivider>
        <NGrid :cols="24" :x-gap="24">
          <NGridItem :span="12">
            <NFormItem label="场地大小" path="venueSize">
              <NInputNumber
                v-model:value="formData.venueSize"
                :min="0"
                placeholder="请输入场地大小(平方米)"
                style="width: 100%"
              >
                <template #suffix>
                  平方米
                </template>
              </NInputNumber>
            </NFormItem>
          </NGridItem>
          <NGridItem :span="12">
            <NFormItem label="最大桌数" path="maxTables">
              <NInputNumber
                v-model:value="formData.maxTables"
                :min="0"
                placeholder="请输入最大桌数"
                style="width: 100%"
              >
                <template #suffix>
                  桌
                </template>
              </NInputNumber>
            </NFormItem>
          </NGridItem>
          <NGridItem :span="12">
            <NFormItem label="最小起订桌数" path="minTables">
              <NInputNumber
                v-model:value="formData.minTables"
                :min="0"
                placeholder="请输入最小起订桌数"
                style="width: 100%"
              >
                <template #suffix>
                  桌
                </template>
              </NInputNumber>
            </NFormItem>
          </NGridItem>
          <NGridItem :span="12">
            <NFormItem label="餐饮风格" path="cateringStyle">
              <NInput
                v-model:value="formData.cateringStyle"
                placeholder="多个风格以英文逗号分隔"
              />
            </NFormItem>
          </NGridItem>
        </NGrid>
      </template>

      <template v-if="formData.productType === PRODUCT_TYPE.HOST">
        <NDivider>司仪主持特定信息</NDivider>
        <NGrid :cols="24" :x-gap="24">
          <NGridItem :span="12">
            <NFormItem label="主持经验" path="hostingExperience">
              <NInputNumber
                v-model:value="formData.hostingExperience"
                :min="0"
                placeholder="请输入主持经验(年)"
                style="width: 100%"
              >
                <template #suffix>
                  年
                </template>
              </NInputNumber>
            </NFormItem>
          </NGridItem>
          <NGridItem :span="12">
            <NFormItem label="主持风格" path="hostingStyle">
              <NInput v-model:value="formData.hostingStyle" placeholder="请输入主持风格" />
            </NFormItem>
          </NGridItem>
          <NGridItem :span="24">
            <NFormItem label="可用语言" path="languages">
              <NInput
                v-model:value="formData.languages"
                placeholder="多个语言以英文逗号分隔"
              />
            </NFormItem>
          </NGridItem>
        </NGrid>
      </template>
    </NForm>

    <div class="flex justify-end mt-6 gap-2">
      <NButton @click="closeModal">
        取消
      </NButton>
      <NButton type="primary" :disabled="formType === 'view'" @click="submitForm">
        确认
      </NButton>
    </div>

    <!-- 预览弹窗 -->
    <NModal
      v-model:show="showPreview"
      preset="card"
      style="width: auto; max-width: 80%"
      title="图片预览"
    >
      <NImage
        v-if="previewUrl"
        :src="previewUrl"
        object-fit="contain"
        style="max-width: 100%; max-height: 80vh"
      />
    </NModal>
  </NModal>
</template>
