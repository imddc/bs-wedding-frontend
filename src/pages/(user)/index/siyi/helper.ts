// Filter options
export const priceOptions = [
  { label: '不限', value: 'all' },
  { label: '3000元以下', value: 'under3000' },
  { label: '3000-5000元', value: '3000to5000' },
  { label: '5000-8000元', value: '5000to8000' },
  { label: '8000元以上', value: 'above8000' },
]

export const experienceOptions = [
  { label: '不限', value: 'all' },
  { label: '3年以下', value: 'under3' },
  { label: '3-5年', value: '3to5' },
  { label: '5-10年', value: '5to10' },
  { label: '10年以上', value: 'above10' },
]

export const sortOptions = [
  { label: '综合排序', value: 'comprehensive' },
  { label: '价格优先', value: 'price' },
  { label: '好评优先', value: 'rating' },
  { label: '经验优先', value: 'experience' },
]

// Hosts data
export const hosts = [
  {
    id: 1,
    name: '张明',
    image: '/images/hosts/host1.jpg',
    rating: 4.9,
    reviewCount: 328,
    price: 5800,
    tags: ['幽默风趣', '知名主持'],
    weddingCount: 586,
    experience: 8,
    style: 'humor',
  },
  {
    id: 2,
    name: '李婷',
    image: '/images/hosts/host2.jpg',
    rating: 4.8,
    reviewCount: 256,
    price: 6200,
    tags: ['温馨感人', '资深主持'],
    weddingCount: 420,
    experience: 7,
    style: 'warm',
  },
  {
    id: 3,
    name: '王浩',
    image: '/images/hosts/host3.jpg',
    rating: 4.7,
    reviewCount: 189,
    price: 4800,
    tags: ['庄重大气', '人气主持'],
    weddingCount: 320,
    experience: 5,
    style: 'elegant',
  },
  {
    id: 4,
    name: '陈青',
    image: '/images/hosts/host4.jpg',
    rating: 4.9,
    reviewCount: 412,
    price: 8600,
    tags: ['知名主持', '电视主持'],
    weddingCount: 723,
    experience: 12,
    style: 'elegant',
  },
  {
    id: 5,
    name: '刘阳',
    image: '/images/hosts/host5.jpg',
    rating: 4.6,
    reviewCount: 167,
    price: 3800,
    tags: ['活力青春', '新锐主持'],
    weddingCount: 213,
    experience: 3,
    style: 'energetic',
  },
  {
    id: 6,
    name: '赵雪',
    image: '/images/hosts/host6.jpg',
    rating: 4.8,
    reviewCount: 284,
    price: 4200,
    tags: ['温馨感人', '资深主持'],
    weddingCount: 376,
    experience: 6,
    style: 'warm',
  },
  // Add more hosts data as needed
]
