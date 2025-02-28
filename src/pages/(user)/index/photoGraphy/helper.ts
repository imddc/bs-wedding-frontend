import type { Studio } from './type'

// Filter options
export const areaOptions = [
  { label: '全部', value: 'all' },
  { label: '朝阳区', value: 'chaoyang' },
  { label: '海淀区', value: 'haidian' },
  { label: '丰台区', value: 'fengtai' },
  { label: '西城区', value: 'xicheng' },
  { label: '东城区', value: 'dongcheng' },
]

export const priceOptions = [
  { label: '全部', value: 'all' },
  { label: '¥5000以下', value: 'under5k' },
  { label: '¥5000-¥10000', value: '5k-10k' },
  { label: '¥10000-¥15000', value: '10k-15k' },
  { label: '¥15000-¥20000', value: '15k-20k' },
  { label: '¥20000以上', value: 'above20k' },
]

// Sort options
export const sortOptions = [
  { label: '推荐排序', value: 'recommend' },
  { label: '人气优先', value: 'popularity' },
  { label: '评分优先', value: 'rating' },
  { label: '价格从低到高', value: 'price-asc' },
  { label: '价格从高到低', value: 'price-desc' },
]

export const mockStudios: Studio[] = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  name: `梦幻婚纱摄影工作室 ${index + 1}`,
  coverImage: `https://picsum.photos/seed/${index + 1}/800/600`,
  subImages: Array.from({ length: 3 }).map((_, i) => `https://picsum.photos/seed/${i + 1}/800/600`),
  location: ['上海', '北京', '广州', '深圳'][Math.floor(Math.random() * 4)],
  priceRange: ['3000以下', '3000-8000', '8000-15000', '15000以上'][Math.floor(Math.random() * 4)],
  rating: 3.5 + Math.random() * 1.5,
  reviewCount: Math.floor(Math.random() * 200) + 50,
  description: '专业的婚纱摄影服务，为您留下最美的回忆。',
}))
