<script setup lang="ts">
import BaseDeleteDialog from '@/components/base/BaseDeleteDialog.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import BasePagination from '@/components/base/BasePagination.vue'
import DropdownButton from '@/components/base/DropdownButton.vue'
import BillsFilter from '@/components/billsManagement/BillsFilter.vue'
import BillsForm from '@/components/billsManagement/BillsForm.vue'
import BillsTable from '@/components/billsManagement/BillsTable.vue'

const items = ref([])
const statistics = reactive({
  totalPaidAmount: 0,
  totalUnpaidAmount: 0,
  executed: 0,
  pending: 0,
})
const itemIdToDelete = ref<string | null>(null)
const itemIdToEdit = ref<string | null>(null)
const showDeleteDialog = ref(false)
const showFormDrawer = ref(false)
const loading = ref(false)

const pagination = ref({
  currentPage: 1,
  totalItems: 0,
  itemsPerPage: 20,
  maxVisiblePages: 0,
})

// paidStatus,
//     billStatus,
//     receivingStation,
//     issuingDateStart,
//     issuingDateEnd,
//     executionDateStart,
//     executionDateEnd,
const filters = ref({
  paidStatus: '',
  billStatus: '',
  receivingStation: '',
  issuingDateStart: '',
  issuingDateEnd: '',
  executionDateStart: '',
  executionDateEnd: '',
})

function handleDelete(id: string) {
  console.log('handleDelete', id)
  itemIdToDelete.value = id
  showDeleteDialog.value = true
}

function handleEdit(id: string) {
  itemIdToEdit.value = id
  showFormDrawer.value = true
}

function handleFormDone() {
  showFormDrawer.value = false
  getBills()
}

async function getBills() {
  console.log('getBills')

  loading.value = true
  baseService
    .get('api/bills', {
      page: pagination.value.currentPage,
      perPage: pagination.value.itemsPerPage,
      ...filters.value,
    })
    .then((res) => {
      pagination.value.totalItems = res.totalCount
      statistics.totalPaidAmount = res.totalPaidAmount
      statistics.totalUnpaidAmount = res.totalUnpaidAmount
      statistics.executed = res.executedCount
      statistics.pending = res.pendingCount
      items.value = res.items
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  getBills()
})

watch(
  () => filters.value,
  () => {
    if (pagination.value.currentPage === 1) {
      getBills()
    } else {
      pagination.value.currentPage = 1
    }
  },
  {
    deep: true,
  },
)

watch(
  () => pagination.value.currentPage,
  (v) => {
    getBills()
  },
)

watch(
  () => showFormDrawer.value,
  (v) => {
    if (!v) {
      itemIdToEdit.value = null
    }
  },
)
</script>

<template>
  <div class="size-full flex flex-col bg-white relative shadow-md sm:rounded-lg overflow-hidden">
    <BillsStatistics
      @add="showFormDrawer = true"
      :totalItems="pagination.totalItems"
      :statistics="statistics"
    />
    <div>
      <BaseExpandPanel title="Filters">
        <BillsFilter v-model="filters" />
      </BaseExpandPanel>
    </div>
    <BillsTable :loading="loading" :items="items" @delete="handleDelete" @edit="handleEdit" />
    <BasePagination
      v-model:currentPage="pagination.currentPage"
      :totalItems="pagination.totalItems"
      :itemsPerPage="pagination.itemsPerPage"
      :maxVisiblePages="pagination.maxVisiblePages"
    />
    <BaseDeleteDialog
      @done="getBills"
      v-model="showDeleteDialog"
      :url="`/api/bills/${itemIdToDelete}`"
    />
    <BaseDrawer v-model="showFormDrawer" :title="itemIdToEdit ? 'Edit Bill' : 'Add Bill'">
      <BillsForm :id="itemIdToEdit" @done="handleFormDone" />
    </BaseDrawer>
  </div>
</template>
