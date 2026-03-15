<template>
  <div class="flex h-screen bg-gray-50 dark:bg-slate-900">
    <!-- Sidebar Navigation -->
    <nav class="w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col">
      <!-- Logo/Header -->
      <div class="p-6 border-b border-gray-200 dark:border-slate-700">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span class="text-white font-bold text-lg">₿</span>
          </div>
          <div>
            <h1 class="font-bold text-gray-900 dark:text-white">CryptoHub</h1>
            <p class="text-xs text-gray-500 dark:text-gray-400">Exchange Tracker</p>
          </div>
        </div>
      </div>

      <!-- Navigation Links -->
      <div class="flex-1 overflow-y-auto p-4 space-y-2">
        <NavLink to="/" icon="BarChart3" label="Dashboard" />
        <NavLink to="/exchanges" icon="Building2" label="Exchanges" />
        <NavLink to="/cryptocurrencies" icon="Coins" label="Cryptocurrencies" />
        <NavLink to="/portfolio" icon="Wallet" label="Portfolio" />
        <NavLink to="/analytics" icon="TrendingUp" label="Analytics" />
      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-gray-200 dark:border-slate-700 space-y-2">
        <button class="w-full px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
          <Icon name="Settings" size="18" />
          Settings
        </button>
        <div class="text-xs text-gray-500 dark:text-gray-400 px-4 py-2">
          <p>Data from CoinGecko</p>
          <p>Updated: {{ lastUpdate }}</p>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto">
      <div class="max-w-7xl mx-auto p-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const lastUpdate = ref('')

const updateTime = () => {
  const now = new Date()
  lastUpdate.value = now.toLocaleTimeString()
}

onMounted(() => {
  updateTime()
  setInterval(updateTime, 60000) // Update every minute
})
</script>

<style scoped>
nav {
  @apply shadow-sm;
}
</style>
