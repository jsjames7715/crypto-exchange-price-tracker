interface CryptoPrice {
  usd: number;
  usd_24h_change?: number;
  usd_market_cap?: number;
}

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number | null;
  market_cap_rank: number | null;
  price_change_percentage_24h: number | null;
  circulating_supply: number | null;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  atl: number;
  high_24h: number;
  low_24h: number;
  total_volume: number | null;
}

interface ExchangeData {
  id: string;
  name: string;
  year_established: number | null;
  country: string | null;
  description: string;
  url: string;
  image: string;
  has_trading_pairs: boolean;
  trade_volume_24h_btc: number | null;
  centralized: boolean;
  tickers_ordered: boolean;
}

export const useCryptoData = () => {
  const COINGECKO_API = 'https://api.coingecko.com/api/v3';

  // Fetch top cryptocurrencies with market data
  const fetchTopCryptos = async (limit: number = 50) => {
    try {
      const { data } = await useFetch<CryptoData[]>(`${COINGECKO_API}/coins/markets`, {
        query: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: limit,
          page: 1,
          sparkline: false,
          price_change_percentage: '24h',
          locale: 'en'
        }
      });
      return data.value || [];
    } catch (error) {
      console.error('Error fetching cryptos:', error);
      return [];
    }
  };

  // Fetch exchange information
  const fetchExchanges = async () => {
    try {
      const { data } = await useFetch<ExchangeData[]>(`${COINGECKO_API}/exchanges`, {
        query: {
          per_page: 100,
          order: 'trade_volume_24h_btc_desc'
        }
      });
      return data.value || [];
    } catch (error) {
      console.error('Error fetching exchanges:', error);
      return [];
    }
  };

  // Fetch single exchange details with cryptocurrencies
  const fetchExchangeDetail = async (exchangeId: string) => {
    try {
      const { data } = await useFetch(`${COINGECKO_API}/exchanges/${exchangeId}`);
      return data.value;
    } catch (error) {
      console.error(`Error fetching exchange detail for ${exchangeId}:`, error);
      return null;
    }
  };

  // Fetch exchange tickers (trading pairs)
  const fetchExchangeTickers = async (exchangeId: string) => {
    try {
      const { data } = await useFetch(`${COINGECKO_API}/exchanges/${exchangeId}/tickers`, {
        query: {
          per_page: 250,
          order: 'volume_desc'
        }
      });
      return data.value || [];
    } catch (error) {
      console.error(`Error fetching tickers for ${exchangeId}:`, error);
      return [];
    }
  };

  // Fetch cryptocurrency details
  const fetchCryptoDetail = async (cryptoId: string) => {
    try {
      const { data } = await useFetch(`${COINGECKO_API}/coins/${cryptoId}`, {
        query: {
          localization: false,
          tickers: true,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: false
        }
      });
      return data.value;
    } catch (error) {
      console.error(`Error fetching crypto detail for ${cryptoId}:`, error);
      return null;
    }
  };

  // Search for cryptocurrencies
  const searchCryptos = async (query: string) => {
    try {
      const { data } = await useFetch(`${COINGECKO_API}/search`, {
        query: { query }
      });
      return data.value?.coins || [];
    } catch (error) {
      console.error('Error searching cryptos:', error);
      return [];
    }
  };

  // Format currency with proper decimal places
  const formatCurrency = (value: number | null): string => {
    if (value === null || value === undefined) return 'N/A';
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    if (value < 0.01) return `$${value.toExponential(2)}`;
    return `$${value.toFixed(2)}`;
  };

  // Format percentage
  const formatPercent = (value: number | null): string => {
    if (value === null || value === undefined) return 'N/A';
    const symbol = value >= 0 ? '+' : '';
    return `${symbol}${value.toFixed(2)}%`;
  };

  // Format supply numbers
  const formatSupply = (value: number | null): string => {
    if (value === null || value === undefined) return 'N/A';
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return `${value.toFixed(0)}`;
  };

  return {
    fetchTopCryptos,
    fetchExchanges,
    fetchExchangeDetail,
    fetchExchangeTickers,
    fetchCryptoDetail,
    searchCryptos,
    formatCurrency,
    formatPercent,
    formatSupply,
    COINGECKO_API
  };
};
