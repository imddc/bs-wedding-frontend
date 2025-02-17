<script setup lang="ts">
import { useDark } from '@vueuse/core'
import { Moon, Sun } from 'lucide-vue-next'
import { toggleDark } from '~/utils/toggleDark'

const isDark = useDark()
</script>

<template>
  <button type="button" class="flex-center" @click="toggleDark">
    <Transition name="fade">
      <Sun v-if="isDark" class="size-6" />
      <Moon v-else class="size-6" />
    </Transition>
  </button>
</template>
