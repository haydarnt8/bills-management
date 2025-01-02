<script setup lang="ts">
interface Props {
  size?: string
}
const props = withDefaults(defineProps<Props>(), {
  size: '8',
})
</script>

<template>
  <div
    style="border-top-color: transparent"
    class="h-6 w-6 border-4 border-blue-200 rounded-full animate-spin mx-auto"
  ></div>
</template>
