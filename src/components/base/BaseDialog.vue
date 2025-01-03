<script lang="ts" setup>
const model = defineModel()
</script>

<template>
  <div
    v-if="model"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg relative max-w-2xl w-full mx-4">
      <button
        @click="model = false"
        class="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <slot></slot>
    </div>
  </div>
</template>
