import type { IUserInfo } from '~/api/user/type'

export interface RegisterParams {
  username: string
  password: string
}

export interface RegisterResponse {
  token: string
  user: IUserInfo
}
