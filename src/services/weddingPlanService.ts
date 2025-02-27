import axios from 'axios'
import type { WeddingPlan } from '~/components/profile/WeddingPlanPanel.vue'

// Response interface
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// Plan creation request interface
interface PlanCreationRequest {
  city: string[]
  weddingDate: string
  budget: number
  guestCount: number
  style: string
}

// Configure axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error),
)

export const WeddingPlanService = {
  // Get wedding plan
  getWeddingPlan(): Promise<ApiResponse<WeddingPlan>> {
    return apiClient.get('/wedding-plan')
  },

  // Create wedding plan
  createPlan(planData: PlanCreationRequest): Promise<ApiResponse<{ planId: number }>> {
    return apiClient.post('/wedding-plan', planData)
  },

  // Update wedding plan
  updatePlan(planId: number, planData: Partial<PlanCreationRequest>): Promise<ApiResponse<any>> {
    return apiClient.put(`/wedding-plan/${planId}`, planData)
  },

  // Delete wedding plan
  deletePlan(planId: number): Promise<ApiResponse<any>> {
    return apiClient.delete(`/wedding-plan/${planId}`)
  },

  // Mark task as completed
  markTaskCompleted(planId: number, taskId: number): Promise<ApiResponse<any>> {
    return apiClient.put(`/wedding-plan/${planId}/tasks/${taskId}/complete`)
  },

  // Mark task as incomplete
  markTaskIncomplete(planId: number, taskId: number): Promise<ApiResponse<any>> {
    return apiClient.put(`/wedding-plan/${planId}/tasks/${taskId}/incomplete`)
  },

  // Add task
  addTask(planId: number, task: { title: string, description: string, date: string }): Promise<ApiResponse<{ taskId: number }>> {
    return apiClient.post(`/wedding-plan/${planId}/tasks`, task)
  },

  // Update task
  updateTask(planId: number, taskId: number, task: Partial<{ title: string, description: string, date: string }>): Promise<ApiResponse<any>> {
    return apiClient.put(`/wedding-plan/${planId}/tasks/${taskId}`, task)
  },

  // Delete task
  deleteTask(planId: number, taskId: number): Promise<ApiResponse<any>> {
    return apiClient.delete(`/wedding-plan/${planId}/tasks/${taskId}`)
  },

  // Book service
  bookService(planId: number, serviceId: number): Promise<ApiResponse<any>> {
    return apiClient.post(`/wedding-plan/${planId}/services/${serviceId}/book`)
  },

  // Remove service
  removeService(planId: number, serviceId: number): Promise<ApiResponse<any>> {
    return apiClient.delete(`/wedding-plan/${planId}/services/${serviceId}`)
  },

  // Get shared plan
  getSharedPlan(shareId: string): Promise<ApiResponse<WeddingPlan>> {
    return apiClient.get(`/wedding-plan/share/${shareId}`)
  },
}
