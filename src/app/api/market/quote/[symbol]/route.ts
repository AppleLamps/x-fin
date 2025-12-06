import { NextRequest, NextResponse } from 'next/server';
import { mockMarketData } from '@/lib/market-data';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ symbol: string }> }
) {
    try {
        const { symbol } = await params;
        const quote = await mockMarketData.getQuote(symbol);

        return NextResponse.json(quote);
    } catch (error) {
        console.error('Failed to fetch quote:', error);
        return NextResponse.json(
            { error: 'Failed to fetch quote' },
            { status: 500 }
        );
    }
}
