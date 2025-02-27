<script setup lang="ts">
import { defineEmits, defineProps, reactive, ref } from 'vue'
import { NButton, NButtonGroup, NCard, NDivider, NForm, NFormItem, NInput, NModal, NPagination, NRate, NSelect, NSpace, NSwitch, NTab, NTabPane, NTabs, NTag, NUpload, useLoadingBar, useMessage } from 'naive-ui'
import {
  Globe,
  Laptop,
  Monitor,
  Moon,
  Smartphone,
  Sun,
  Tablet,
} from 'lucide-vue-next'
import { SettingsService } from '~/services/settingsService'

// Define props with TypeScript interface
interface NotificationSettings {
  orders: boolean
  messages: boolean
  weddingPlan: boolean
  marketing: boolean
  methods: string[]
}

interface PrivacySettings {
  showProfile: boolean
  shareWeddingPlan: boolean
  showOnlineStatus: boolean
  saveHistory: boolean
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system'
  primaryColor: string
  fontSize: number
}

interface Settings {
  notifications: NotificationSettings
  privacy: PrivacySettings
  appearance: AppearanceSettings
  language: string
}

const props = defineProps<{
  settings: Settings
}>()

const emit = defineEmits<{
  update: [settings: Settings]
}>()

const message = useMessage()
const loading = ref(false)

// Form data - Create a reactive copy of the settings
const formValue = reactive<Settings>({
  notifications: {
    orders: props.settings.notifications.orders,
    messages: props.settings.notifications.messages,
    weddingPlan: props.settings.notifications.weddingPlan,
    marketing: props.settings.notifications.marketing,
    methods: [...props.settings.notifications.methods],
  },
  privacy: {
    showProfile: props.settings.privacy.showProfile,
    shareWeddingPlan: props.settings.privacy.shareWeddingPlan,
    showOnlineStatus: props.settings.privacy.showOnlineStatus,
    saveHistory: props.settings.privacy.saveHistory,
  },
  appearance: {
    theme: props.settings.appearance.theme,
    primaryColor: props.settings.appearance.primaryColor,
    fontSize: props.settings.appearance.fontSize,
  },
  language: props.settings.language,
})

// Modals
const showDeleteAccountConfirm = ref(false)
const showDevicesModal = ref(false)

// Color swatches for theme picker
const colorSwatches = [
  '#1976d2',
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#03a9f4',
  '#00bcd4',
  '#009688',
  '#4caf50',
  '#8bc34a',
  '#cddc39',
  '#ffeb3b',
  '#ffc107',
  '#ff9800',
  '#ff5722',
  '#795548',
  '#9e9e9e',
  '#607d8b',
]

// Notification method options
const notificationMethodOptions = [
  { label: '应用内通知', value: 'app' },
  { label: '短信通知', value: 'sms' },
  { label: '电子邮件', value: 'email' },
  { label: '微信通知', value: 'wechat' },
]

// Mock login devices data
const loginDevices = ref([
  {
    id: 1,
    name: 'iPhone 13 Pro',
    type: 'mobile',
    location: '上海, 中国',
    lastActive: new Date().toISOString(),
    current: true,
  },
  {
    id: 2,
    name: 'MacBook Pro',
    type: 'desktop',
    location: '上海, 中国',
    lastActive: '2023-04-10T08:30:45Z',
    current: false,
  },
  {
    id: 3,
    name: 'iPad Air',
    type: 'tablet',
    location: '北京, 中国',
    lastActive: '2023-03-28T14:22:15Z',
    current: false,
  },
])

// Format date
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

// Save settings
async function saveSettings() {
  loading.value = true

  try {
    const { data } = await SettingsService.updateSettings(formValue)

    if (data.code === 200) {
      message.success('设置已保存')
      emit('update', formValue)
    } else {
      message.error(data.message || '保存设置失败')
    }
  } catch (error) {
    message.error('保存设置失败，请检查网络连接')
    console.error('Error saving settings:', error)
  } finally {
    loading.value = false
  }
}

