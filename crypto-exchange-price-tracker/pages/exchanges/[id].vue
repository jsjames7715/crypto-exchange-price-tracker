<template>
  <div class="space-y-8">
    <!-- Back Button -->
    <NuxtLink to="/exchanges" class="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline">
      <Icon name="ChevronLeft" :size="20" />
      Back to Exchanges
    </NuxtLink>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="text-center">
        <div class="animate-spin w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 rounded-full mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading exchange details...</p>
      </div>
    </div>

    <div v-else-if="exchange">
      <!-- Exchange Header -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <div class="flex items-start gap-6">
          <img
            v-if="exchange.image"
            :src="exchange.image"
            :alt="exchange.name"
            class="w-24 h-24 rounded-lg"
          />
          <div class="flex-1">
            <h1 class="text-4xl font-bold mb-2">{{ exchange.name }}</h1>
            <p v-if="exchange.country" class="text-blue-100 mb-4">{{ exchange.country }}</p>
            <div class="flex gap-4 flex-wrap">
              <span :class="exchange.centralized ? 'bg-white/20' : 'bg-purple-500/20'" class="px-3 py-1 rounded-full text-sm font-medium">
                {{ exchange.centralized ? '🔒 Centralized' : '🔓 Decentralized' }}
              </span>
              <span v-if="exchange.has_trading_pairs" class="px-3 py-1 rounded-full text-sm font-medium bg-white/20">
                ✓ Trading Pairs Available
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div v-if="exchange.description" class="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-3">About</h2>
        <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ exchange.description }}</p>
      </div>

      <!-- Key Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Established</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ exchange.year_established || 'Unknown' }}
          </p>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">24h Volume</p>
          <p class="text-2xl font-mono font-bold text-gray-900 dark:text-white">
            {{ exchange.trade_volume_24h_btc ? exchange.trade_volume_24h_btc.toFixed(0) : 'N/A' }} BTC
          </p>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Type</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ exchange.centralized ? 'CEX' : 'DEX' }}
          </p>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Status</p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">Active</p>
        </div>
      </div>

      <!-- Visit Website -->
      <div v-if="exchange.url" class="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700 flex items-center justify-between">
        <div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Visit Exchange</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">Go to official website</p>
        </div>
        <a
          :href="exchange.url"
          target="_blank"
          rel="noopener noreferrer"
          class="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium inline-flex items-center gap-2"
        >
          <Icon name="ExternalLink" :size="18" />
          Open Website
        </a>
      </div>

      <!-- Trading Pairs Section -->
      <div v-if="!loadingTickers" class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Trading Pairs</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ tickers.length }} total pairs</p>
          </div>
          <input
            v-model="tickerSearch"
            type="text"
            placeholder="Search pairs..."
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div v-if="filteredTickers.length > 0" class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="border-b border-gray-200 dark:border-slate-700">
              <tr class="text-gray-600 dark:text-gray-400 text-left">
                <th class="pb-3 font-semibold">Base/Quote</th>
                <th class="pb-3 font-semibold">Last Price</th>
                <th class="pb-3 font-semibold">24h Volume</th>
                <th class="pb-3 font-semibold">Trade Count</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-slate-700">
              <tr
                v-for="ticker in filteredTickers.slice(0, 50)"
                :key="ticker.target"
                class="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                <td class="py-4">
                  <div class="font-mono font-medium text-gray-900 dark:text-white">
                    {{ ticker.base }}/{{ ticker.target }}
                  </div>
                </td>
                <td class="py-4 font-mono text-gray-600 dark:text-gray-400">
                  {{ ticker.last ? ticker.last.toFixed(8) : 'N/A' }}
                </td>
                <td class="py-4 text-gray-600 dark:text-gray-400">
                  {{ ticker.volume ? ticker.volume.toFixed(2) : 'N/A' }}
                </td>
                <td class="py-4 text-gray-600 dark:text-gray-400">
                  {{ ticker.trade_count || 'N/A' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center py-8 text-gray-600 dark:text-gray-400">
          No trading pairs found
        </div>
      </div>

      <div v-else class="bg-white dark:bg-slate-800 rounded-lg p-12 border border-gray-200 dark:border-slate-700 text-center">
        <div class="animate-spin w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 rounded-full mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading trading pairs...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-12">
      <Icon name="AlertCircle" :size="48" class="mx-auto text-red-400 mb-4" />
      <p class="text-gray-600 dark:text-gray-400">Exchange not found</p>
      <NuxtLink to="/exchanges" class="text-blue-600 dark:text-blue-400 hover:underline mt-4 inline-block">
        Return to Exchanges
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCryptoData } from '~/composables/useCryptoData'

const route = useRoute()
const { fetchExchangeDetail, fetchExchangeTickers } = useCryptoData()

const exchange = ref(null)
const tickers = ref([])
const isLoading = ref(false)
const loadingTickers = ref(false)
const tickerSearch = ref('')

const filteredTickers = computed(() => {
  const query = tickerSearch.value.toLowerCase()
  return tickers.value.filter(ticker =>
    ticker.base.toLowerCase().includes(query) ||
    ticker.target.toLowerCase().includes(query)
  )
})

const loadData = async () => {
  isLoading.value = true
  try {
    exchange.value = await fetchExchangeDetail(route.params.id)
  } finally {
    isLoading.value = false
  }
}

const loadTickers = async () => {
  loadingTickers.value = true
  try {
    const tickerData = await fetchExchangeTickers(route.params.id)
    tickers.value = tickerData.tickers || []
  } finally {
    loadingTickers.value = false
  }
}

onMounted(() => {
  loadData()
  loadTickers()
})
</script>
