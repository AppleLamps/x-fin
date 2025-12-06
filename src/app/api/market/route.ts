import { NextResponse } from 'next/server';
import { getMarketDataProvider } from '@/lib/market-data';

const marketDataProvider = getMarketDataProvider();

export async function GET() {
    try {
        const [futures, vix, sectors, movers] = await Promise.all([
            marketDataProvider.getFuturesSnapshot(),
            marketDataProvider.getVix(),
            marketDataProvider.getSectorPerformance(),
            marketDataProvider.getGainersLosers(),
        ]);

        return NextResponse.json({
            futures,
            vix,
            sectors,
            movers,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Failed to fetch market data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch market data' },
            { status: 500 }
        );
    }
}
