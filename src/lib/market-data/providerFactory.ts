import { MarketDataProvider } from './MarketDataProvider';
import { MockMarketDataProvider, mockMarketData } from './MockMarketDataProvider';

/**
 * Return the configured MarketDataProvider based on environment.
 * Falls back to mock provider by default to keep development working.
 */
export function getMarketDataProvider(): MarketDataProvider {
    const provider = process.env.MARKET_DATA_PROVIDER?.toLowerCase();

    switch (provider) {
        case 'mock':
        case undefined:
        case null:
        case '':
            return mockMarketData;
        default:
            console.warn(
                `Unsupported MARKET_DATA_PROVIDER "${provider}", falling back to mock provider`
            );
            return new MockMarketDataProvider();
    }
}


