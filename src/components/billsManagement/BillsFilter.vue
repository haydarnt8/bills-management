<script lang="ts" setup>
import type { BillsFilterType } from '@/models/bills'

const model = defineModel<BillsFilterType>({
  default: {
    billNumber: '',
    paidStatus: '',
    billStatus: '',
    receivingStation: '',
    issuingDateStart: '',
    issuingDateEnd: '',
    executionDateStart: '',
    executionDateEnd: '',
  },
})
</script>

<template>
  <div class="grid gap-4">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="form-group">
        <BaseTextField
          v-model="model.billNumber"
          name="BillNumber"
          label="Bill Number"
          type="text"
        />
      </div>
      <div class="form-group">
        <BaseTextField
          v-model="model.receivingStation"
          name="ReceivingStation"
          label="Receiving Station"
          type="text"
        />
      </div>
      <div class="form-group">
        <BaseTextField
          v-model="model.paidStatus"
          name="PaidStatus"
          label="Paid Status"
          type="select"
          :options="[
            { value: 'paid', label: 'Paid' },
            { value: 'unpaid', label: 'Unpaid' },
          ]"
        />
      </div>
      <div class="form-group">
        <BaseTextField
          v-model="model.billStatus"
          name="BillStatus"
          label="Bill Status"
          type="select"
          required
          :options="[
            { value: 'pending', label: 'Pending' },
            { value: 'executed', label: 'Executed' },
          ]"
        />
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="form-group">
        <BaseTextField
          v-model="model.issuingDateStart"
          name="IssuingDateStart"
          label="Issuing Date Start"
          type="date"
        />
      </div>
      <div class="form-group">
        <BaseTextField
          v-model="model.issuingDateEnd"
          name="IssuingDateEnd"
          label="Issuing Date End"
          type="date"
        />
      </div>
      <div class="form-group">
        <BaseTextField
          v-model="model.executionDateStart"
          name="ExecutionDateStart"
          label="Execution Date Start"
          type="date"
        />
      </div>
      <div class="form-group">
        <BaseTextField
          v-model="model.executionDateEnd"
          name="ExecutionDateEnd"
          label="Execution Date End"
          type="date"
        />
      </div>
    </div>
  </div>
</template>
