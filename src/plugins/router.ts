import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { useUserStore } from '~/stores'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 添加全局前置守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  const needAuth = ['/user', '/favorite', '/order', '/weddingPackage']
  if (needAuth.includes(to.path)) {
    if (!userStore.isLoggedIn) {
      next({ path: '/login' })
    }
  }

  // 检查是否是管理员路由
  if (to.path.startsWith('/admin')) {
    const isAdmin = userStore.isAdmin

    if (!isAdmin) {
      // 如果不是管理员，可以重定向到登录页或者显示错误页
      console.log(from)
      next({ path: from.path }) // 或者其他处理方式
      return
    }
  }

  // 不是管理员路由或者是管理员，允许访问
  next()
})

function setupRouter(app: App) {
  app.use(router)
}

export { router, setupRouter }
