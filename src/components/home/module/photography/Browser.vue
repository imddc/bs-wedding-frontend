<script setup lang="ts">
import { NButton } from 'naive-ui'
import { ChevronRightIcon, FireIcon, HeartIcon, studioRankList } from './helper'

// Import icons and components
import StudioRankItem from './StudioRankItem.vue'
</script>

<template>
  <div class="wedding-photography-browse container mx-auto py-3">
    <!-- Page Header -->
    <div class="page-header">
      <h1 class="text-2xl font-bold">
        拍婚纱照
      </h1>
    </div>

    <!-- Main Content Area -->
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Left Content: Featured Studios -->
      <div class="w-full lg:w-3/4">
        <div class="bg-white rounded-lg p-6 shadow-sm">
          <!-- Section Title -->
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold">
              推荐作品
            </h2>
            <div class="flex">
              <div class="pagination-dots">
                <span class="dot active" />
                <span class="dot" />
                <span class="dot" />
              </div>
            </div>
          </div>

          <!-- Featured Studio Carousel -->
          <div class="featured-carousel relative">
            <div class="featured-item">
              <div class="mb-4">
                <div class="relative rounded-lg overflow-hidden">
                  <img
                    src=""
                    alt="草坪婚纱照"
                    class="w-full h-96 object-cover"
                  >

                  <!-- Caption -->
                  <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                    <h3 class="text-lg font-bold mb-1">
                      这组草坪森系婚纱照也太治愈了吧！
                    </h3>
                    <div class="text-sm bg-gray-800/50 w-fit px-2 py-1 rounded">
                      草坪森系
                    </div>
                  </div>
                </div>
              </div>

              <!-- Studio Info Card -->
              <div class="studio-card flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                <div class="flex items-center">
                  <div class="w-12 h-12 mr-3">
                    <img
                      src=""
                      alt="水晶之恋"
                      class="w-full h-full object-contain"
                    >
                  </div>
                  <div>
                    <h4 class="font-bold">
                      水晶之恋婚纱摄影（影视基地总店）
                    </h4>
                    <div class="flex items-center mt-1">
                      <span class="inline-flex items-center bg-blue-50 text-blue-600 rounded px-2 py-1 text-xs mr-2">
                        <HeartIcon class="w-3 h-3 mr-1 fill-blue-600" />
                        评分 5.0分
                      </span>
                      <span class="text-gray-400 text-xs">无预订</span>
                      <div class="ml-2 px-2 py-1 text-xs text-amber-600 bg-amber-50 rounded">
                        人气商家榜第1名
                      </div>
                    </div>
                  </div>
                </div>

                <NButton type="primary" size="small" class="view-btn">
                  进店看看
                </NButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Sidebar: Rankings -->
      <div class="w-full lg:w-1/4">
        <div class="bg-white rounded-lg p-6 shadow-sm h-full">
          <!-- Ranking Title -->
          <div class="flex justify-between items-center mb-4">
            <h2 class="flex items-center text-lg font-bold">
              <FireIcon class="w-5 h-5 mr-2 text-red-500" />
              人气榜单
            </h2>
            <NButton text type="primary" class="text-sm">
              查看更多
              <template #icon>
                <ChevronRightIcon class="w-4 h-4" />
              </template>
            </NButton>
          </div>

          <!-- Ranking List -->
          <div class="space-y-4 h-full">
            <StudioRankItem
              v-for="studio in studioRankList"
              :key="studio.name"
              v-bind="studio"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  padding: 1rem 0;
  margin-bottom: 1rem;
}

.pagination-dots {
  display: flex;
  gap: 0.5rem;
}

.dot {
  height: 8px;
  width: 8px;
  background-color: #e5e7eb;
  border-radius: 50%;
  display: inline-block;
}

.dot.active {
  background-color: #ef4444;
  width: 24px;
  border-radius: 4px;
}

.studio-card {
  border-top: 1px solid #f3f4f6;
}

.view-btn {
  border-radius: 20px;
  padding: 0 1rem;
}
</style>