// Reset settings to default
function resetSettings() {
  // Predefined default settings
  const defaultSettings: Settings = {
    notifications: {
      orders: true,
      messages: true,
      weddingPlan: true,
      marketing: false,
      methods: ['app', 'email'],
    },
    privacy: {
      showProfile: true,
      shareWeddingPlan: false,
      showOnlineStatus: true,
      saveHistory: true,
    },
    appearance: {
      theme: 'system',
      primaryColor: '#1976d2',
      fontSize: 14,
    },
    language: 'zh-CN',
  }

  // Prompt user for confirmation
  message.warning('确定要恢复默认设置吗？', {
    duration: 5000,
    closable: true,
    // render(props) {
    //   return (
    //     <div>
    //       <div>{props.content}</div>
    //       <div style="display: flex; justify-content: flex-end; margin-top: 12px;">
    //         <n-button
    //           onClick={() => props.onClose()}
    //           class="mr-2"
    //         >
    //           取消
    //         </n-button>
    //         <n-button
    //           type="primary"
    //           onClick={() => {
    //             // Apply default settings
    //             Object.assign(formValue, defaultSettings)
    //             saveSettings()
    //             props.onClose()
    //           }}
    //         >
    //           确定
    //         </n-button>
    //       </div>
    //     </div>
    //   )
    // },
  })
}

// Delete account
async function deleteAccount() {
  try {
    const { data } = await SettingsService.deleteAccount()

    if (data.code === 200) {
      message.success('账号已注销')
      // Redirect to logout page
      window.location.href = '/logout'
    } else {
      message.error(data.message || '账号注销失败')
    }
  } catch (error) {
    message.error('账号注销失败，请检查网络连接')
    console.error('Error deleting account:', error)
  }
}

// Export user data
async function exportUserData() {
  try {
    message.loading('正在准备导出数据...')

    const { data } = await SettingsService.exportUserData()

    if (data.code === 200) {
      message.success('数据导出成功')

      // Create download link
      const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'my_data.json'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } else {
      message.error(data.message || '数据导出失败')
    }
  } catch (error) {
    message.error('数据导出失败，请检查网络连接')
    console.error('Error exporting user data:', error)
  }
}

// Logout device
async function logoutDevice(deviceId: number) {
  try {
    const { data } = await SettingsService.logoutDevice(deviceId)

    if (data.code === 200) {
      message.success('设备已退出登录')

      // Remove device from list
      const index = loginDevices.value.findIndex(d => d.id === deviceId)
      if (index !== -1) {
        loginDevices.value.splice(index, 1)
      }
    } else {
      message.error(data.message || '操作失败')
    }
  } catch (error) {
    message.error('操作失败，请检查网络连接')
    console.error('Error logging out device:', error)
  }
}

// Logout all devices
async function logoutAllDevices() {
  try {
    const { data } = await SettingsService.logoutAllDevices()

    if (data.code === 200) {
      message.success('所有设备已退出登录')
      // Keep only current device
      loginDevices.value = loginDevices.value.filter(d => d.current)
    } else {
      message.error(data.message || '操作失败')
    }
  } catch (error) {
    message.error('操作失败，请检查网络连接')
    console.error('Error logging out all devices:', error)
  }
}
</script>

