<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Form } from 'vee-validate'
import * as yup from 'yup'
import { AuthStorageUtils } from '@/utils/auth/auth-storage-utils'

const isLoading = ref(false)
const schema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(8),
})
const router = useRouter()

const credentials = ref({
  email: '',
  password: '',
})

const handleLogin = async (v) => {
  isLoading.value = true
  await baseService
    .create('api/login', credentials.value)
    .then((res) => {
      AuthStorageUtils.saveAccessTokenToLocalStorage(res?.token)
      router.push('/')
    })
    .finally(() => {
      isLoading.value = false
    })
}
</script>

<template>
  <div class="size-full flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Sign In</h2>

      <Form class="space-y-4" :validation-schema="schema" @submit="handleLogin">
        <div>
          <BaseTextField
            v-model="credentials.email"
            name="email"
            label="Email"
            type="email"
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <BaseTextField
            v-model="credentials.password"
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          <BaseLoadingSpinner v-if="isLoading" />
          <span v-else> Sign In </span>
        </button>
      </Form>
    </div>
  </div>
</template>
