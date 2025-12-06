import { MockMarketDataProvider } from '@/lib/market-data/MockMarketDataProvider';

describe('MockMarketDataProvider', () => {
    let provider: MockMarketDataProvider;

    beforeEach(() => {
        provider = new MockMarketDataProvider();
    });

    describe('getFuturesSnapshot', () => {
        it('should return an array of futures data', async () => {
            const futures = await provider.getFuturesSnapshot();

            expect(Array.isArray(futures)).toBe(true);
            expect(futures.length).toBeGreaterThan(0);
        });

        it('should return futures with required properties', async () => {
            const futures = await provider.getFuturesSnapshot();

            futures.forEach((future) => {
                expect(future).toHaveProperty('symbol');
                expect(future).toHaveProperty('name');
                expect(future).toHaveProperty('price');
                expect(future).toHaveProperty('change');
                expect(future).toHaveProperty('changePercent');
                expect(future).toHaveProperty('sparklineData');
                expect(typeof future.price).toBe('number');
                expect(Array.isArray(future.sparklineData)).toBe(true);
            });
        });
    });

    describe('getVix', () => {
        it('should return VIX data with required properties', async () => {
            const vix = await provider.getVix();

            expect(vix).toHaveProperty('value');
            expect(vix).toHaveProperty('change');
            expect(vix).toHaveProperty('changePercent');
            expect(vix).toHaveProperty('sparklineData');
            expect(typeof vix.value).toBe('number');
            expect(vix.value).toBeGreaterThan(0);
        });
    });

    describe('getSectorPerformance', () => {
        it('should return an array of sector data', async () => {
            const sectors = await provider.getSectorPerformance();

            expect(Array.isArray(sectors)).toBe(true);
            expect(sectors.length).toBeGreaterThan(0);
        });

        it('should return sectors with name and changePercent', async () => {
            const sectors = await provider.getSectorPerformance();

            sectors.forEach((sector) => {
                expect(sector).toHaveProperty('name');
                expect(sector).toHaveProperty('changePercent');
                expect(typeof sector.name).toBe('string');
                expect(typeof sector.changePercent).toBe('number');
            });
        });
    });

    describe('getGainersLosers', () => {
        it('should return movers data with gainers, losers, and active', async () => {
            const movers = await provider.getGainersLosers();

            expect(movers).toHaveProperty('gainers');
            expect(movers).toHaveProperty('losers');
            expect(movers).toHaveProperty('active');
            expect(Array.isArray(movers.gainers)).toBe(true);
            expect(Array.isArray(movers.losers)).toBe(true);
            expect(Array.isArray(movers.active)).toBe(true);
        });

        it('should return gainers with positive changes', async () => {
            const movers = await provider.getGainersLosers();

            movers.gainers.forEach((stock) => {
                expect(stock.changePercent).toBeGreaterThan(0);
            });
        });

        it('should return losers with negative changes', async () => {
            const movers = await provider.getGainersLosers();

            movers.losers.forEach((stock) => {
                expect(stock.changePercent).toBeLessThan(0);
            });
        });
    });

    describe('getQuote', () => {
        it('should return quote for known symbol', async () => {
            const quote = await provider.getQuote('AAPL');

            expect(quote.symbol).toBe('AAPL');
            expect(quote).toHaveProperty('name');
            expect(quote).toHaveProperty('price');
            expect(quote).toHaveProperty('change');
            expect(quote).toHaveProperty('changePercent');
            expect(typeof quote.price).toBe('number');
        });

        it('should handle unknown symbols gracefully', async () => {
            const quote = await provider.getQuote('UNKNOWN123');

            expect(quote.symbol).toBe('UNKNOWN123');
            expect(typeof quote.price).toBe('number');
        });

        it('should normalize symbol to uppercase', async () => {
            const quote = await provider.getQuote('aapl');

            expect(quote.symbol).toBe('AAPL');
        });
    });

    describe('getQuotes', () => {
        it('should return quotes for multiple symbols', async () => {
            const quotes = await provider.getQuotes(['AAPL', 'MSFT', 'GOOGL']);

            expect(quotes.length).toBe(3);
            expect(quotes[0].symbol).toBe('AAPL');
            expect(quotes[1].symbol).toBe('MSFT');
            expect(quotes[2].symbol).toBe('GOOGL');
        });
    });

    describe('with latency simulation', () => {
        it('should add delay when simulateLatency is enabled', async () => {
            const slowProvider = new MockMarketDataProvider({
                simulateLatency: true,
                latencyMs: 100,
            });

            const start = Date.now();
            await slowProvider.getVix();
            const elapsed = Date.now() - start;

            expect(elapsed).toBeGreaterThanOrEqual(100);
        });
    });
});
