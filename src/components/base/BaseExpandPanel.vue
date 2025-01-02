<template>
  <div
    id="accordion-flush"
    data-accordion="collapse"
    data-active-classes="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
    data-inactive-classes="text-gray-500 dark:text-gray-400"
  >
    <h2 id="accordion-flush-heading-1">
      <button
        type="button"
        class="flex items-center justify-between w-full p-3 font-medium rtl:text-right text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3"
        @click="toggleAccordion"
      >
        <span>{{ title }}</span>
        <svg
          :class="{ 'rotate-180': !isOpen }"
          class="w-3 h-3 shrink-0 transition-transform"
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
            d="M9 5 5 1 1 5"
          />
        </svg>
      </button>
    </h2>
    <transition name="accordion" @before-enter="beforeEnter" @enter="enter" @leave="leave">
      <div v-show="isOpen" class="overflow-hidden">
        <div class="p-3 border-b border-gray-200 dark:border-gray-700">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  title: string
}
const props = defineProps<Props>()
const isOpen = ref(false)
const toggleAccordion = () => {
  isOpen.value = !isOpen.value
}
const beforeEnter = (el: HTMLElement) => {
  el.style.height = '0px'
}

const enter = (el: HTMLElement) => {
  el.style.height = el.scrollHeight + 'px'
  el.addEventListener(
    'transitionend',
    () => {
      el.style.height = 'auto'
    },
    { once: true },
  )
}

const leave = (el: HTMLElement) => {
  el.style.height = el.scrollHeight + 'px'
  requestAnimationFrame(() => {
    el.style.height = '0px'
  })
}
</script>

<style scoped>
.accordion-enter-active,
.accordion-leave-active {
  transition: height 0.3s ease;
}
</style>
