<script setup lang="ts">
import { ref } from 'vue'
import { Form, useForm } from 'vee-validate'
import * as yup from 'yup'
import { Field } from 'vee-validate'
import type { Bills } from '@/models/bills'

interface Props {
  id?: string | null
}

const props = defineProps<Props>()
const emit = defineEmits(['done'])

const isLoading = ref(false)
const getItemLoading = ref(false)

const billSchema = yup.object({
  billNumber: yup.string().required('Bill number is required'),
  receiver: yup.string().required('Receiver is required'),
  amount: yup.number().typeError('Amount must be a valid number').required('Amount is required'),
  paidStatus: yup.string().required('Paid status is required'),
  billStatus: yup.string().required('Bill status is required'),
  issuingDate: yup.string().required('Issuing date is required'),
  executionDate: yup.string().required('Execution date is required'),
  receivingStation: yup.string().required('Receiving station is required'),
})

const transactionSchema = yup.object({
  transactionAmount: yup
    .number()
    .typeError('Amount must be a valid number')
    .required('Amount is required'),
  transactionPaymentDate: yup.string().required('Payment date is required'),
})

const form = ref<Bills>({
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

const transactionForm = ref({
  amount: '',
  paymentDate: '',
})

const handleEditItem = (res: Bills) => {
  if (!res) return
  form.value.billNumber = res.billNumber
  form.value.receiver = res.receiver
  form.value.amount = res.amount
  form.value.paidStatus = res.paidStatus
  form.value.billStatus = res.billStatus
  form.value.issuingDate = res.issuingDate
  form.value.executionDate = res.executionDate
  form.value.receivingStation = res.receivingStation
  form.value.transactions = res.transactions
}

const getBill = async () => {
  getItemLoading.value = true
  await baseService
    .get(`/api/bills/${props.id}`)
    .then((res: object | null) => {
      console.log(res)

      if (res) handleEditItem(res as Bills)
    })
    .finally(() => {
      getItemLoading.value = false
    })
}

const handleAddTransaction = () => {
  form.value.transactions.push(transactionForm.value)
  transactionForm.value = {
    amount: '',
    paymentDate: '',
  }
}

const handelDeleteTransaction = (index: number) => {
  form.value.transactions.splice(index, 1)
}

const handleSub = async () => {
  const endpoint = props.id ? `/api/bills/${props.id}` : 'api/bills'
  isLoading.value = true
  await baseService[props.id ? 'update' : 'create'](endpoint, form.value)
    .then(() => {
      emit('done')
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
  <div class="mx-auto h-full">
    <BaseFormSkeleton v-if="getItemLoading" />
    <Form
      v-else
      @submit="handleSub"
      :validation-schema="billSchema"
      class="space-y-4 h-full flex flex-col justify-between"
    >
      <div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="col-span-2">
            <BaseTextField
              v-model="form.receiver"
              name="receiver"
              label="Receiver"
              type="text"
              placeholder="Receiver..."
              required
            />
          </div>
          <div class="form-group col-span-2">
            <BaseTextField
              v-model="form.receivingStation"
              name="receivingStation"
              label="Receiving Station"
              type="text"
              placeholder="Station..."
              required
            />
          </div>
          <div class="form-group col-span-2 md:col-span-1">
            <BaseTextField
              v-model="form.billNumber"
              name="billNumber"
              label="Bill Number"
              type="text"
              placeholder="BILL-001"
              required
            />
          </div>

          <div class="form-group col-span-2 md:col-span-1">
            <BaseTextField
              v-model="form.amount"
              name="amount"
              label="Amount"
              type="text"
              placeholder="1500"
              required
            />
          </div>
          <div class="form-group col-span-2 md:col-span-1">
            <BaseTextField
              v-model="form.paidStatus"
              name="paidStatus"
              label="Paid Status"
              type="select"
              required
              :options="[
                { value: 'paid', label: 'Paid' },
                { value: 'unpaid', label: 'Unpaid' },
              ]"
            />
          </div>
          <div class="form-group col-span-2 md:col-span-1">
            <BaseTextField
              v-model="form.billStatus"
              name="billStatus"
              label="Bill Status"
              type="select"
              required
              :options="[
                { value: 'pending', label: 'Pending' },
                { value: 'executed', label: 'Executed' },
              ]"
            />
          </div>
          <div class="form-group col-span-2 md:col-span-1">
            <BaseTextField
              v-model="form.issuingDate"
              name="issuingDate"
              label="Issuing Date"
              type="date"
              placeholder="2024-01-01"
              required
            />
          </div>
          <div class="form-group col-span-2 md:col-span-1">
            <BaseTextField
              v-model="form.executionDate"
              name="executionDate"
              label="Execution Date"
              type="date"
              placeholder="2024-01-15"
              required
            />
          </div>
        </div>
        <Form
          :key="form.transactions.length"
          @submit="handleAddTransaction"
          :validation-schema="transactionSchema"
          class="space-y-4 border rounded-lg p-4 mt-3"
        >
          <h3 class="text-lg font-semibold">Transaction</h3>
          <div
            v-for="(transaction, index) in form.transactions"
            :key="index"
            class="border py-2 rounded-lg px-4 relative"
          >
            <button
              type="button"
              class="absolute top-2 right-2 text-red-500"
              @click="handelDeleteTransaction(index)"
            >
              ✕
            </button>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="col-span-2 md:col-span-1">
                <label> Amount: {{ Number(transaction.amount).toLocaleString() }} </label>
              </div>
              <div class="col-span-2 md:col-span-1">
                <label> Payment Date: {{ transaction.paymentDate }} </label>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-group col-span-2 md:col-span-1">
              <BaseTextField
                v-model="transactionForm.amount"
                name="transactionAmount"
                label="Amount"
                type="text"
                placeholder="1500"
                required
              />
            </div>
            <div class="form-group col-span-2 md:col-span-1">
              <BaseTextField
                v-model="transactionForm.paymentDate"
                name="transactionPaymentDate"
                label="Payment Date"
                type="date"
                placeholder="2024-01-01"
                required
              />
            </div>
          </div>
          <div class="flex justify-end">
            <button
              type="submit"
              class="w-24 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span> Add </span>
            </button>
          </div>
        </Form>
      </div>

      <div class="flex justify-end">
        <button
          type="submit"
          class="w-24 px-4 py-2 my-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <BaseLoadingSpinner v-if="isLoading" />
          <span v-else> {{ props.id ? 'Update' : 'Create' }} </span>
        </button>
      </div>
    </Form>
  </div>
</template>
