<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'

const activityId = useRouteParams('id')
</script>

<template>
  <div>
    this is 活动详情页面 -- {{ activityId }}
  </div>
</template>

<style scoped>

</style>
