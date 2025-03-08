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

  const needAuth = ['/admin', '/user', '/favorite', '/order']
  if (needAuth.includes(to.path)) {
    if (!userStore.isLoggedIn) {
      next({ path: '/login' })
    }
  }

  // 检查是否是管理员路由
  if (to.path.startsWith('/admin')) {
    // 这里可以调用你的检查管理员权限的方法
    // 例如: const isAdmin = await checkIsAdmin()
    const isAdmin = userStore.isAdmin // 这里替换成你的管理员验证逻辑

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
