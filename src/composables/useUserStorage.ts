import { createGlobalState, useStorage } from '@vueuse/core'
import type { UserInfo } from '~/api/user/type'

const useUserToken = createGlobalState(() =>
  useStorage('token', ''),
)

const useUserInfo = createGlobalState(() =>
  useStorage('userInfo', {} as UserInfo),
)

export {
  useUserInfo,
  useUserToken,
}
