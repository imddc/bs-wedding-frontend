import { ref } from 'vue'

export function useResettableRef<T>(value: T, fn?: (v: T) => T) {
  const resetFn = (v: T) => {
    if (fn) {
      return fn(v)
    }
    return JSON.parse(JSON.stringify(v))
  }

  const state = ref<T>(resetFn(value))

  function reset() {
    state.value = resetFn(value)
  }

  return {
    state,
    reset,
  }
}
