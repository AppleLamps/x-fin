import { MarketDataProvider } from './MarketDataProvider';
import {
    FuturesData,
    VixData,
    SectorData,
    MoversData,
    StockQuote
} from '@/types';

// Helper to generate realistic sparkline data
function generateSparkline(baseValue: number, volatility: number = 0.02, points: number = 20): number[] {
    const data: number[] = [];
    let current = baseValue * (1 - volatility * 5);

    for (let i = 0; i < points; i++) {
        const change = (Math.random() - 0.5) * volatility * baseValue;
        current = Math.max(current + change, baseValue * 0.9);
        data.push(parseFloat(current.toFixed(2)));
    }

    // Ensure the last point is near the base value
    data[data.length - 1] = baseValue;
    return data;
}

// Mock stock database
const MOCK_STOCKS: Record<string, { name: string; price: number; change: number }> = {
    AAPL: { name: 'Apple Inc.', price: 189.95, change: 2.34 },
    MSFT: { name: 'Microsoft Corporation', price: 378.91, change: -1.23 },
    GOOGL: { name: 'Alphabet Inc.', price: 141.80, change: 0.87 },
    AMZN: { name: 'Amazon.com Inc.', price: 178.25, change: 3.45 },
    TSLA: { name: 'Tesla, Inc.', price: 248.50, change: -5.67 },
    NVDA: { name: 'NVIDIA Corporation', price: 467.70, change: 12.34 },
    META: { name: 'Meta Platforms, Inc.', price: 505.25, change: 8.90 },
    JPM: { name: 'JPMorgan Chase & Co.', price: 172.45, change: -0.89 },
    V: { name: 'Visa Inc.', price: 274.30, change: 1.56 },
    JNJ: { name: 'Johnson & Johnson', price: 156.80, change: -2.10 },
    WMT: { name: 'Walmart Inc.', price: 165.20, change: 0.45 },
    PG: { name: 'Procter & Gamble Co.', price: 158.90, change: 0.23 },
    UNH: { name: 'UnitedHealth Group', price: 527.30, change: -4.50 },
    HD: { name: 'The Home Depot, Inc.', price: 345.60, change: 2.80 },
    BAC: { name: 'Bank of America Corp.', price: 33.45, change: -0.34 },
    XOM: { name: 'Exxon Mobil Corporation', price: 104.25, change: 1.89 },
    CVX: { name: 'Chevron Corporation', price: 149.80, change: 2.15 },
    COIN: { name: 'Coinbase Global, Inc.', price: 156.40, change: 8.75 },
    AMD: { name: 'Advanced Micro Devices', price: 128.90, change: 4.56 },
    NFLX: { name: 'Netflix, Inc.', price: 485.30, change: 6.78 },
};

/**
 * Mock implementation of MarketDataProvider for MVP development.
 * Replace with real data provider (e.g., Alpha Vantage, Polygon.io) in production.
 */
export class MockMarketDataProvider implements MarketDataProvider {
    private simulateLatency: boolean;
    private latencyMs: number;

    constructor(options?: { simulateLatency?: boolean; latencyMs?: number }) {
        this.simulateLatency = options?.simulateLatency ?? false;
        this.latencyMs = options?.latencyMs ?? 200;
    }

    private async delay(): Promise<void> {
        if (this.simulateLatency) {
            await new Promise(resolve => setTimeout(resolve, this.latencyMs));
        }
    }

    async getFuturesSnapshot(): Promise<FuturesData[]> {
        await this.delay();

        return [
            {
                symbol: 'ES',
                name: 'S&P Futures',
                price: 5089.25,
                change: 12.50,
                changePercent: 0.25,
                sparklineData: generateSparkline(5089.25, 0.003),
            },
            {
                symbol: 'NQ',
                name: 'Nasdaq Futures',
                price: 17845.50,
                change: 89.25,
                changePercent: 0.50,
                sparklineData: generateSparkline(17845.50, 0.004),
            },
            {
                symbol: 'YM',
                name: 'Dow Futures',
                price: 38215.00,
                change: -45.00,
                changePercent: -0.12,
                sparklineData: generateSparkline(38215.00, 0.002),
            },
        ];
    }

    async getVix(): Promise<VixData> {
        await this.delay();

        return {
            value: 14.32,
            change: -0.45,
            changePercent: -3.05,
            sparklineData: generateSparkline(14.32, 0.05),
        };
    }

