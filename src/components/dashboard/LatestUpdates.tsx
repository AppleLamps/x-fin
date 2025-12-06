'use client';

import { Card } from '@/components/ui/card';
import { NewsItem } from '@/types';
import { Clock, ExternalLink } from 'lucide-react';

// Mock news data for MVP
const mockNews: NewsItem[] = [
    {
        id: '1',
        title: 'Fed Officials Signal Patience on Rate Cuts Amid Strong Jobs Data',
        summary: 'Federal Reserve policymakers indicated they are in no rush to cut interest rates, pointing to a resilient labor market.',
        source: 'Reuters',
        url: 'https://reuters.com',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        relatedSymbols: ['SPY', 'TLT'],
    },
    {
        id: '2',
        title: 'Tech Giants Lead Market Rally as AI Optimism Continues',
        summary: 'Major technology stocks pushed higher as investors remain bullish on artificial intelligence developments.',
        source: 'Bloomberg',
        url: 'https://bloomberg.com',
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        relatedSymbols: ['NVDA', 'MSFT', 'GOOGL'],
    },
    {
        id: '3',
        title: 'Oil Prices Edge Higher on Supply Concerns',
        summary: 'Crude oil futures rose as traders weighed potential supply disruptions against demand outlook.',
        source: 'WSJ',
        url: 'https://wsj.com',
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        relatedSymbols: ['XOM', 'CVX'],
    },
];

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
}

export function LatestUpdates() {
    return (
        <Card className="p-5 bg-zinc-900/50 border-zinc-800">
            <h2 className="text-sm font-semibold text-white mb-4">Latest Updates</h2>

            <div className="space-y-4">
                {mockNews.map((news) => (
                    <a
                        key={news.id}
                        href={news.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group"
                    >
                        <article className="p-3 -mx-3 rounded-lg hover:bg-zinc-800/50 transition-colors">
                            <div className="flex items-start justify-between gap-2 mb-1">
                                <h3 className="text-sm font-medium text-zinc-200 group-hover:text-white line-clamp-2">
                                    {news.title}
                                </h3>
                                <ExternalLink className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <p className="text-xs text-zinc-400 line-clamp-2 mb-2">
                                {news.summary}
                            </p>

                            <div className="flex items-center gap-3 text-xs text-zinc-500">
                                <span className="font-medium text-zinc-400">{news.source}</span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatTimeAgo(news.publishedAt)}
                                </span>
                                {news.relatedSymbols && news.relatedSymbols.length > 0 && (
                                    <div className="flex gap-1">
                                        {news.relatedSymbols.slice(0, 3).map((symbol) => (
                                            <span
                                                key={symbol}
                                                className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400"
                                            >
                                                {symbol}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </article>
                    </a>
                ))}
            </div>

            <p className="mt-4 text-[10px] text-zinc-600 text-center">
                News integration coming soon. Currently showing sample data.
            </p>
        </Card>
    );
}
