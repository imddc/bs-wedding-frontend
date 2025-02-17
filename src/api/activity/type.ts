export interface Activity {
  id: number // 活动的唯一标识符
  title: string // 活动的标题
  description: string // 活动的详细描述
  imageUrl: string // 活动的图片URL
  startTime: string // 活动的开始时间
  endTime: string // 活动的结束时间
  date: string // 活动的日期
  location: string // 活动的地点
  organizer: string // 活动的组织者
  tags: string[] // 活动的标签数组
  isOnline: boolean // 是否是线上活动
  registrationRequired: boolean // 是否需要注册
  registrationLink: string // 注册链接
  capacity: number // 活动的容量
  attendeeCount: number // 已报名的人数
}
