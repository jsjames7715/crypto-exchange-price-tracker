<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Cryptocurrency Exchanges</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">Browse and compare major crypto exchanges</p>
    </div>

    <!-- Search and Filter -->
    <div class="flex gap-4">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search exchanges..."
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <select
        v-model="filterType"
        class="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Types</option>
        <option value="centralized">Centralized</option>
        <option value="decentralized">Decentralized</option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="text-center">
        <div class="animate-spin w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 rounded-full mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading exchanges...</p>
      </div>
    </div>

    <!-- Exchanges Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="exchange in filteredExchanges"
        :key="exchange.id"
        class="exchange-card cursor-pointer hover:shadow-lg transition-all"
        @click="selectExchange(exchange)"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-start gap-3 flex-1">
            <img
              v-if="exchange.image"
              :src="exchange.image"
              :alt="exchange.name"
              class="w-14 h-14 rounded-lg flex-shrink-0"
            />
            <div class="min-w-0">
              <h3 class="font-bold text-gray-900 dark:text-white truncate">{{ exchange.name }}</h3>
              <p v-if="exchange.country" class="text-xs text-gray-500 dark:text-gray-400">
                {{ exchange.country }}
              </p>
            </div>
          </div>
          <span :class="exchange.centralized ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'" class="px-2 py-1 rounded text-xs font-medium whitespace-nowrap ml-2">
            {{ exchange.centralized ? 'CEX' : 'DEX' }}
          </span>
        </div>

        <!-- Stats -->
        <div class="space-y-3 mb-4">
          <div v-if="exchange.year_established" class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">Established</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ exchange.year_established }}</span>
          </div>
          <div v-if="exchange.trade_volume_24h_btc" class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">24h Volume</span>
            <span class="font-mono font-medium text-gray-900 dark:text-white">
              {{ (exchange.trade_volume_24h_btc || 0).toFixed(0) }} BTC
            </span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">Status</span>
            <span class="font-medium text-green-600 dark:text-green-400">Active</span>
          </div>
        </div>

        <!-- Description -->
        <p v-if="exchange.description" class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
          {{ exchange.description }}
        </p>

        <!-- Action Buttons -->
        <div class="flex gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
          <a
            v-if="exchange.url"
            :href="exchange.url"
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 text-center px-3 py-2 rounded text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            Visit Website
          </a>
          <NuxtLink
            :to="`/exchanges/${exchange.id}`"
            class="flex-1 text-center px-3 py-2 rounded text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            View Details
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!isLoading && filteredExchanges.length === 0" class="text-center py-12">
      <Icon name="Search" :size="48" class="mx-auto text-gray-400 mb-4" />
      <p class="text-gray-600 dark:text-gray-400">No exchanges found matching your search</p>
    </div>

    <!-- Selected Exchange Modal -->
    <div
      v-if="selectedExchange"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      @click="selectedExchange = null"
    >
      <div
        class="bg-white dark:bg-slate-800 rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto"
        @click.stop
      >
        <div class="p-6 border-b border-gray-200 dark:border-slate-700 flex items-start justify-between">
          <div class="flex items-start gap-4">
            <img
              v-if="selectedExchange.image"
              :src="selectedExchange.image"
              :alt="selectedExchange.name"
              class="w-16 h-16 rounded-lg"
            />
            <div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ selectedExchange.name }}</h2>
              <p class="text-gray-600 dark:text-gray-400 mt-1">{{ selectedExchange.country }}</p>
            </div>
          </div>
          <button
            @click="selectedExchange = null"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Icon name="X" :size="24" />
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div v-if="selectedExchange.description" class="mb-6">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">About</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ selectedExchange.description }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div v-if="selectedExchange.year_established">
              <p class="text-sm text-gray-600 dark:text-gray-400">Established</p>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ selectedExchange.year_established }}</p>
            </div>
            <div v-if="selectedExchange.trade_volume_24h_btc">
              <p class="text-sm text-gray-600 dark:text-gray-400">24h Volume</p>
              <p class="text-lg font-mono font-semibold text-gray-900 dark:text-white">{{ selectedExchange.trade_volume_24h_btc.toFixed(0) }} BTC</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Type</p>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ selectedExchange.centralized ? 'Centralized' : 'Decentralized' }}</p>
            </div>
            <div v-if="selectedExchange.has_trading_pairs">
              <p class="text-sm text-gray-600 dark:text-gray-400">Trading Pairs</p>
              <p class="text-lg font-semibold text-green-600 dark:text-green-400">Available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCryptoData } from '~/composables/useCryptoData'

const { fetchExchanges } = useCryptoData()

const exchanges = ref([])
const isLoading = ref(false)
const searchQuery = ref('')
const filterType = ref('')
const selectedExchange = ref(null)

const filteredExchanges = computed(() => {
  return exchanges.value.filter(exchange => {
    const matchesSearch = exchange.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesFilter = !filterType.value || 
      (filterType.value === 'centralized' && exchange.centralized) ||
      (filterType.value === 'decentralized' && !exchange.centralized)
    return matchesSearch && matchesFilter
  })
})

const selectExchange = (exchange: any) => {
  selectedExchange.value = exchange
}

const loadExchanges = async () => {
  isLoading.value = true
  try {
    exchanges.value = await fetchExchanges()
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadExchanges()
})
</script>
