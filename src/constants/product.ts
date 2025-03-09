// src/constants/product.ts
export const PRODUCT_TYPE = {
  PHOTOGRAPHY: 1,
  HOTEL: 2,
  HOST: 3,
}

// 筛选器选项
export const LOCATION_OPTIONS = [
  { label: '北京', value: '北京' },
  { label: '上海', value: '上海' },
  { label: '广州', value: '广州' },
  { label: '深圳', value: '深圳' },
  { label: '杭州', value: '杭州' },
  { label: '成都', value: '成都' },
]

export const EXPERIENCE_OPTIONS = [
  { label: '1年以下', value: 1 },
  { label: '1-3年', value: 3 },
  { label: '3-5年', value: 5 },
  { label: '5-10年', value: 10 },
  { label: '10年以上', value: 15 },
]

export const SORT_OPTIONS = [
  { label: '评分高到低', value: 'rating_desc' },
  { label: '价格高到低', value: 'price_desc' },
  { label: '价格低到高', value: 'price_asc' },
  { label: '经验高到低', value: 'hostingExperience_desc' },
  { label: '场次多到少', value: 'sales_desc' },
]

export const PRODUCT_TYPE_OPTIONS = [
  { label: '婚纱摄影', value: PRODUCT_TYPE.PHOTOGRAPHY },
  { label: '婚宴酒店', value: PRODUCT_TYPE.HOTEL },
  { label: '司仪主持', value: PRODUCT_TYPE.HOST },
]

export const PRODUCT_STATUS = {
  OFF_SHELF: 0,
  ON_SHELF: 1,
}

export const PRODUCT_STATUS_OPTIONS = [
  { label: '下架', value: PRODUCT_STATUS.OFF_SHELF },
  { label: '上架', value: PRODUCT_STATUS.ON_SHELF },
]

export const ORDER_BY_OPTIONS = [
  { label: '最新更新', value: 'update_time_desc' },
  { label: '价格从高到低', value: 'price_desc' },
  { label: '价格从低到高', value: 'price_asc' },
  { label: '评分从高到低', value: 'rating_desc' },
  { label: '销量从高到低', value: 'sales_desc' },
]

// 通用表单项目配置
export const COMMON_FORM_RULES = {
  productName: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { max: 100, message: '商品名称不能超过100个字符', trigger: 'blur' },
  ],
  categoryId: [
    { required: true, message: '请选择分类', trigger: 'change', type: 'number' },
  ],
  productType: [
    { required: true, message: '请选择商品类型', trigger: 'change', type: 'number' },
  ],
  price: [
    { type: 'number', required: true, message: '请输入价格', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '价格必须大于0', trigger: 'blur' },
  ],
  description: [
    { max: 500, message: '简短描述不能超过500个字符', trigger: 'blur' },
  ],
}

// 创建时的默认值
export const DEFAULT_PRODUCT = {
  productName: '',
  merchantId: null,
  categoryId: null,
  productType: null,
  price: 0,
  rating: 5.0,
  mainImage: '',
  subImages: '',
  description: '',
  tags: '',
  services: '',
  detail: '',
  stock: null,
  location: '',
  establishmentYears: null,
  status: PRODUCT_STATUS.ON_SHELF,
}

export const DEFAULT_PHOTOGRAPHY_PRODUCT = {
  ...DEFAULT_PRODUCT,
  productType: PRODUCT_TYPE.PHOTOGRAPHY,
  shootingLocations: '',
  costumeCount: null,
  photographerLevel: '',
  photoCount: null,
}

export const DEFAULT_HOTEL_PRODUCT = {
  ...DEFAULT_PRODUCT,
  productType: PRODUCT_TYPE.HOTEL,
  venueSize: null,
  maxTables: null,
  minTables: null,
  cateringStyle: '',
}

export const DEFAULT_HOST_PRODUCT = {
  ...DEFAULT_PRODUCT,
  productType: PRODUCT_TYPE.HOST,
  hostingExperience: null,
  hostingStyle: '',
  languages: '',
}
