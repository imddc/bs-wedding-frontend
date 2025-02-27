export interface User {
  id: number
  username: string
  realName: string
  email: string
  phone: string
  status: number
  userType: number
  createTime: string
  updateTime: string
}

export interface IUserInfo extends User {}
