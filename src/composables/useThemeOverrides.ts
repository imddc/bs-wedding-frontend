import type { GlobalThemeOverrides } from 'naive-ui'
import { useDark } from '@vueuse/core'
import { computed } from 'vue'

const commonThemeOverrides: GlobalThemeOverrides = {
  common: {
    borderRadius: '10px',
  },
}

export function useThemeOverrides() {
  const isDark = useDark()

  const themeOverridesDark: GlobalThemeOverrides = {
  }
  const themeOverridesLight: GlobalThemeOverrides = {
  }

  const themeOverrides = computed(() => {
    return {
      ...commonThemeOverrides,
      ...(isDark.value ? themeOverridesDark : themeOverridesLight),
    }
  })

  return {
    themeOverrides,
  }
}
