import type { GlobalThemeOverrides } from 'naive-ui'
import { computed } from 'vue'

const commonThemeOverrides: GlobalThemeOverrides = {
  common: {
    borderRadius: '10px',
  },
}

export function useThemeOverrides() {
  const themeOverridesLight: GlobalThemeOverrides = {
    common: {
      bodyColor: '#f5f5f5',
      primaryColor: '#e4464b',
      hoverColor: '#c94b4c',
      primaryColorHover: '#c94b4c',
    },
    Tag: {
      borderRadius: '10px',
    },
  }

  const themeOverrides = computed(() => {
    return {
      ...commonThemeOverrides,
      ...themeOverridesLight,
    }
  })

  return {
    themeOverrides,
  }
}
