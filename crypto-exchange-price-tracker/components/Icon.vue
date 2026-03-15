<template>
  <component :is="iconComponent" :size="size" :stroke-width="strokeWidth" v-bind="$attrs" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import * as LucideIcons from 'lucide-vue-next'

interface Props {
  name: string
  size?: number | string
  strokeWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  strokeWidth: 2
})

const iconComponent = computed(() => {
  const iconName = `${props.name.charAt(0).toUpperCase()}${props.name.slice(1)}`
  return (LucideIcons as any)[iconName] || LucideIcons.HelpCircle
})
</script>
