<script setup lang="ts">
import { onMounted } from 'vue'
import axiosIns from './plugins/axios'

onMounted(async () => {})
</script>

<template>
  <main class="size-full shadow-md p-4 bg-white rounded-lg">
    <RouterView />
    <BaseToast />
  </main>
</template>
