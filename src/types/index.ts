// Market Data Types

export interface FuturesData {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    sparklineData: number[];
}

export interface VixData {
    value: number;
    change: number;
    changePercent: number;
    sparklineData: number[];
}

export interface StockQuote {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    marketCap?: number;
    high52Week?: number;
    low52Week?: number;
}

export interface SectorData {
    name: string;
    changePercent: number;
}

export interface MoverStock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
}

export interface MoversData {
    gainers: MoverStock[];
    losers: MoverStock[];
    active: MoverStock[];
}

// AI Response Types

export interface MarketSummarySection {
    title: string;
    summary: string;
}

export interface MarketSummaryResponse {
    generatedAt: string;
    sections: MarketSummarySection[];
    citations: string[];
}

export interface TickerBriefResponse {
    symbol: string;
    overview: string;
    bullCase: string[];
    bearCase: string[];
    keyRisks: string[];
    watchItems: string[];
    citations: string[];
}

// Watchlist Types

export interface WatchlistItem {
    symbol: string;
    addedAt: string;
}

// Settings Types

export interface AppSettings {
    model: 'grok-4-1-fast' | 'grok-4-fast';
    enableWebSearch: boolean;
    enableXSearch: boolean;
}

// News Types

export interface NewsItem {
    id: string;
    title: string;
    summary: string;
    source: string;
    url: string;
    publishedAt: string;
    relatedSymbols?: string[];
}