<template>
  <div>
    <NCard title="系统设置" class="mb-4">
      <NTabs default-value="notifications" animated>
        <NTabPane name="notifications" tab="通知设置">
          <div class="py-4 space-y-4">
            <div class="flex justify-between items-center">
              <div>
                <div class="text-base font-medium">
                  订单通知
                </div>
                <div class="text-sm text-gray-500">
                  接收订单状态变更、支付通知
                </div>
              </div>
              <NSwitch v-model:value="formValue.notifications.orders" />
            </div>

            <NDivider />

            <div class="flex justify-between items-center">
              <div>
                <div class="text-base font-medium">
                  消息通知
                </div>
                <div class="text-sm text-gray-500">
                  接收商家新消息提醒
                </div>
              </div>
              <NSwitch v-model:value="formValue.notifications.messages" />
            </div>

            <NDivider />

            <div class="flex justify-between items-center">
              <div>
                <div class="text-base font-medium">
                  婚礼方案提醒
                </div>
                <div class="text-sm text-gray-500">
                  接收婚礼准备任务到期提醒
                </div>
              </div>
              <NSwitch v-model:value="formValue.notifications.weddingPlan" />
            </div>

            <NDivider />

            <div class="flex justify-between items-center">
              <div>
                <div class="text-base font-medium">
                  营销信息
                </div>
                <div class="text-sm text-gray-500">
                  接收促销、优惠等营销信息
                </div>
              </div>
              <NSwitch v-model:value="formValue.notifications.marketing" />
            </div>

            <NDivider />

            <div class="flex justify-between items-center">
              <div>
                <div class="text-base font-medium">
                  通知方式
                </div>
                <div class="text-sm text-gray-500">
                  选择您希望接收通知的方式
                </div>
              </div>
              <NSelect
                v-model:value="formValue.notifications.methods"
                multiple
                :options="notificationMethodOptions"
                style="min-width: 200px"
              />
            </div>
          </div>
        </NTabPane>

        <NTabPane name="privacy" tab="隐私设置">
          <div class="py-4 space-y-4">
            <div class="flex justify-between items-center">
              <div>
                <div class="text-base font-medium">
                  公开个人资料
                </div>
                <div class="text-sm text-gray-500">
                  允许商家查看您的基本资料
                </div>
              </div>
              <NSwitch v-model:value="formValue.privacy.showProfile" />
            </div>

            <NDivider />

            <div class="flex justify-between items-center">
              <div>
                <div class="text-base font-medium">
                  分享婚礼方案
                </div>
                <div class="text-sm text-gray-500">
                  允许朋友通过链接查看您的婚礼方案
                </div>
              </div>
              <NSwitch v-model:value="formValue.privacy.shareWeddingPlan" />
            </div>

            <NDivider />

            <div class="flex justify-between items-center">
              <div>
                <div class="text-base font-medium">
                  显示在线状态
                </div>
                <div class="text-sm text-gray-500">
                  让商家看到您的在线状态
                </div>
              </div>
              <NSwitch v-model:value="formValue.privacy.showOnlineStatus" />
            </div>

            <NDivider />

            <div class="flex justify-between items-center">
              <div>
                <div class="text-base font-medium">
                  浏览历史
                </div>
                <div class="text-sm text-gray-500">
                  记录您浏览过的服务和商家
                </div>
              </div>
              <NSwitch v-model:value="formValue.privacy.saveHistory" />
            </div>
          </div>
        </NTabPane>

        <NTabPane name="appearance" tab="外观设置">
          <div class="py-4 space-y-4">
            <div class="flex justify-between items-center">
              <div>
                <div class="text-base font-medium">
                  主题模式
                </div>
                <div class="text-sm text-gray-500">
                  选择应用的显示模式
                </div>
              </div>
              <n-radio-group v-model:value="formValue.appearance.theme" name="theme">
                <NSpace>
                  <n-radio-button value="light">
                    <template #default>
                      <div class="flex items-center">
                        <Sun size="18" class="mr-1" /> 浅色
                      </div>
                    </template>
                  </n-radio-button>
                  <n-radio-button value="dark">
                    <template #default>
                      <div class="flex items-center">
                        <Moon size="18" class="mr-1" /> 深色
                      </div>
                    </template>
                  </n-radio-button>
                  <n-radio-button value="system">
                    <template #default>
                      <div class="flex items-center">
                        <Monitor size="18" class="mr-1" /> 跟随系统
                      </div>
                    </template>
                  </n-radio-button>
                </NSpace>
              </n-radio-group>
            </div>

            <NDivider />

            <div class="flex justify-between items-center">
              <div>
                <div class="text-base font-medium">
                  主题色
                </div>
                <div class="text-sm text-gray-500">
                  选择应用的主色调
                </div>
              </div>
              <n-color-picker
                v-model:value="formValue.appearance.primaryColor"
                :swatches="colorSwatches"
              />
            </div>

            <NDivider />

            <div class="flex justify-between items-center">
              <div>
                <div class="text-base font-medium">
                  字体大小
                </div>
                <div class="text-sm text-gray-500">
                  调整应用的字体大小
                </div>
              </div>
              <n-slider
                v-model:value="formValue.appearance.fontSize"
                :step="1"
                :min="12"
                :max="20"
                style="width: 200px"
              >
                <template #thumb>
                  {{ formValue.appearance.fontSize }}px
                </template>
              </n-slider>
            </div>
          </div>
        </NTabPane>

        <NTabPane name="account" tab="账号设置">
          <div class="py-4 space-y-4">
            <div class="flex justify-between items-center">
              <div>
                <div class="text-base font-medium">
                  账号注销
                </div>
                <div class="text-sm text-gray-500">
                  永久删除您的账号及所有数据
                </div>
              </div>
              <NButton
                type="error"
                @click="showDeleteAccountConfirm = true"
              >
                注销账号
              </NButton>
            </div>

            <NDivider />

            <div class="flex justify-between items-center">
              <div>
                <div class="text-base font-medium">
                  数据导出
                </div>
                <div class="text-sm text-gray-500">
                  导出您的个人数据副本
                </div>
              </div>
              <NButton @click="exportUserData">
                导出数据
              </NButton>
            </div>

            <NDivider />

            <div class="flex justify-between items-center">
              <div>
                <div class="text-base font-medium">
                  登录设备
                </div>
                <div class="text-sm text-gray-500">
                  管理已登录的设备
                </div>
              </div>
              <NButton @click="showDevicesModal = true">
                查看设备
              </NButton>
            </div>
          </div>
        </NTabPane>
      </NTabs>

      <div class="flex justify-end mt-6">
        <NSpace>
          <NButton @click="resetSettings">
            恢复默认设置
          </NButton>
          <NButton
            type="primary"
            :loading="loading"
            @click="saveSettings"
          >
            保存设置
          </NButton>
        </NSpace>
      </div>
    </NCard>

    <!-- Delete Account Confirmation Modal -->
    <NModal
      v-model:show="showDeleteAccountConfirm"
      preset="dialog"
      type="error"
      title="确认注销账号"
      content="账号注销后，您的所有数据将被永久删除且无法恢复。确定要继续吗？"
      positive-text="确认注销"
      negative-text="取消"
      @positive-click="deleteAccount"
    />

    <!-- Devices Modal -->
    <NModal
      v-model:show="showDevicesModal"
      preset="card"
      title="已登录设备"
      style="width: 600px"
    >
      <div>
        <n-list>
          <n-list-item v-for="device in loginDevices" :key="device.id">
            <n-thing
              :title="device.name"
              :description="device.location"
            >
              <template #avatar>
                <n-avatar>
                  <template #default>
                    <Smartphone v-if="device.type === 'mobile'" />
                    <Laptop v-else-if="device.type === 'desktop'" />
                    <Tablet v-else-if="device.type === 'tablet'" />
                    <Globe v-else />
                  </template>
                </n-avatar>
              </template>

              <template #header-extra>
                <NTag v-if="device.current" type="success">
                  当前设备
                </NTag>
              </template>

              <template #default>
                <div class="flex justify-between items-center mt-2">
                  <div class="text-sm text-gray-500">
                    最后活动时间: {{ formatDate(device.lastActive) }}
                  </div>

                  <NButton
                    v-if="!device.current"
                    size="small"
                    type="error"
                    @click="logoutDevice(device.id)"
                  >
                    退出登录
                  </NButton>
                </div>
              </template>
            </n-thing>
          </n-list-item>
        </n-list>

        <div class="flex justify-end mt-4">
          <NButton type="error" @click="logoutAllDevices">
            退出所有设备
          </NButton>
        </div>
      </div>
    </NModal>
  </div>
</template>
