import {
    FuturesData,
    VixData,
    SectorData,
    MoversData,
    StockQuote
} from '@/types';

/**
 * Interface for market data providers.
 * Implement this interface to swap between mock data and real data sources.
 */
export interface MarketDataProvider {
    /**
     * Get snapshot of major futures (S&P, Nasdaq, Dow)
     */
    getFuturesSnapshot(): Promise<FuturesData[]>;

    /**
     * Get current VIX data
     */
    getVix(): Promise<VixData>;

    /**
     * Get sector performance data
     */
    getSectorPerformance(): Promise<SectorData[]>;

    /**
     * Get top gainers, losers, and most active stocks
     */
    getGainersLosers(): Promise<MoversData>;

    /**
     * Get quote for a specific symbol
     */
    getQuote(symbol: string): Promise<StockQuote>;

    /**
     * Get quotes for multiple symbols
     */
    getQuotes(symbols: string[]): Promise<StockQuote[]>;
}
