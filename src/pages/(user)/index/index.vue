<!-- src/views/HomePage.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NCarousel, NCarouselItem } from 'naive-ui'
import {
  Calendar,
  Camera,
  CheckCircle,
  CheckSquare,
  Headphones,
  Home as HotelIcon,
  Mic,
  Sparkles,
  ThumbsUp,
  Users,
  Wallet,
} from 'lucide-vue-next'

const router = useRouter()

// Navigation functions
function navigateTo(path: string) {
  router.push(path)
}

function scrollToServices() {
  const servicesSection = document.getElementById('services-section')
  if (servicesSection) {
    servicesSection.scrollIntoView({ behavior: 'smooth' })
  }
}

// 客户见证数据
const testimonials = [
  {
    id: 1,
    name: '张先生 & 李女士',
    location: '北京',
    image: '/src/assets/couple1.jpg',
    quote: '非常感谢良缘喜事团队的帮助，让我们的婚礼如此完美。摄影团队捕捉了每一个珍贵的瞬间，酒店的布置也超出了我们的期望。',
    rating: 5,
  },
  {
    id: 2,
    name: '王先生 & 赵女士',
    location: '上海',
    image: '/src/assets/couple2.jpg',
    quote: '从婚纱摄影到司仪主持，每一项服务都非常专业。婚礼当天所有流程都很顺畅，让我们真正享受了这个特别的日子。',
    rating: 5,
  },
  {
    id: 3,
    name: '刘先生 & 陈女士',
    location: '广州',
    image: '/src/assets/couple3.jpg',
    quote: '定制婚礼方案服务真的很棒，根据我们的预算给出了很多实用的建议。最后的婚礼效果比我们想象的还要好。',
    rating: 4.5,
  },
]

onMounted(() => {
  // Any initialization code
})
</script>

