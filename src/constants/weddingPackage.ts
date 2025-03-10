// 婚礼方案状态
export enum WeddingPackageStatus {
  DRAFT = 0,
  CONFIRMED = 1
}

// 婚礼方案状态名称映射
export const WeddingPackageStatusMap = {
  [WeddingPackageStatus.DRAFT]: '草稿',
  [WeddingPackageStatus.CONFIRMED]: '已确认'
}

// 产品类型
export enum ProductType {
  PHOTOGRAPHY = 1,
  HOTEL = 2,
  HOST = 3
}

// 产品类型名称映射
export const ProductTypeMap = {
  [ProductType.PHOTOGRAPHY]: '婚纱摄影',
  [ProductType.HOTEL]: '婚宴酒店',
  [ProductType.HOST]: '司仪主持'
}

// 城市选项
export const CityOptions = [
  { label: '北京', value: '北京' },
  { label: '上海', value: '上海' },
  { label: '广州', value: '广州' },
  { label: '深圳', value: '深圳' },
  { label: '杭州', value: '杭州' },
  { label: '成都', value: '成都' },
  { label: '重庆', value: '重庆' },
  { label: '西安', value: '西安' },
  { label: '南京', value: '南京' },
  { label: '武汉', value: '武汉' }
]

// 预算范围选项
export const BudgetRangeOptions = [
  { label: '不限', value: null },
  { label: '5万以下', value: [0, 50000] },
  { label: '5-10万', value: [50000, 100000] },
  { label: '10-15万', value: [100000, 150000] },
  { label: '15-20万', value: [150000, 200000] },
  { label: '20万以上', value: [200000, null] }
]
