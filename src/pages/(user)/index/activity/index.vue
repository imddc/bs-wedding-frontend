<script setup lang="ts">
import { NButton, NCard, NList, NListItem } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import DefaultLayout from '~/layouts/DefaultLayout.vue'
import { useActivityStore } from '~/stores/activityStore'

const router = useRouter()
const activityStore = useActivityStore()
const { activities } = storeToRefs(activityStore)

function viewActivity(id: number) {
  router.push(`/activity/${id}`)
}
</script>

<template>
  <DefaultLayout>
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">
        活动列表
      </h1>

      <NCard>
        <NList hoverable>
          <NListItem v-for="activity in activities" :key="activity.id">
            <div class="flex-between">
              <div>
                <h2 class="text-xl font-semibold">
                  {{ activity.title }}
                </h2>
                <p class="text-gray-500">
                  {{ activity.date }}
                </p>
              </div>
              <NButton type="primary" @click="viewActivity(activity.id)">
                查看详情
              </NButton>
            </div>
          </NListItem>
        </NList>
      </NCard>
    </div>
  </DefaultLayout>
</template>
