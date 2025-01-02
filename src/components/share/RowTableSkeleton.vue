<script lang="ts" setup></script>

<template>
  <tr v-for="i in 10" :key="i" class="animate-pulse [&>td]:px-4 [&>td]:py-3 border-b">
    <td v-for="j in 7" :key="j" class="whitespace-nowrap">
      <div class="h-4 bg-gray-200 rounded w-20"></div>
    </td>
    <td>
      <div class="flex items-center gap-4">
        <div class="h-6 w-6 bg-gray-200 rounded"></div>
        <div class="h-6 w-6 bg-gray-200 rounded"></div>
      </div>
    </td>
  </tr>
</template>