<template>
  <div class="home-container">
    <!-- 英雄区域 -->
    <section class="relative h-[600px] overflow-hidden">
      <img src="/src/assets/banner.png" alt="婚礼背景" class="w-full h-full object-cover absolute">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70 z-0" />
      <div class="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
        <h1 class="text-4xl md:text-6xl font-bold text-white mb-6 font-serif">
          开启您的完美婚礼之旅
        </h1>
        <p class="text-xl md:text-2xl text-white mb-8">
          一站式婚礼服务平台，让您的婚礼准备轻松愉快
        </p>

        <NButton
          type="primary"
          size="large"
          class="text-lg px-8 py-6"
          @click="scrollToServices"
        >
          开始探索
        </NButton>
      </div>
    </section>

    <!-- 主要服务区域 -->
    <section id="services-section" class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-serif">
            完整婚礼服务
          </h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            我们提供一站式的婚礼筹备服务，从婚纱摄影到宴会场地，从司仪主持到婚礼方案，全方位满足您的需求。
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- 婚纱摄影服务 -->
          <div class="service-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div class="relative h-48 bg-red-50 overflow-hidden">
              <div class="absolute inset-0 flex items-center justify-center">
                <Camera class="h-20 w-20 text-red-200" />
              </div>
              <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-red-600 to-transparent">
                <h3 class="text-xl font-bold text-white">
                  婚纱摄影
                </h3>
              </div>
            </div>
            <div class="p-6">
              <p class="text-gray-600 mb-6">
                专业摄影团队，捕捉您最美丽的瞬间，留下永恒回忆。风格多样，满足个性化需求。
              </p>
              <div class="grid grid-cols-3 gap-2 mb-6">
                <div class="text-center">
                  <div class="text-red-600 font-bold">
                    500+
                  </div>
                  <div class="text-xs text-gray-500">
                    摄影师数量
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-red-600 font-bold">
                    4.9
                  </div>
                  <div class="text-xs text-gray-500">
                    服务评分
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-red-600 font-bold">
                    多样化
                  </div>
                  <div class="text-xs text-gray-500">
                    套餐选择
                  </div>
                </div>
              </div>
              <NButton
                type="primary"
                color="#D32029"
                block
                @click="navigateTo('/photography')"
              >
                浏览摄影服务
              </NButton>
            </div>
          </div>

          <!-- 婚宴酒店服务 -->
          <div class="service-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div class="relative h-48 bg-amber-50 overflow-hidden">
              <div class="absolute inset-0 flex items-center justify-center">
                <HotelIcon class="h-20 w-20 text-amber-200" />
              </div>
              <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-amber-600 to-transparent">
                <h3 class="text-xl font-bold text-white">
                  婚宴酒店
                </h3>
              </div>
            </div>
            <div class="p-6">
              <p class="text-gray-600 mb-6">
                精选高品质宴会场地，为您打造难忘的婚礼盛宴。多种场地类型，满足不同规模需求。
              </p>
              <div class="grid grid-cols-3 gap-2 mb-6">
                <div class="text-center">
                  <div class="text-amber-600 font-bold">
                    300+
                  </div>
                  <div class="text-xs text-gray-500">
                    合作酒店
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-amber-600 font-bold">
                    4.8
                  </div>
                  <div class="text-xs text-gray-500">
                    服务评分
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-amber-600 font-bold">
                    多样化
                  </div>
                  <div class="text-xs text-gray-500">
                    场地类型
                  </div>
                </div>
              </div>
              <NButton
                type="primary"
                color="#D97706"
                block
                @click="navigateTo('/hotel')"
              >
                查找婚宴场地
              </NButton>
            </div>
          </div>

          <!-- 司仪主持服务 -->
          <div class="service-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div class="relative h-48 bg-indigo-50 overflow-hidden">
              <div class="absolute inset-0 flex items-center justify-center">
                <Mic class="h-20 w-20 text-indigo-200" />
              </div>
              <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-indigo-600 to-transparent">
                <h3 class="text-xl font-bold text-white">
                  司仪主持
                </h3>
              </div>
            </div>
            <div class="p-6">
              <p class="text-gray-600 mb-6">
                专业婚礼司仪，掌控婚礼流程，营造温馨欢乐的氛围。多种主持风格，呈现完美仪式。
              </p>
              <div class="grid grid-cols-3 gap-2 mb-6">
                <div class="text-center">
                  <div class="text-indigo-600 font-bold">
                    200+
                  </div>
                  <div class="text-xs text-gray-500">
                    主持人数量
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-indigo-600 font-bold">
                    4.8
                  </div>
                  <div class="text-xs text-gray-500">
                    服务评分
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-indigo-600 font-bold">
                    多样化
                  </div>
                  <div class="text-xs text-gray-500">
                    主持风格
                  </div>
                </div>
              </div>
              <NButton
                type="primary"
                color="#4F46E5"
                block
                @click="navigateTo('/host')"
              >
                寻找婚礼司仪
              </NButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 定制婚礼方案 -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row items-center gap-12">
          <div class="lg:w-1/2">
            <div class="relative">
              <div class="rounded-lg overflow-hidden bg-gradient-to-r from-red-50 to-pink-50 h-80 flex items-center justify-center">
                <div class="text-8xl text-pink-200 font-serif">
                  喜
                </div>
              </div>
              <div class="absolute -right-4 -bottom-4 w-40 h-40 bg-pink-100 rounded-full -z-10" />
              <div class="absolute -left-4 -top-4 w-24 h-24 bg-purple-100 rounded-full -z-10" />
            </div>
          </div>

          <div class="lg:w-1/2">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-6 font-serif">
              定制专属婚礼方案
            </h2>
            <p class="text-lg text-gray-600 mb-8">
              通过智能方案推荐，您只需填写婚礼城市、日期和预算，我们就能为您量身定制完美婚礼方案，省时省力，轻松搞定婚礼筹备。
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div class="flex items-start">
                <div class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-pink-100 mr-3">
                  <Sparkles class="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-800 mb-1">
                    智能推荐
                  </h3>
                  <p class="text-gray-600">
                    基于您的需求智能匹配最适合的供应商
                  </p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-pink-100 mr-3">
                  <Wallet class="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-800 mb-1">
                    预算控制
                  </h3>
                  <p class="text-gray-600">
                    合理分配婚礼预算，避免超支
                  </p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-pink-100 mr-3">
                  <Calendar class="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-800 mb-1">
                    时间规划
                  </h3>
                  <p class="text-gray-600">
                    定制详细的婚礼筹备时间线
                  </p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-pink-100 mr-3">
                  <CheckSquare class="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-800 mb-1">
                    一键预订
                  </h3>
                  <p class="text-gray-600">
                    所有服务一站式预订，省心省力
                  </p>
                </div>
              </div>
            </div>

            <NButton
              type="primary"
              size="large"
              color="#E11D48"
              @click="navigateTo('/custom')"
            >
              创建我的婚礼方案
            </NButton>
          </div>
        </div>
      </div>
    </section>

    <!-- 客户见证 -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-serif">
            幸福新人的分享
          </h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            听听已经使用我们服务的新人们怎么说，他们的真实体验和分享。
          </p>
        </div>

        <NCarousel
          show-arrow
          dot-type="line"
          effect="fade"
          class="max-w-5xl mx-auto"
        >
          <NCarouselItem v-for="item in testimonials" :key="item.id">
            <div class="bg-white p-8 rounded-lg shadow-md">
              <div class="flex flex-col md:flex-row gap-8 items-center">
                <div class="md:w-1/3 flex justify-center">
                  <div class="w-48 h-48 rounded-full overflow-hidden border-4 border-pink-100">
                    <img :src="item.image" :alt="item.name" class="w-full h-full object-cover">
                  </div>
                </div>
                <div class="md:w-2/3">
                  <div class="flex items-center mb-3">
                    <div v-for="i in 5" :key="i" class="text-yellow-400">
                      <span v-if="i <= Math.floor(item.rating)">★</span>
                      <span v-else-if="i - 0.5 === Math.floor(item.rating)">★</span>
                      <span v-else>☆</span>
                    </div>
                  </div>
                  <p class="text-gray-600 text-lg italic mb-6">
                    "{{ item.quote }}"
                  </p>
                  <div>
                    <p class="font-bold text-gray-800">
                      {{ item.name }}
                    </p>
                    <p class="text-gray-500">
                      {{ item.location }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </NCarouselItem>
        </NCarousel>
      </div>
    </section>

    <!-- 统计数据 -->
    <section class="py-16 bg-gradient-to-r from-red-600 to-pink-600 text-white">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div class="flex flex-col items-center">
            <div class="mb-3">
              <CheckCircle class="h-10 w-10" />
            </div>
            <div class="text-3xl font-bold mb-1">
              10,000+
            </div>
            <div class="text-white opacity-80">
              成功案例
            </div>
          </div>

          <div class="flex flex-col items-center">
            <div class="mb-3">
              <Users class="h-10 w-10" />
            </div>
            <div class="text-3xl font-bold mb-1">
              1,000+
            </div>
            <div class="text-white opacity-80">
              合作供应商
            </div>
          </div>

          <div class="flex flex-col items-center">
            <div class="mb-3">
              <ThumbsUp class="h-10 w-10" />
            </div>
            <div class="text-3xl font-bold mb-1">
              98%
            </div>
            <div class="text-white opacity-80">
              客户满意度
            </div>
          </div>

          <div class="flex flex-col items-center">
            <div class="mb-3">
              <Headphones class="h-10 w-10" />
            </div>
            <div class="text-3xl font-bold mb-1">
              24/7
            </div>
            <div class="text-white opacity-80">
              专业客服
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 新用户专享 -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-8 md:p-12">
          <div class="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-4 font-serif">
                新用户专享优惠
              </h2>
              <p class="text-lg text-gray-600 mb-6">
                注册即可获得¥500优惠券礼包，适用于平台所有服务，立即开启您的完美婚礼之旅！
              </p>
              <NButton
                type="primary"
                size="large"
                color="#E11D48"
                @click="navigateTo('/register')"
              >
                立即注册
              </NButton>
            </div>

            <div class="hidden lg:flex items-center justify-center">
              <div class="w-32 h-32 rounded-full bg-white flex items-center justify-center p-4">
                <div class="text-4xl font-bold text-red-600 font-serif">
                  喜礼
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 开始计划 -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-6 font-serif">
          准备好开启您的婚礼之旅了吗？
        </h2>
        <p class="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
          无论您是刚刚订婚还是已经开始筹备婚礼，我们都能为您提供全方位的支持和服务。
        </p>

        <div class="flex flex-wrap justify-center gap-4">
          <NButton
            type="primary"
            size="large"
            color="#E11D48"
            @click="navigateTo('/custom')"
          >
            创建婚礼方案
          </NButton>
          <NButton
            type="default"
            size="large"
            @click="scrollToServices"
          >
            浏览所有服务
          </NButton>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-container {
  background-color: #f9f8f6;
}

.font-serif {
  font-family: 'STZhongsong', 'SimSun', serif;
}

.service-card {
  transition: all 0.3s ease;
}

.service-card:hover {
  transform: translateY(-5px);
}

/* 自定义轮播样式 */
:deep(.n-carousel-dots) {
  margin-top: 16px;
}

:deep(.n-carousel-dots-line .n-carousel-dot.n-carousel-dot--active) {
  width: 24px;
  background-color: #e11d48;
}
</style>
