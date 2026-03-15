<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Cryptocurrencies</h1>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search cryptocurrencies..."
        class="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 rounded-full"></div>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="border-b border-gray-200 dark:border-slate-700">
          <tr class="text-gray-600 dark:text-gray-400 text-left">
            <th class="pb-3 font-semibold">#</th>
            <th class="pb-3 font-semibold">Name</th>
            <th class="pb-3 font-semibold">Price</th>
            <th class="pb-3 font-semibold">24h Change</th>
            <th class="pb-3 font-semibold">Market Cap</th>
            <th class="pb-3 font-semibold">Volume (24h)</th>
            <th class="pb-3 font-semibold">Supply</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-slate-700">
          <tr
            v-for="(crypto, index) in filteredCryptos"
            :key="crypto.id"
            class="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            <td class="py-4 text-gray-600 dark:text-gray-400">{{ index + 1 }}</td>
            <td class="py-4">
              <div class="flex items-center gap-3">
                <img :src="crypto.image" :alt="crypto.name" class="w-8 h-8 rounded-full" />
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCryptoData } from '~/composables/useCryptoData'

const { fetchTopCryptos, formatCurrency, formatPercent, formatSupply } = useCryptoData()

const cryptos = ref([])
const isLoading = ref(false)
const searchQuery = ref('')

const loadCryptos = async () => {
  isLoading.value = true
  try {
    cryptos.value = await fetchTopCryptos(200)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadCryptos()
})

const filteredCryptos = computed(() => {
  if (!searchQuery.value) return cryptos.value
  const q = searchQuery.value.toLowerCase()
  return cryptos.value.filter(c =>
    c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
  )
})
</script>
