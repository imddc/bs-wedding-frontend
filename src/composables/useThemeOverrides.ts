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

  const themeOverridesLight: GlobalThemeOverrides = {
    common: {
      bodyColor: '#f5f5f5',
    },
  }
  const themeOverridesDark: GlobalThemeOverrides = {
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
