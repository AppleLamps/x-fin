'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    ArrowLeft,
    Star,
    StarOff,
    RefreshCw,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Eye,
    ThumbsUp,
    ThumbsDown,
    ExternalLink,
} from 'lucide-react';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useAppStore } from '@/lib/store';
import { StockQuote, TickerBriefResponse } from '@/types';
import { CitationsModal } from '@/components/ui/CitationsModal';

export default function TickerPage() {
    const params = useParams();
    const symbol = (params.symbol as string).toUpperCase();

    const { isInWatchlist, addSymbol, removeSymbol } = useWatchlist();
    const { openCitationsModal, citationsModalOpen, citationsModalData, closeCitationsModal } = useAppStore();

    const [quote, setQuote] = useState<StockQuote | null>(null);
    const [brief, setBrief] = useState<TickerBriefResponse | null>(null);
    const [isLoadingQuote, setIsLoadingQuote] = useState(true);
    const [isLoadingBrief, setIsLoadingBrief] = useState(true);

    const inWatchlist = isInWatchlist(symbol);

    // Fetch quote
    useEffect(() => {
        async function fetchQuote() {
            try {
                const response = await fetch(`/api/market/quote/${symbol}`);
                if (response.ok) {
                    setQuote(await response.json());
                }
            } catch (error) {
                console.error('Failed to fetch quote:', error);
            } finally {
                setIsLoadingQuote(false);
            }
        }
        fetchQuote();
    }, [symbol]);

    // Fetch AI brief
    const fetchBrief = useCallback(async () => {
        setIsLoadingBrief(true);
        try {
            const response = await fetch('/api/ai/ticker-brief', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symbol }),
            });
            if (response.ok) {
                setBrief(await response.json());
            }
        } catch (error) {
            console.error('Failed to fetch brief:', error);
        } finally {
            setIsLoadingBrief(false);
        }
    }, [symbol]);

    useEffect(() => {
        fetchBrief();
    }, [fetchBrief]);

    const toggleWatchlist = () => {
        if (inWatchlist) {
            removeSymbol(symbol);
        } else {
            addSymbol(symbol);
        }
    };

    const isPositive = quote ? quote.change >= 0 : true;

    return (
        <>
            <div className="p-6 max-w-5xl mx-auto">
                {/* Back Button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>

                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-white">{symbol}</h1>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleWatchlist}
                                className="text-zinc-400 hover:text-yellow-500"
                            >
                                {inWatchlist ? (
                                    <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                                ) : (
                                    <StarOff className="w-5 h-5" />
                                )}
                            </Button>
                        </div>

                        {isLoadingQuote ? (
                            <Skeleton className="h-5 w-48" />
                        ) : quote ? (
                            <p className="text-zinc-400">{quote.name}</p>
                        ) : null}
                    </div>

                    {/* Price Display */}
                    <div className="text-right">
                        {isLoadingQuote ? (
                            <>
                                <Skeleton className="h-8 w-24 mb-2" />
                                <Skeleton className="h-5 w-20" />
                            </>
                        ) : quote ? (
                            <>
                                <div className="text-3xl font-bold text-white">
                                    ${quote.price.toFixed(2)}
                                </div>
                                <div
                                    className={`flex items-center justify-end gap-1 text-lg ${isPositive ? 'text-emerald-500' : 'text-red-500'
                                        }`}
                                >
                                    {isPositive ? (
                                        <TrendingUp className="w-5 h-5" />
                                    ) : (
                                        <TrendingDown className="w-5 h-5" />
                                    )}
                                    {isPositive ? '+' : ''}
                                    {quote.change.toFixed(2)} ({quote.changePercent.toFixed(2)}%)
                                </div>
                            </>
                        ) : null}
                    </div>
                </div>

                {/* Quote Stats */}
                {quote && (
                    <Card className="p-4 bg-zinc-900/50 border-zinc-800 mb-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-xs text-zinc-500 mb-1">Volume</p>
                                <p className="text-sm font-medium text-white">
                                    {quote.volume?.toLocaleString() || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 mb-1">Market Cap</p>
                                <p className="text-sm font-medium text-white">
                                    {quote.marketCap
                                        ? `$${(quote.marketCap / 1e9).toFixed(2)}B`
                                        : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 mb-1">52W High</p>
                                <p className="text-sm font-medium text-white">
                                    ${quote.high52Week?.toFixed(2) || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 mb-1">52W Low</p>
                                <p className="text-sm font-medium text-white">
                                    ${quote.low52Week?.toFixed(2) || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* AI Brief */}
                <Card className="p-5 bg-zinc-900/50 border-zinc-800">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">AI Analysis</h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={fetchBrief}
                            disabled={isLoadingBrief}
                            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingBrief ? 'animate-spin' : ''}`} />
                            Regenerate
                        </Button>
                    </div>

                    {isLoadingBrief ? (
                        <div className="space-y-4">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                    ) : brief ? (
                        <div className="space-y-6">
                            {/* Overview */}
                            <div>
                                <p className="text-zinc-300 leading-relaxed">{brief.overview}</p>
                            </div>

                            {/* Bull/Bear Cases */}
                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Bull Case */}
                                <div className="p-4 rounded-lg bg-emerald-950/30 border border-emerald-900/50">
                                    <div className="flex items-center gap-2 mb-3">
                                        <ThumbsUp className="w-4 h-4 text-emerald-500" />
                                        <h3 className="text-sm font-medium text-emerald-400">Bull Case</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {brief.bullCase.map((point, i) => (
                                            <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                                                <span className="text-emerald-500 mt-1">•</span>
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Bear Case */}
                                <div className="p-4 rounded-lg bg-red-950/30 border border-red-900/50">
                                    <div className="flex items-center gap-2 mb-3">
                                        <ThumbsDown className="w-4 h-4 text-red-500" />
                                        <h3 className="text-sm font-medium text-red-400">Bear Case</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {brief.bearCase.map((point, i) => (
                                            <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                                                <span className="text-red-500 mt-1">•</span>
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Key Risks */}
                            <div className="p-4 rounded-lg bg-amber-950/20 border border-amber-900/30">
                                <div className="flex items-center gap-2 mb-3">
                                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                                    <h3 className="text-sm font-medium text-amber-400">Key Risks</h3>
                                </div>
                                <ul className="space-y-2">
                                    {brief.keyRisks.map((risk, i) => (
                                        <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                                            <span className="text-amber-500 mt-1">•</span>
                                            {risk}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Watch Items */}
                            <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                                <div className="flex items-center gap-2 mb-3">
                                    <Eye className="w-4 h-4 text-zinc-400" />
                                    <h3 className="text-sm font-medium text-zinc-300">What to Watch</h3>
                                </div>
                                <ul className="space-y-2">
                                    {brief.watchItems.map((item, i) => (
                                        <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                                            <span className="text-zinc-500 mt-1">•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Citations */}
                            {brief.citations.length > 0 && (
                                <div className="pt-4 border-t border-zinc-800">
                                    <button
                                        onClick={() => openCitationsModal(brief.citations)}
                                        className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        Sources: {brief.citations.length}
                                    </button>
                                </div>
                            )}

                            {/* Disclaimer */}
                            <p className="text-[10px] text-zinc-600">
                                This analysis is AI-generated and is not financial advice. Always conduct your own research before making investment decisions.
                            </p>
                        </div>
                    ) : (
                        <p className="text-zinc-500">Unable to load analysis. Please try again.</p>
                    )}
                </Card>
            </div>

            <CitationsModal
                isOpen={citationsModalOpen}
                onClose={closeCitationsModal}
                citations={citationsModalData}
            />
        </>
    );
}
