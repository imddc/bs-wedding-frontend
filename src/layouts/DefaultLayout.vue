<script setup lang="ts">
defineSlots<{
  default: () => void
}>()
</script>

<template>
  <div class="mx-auto max-w-[1280px]">
    <slot name="default" />
  </div>
</template>
