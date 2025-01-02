<script lang="ts" setup>
import { Field } from 'vee-validate'
import { date } from 'yup'
interface Props {
  placeholder?: string
  label?: string
  name: string
  type?: 'text' | 'email' | 'password' | 'date' | 'select'
  required?: boolean
  options?: Array<{ value: string | number; label: string }>
}

const props = defineProps<Props>()
const model = defineModel()

const resetField = () => {
  model.value = ''
}
</script>

<template>
  <div class="relative">
    <label
      :for="props.name"
      :class="['block text-sm font-medium text-gray-700 mb-1', { required: props.required }]"
    >
      {{ props.label }}
    </label>
    <Field
      v-slot="{ field, errorMessage }"
      v-model="model"
      :name="props.name"
      :validateOnInput="true"
    >
      <div class="relative">
        <template v-if="props.type === 'select'">
          <select
            v-bind="field"
            :class="[
              'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all',
              { 'border-gray-300': !errorMessage, 'border-red-500': errorMessage },
            ]"
          >
            <option v-for="option in options" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </template>
        <template v-else>
          <input
            v-bind="field"
            :type="props.type"
            :placeholder="props.placeholder"
            :class="[
              'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all',
              { 'border-gray-300': !errorMessage, 'border-red-500': errorMessage },
            ]"
          />
        </template>
        <button
          v-if="model"
          type="button"
          :class="[
            'absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 ',
            {
              'right-5': props.type === 'select',
              'right-10': props.type === 'date',
              'right-4': props.type !== 'select' && props.type !== 'date',
            },
          ]"
          @click="resetField"
        >
          ✕
        </button>
      </div>
      <span class="text-red-500 text-sm">
        {{ errorMessage }}
      </span>
    </Field>
  </div>
</template>
