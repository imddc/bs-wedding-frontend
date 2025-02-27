import axios from 'axios'

// Response interface
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// Order interface
export interface Order {
  id: number
  orderNo: string
  status: number
  productName: string
  productDescription: string
  productImage: string
  type: string
  vendorId: number
  totalAmount: number
  serviceDate: string
  createdTime: string
  hasReview: boolean
}

// Review interface
export interface Review {
  id: number
  orderId: number
  rating: number
  content: string
  images: string[]
  anonymous: boolean
  createdTime: string
}

// Configure axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export const OrderService = {
  // Get orders
  getOrders(): Promise<ApiResponse<Order[]>> {
    return apiClient.get('/orders')
  },

  // Get order detail
  getOrderDetail(orderId: number): Promise<ApiResponse<Order>> {
    return apiClient.get(`/orders/${orderId}`)
  },

  // Create order
  createOrder(orderData: any): Promise<ApiResponse<{orderId: number}>> {
    return apiClient.post('/orders', orderData)
  },

  // Pay order
  payOrder(orderId: number, paymentMethod: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/orders/${orderId}/pay`, {
      paymentMethod
    })
  },

  // Cancel order
  cancelOrder(orderId: number, reason: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/orders/${orderId}/cancel`, {
      reason
    })
  },

  // Get order review
  getOrderReview(orderId: number): Promise<ApiResponse<Review>> {
    return apiClient.get(`/orders/${orderId}/review`)
  },

  // Submit review
  submitReview(orderId: number, reviewData: FormData): Promise<ApiResponse<any>> {
    return apiClient.post(`/orders/${orderId}/review`, reviewData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
