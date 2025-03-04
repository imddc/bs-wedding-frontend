import type { AxiosError, AxiosResponse } from 'axios'
import { useUserToken } from '~/composables/useUserStorage'
import {
  BASE_URL,
  TIME_OUT,
} from '~/plugins/http/request/config'
import type { DataType } from './type'
import type { ErrorMessageMode } from './request/type'
import Request from './request'
// import { useUserStore } from '~/stores/userStore'

function SpringRequest(baseURL: string = BASE_URL) {
  return new Request({
    baseURL,
    timeout: TIME_OUT,
    interceptors: {
      requestInterceptor(config) {
        const token = useUserToken()
        if (token.value) {
          config.headers!.Authorization = `Bearer ${token.value}`
        }
        return config
      },
      // @ts-expect-error non
      responseInterceptor(res: AxiosResponse<DataType>) {
        if (res.data.code !== 200) {
          //
        }
        return res.data
      },
      responseInterceptorCatch(error: AxiosError<DataType>) {
        if (error.response) {
          const { status, data } = error.response
          if (status && data?.message) {
            return checkStatus(status, data.message)
          }
        }
        return Promise.reject(error)
      },
    },
  })
}
const request = SpringRequest()

function checkStatus(status: number, msg: string, errorMessageMode: ErrorMessageMode = 'message') {
  let errMessage = ''
  // const userStore = useUserStore()

  switch (status) {
    case 400:
      errMessage = `${msg}`
      break
    case 401:
      // errMessage = '请重新登录'
      // 需清除缓存
      // userStore.clearAllUserInfo()
      // router.push('/login')
      break
    case 403:
      errMessage = msg || '没有权限'
      break
    case 404:
      errMessage = msg || '找不到该页面'
      break
    case 422:
      errMessage = msg || '参数错误'
      break
    case 500:
      errMessage = msg || '服务器异常'
      break
    default:
      errMessage = `${msg}`
  }

  if (errMessage) {
    if (errorMessageMode === 'message') {
      window.$message.info(errMessage)
    }
  }
}

export {
  request,
}
