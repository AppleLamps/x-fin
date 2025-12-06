import { NextResponse } from 'next/server';
import { mockMarketData } from '@/lib/market-data';

export async function GET() {
    try {
        const [futures, vix, sectors, movers] = await Promise.all([
            mockMarketData.getFuturesSnapshot(),
            mockMarketData.getVix(),
            mockMarketData.getSectorPerformance(),
            mockMarketData.getGainersLosers(),
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
