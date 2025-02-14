<script setup lang="ts">
import Provider from '~/components/common/Provider.vue'
</script>

<template>
  <Provider>
    <RouterView #default="{ Component }">
      <Transition name="fade" mode="out-in">
        <KeepAlive>
          <component :is="Component" />
        </KeepAlive>
      </Transition>
    </RouterView>
  </Provider>
</template>
