<script lang="ts" setup>
interface Statistics {
  totalPaidAmount: number
  totalUnpaidAmount: number
  executed: number
  pending: number
}

interface Props {
  totalItems: string | number
  statistics: Statistics
}

const emit = defineEmits(['add'])
const props = defineProps<Props>()
const { totalItems, statistics } = toRefs(props)
</script>

<template>
  <div class="flex flex-col items-start p-4 gap-4 overflow-auto">
    <div class="flex items-center justify-between w-full">
      <h2 class="min-w-fit text-2xl font-bold text-gray-900">Bills Management</h2>
      <!-- create add button -->
      <button
        @click="emit('add')"
        class="flex flex-shrink w-32 items center px-4 py-2 text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
      >
        <svg
          class="w-6 h-6 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          ></path>
        </svg>
        <span>Add Bill</span>
      </button>
    </div>
    <div class="flex-1 flex gap-4 flex-wrap">
      <div class="flex md:items-center min-w-fit gap-1 break-words">
        <span>Paid Amount:</span>
        <b>{{ Number(statistics.totalPaidAmount).toLocaleString() }}</b>
      </div>
      <div class="flex md:items-center min-w-fit gap-1 break-words">
        <span>Unpaid Amount:</span>
        <b>{{ Number(statistics.totalUnpaidAmount).toLocaleString() }}</b>
      </div>
      <div class="flex md:items-center min-w-fit gap-1 break-words">
        <span>Total Bills:</span>
        <b>{{ totalItems }}</b>
      </div>
      <div class="flex md:items-center min-w-fit gap-1 break-words">
        <span>Executed:</span>
        <b>{{ statistics.executed }}</b>
      </div>
      <div class="flex md:items-center min-w-fit gap-1 break-words">
        <span>Pending:</span>
        <b>{{ statistics.pending }}</b>
      </div>
    </div>
  </div>
</template>
