<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NPagination, NTag, useMessage } from 'naive-ui'
import StudioListItem from '~/components/photography/StudioListItem.vue'
import { areaOptions, mockStudios, priceOptions } from './helper'
import type { Studio } from './type'

// // Import services
// import { PhotographyService } from '~/services/PhotographyService'

// // Import types
// import type { Studio } from '~/types/photography'

const route = useRoute()
const router = useRouter()
const message = useMessage()

// Pagination
const currentPage = ref(1)
const pageSize = ref(12)
const totalStudios = ref(0)

// Filter and sort
const selectedArea = ref('all')
const selectedPrice = ref('all')
const sortOption = ref('recommend')
const viewMode = ref('grid')

// Studios data
const studios = ref<Studio[]>([])
const loading = ref(false)

// Methods
async function loadStudios() {
  loading.value = true

  try {
    // const filters = {
    //   area: selectedArea.value !== 'all' ? selectedArea.value : undefined,
    //   priceRange: selectedPrice.value !== 'all' ? selectedPrice.value : undefined,
    //   page: currentPage.value,
    //   pageSize: pageSize.value,
    //   sortBy: sortOption.value,
    // }

    // const response = await PhotographyService.searchStudios(filters)

    const response = { data: mockStudios }

    // studios.value = response.data.studios
    // totalStudios.value = response.data.total
    studios.value = response.data
    totalStudios.value = response.data.length
  } catch (error) {
    message.error('加载婚纱摄影工作室数据失败')
    console.error('Error loading studios:', error)
  } finally {
    loading.value = false
  }
}

function selectArea(area: string) {
  selectedArea.value = area
  currentPage.value = 1
  updateRouteQuery()
  loadStudios()
}

function selectPrice(price: string) {
  selectedPrice.value = price
  currentPage.value = 1
  updateRouteQuery()
  loadStudios()
}

function handlePageChange(page: number) {
  currentPage.value = page
  updateRouteQuery()
  loadStudios()
}

function handlePageSizeChange(size: number) {
  pageSize.value = size
  currentPage.value = 1
  updateRouteQuery()
  loadStudios()
}

function viewStudioDetail(studioId: number) {
  router.push(`/photography/${studioId}`)
}

// Update URL query parameters
function updateRouteQuery() {
  router.push({
    query: {
      area: selectedArea.value !== 'all' ? selectedArea.value : undefined,
      price: selectedPrice.value !== 'all' ? selectedPrice.value : undefined,
      sort: sortOption.value !== 'recommend' ? sortOption.value : undefined,
      page: currentPage.value > 1 ? currentPage.value.toString() : undefined,
      pageSize: pageSize.value !== 12 ? pageSize.value.toString() : undefined,
      view: viewMode.value !== 'grid' ? viewMode.value : undefined,
    },
  })
}

// Sync URL query parameters to component state
function syncQueryToState() {
  const query = route.query

  selectedArea.value = query.area?.toString() || 'all'
  selectedPrice.value = query.price?.toString() || 'all'
  sortOption.value = query.sort?.toString() || 'recommend'
  currentPage.value = Number.parseInt(query.page?.toString() || '1')
  pageSize.value = Number.parseInt(query.pageSize?.toString() || '12')
  viewMode.value = query.view?.toString() || 'grid'
}

// Watch for URL changes
watch(() => route.query, () => {
  syncQueryToState()
  loadStudios()
}, { deep: true })

// Initialize
onMounted(() => {
  syncQueryToState()
  loadStudios()
})
</script>

<template>
  <div class="photography-list-page container mx-auto mt-8">
    <!-- Search and Filter Bar -->
    <div class="search-filter-bar bg-white p-4 rounded-lg shadow-sm mb-6">
      <div>
        <!-- Location Filter -->
        <div class="filter-group">
          <span class="text-gray-600 mr-2">区域:</span>
          <div class="filter-options flex flex-wrap gap-2">
            <NTag
              v-for="(area, index) in areaOptions"
              :key="index"
              :type="selectedArea === area.value ? 'primary' : 'default'"
              :bordered="false"
              class="cursor-pointer hover:bg-gray-100"
              @click="selectArea(area.value)"
            >
              {{ area.label }}
            </NTag>
          </div>
        </div>

        <!-- Price Filter -->
        <div class="filter-group mt-2">
          <span class="text-gray-600 mr-2">价格:</span>
          <div class="filter-options flex flex-wrap gap-2">
            <NTag
              v-for="(price, index) in priceOptions"
              :key="index"
              :type="selectedPrice === price.value ? 'primary' : 'default'"
              :bordered="false"
              class="cursor-pointer hover:bg-gray-100"
              @click="selectPrice(price.value)"
            >
              {{ price.label }}
            </NTag>
          </div>
        </div>
      </div>

      <!-- Sort Options -->
      <div class="sort-options mt-4 flex justify-between items-center border-t border-gray-100 pt-4">
        <div class="text-gray-500 text-sm">
          共 <span class="text-primary font-bold">{{ totalStudios }}</span> 个婚纱摄影工作室
        </div>
      </div>
    </div>

    <!-- Studio List -->
    <div class="studio-list mb-6">
      <!-- List View -->
      <div class="flex flex-col gap-4">
        <StudioListItem
          v-for="studio in studios"
          :key="studio.id"
          :studio="studio"
          @click="viewStudioDetail(studio.id)"
        />
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination flex justify-center my-8">
      <NPagination
        v-model:page="currentPage"
        :page-sizes="[12, 24, 36]"
        :page-size="pageSize"
        :item-count="totalStudios"
        show-quick-jumper
        show-size-picker
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </div>
  </div>
</template>

<style scoped>
.filter-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .filter-group {
    width: 100%;
  }
}
</style>
