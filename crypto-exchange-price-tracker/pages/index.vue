<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Real-time cryptocurrency market overview</p>
      </div>
      <button
        @click="refreshData"
        :disabled="isRefreshing"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        <Icon name="RefreshCw" :size="18" :class="{ 'animate-spin': isRefreshing }" />
        {{ isRefreshing ? 'Updating...' : 'Refresh' }}
      </button>
    </div>

    <!-- Key Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard label="Top Exchange" :value="topExchange?.name || 'Loading...'" icon="Building2" />
      <StatCard label="Total Exchanges" :value="exchangeCount.toString()" icon="Network" />
      <StatCard label="Top Crypto" :value="topCrypto?.name || 'Loading...'" icon="TrendingUp" />
      <StatCard label="Market Update" :value="lastUpdate" icon="Clock" />
    </div>

    <!-- Top Cryptocurrencies by Market Cap -->
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Top Cryptocurrencies</h2>
        <NuxtLink
          to="/cryptocurrencies"
          class="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
        >
          View all →
        </NuxtLink>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="border-b border-gray-200 dark:border-slate-700">
            <tr class="text-gray-600 dark:text-gray-400 text-left">
              <th class="pb-3 font-semibold">#</th>
              <th class="pb-3 font-semibold">Name</th>
              <th class="pb-3 font-semibold">Price</th>
              <th class="pb-3 font-semibold">24h Change</th>
              <th class="pb-3 font-semibold">Market Cap</th>
              <th class="pb-3 font-semibold">24h Volume</th>
              <th class="pb-3 font-semibold">Supply</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-slate-700">
            <tr
              v-for="(crypto, index) in topCryptos.slice(0, 10)"
              :key="crypto.id"
              class="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              <td class="py-4 text-gray-600 dark:text-gray-400">{{ index + 1 }}</td>
              <td class="py-4">
                <div class="flex items-center gap-3">
                  <img
                    :src="crypto.image"
                    :alt="crypto.name"
                    class="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div class="font-medium text-gray-900 dark:text-white">{{ crypto.name }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ crypto.symbol }}</div>
                  </div>
                </div>
              </td>
              <td class="py-4 font-mono font-medium text-gray-900 dark:text-white">
                {{ formatCurrency(crypto.current_price) }}
              </td>
              <td class="py-4">
                <span :class="crypto.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ formatPercent(crypto.price_change_percentage_24h) }}
                </span>
              </td>
              <td class="py-4 text-gray-600 dark:text-gray-400">{{ formatCurrency(crypto.market_cap) }}</td>
              <td class="py-4 text-gray-600 dark:text-gray-400">{{ formatCurrency(crypto.total_volume) }}</td>
              <td class="py-4 text-gray-600 dark:text-gray-400">{{ formatSupply(crypto.circulating_supply) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Top Exchanges -->
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Top Exchanges</h2>
        <NuxtLink
          to="/exchanges"
          class="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
        >
          View all →
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="exchange in topExchanges.slice(0, 6)"
          :key="exchange.id"
          class="exchange-card"
        >
          <div class="flex items-start gap-4">
            <img
              v-if="exchange.image"
              :src="exchange.image"
              :alt="exchange.name"
              class="w-12 h-12 rounded-lg"
            />
            <div class="flex-1">
              <h3 class="font-bold text-gray-900 dark:text-white">{{ exchange.name }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1" v-if="exchange.country">
                {{ exchange.country }}
              </p>
            </div>
          </div>

          <div class="mt-4 space-y-3">
            <div v-if="exchange.year_established" class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Established</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ exchange.year_established }}</span>
            </div>
            <div v-if="exchange.trade_volume_24h_btc" class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">24h Volume</span>
              <span class="font-mono font-medium text-gray-900 dark:text-white">
                {{ exchange.trade_volume_24h_btc.toFixed(0) }} BTC
              </span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Type</span>
              <span class="font-medium text-gray-900 dark:text-white">
                {{ exchange.centralized ? 'Centralized' : 'Decentralized' }}
              </span>
            </div>
          </div>

          <NuxtLink
            :to="`/exchanges/${exchange.id}`"
            class="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            View details →
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useCryptoData } from '~/composables/useCryptoData'

const { fetchTopCryptos, fetchExchanges, formatCurrency, formatPercent, formatSupply } = useCryptoData()

const topCryptos = ref([])
const topExchanges = ref([])
const isRefreshing = ref(false)
const lastUpdate = ref('')

const topExchange = computed(() => topExchanges.value[0])
const topCrypto = computed(() => topCryptos.value[0])
const exchangeCount = computed(() => topExchanges.value.length)

const loadData = async () => {
  isRefreshing.value = true
  try {
    const [cryptos, exchanges] = await Promise.all([
      fetchTopCryptos(100),
      fetchExchanges()
    ])
    topCryptos.value = cryptos
    topExchanges.value = exchanges
    lastUpdate.value = new Date().toLocaleTimeString()
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    isRefreshing.value = false
  }
}

const refreshData = () => loadData()

onMounted(() => {
  loadData()
})


</script>
