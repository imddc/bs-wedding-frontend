import { ref, unref } from 'vue'
import type { MaybeRef } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '~/stores'
import { createOrder } from '~/api/order'
import type { OrdersCreateParams } from '~/api/order/type'
import OrderCreateModal from './index.vue'

export default OrderCreateModal

interface UseOrderCreateModalProps {
  productId: MaybeRef<number>
  merchantId: MaybeRef<number>
}

export function useOrderCreateModal({ productId, merchantId }: UseOrderCreateModalProps) {
  const router = useRouter()
  const userStore = useUserStore()

  const show = ref(false)
  const submitting = ref(false)

  async function confirm(data: Pick<OrdersCreateParams, 'weddingDate' | 'remark'>) {
    submitting.value = true
    try {
      const order = {
        ...data,
        userId: userStore.userInfo?.id ?? 0,
        merchantId: unref(merchantId),
        productId: unref(productId),
      }

      const response = await createOrder(order)
      if (response.success) {
        window.$message.success('预约成功')
        setTimeout(() => {
          show.value = false
          router.push(`/order/${response.data}`)
        }, 500)
      } else {
        window.$message.error('预约失败')
      }
    } catch (error) {
      console.error('预约失败:', error)
      window.$message.error('预约失败')
    } finally {
      submitting.value = false
    }
  }

  const open = () => {
    show.value = true
  }

  const close = () => {
    show.value = false
  }

  const cancel = () => {
    close()
  }

  return {
    show,
    submitting,
    open,
    close,
    confirm,
    cancel,
  }
}