    async getSectorPerformance(): Promise<SectorData[]> {
        await this.delay();

        return [
            { name: 'Technology', changePercent: 1.24 },
            { name: 'Healthcare', changePercent: 0.56 },
            { name: 'Financials', changePercent: -0.32 },
            { name: 'Consumer Discretionary', changePercent: 0.89 },
            { name: 'Energy', changePercent: 1.67 },
            { name: 'Industrials', changePercent: 0.45 },
            { name: 'Communication Services', changePercent: 0.78 },
            { name: 'Materials', changePercent: -0.15 },
            { name: 'Real Estate', changePercent: -0.67 },
            { name: 'Utilities', changePercent: -0.23 },
            { name: 'Consumer Staples', changePercent: 0.12 },
        ];
    }

    async getGainersLosers(): Promise<MoversData> {
        await this.delay();

        return {
            gainers: [
                { symbol: 'NVDA', name: 'NVIDIA', price: 467.70, change: 12.34, changePercent: 2.71 },
                { symbol: 'META', name: 'Meta', price: 505.25, change: 8.90, changePercent: 1.79 },
                { symbol: 'COIN', name: 'Coinbase', price: 156.40, change: 8.75, changePercent: 5.93 },
                { symbol: 'NFLX', name: 'Netflix', price: 485.30, change: 6.78, changePercent: 1.42 },
                { symbol: 'AMD', name: 'AMD', price: 128.90, change: 4.56, changePercent: 3.67 },
            ],
            losers: [
                { symbol: 'TSLA', name: 'Tesla', price: 248.50, change: -5.67, changePercent: -2.23 },
                { symbol: 'UNH', name: 'UnitedHealth', price: 527.30, change: -4.50, changePercent: -0.85 },
                { symbol: 'JNJ', name: 'J&J', price: 156.80, change: -2.10, changePercent: -1.32 },
                { symbol: 'MSFT', name: 'Microsoft', price: 378.91, change: -1.23, changePercent: -0.32 },
                { symbol: 'JPM', name: 'JPMorgan', price: 172.45, change: -0.89, changePercent: -0.51 },
            ],
            active: [
                { symbol: 'AAPL', name: 'Apple', price: 189.95, change: 2.34, changePercent: 1.25 },
                { symbol: 'NVDA', name: 'NVIDIA', price: 467.70, change: 12.34, changePercent: 2.71 },
                { symbol: 'TSLA', name: 'Tesla', price: 248.50, change: -5.67, changePercent: -2.23 },
                { symbol: 'AMD', name: 'AMD', price: 128.90, change: 4.56, changePercent: 3.67 },
                { symbol: 'AMZN', name: 'Amazon', price: 178.25, change: 3.45, changePercent: 1.97 },
            ],
        };
    }

    async getQuote(symbol: string): Promise<StockQuote> {
        await this.delay();

        const upperSymbol = symbol.toUpperCase();
        const stock = MOCK_STOCKS[upperSymbol];

        if (!stock) {
            // Return a generated quote for unknown symbols
            const randomPrice = 50 + Math.random() * 200;
            const randomChange = (Math.random() - 0.5) * 10;
            return {
                symbol: upperSymbol,
                name: `${upperSymbol} Inc.`,
                price: parseFloat(randomPrice.toFixed(2)),
                change: parseFloat(randomChange.toFixed(2)),
                changePercent: parseFloat((randomChange / randomPrice * 100).toFixed(2)),
                volume: Math.floor(Math.random() * 50000000) + 1000000,
                marketCap: Math.floor(Math.random() * 500000000000) + 10000000000,
                high52Week: parseFloat((randomPrice * 1.3).toFixed(2)),
                low52Week: parseFloat((randomPrice * 0.7).toFixed(2)),
            };
        }

        const changePercent = (stock.change / stock.price) * 100;

        return {
            symbol: upperSymbol,
            name: stock.name,
            price: stock.price,
            change: stock.change,
            changePercent: parseFloat(changePercent.toFixed(2)),
            volume: Math.floor(Math.random() * 50000000) + 5000000,
            marketCap: Math.floor(Math.random() * 500000000000) + 100000000000,
            high52Week: parseFloat((stock.price * 1.25).toFixed(2)),
            low52Week: parseFloat((stock.price * 0.75).toFixed(2)),
        };
    }

    async getQuotes(symbols: string[]): Promise<StockQuote[]> {
        return Promise.all(symbols.map(symbol => this.getQuote(symbol)));
    }
}

// Export singleton instance for easy use
export const mockMarketData = new MockMarketDataProvider();
