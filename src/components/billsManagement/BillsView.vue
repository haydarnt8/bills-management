<script lang="ts" setup>
import type { Bills } from '@/models/bills'

interface Props {
  id: string | null
}

interface Emit {
  (event: 'edit', id: string | null): void
}
const props = defineProps<Props>()
const emit = defineEmits<Emit>()
const isLoading = ref(false)
const item = reactive<Bills>({
  id: '',
  billNumber: '',
  receiver: '',
  amount: '',
  paidStatus: '',
  billStatus: '',
  issuingDate: '',
  executionDate: '',
  receivingStation: '',
  transactions: [],
})

const getBill = async () => {
  isLoading.value = true
  await baseService
    .get(`/api/bills/${props.id}`)
    .then((res) => {
      item.id = res.id
      item.billNumber = res.billNumber
      item.receiver = res.receiver
      item.amount = res.amount
      item.paidStatus = res.paidStatus
      item.billStatus = res.billStatus
      item.issuingDate = res.issuingDate
      item.executionDate = res.executionDate
      item.receivingStation = res.receivingStation
      item.transactions = res.transactions
    })
    .finally(() => {
      isLoading.value = false
    })
}

watch(
  () => props.id,
  () => {
    if (props.id) {
      getBill()
    }
  },
  {
    immediate: true,
    deep: true,
  },
)
</script>

<template>
  <div class="max-w-2xl mx-auto max-h-[80vh] bg-white rounded-lg shadow p-6 overflow-auto">
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-800">Bill Details</h2>
        <button
          @click="emit('edit', props.id)"
          class="flex items-center justify-center p-2 text-white bg-orange-500 rounded-full shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 28 28"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
            />
          </svg>
        </button>
      </div>
      <div class="flex items-center gap-1 text-gray-600">
        <span>#</span>
        <span v-if="isLoading" class="animate-pulse h-6 bg-gray-200 rounded w-20"></span>
        <span v-else>
          {{ item.billNumber }}
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4">
      <div class="space-y-2 col-span-1">
        <div class="flex gap-1 justify-between">
          <span class="text-gray-600">Receiver:</span>
          <span v-if="isLoading" class="animate-pulse h-5 bg-gray-200 rounded w-20"></span>
          <span v-else class="font-medium break-all">{{ item.receiver }}</span>
        </div>
        <div class="flex gap-1 justify-between">
          <span class="text-gray-600">Amount:</span>
          <span v-if="isLoading" class="animate-pulse h-5 bg-gray-200 rounded w-20"></span>
          <span v-else class="font-medium break-all">{{
            Number(item.amount).toLocaleString()
          }}</span>
        </div>
        <div class="flex gap-1 justify-between">
          <span class="text-gray-600">Receiving Station:</span>
          <span v-if="isLoading" class="animate-pulse h-5 bg-gray-200 rounded w-20"></span>
          <span v-else class="font-medium break-all">{{ item.receivingStation }}</span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <div class="flex justify-between item-center">
            <span class="text-gray-600">Payment Status:</span>
            <span v-if="isLoading" class="animate-pulse h-5 bg-gray-200 rounded w-20"></span>
            <span
              v-else
              class="px-2 py-1 rounded-full text-sm"
              :class="{
                'bg-green-100 text-green-800': item.paidStatus === 'paid',
                'bg-red-100 text-red-800': item.paidStatus !== 'paid',
              }"
              >{{ item.paidStatus }}</span
            >
          </div>
          <div class="flex justify-between item-center">
            <span class="text-gray-600">Bill Status:</span>
            <span v-if="isLoading" class="animate-pulse h-5 bg-gray-200 rounded w-20"></span>
            <span v-else class="px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800">{{
              item.billStatus
            }}</span>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between item-center">
            <span class="text-gray-600">Issuing Date:</span>
            <span v-if="isLoading" class="animate-pulse h-5 bg-gray-200 rounded w-20"></span>
            <span v-else class="font-medium">{{ item.issuingDate }}</span>
          </div>
          <div class="flex justify-between item-center">
            <span class="text-gray-600">Execution Date:</span>
            <span v-if="isLoading" class="animate-pulse h-5 bg-gray-200 rounded w-20"></span>
            <span v-else class="font-medium">{{ item.executionDate }}</span>
          </div>
        </div>
      </div>

      <div class="mt-8 border-t border-gray-200 pt-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Transaction History</h3>
          <span class="text-sm text-gray-500">{{ item.transactions.length }} entries</span>
        </div>

        <div v-if="isLoading" class="space-y-3">
          <div
            v-for="n in 3"
            :key="n"
            class="animate-pulse flex justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div class="h-5 bg-gray-200 rounded w-24"></div>
            <div class="h-5 bg-gray-200 rounded w-32"></div>
          </div>
        </div>

        <div
          v-else-if="item.transactions.length === 0"
          class="flex flex-col items-center justify-center py-8 text-gray-500"
        >
          <svg
            class="w-12 h-12 mb-3 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p class="text-sm">No transactions recorded yet</p>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="transaction in item.transactions"
            :key="transaction.paymentDate"
            class="flex justify-between items-center p-4 bg-gray-50 rounded-lg transition-colors duration-200 hover:bg-gray-100"
          >
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="font-medium text-gray-900">
                {{ Number(transaction.amount).toLocaleString() }}
              </span>
            </div>
            <div class="text-sm text-gray-600">
              {{
                new Date(transaction.paymentDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
