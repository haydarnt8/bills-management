<script setup lang="ts">
interface Props {
  label: string
  items: { label: string; value: string }[] | []
}

const model = defineModel()
const props = withDefaults(defineProps<Props>(), {
  items: () => [],
})

const isOpen = ref(false)
const dropdownRef = ref(null)
const Showlabel = computed(
  () => props.items.find((item) => item.value === model.value)?.labe || props.label,
)

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

const handleSelect = (value) => {
  model.value = value
  isOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="dropdownRef" class="relative w-28">
    <button
      @click="isOpen = !isOpen"
      class="w-full text-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center"
      type="button"
    >
      <div class="w-full flex items-center">
        <span>
          {{ Showlabel }}
        </span>
        <svg
          class="w-2.5 h-2.5 ms-3 transition-transform"
          :class="{ 'rotate-180': isOpen }"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </div>
    </button>

    <div
      v-if="isOpen"
      class="absolute z-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
    >
      <ul class="py-2 text-sm text-gray-700">
        <li v-for="item in items" :key="item.value">
          <button
            @click="handleSelect(item.value)"
            class="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            {{ item.label }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
