import { h } from 'vue'
import type { StudioRankData } from './type'

// Icons (SVG components)
export const HeartIcon = {
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      width: '24',
      height: '24',
    }, [
      h('path', {
        d: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
      }),
    ])
  },
}

export const FireIcon = {
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      width: '24',
      height: '24',
      fill: 'currentColor',
    }, [
      h('path', {
        d: 'M17.66 11.2c-.23-.3-.51-.56-.77-.82-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-.95.23-1.78.75-2.49 1.32-2.59 2.08-3.61 5.75-2.39 8.9.04.1.08.2.08.33 0 .22-.15.42-.35.5-.23.1-.47.04-.66-.12a.58.58 0 01-.14-.17c-1.13-1.43-1.31-3.48-.55-5.12C5.78 10 4.87 12.3 5 14.47c.06.5.12 1 .29 1.5.14.6.41 1.2.71 1.73 1.08 1.73 2.95 2.97 4.96 3.22 2.14.27 4.43-.12 6.07-1.6 1.83-1.66 2.47-4.32 1.53-6.6l-.13-.26c-.21-.46-.77-1.26-.77-1.26m-3.16 6.3c-.28.24-.74.5-1.1.6-1.12.4-2.24-.16-2.9-.82 1.19-.28 1.9-1.16 2.11-2.05.17-.8-.15-1.46-.28-2.23-.12-.74-.1-1.37.17-2.06.19.38.39.76.63 1.06.77 1 1.98 1.44 2.24 2.8.04.14.06.28.06.43.03.82-.33 1.72-.93 2.27z',
      }),
    ])
  },
}

export const ChevronRightIcon = {
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      width: '24',
      height: '24',
      fill: 'currentColor',
    }, [
      h('path', {
        d: 'M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z',
      }),
    ])
  },
}

/**
 * rank list
 */
export const studioRankList: StudioRankData[] = [
  {
    rank: '1',
    logo: '',
    name: '水晶之恋婚纱摄影（影视基地总店）',
    price: '¥6999起',
    reviewCount: '819评价',
    area: '丰台区',
    rating: '5.8分',
    type: 'blue',
  },
  {
    rank: '2',
    logo: '',
    name: '北京蒙娜丽莎婚纱摄影(总店)',
    price: '¥6599起',
    reviewCount: '386评价',
    area: '朝阳区',
    rating: '4.8分',
    type: 'blue',
  },
  {
    rank: '3',
    logo: '',
    name: '韩国匠艺婚纱摄影',
    price: '¥4998起',
    reviewCount: '166评价',
    area: '朝阳区',
    rating: '4.7分',
    type: 'gold',
  },
  {
    logo: '',
    name: '城市花园婚纱摄影',
    price: '¥8699起',
    reviewCount: '697评价',
    area: '丰台区',
    rating: '4.7分',
    type: 'gold',
  },
  {
    logo: '',
    name: '北京金夫人婚纱摄影',
    price: '¥7299起',
    reviewCount: '205评价',
    area: '东城区',
    rating: '4.6分',
    type: 'gold',
  },
]
