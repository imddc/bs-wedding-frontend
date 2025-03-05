import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Activity } from '~/api/activity/type'
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
