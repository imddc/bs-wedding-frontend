import type { IUserInfo } from '~/api/user/type'
import { createGlobalState, useStorage } from '@vueuse/core'

const useUserToken = createGlobalState(() =>
  useStorage('token', ''),
)

const useUserInfo = createGlobalState(() =>
  useStorage('userInfo', {} as IUserInfo),
)

export {
  useUserInfo,
  useUserToken,
}
