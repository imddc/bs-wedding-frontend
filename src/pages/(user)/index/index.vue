<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NCarousel, NModal } from 'naive-ui'

// Import components
import ServiceCard from '~/components/home/ServiceCard.vue'
import FeatureItem from '~/components/home/FeatureItem.vue'
import TestimonialSlide from '~/components/home/TestimonialSlide.vue'
import StatisticItem from '~/components/home/StatisticItem.vue'
import RegisterForm from '~/components/home/RegisterForm.vue'

import Browser from '~/components/photography/Browser.vue'
import { testimonials } from './helper'

const router = useRouter()
const showRegisterModal = ref(false)
// Navigation functions
function navigateTo(path: string) {
  router.push(path)
}

function scrollToServices() {
  const servicesSection = document.getElementById('browser')
  if (servicesSection) {
    servicesSection.scrollIntoView({ behavior: 'smooth' })
  }
}

// Handle register success
function handleRegisterSuccess() {
  showRegisterModal.value = false
  // Show success message or redirect
}

// Lifecycle hooks
onMounted(() => {
  // Any initialization code
})
</script>

<template>
  <div class="overflow-x-hidden space-y-4">
    <!-- Hero Section with Video Background -->
    <section class="relative h-[40vh]">
      <video
        class="absolute inset-0 w-full h-full object-cover"
        autoplay
        loop
        muted
        playsinline
      >
        <!-- <source src="/videos/wedding-hero.mp4" type="video/mp4"> -->
      </video>
      <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70" />

      <div class="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
        <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
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

    <Browser id="browser" />

    <!-- Main Services Section -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            完整婚礼服务
          </h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            我们提供一站式的婚礼筹备服务，从婚纱摄影到宴会场地，从司仪主持到婚礼方案，全方位满足您的需求。
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Photography Service -->
          <ServiceCard
            title="婚纱摄影"
            description="专业摄影团队，捕捉您最美丽的瞬间，留下永恒回忆。"
            icon="Camera"
            image="/images/photography-cover.jpg"
            :stats="[
              { label: '摄影师数量', value: '500+' },
              { label: '服务评分', value: '4.9' },
              { label: '套餐选择', value: '多样化' },
            ]"
            button-text="浏览摄影服务"
            @click="navigateTo('/photography')"
          />

          <!-- Hotel Service -->
          <ServiceCard
            title="婚宴酒店"
            description="精选高品质宴会场地，为您打造难忘的婚礼盛宴。"
            icon="Home"
            image="/images/hotel-cover.jpg"
            :stats="[
              { label: '合作酒店', value: '300+' },
              { label: '服务评分', value: '4.8' },
              { label: '场地类型', value: '多样化' },
            ]"
            button-text="查找婚宴场地"
            @click="navigateTo('/hotel')"
          />

          <!-- Host Service -->
          <ServiceCard
            title="司仪主持"
            description="专业婚礼司仪，掌控婚礼流程，营造温馨欢乐的氛围。"
            icon="Mic"
            image="/images/host-cover.jpg"
            :stats="[
              { label: '主持人数量', value: '200+' },
              { label: '服务评分', value: '4.8' },
              { label: '主持风格', value: '多样化' },
            ]"
            button-text="寻找婚礼司仪"
            @click="navigateTo('/host')"
          />
        </div>
      </div>
    </section>

    <!-- Wedding Plan Feature -->
    <section class="py-20 bg-gradient-to-r from-pink-50 to-purple-50">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row items-center gap-12">
          <div class="lg:w-1/2">
            <div class="relative">
              <img
                src=""
                alt="婚礼方案"
                class="w-full max-w-md mx-auto lg:mx-0 rounded-lg shadow-xl"
              >
              <div class="absolute -right-4 -bottom-4 w-40 h-40 bg-pink-100 rounded-full -z-10" />
              <div class="absolute -left-4 -top-4 w-24 h-24 bg-purple-100 rounded-full -z-10" />
            </div>
          </div>

          <div class="lg:w-1/2">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              定制专属婚礼方案
            </h2>
            <p class="text-lg text-gray-600 mb-8">
              通过智能方案推荐，您只需填写婚礼城市、日期和预算，我们就能为您量身定制完美婚礼方案，省时省力，轻松搞定婚礼筹备。
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <FeatureItem
                title="智能推荐"
                icon="Sparkles"
                description="基于您的需求智能匹配最适合的供应商"
              />
              <FeatureItem
                title="预算控制"
                icon="Wallet"
                description="合理分配婚礼预算，避免超支"
              />
              <FeatureItem
                title="时间规划"
                icon="Calendar"
                description="定制详细的婚礼筹备时间线"
              />
              <FeatureItem
                title="一键预订"
                icon="CheckSquare"
                description="所有服务一站式预订，省心省力"
              />
            </div>

            <NButton
              type="primary"
              size="large"
              @click="navigateTo('/wedding-plan')"
            >
              创建我的婚礼方案
            </NButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
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
          <TestimonialSlide
            v-for="testimonial in testimonials"
            :key="testimonial.id"
            :testimonial="testimonial"
          />
        </NCarousel>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="py-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <StatisticItem
            number="10,000+"
            label="成功案例"
            icon="CheckCircle"
          />
          <StatisticItem
            number="1,000+"
            label="合作供应商"
            icon="Users"
          />
          <StatisticItem
            number="98%"
            label="客户满意度"
            icon="ThumbsUp"
          />
          <StatisticItem
            number="24/7"
            label="专业客服"
            icon="HeadphonesIcon"
          />
        </div>
      </div>
    </section>

    <!-- Promotion Section -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-8 md:p-12">
          <div class="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                新用户专享优惠
              </h2>
              <p class="text-lg text-gray-600 mb-6">
                注册即可获得¥500优惠券礼包，适用于平台所有服务，立即开启您的完美婚礼之旅！
              </p>
              <NButton
                type="primary"
                size="large"
                @click="showRegisterModal = true"
              >
                立即注册
              </NButton>
            </div>

            <div class="hidden lg:block">
              <img
                src=""
                alt="新用户礼包"
                class="max-w-xs"
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Start Planning Section -->
    <section class="py-20 bg-gradient-to-r from-pink-50 to-purple-50">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          准备好开启您的婚礼之旅了吗？
        </h2>
        <p class="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
          无论您是刚刚订婚还是已经开始筹备婚礼，我们都能为您提供全方位的支持和服务。
        </p>

        <div class="flex flex-wrap justify-center gap-4">
          <NButton
            type="primary"
            size="large"
            @click="navigateTo('/wedding-plan')"
          >
            创建婚礼方案
          </NButton>
          <NButton
            type="default"
            size="large"
            @click="navigateTo('/services')"
          >
            浏览所有服务
          </NButton>
        </div>
      </div>
    </section>

    <!-- Register Modal -->
    <NModal v-model:show="showRegisterModal">
      <RegisterForm @success="handleRegisterSuccess" @cancel="showRegisterModal = false" />
    </NModal>
  </div>
</template>
