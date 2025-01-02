<script setup lang="ts">
import { defineProps, defineEmits, onMounted, onUnmounted, computed, ref } from 'vue'

interface Props {
  title: string
  position?: 'left' | 'right'
  width?: string
}

const props = withDefaults(defineProps<Props>(), {
  position: 'left',
  width: '1000px',
})

const model = defineModel()

const closeDrawer = () => {
  model.value = false
}

const windowWidth = ref(window.innerWidth)

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const drawerStyles = computed(() => {
  const requestedWidth = parseInt(props.width)

  return {
    width: windowWidth.value < requestedWidth ? '100%' : props.width,
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="model" class="drawer-container" @click.self="closeDrawer">
        <div
          :class="['drawer', `drawer-${position}`, { 'drawer-open': model }]"
          :style="drawerStyles"
        >
          <div class="py-3 px-6 border-b border-gray-200 flex justify-between items-center">
            <span class="text-2xl">{{ title }}</span>
            <button class="close-button" @click="closeDrawer">×</button>
          </div>

          <div class="flex-1 py-3 px-6 overflow-y-auto">
            <slot></slot>
          </div>

          <div v-if="$slots.footer" class="py-3 px-6 border-t border-gray-200">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.drawer {
  position: fixed;
  top: 0;
  height: 100vh;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

.drawer-right {
  right: 0;
}

.drawer-left {
  left: 0;
}

.close-button {
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  color: #666;
}

.close-button:hover {
  color: #000;
}

/* Transition animations */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-active .drawer,
.drawer-leave-active .drawer {
  transition: transform 0.3s ease;
}

.drawer-enter-from .drawer-right,
.drawer-leave-to .drawer-right {
  transform: translateX(100%);
}

.drawer-enter-from .drawer-left,
.drawer-leave-to .drawer-left {
  transform: translateX(-100%);
}
</style>
