<template>
  <NuxtLink
    :to="to"
    class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
    :class="isActive
      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
    "
  >
    <Icon :name="icon" size="20" />
    <span>{{ label }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineProps<{
  to: string
  icon: string
  label: string
}>()

const route = useRoute()
const isActive = computed(() => route.path === to || route.path.startsWith(to + '/'))
</script>
