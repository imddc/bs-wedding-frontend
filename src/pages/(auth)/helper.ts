import type { FormRules } from 'naive-ui'
import type { MaybeRef } from 'vue'
import { computed, ref, unref } from 'vue'
import { useResettableRef } from '~/composables/useResettableRef'

type AuthType = 'login' | 'register'

interface FormState {
  username: string
  password: string
  repeatPassword: string
}

export interface RegisterPayload {
  username: string
  password: string
}

export function useAuthState() {
  const authType = ref<AuthType>('login')
  const loading = ref(false)
  const { state: formState, reset: resetFormState } = useResettableRef<FormState>({
    username: '',
    password: '',
    repeatPassword: '',
  })

  const isRegister = computed(() => authType.value === 'register')

  function toggleAuthType() {
    authType.value = authType.value === 'login' ? 'register' : 'login'
    resetFormState()
  }

  return {
    authType,
    isRegister,
    formState,
    loading,
    resetFormState,
    toggleAuthType,
  }
}

export function createLoginRules(formState: MaybeRef<FormState>): FormRules {
  return {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 6, max: 20, message: '用户名长度在6-20之间', trigger: 'input' },
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 20, message: '密码长度在6-20之间', trigger: 'input' },
    ],
    repeatPassword: [
      { required: true, message: '请输入确认密码' },
      {
        validator: (_: any, value: string) => {
          return new Promise((resolve, reject) => {
            console.log(value, unref(formState).password)
            if (value !== unref(formState).password) {
              reject(new Error('两次密码不一致'))
            }
            resolve()
          })
        },
        trigger: ['blur', 'input'],
      },
    ],
  }
}
