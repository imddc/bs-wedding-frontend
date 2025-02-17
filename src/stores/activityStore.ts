import type { Activity } from '~/api/activity/type'
import { defineStore } from 'pinia'
import { ref } from 'vue'
// import { getActivities } from '~/api/activity'

export const useActivityStore = defineStore('activity', () => {
  const activities = ref<Activity[]>([
    {
      id: 1,
      title: '春季徒步活动',
      description: '一起来享受大自然的美景,呼吸新鲜空气!',
      imageUrl: 'https://example.com/spring-hiking.jpg',
      startTime: '2023-03-15 08:00',
      endTime: '2023-03-15 12:00',
      date: '2023-03-15',
      location: '城市森林公园',
      organizer: '户外运动俱乐部',
      tags: ['徒步', '春季'],
      isOnline: false,
      registrationRequired: true,
      registrationLink: 'https://example.com/spring-hiking/register',
      capacity: 50,
      attendeeCount: 28,
    },
    {
      id: 2,
      title: '在线编程课程',
      description: '学习最新的编程语言和框架,提升你的技能!',
      imageUrl: 'https://example.com/online-programming.jpg',
      startTime: '2023-04-01 19:30',
      endTime: '2023-04-01 21:00',
      date: '2023-04-01',
      location: '在线直播间',
      organizer: '程序员之家',
      tags: ['编程', '在线课程'],
      isOnline: true,
      registrationRequired: true,
      registrationLink: 'https://example.com/online-programming/register',
      capacity: 500,
      attendeeCount: 278,
    },
    {
      id: 20,
      title: '冬季滑雪一日游',
      description: '体验速度与激情,享受冬日的快乐时光!',
      imageUrl: 'https://example.com/winter-skiing.jpg',
      startTime: '2023-12-23 07:30',
      endTime: '2023-12-23 17:00',
      date: '2023-12-23',
      location: '雪山滑雪场',
      organizer: '极限运动俱乐部',
      tags: ['滑雪', '冬季'],
      isOnline: false,
      registrationRequired: true,
      registrationLink: 'https://example.com/winter-skiing/register',
      capacity: 100,
      attendeeCount: 85,
    },
  ])

  // const fetchActivities = async () => {
  //   const res = await getActivities()
  //   activities.value = res.data
  // }

  // fetchActivities()

  return {
    activities,
    // fetchActivities,
  }
})
