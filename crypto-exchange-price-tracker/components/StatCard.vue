<template>
  <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm font-medium text-blue-600 dark:text-blue-300">{{ label }}</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1 truncate">{{ value }}</p>
      </div>
      <div class="p-3 rounded-lg bg-blue-200 dark:bg-blue-800">
        <Icon :name="icon" :size="24" class="text-blue-700 dark:text-blue-300" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string
  icon: string
}>()
</script>
