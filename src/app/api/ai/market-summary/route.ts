import { NextRequest, NextResponse } from 'next/server';
import {
    GrokClient,
    MARKET_SUMMARY_SYSTEM_PROMPT,
    getMarketSummaryPrompt
} from '@/lib/ai';
import { cache, cacheKeys } from '@/lib/cache';
import { MarketSummaryResponse, MarketSummarySection } from '@/types';

interface MarketSummaryRequestBody {
    region?: string;
    focus?: string;
}

interface RawSummaryResponse {
    sections: MarketSummarySection[];
}

export async function POST(request: NextRequest) {
    try {
        const body: MarketSummaryRequestBody = await request.json();
        const { region = 'US', focus } = body;

        // Check cache first
        const cacheKey = cacheKeys.marketSummary(region, focus);
        const cached = cache.get<MarketSummaryResponse>(cacheKey);

        if (cached) {
            return NextResponse.json(cached);
        }

        // Check if API key is configured
        if (!process.env.XAI_API_KEY) {
            // Return mock data if no API key
            return NextResponse.json(getMockMarketSummary());
        }

        // Initialize Grok client
        const grok = new GrokClient({
            enableWebSearch: true,
        });

        // Generate market summary
        const userPrompt = getMarketSummaryPrompt(region, focus);
        const { text, citations } = await grok.sendMessage(
            MARKET_SUMMARY_SYSTEM_PROMPT,
            userPrompt
        );

        // Parse the JSON response
        const parsed = GrokClient.parseJsonResponse<RawSummaryResponse>(text);

        // Sanitize section content
        const sanitizedSections = parsed.sections.map(section => ({
            title: GrokClient.sanitizeText(section.title),
            summary: GrokClient.sanitizeText(section.summary),
        }));

        const response: MarketSummaryResponse = {
            generatedAt: new Date().toISOString(),
            sections: sanitizedSections,
            citations,
        };

        // Cache the response
        cache.set(cacheKey, response);

        return NextResponse.json(response);
    } catch (error) {
        console.error('Market summary generation failed:', error);

        // Return mock data on error
        return NextResponse.json(getMockMarketSummary());
    }
}

// Mock data for development/fallback
function getMockMarketSummary(): MarketSummaryResponse {
    return {
        generatedAt: new Date().toISOString(),
        sections: [
            {
                title: 'Macro/Fed',
                summary: 'Fed officials signal patience on rate cuts, emphasizing data dependency. Treasury yields stabilize as markets digest recent employment data showing resilient labor market conditions.',
            },
            {
                title: 'Equities Breadth',
                summary: 'Broad market participation improves with advancers outpacing decliners 3:2. Small caps showing relative strength as rotation theme continues.',
            },
            {
                title: 'Tech Sector',
                summary: 'Magnificent Seven mixed today with AI-related names leading. Semiconductor stocks rally on positive guidance from key players. Software names consolidating recent gains.',
            },
            {
                title: 'Crypto Tone',
                summary: 'Bitcoin holding above key support levels with institutional flows remaining steady. Ethereum sees renewed interest ahead of network upgrades.',
            },
            {
                title: 'FX Markets',
                summary: 'Dollar index slightly weaker as European data beats expectations. USD/JPY consolidates below recent highs as BOJ policy speculation continues.',
            },
            {
                title: 'Commodities',
                summary: 'Oil prices edge higher on supply concerns and improving demand outlook. Gold holds steady as real rates remain supportive.',
            },
        ],
        citations: [
            'https://www.bloomberg.com/markets',
            'https://www.reuters.com/markets',
            'https://www.wsj.com/markets',
        ],
    };
}
