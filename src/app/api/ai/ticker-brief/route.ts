import { NextRequest, NextResponse } from 'next/server';
import {
    GrokClient,
    TICKER_BRIEF_SYSTEM_PROMPT,
    getTickerBriefPrompt
} from '@/lib/ai';
import { cache, cacheKeys } from '@/lib/cache';
import { TickerBriefResponse } from '@/types';

interface TickerBriefRequestBody {
    symbol: string;
}

interface RawTickerBriefResponse {
    overview: string;
    bullCase: string[];
    bearCase: string[];
    keyRisks: string[];
    watchItems: string[];
}

export async function POST(request: NextRequest) {
    try {
        const body: TickerBriefRequestBody = await request.json();
        const { symbol } = body;

        if (!symbol || typeof symbol !== 'string') {
            return NextResponse.json(
                { error: 'Symbol is required' },
                { status: 400 }
            );
        }

        const upperSymbol = symbol.toUpperCase().trim();

        // Check cache first
        const cacheKey = cacheKeys.tickerBrief(upperSymbol);
        const cached = cache.get<TickerBriefResponse>(cacheKey);

        if (cached) {
            return NextResponse.json(cached);
        }

        // Check if API key is configured
        if (!process.env.XAI_API_KEY) {
            // Return mock data if no API key
            return NextResponse.json(getMockTickerBrief(upperSymbol));
        }

        // Initialize Grok client
        const grok = new GrokClient({
            enableWebSearch: true,
        });

        // Generate ticker brief
        const userPrompt = getTickerBriefPrompt(upperSymbol);
        const { text, citations } = await grok.sendMessage(
            TICKER_BRIEF_SYSTEM_PROMPT,
            userPrompt
        );

        // Parse the JSON response
        const parsed = GrokClient.parseJsonResponse<RawTickerBriefResponse>(text);

        // Sanitize content
        const response: TickerBriefResponse = {
            symbol: upperSymbol,
            overview: GrokClient.sanitizeText(parsed.overview),
            bullCase: parsed.bullCase.map(GrokClient.sanitizeText),
            bearCase: parsed.bearCase.map(GrokClient.sanitizeText),
            keyRisks: parsed.keyRisks.map(GrokClient.sanitizeText),
            watchItems: parsed.watchItems.map(GrokClient.sanitizeText),
            citations,
        };

        // Cache the response
        cache.set(cacheKey, response);

        return NextResponse.json(response);
    } catch (error) {
        console.error('Ticker brief generation failed:', error);

        const body = await request.clone().json().catch(() => ({ symbol: 'UNKNOWN' }));
        return NextResponse.json(getMockTickerBrief(body.symbol?.toUpperCase() || 'UNKNOWN'));
    }
}

// Mock data for development/fallback
function getMockTickerBrief(symbol: string): TickerBriefResponse {
    const mockData: Record<string, Partial<TickerBriefResponse>> = {
        AAPL: {
            overview: 'Apple Inc. is a global technology leader known for iPhone, Mac, and services ecosystem. The company continues to show resilience with steady iPhone sales and growing services revenue.',
            bullCase: [
                'Services segment growing at double-digit rates with high margins',
                'Strong ecosystem lock-in with over 2 billion active devices',
                'Upcoming AI features could drive iPhone upgrade cycle',
                'Consistent capital returns through buybacks and dividends',
            ],
            bearCase: [
                'iPhone sales growth slowing in mature markets',
                'China regulatory and competitive pressures intensifying',
                'Vision Pro adoption remains uncertain',
            ],
            keyRisks: [
                'Regulatory scrutiny over App Store practices',
                'Supply chain concentration in Asia',
            ],
            watchItems: [
                'iPhone 16 sales trajectory',
                'Apple Intelligence adoption rates',
                'Services revenue guidance',
            ],
        },
        TSLA: {
            overview: 'Tesla, Inc. is the leading electric vehicle manufacturer and clean energy company. Recent focus on cost reductions and FSD development amid competitive pricing environment.',
            bullCase: [
                'Leading position in EV market with brand recognition',
                'Energy storage business showing strong growth',
                'FSD technology improvements could unlock robotaxi potential',
                'Manufacturing efficiency advantages',
            ],
            bearCase: [
                'Intensifying competition from legacy automakers and Chinese EVs',
                'Margin pressure from price cuts',
                'CEO distraction with other ventures',
            ],
            keyRisks: [
                'EV demand uncertainty in current macro environment',
                'Regulatory changes affecting EV incentives',
            ],
            watchItems: [
                'Q4 delivery numbers',
                'FSD rollout progress',
                'Cybertruck production ramp',
            ],
        },
    };

    const specific = mockData[symbol];

    return {
        symbol,
        overview: specific?.overview || `${symbol} is a publicly traded company. Analysis based on recent market data and news.`,
        bullCase: specific?.bullCase || [
            'Strong market position in core business',
            'Solid balance sheet with growth potential',
            'Positive industry tailwinds',
        ],
        bearCase: specific?.bearCase || [
            'Competitive pressures in key markets',
            'Valuation concerns at current levels',
            'Macro headwinds could impact growth',
        ],
        keyRisks: specific?.keyRisks || [
            'Market-wide risk factors',
            'Company-specific execution risks',
        ],
        watchItems: specific?.watchItems || [
            'Upcoming earnings report',
            'Management guidance updates',
        ],
        citations: [
            'https://finance.yahoo.com',
            'https://www.bloomberg.com',
            'https://seekingalpha.com',
        ],
    };
}
