<script lang="ts" setup>
import type { Bills } from '@/models/bills'

interface Props {
  items: Bills[] | []
  loading: boolean
}
interface Emit {
  (event: 'edit', id: string | undefined): void
  (event: 'delete', id: string | undefined): void
  (event: 'view', id: string | undefined): void
}

const emit = defineEmits<Emit>()
const props = withDefaults(defineProps<Props>(), {
  items: () => [],
})
</script>

<template>
  <div class="flex-1 w-full overflow-auto border-b">
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
        <tr class="[&>th]:px-4 [&>th]:py-3">
          <th scope="col">Number</th>
          <th scope="col">Receiver</th>
          <th scope="col">Amount</th>
          <th scope="col">Paid Status</th>
          <th scope="col">Issuing Date</th>
          <th scope="col">Execution Date</th>
          <th scope="col">Receiving Station</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <RowTableSkeleton v-if="props.loading" />
        <tr v-else-if="props.items.length === 0">
          <td class="text-center text-2xl py-8" colspan="8">No data available</td>
        </tr>
        <tr
          v-else
          v-for="(item, i) in props.items"
          :key="i"
          :class="[{ 'border-b': i !== props.items.length - 1 }]"
          class="[&>td]:px-4 [&>td]:py-3 hover:bg-gray-100 cursor-pointer"
          @click="emit('view', item.id)"
        >
          <td class="truncate max-w-36">{{ item.billNumber }}</td>
          <td class="truncate max-w-36">{{ item.receiver }}</td>
          <td class="truncate max-w-36">{{ Number(item.amount).toLocaleString() }}</td>
          <td class="truncate max-w-36">{{ item.paidStatus }}</td>
          <td class="truncate max-w-36">{{ item.issuingDate }}</td>
          <td class="truncate max-w-36">{{ item.executionDate }}</td>
          <td class="truncate max-w-36">{{ item.receivingStation }}</td>
          <td class="flex items-center gap-4">
            <span class="cursor-pointer" @click.stop="emit('edit', item.id)">
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
            </span>
            <span class="cursor-pointer" @click.stop="emit('delete', item.id)">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
