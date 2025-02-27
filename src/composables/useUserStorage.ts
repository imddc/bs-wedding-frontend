import { createGlobalState, useStorage } from '@vueuse/core'
import type { IUserInfo } from '~/api/user/type'

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
