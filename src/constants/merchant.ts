import { MerchantStatus, MerchantType } from '~/api/merchant/type'

/**
 * 商家类型选项
 */
export const MERCHANT_TYPE_OPTIONS = [
  { label: '婚纱摄影', value: MerchantType.PHOTOGRAPHY },
  { label: '婚宴酒店', value: MerchantType.HOTEL },
  { label: '司仪主持', value: MerchantType.HOST },
]

/**
 * 商家状态选项
 */
export const MERCHANT_STATUS_OPTIONS = [
  { label: '上架', value: MerchantStatus.ONLINE },
  { label: '下架', value: MerchantStatus.OFFLINE },
]

/**
 * 商家类型映射
 */
export const MERCHANT_TYPE_MAP: Record<number, string> = {
  [MerchantType.PHOTOGRAPHY]: '婚纱摄影',
  [MerchantType.HOTEL]: '婚宴酒店',
  [MerchantType.HOST]: '司仪主持',
}

/**
 * 商家状态映射
 */
export const MERCHANT_STATUS_MAP: Record<number, string> = {
  [MerchantStatus.ONLINE]: '上架',
  [MerchantStatus.OFFLINE]: '下架',
}

/**
 * 状态对应的标签类型
 */
export const STATUS_TAG_TYPE: Record<number, 'success' | 'warning' | 'error' | 'info'> = {
  [MerchantStatus.ONLINE]: 'success',
  [MerchantStatus.OFFLINE]: 'warning',
}
