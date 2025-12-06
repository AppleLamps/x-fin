'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, X, TrendingUp, TrendingDown } from 'lucide-react';
import { useWatchlist } from '@/hooks/useWatchlist';
import { StockQuote } from '@/types';
import { MARKET_POLL_INTERVAL_MS } from '@/lib/config';

export function WatchlistPanel() {
    const { symbols, addSymbol, removeSymbol, isLoaded } = useWatchlist();
    const [quotes, setQuotes] = useState<Record<string, StockQuote>>({});
    const [isLoadingQuotes, setIsLoadingQuotes] = useState(true);
    const [newSymbol, setNewSymbol] = useState('');
    const [showAddInput, setShowAddInput] = useState(false);

    // Fetch quotes for watchlist symbols
    useEffect(() => {
        if (!isLoaded || symbols.length === 0) {
            setIsLoadingQuotes(false);
            return;
        }

        async function fetchQuotes() {
            setIsLoadingQuotes(true);
            const newQuotes: Record<string, StockQuote> = {};

            await Promise.all(
                symbols.map(async (symbol) => {
                    try {
                        const response = await fetch(`/api/market/quote/${symbol}`);
                        if (response.ok) {
                            newQuotes[symbol] = await response.json();
                        }
                    } catch (error) {
                        console.error(`Failed to fetch quote for ${symbol}:`, error);
                    }
                })
            );

            setQuotes(newQuotes);
            setIsLoadingQuotes(false);
        }

        fetchQuotes();
        // Refresh every interval from shared config
        const interval = setInterval(fetchQuotes, MARKET_POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [symbols, isLoaded]);

    const handleAddSymbol = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSymbol.trim()) {
            addSymbol(newSymbol);
            setNewSymbol('');
            setShowAddInput(false);
        }
    };

    if (!isLoaded) {
        return (
            <Card className="p-4 bg-zinc-900/50 border-zinc-800">
                <div className="flex items-center justify-between mb-3">
                    <Skeleton className="h-4 w-20" />
                </div>
                <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                    ))}
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-4 bg-zinc-900/50 border-zinc-800">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">Watchlist</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddInput(!showAddInput)}
                    className="h-6 w-6 p-0 text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            {/* Add Symbol Input */}
            {showAddInput && (
                <form onSubmit={handleAddSymbol} className="mb-3">
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            placeholder="Add symbol..."
                            value={newSymbol}
                            onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                            className="h-8 text-xs bg-zinc-800 border-zinc-700"
                            autoFocus
                        />
                        <Button
                            type="submit"
                            size="sm"
                            className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700"
                        >
                            Add
                        </Button>
                    </div>
                </form>
            )}

            {/* Watchlist Items */}
            <div className="space-y-1">
                {symbols.length === 0 ? (
                    <p className="text-xs text-zinc-500 py-4 text-center">
                        No stocks in watchlist. Add some!
                    </p>
                ) : (
                    symbols.slice(0, 5).map((symbol) => {
                        const quote = quotes[symbol];
                        const isPositive = quote ? quote.change >= 0 : true;

                        return (
                            <div
                                key={symbol}
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800/50 transition-colors group"
                            >
                                <Link
                                    href={`/ticker/${symbol}`}
                                    className="flex-1 flex items-center gap-2"
                                >
                                    <span className="text-sm font-medium text-white">{symbol}</span>
                                    {isLoadingQuotes ? (
                                        <Skeleton className="h-3 w-16" />
                                    ) : quote ? (
                                        <span className="text-xs text-zinc-500 truncate max-w-[80px]">
                                            {quote.name?.split(' ')[0] || ''}
                                        </span>
                                    ) : null}
                                </Link>

                                <div className="flex items-center gap-2">
                                    {isLoadingQuotes ? (
                                        <Skeleton className="h-4 w-12" />
                                    ) : quote ? (
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-white">
                                                ${quote.price.toFixed(2)}
                                            </div>
                                            <div
                                                className={`text-xs flex items-center gap-0.5 ${isPositive ? 'text-emerald-500' : 'text-red-500'
                                                    }`}
                                            >
                                                {isPositive ? (
                                                    <TrendingUp className="w-3 h-3" />
                                                ) : (
                                                    <TrendingDown className="w-3 h-3" />
                                                )}
                                                {isPositive ? '+' : ''}
                                                {quote.changePercent.toFixed(2)}%
                                            </div>
                                        </div>
                                    ) : null}

                                    <button
                                        onClick={() => removeSymbol(symbol)}
                                        className="p-1 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-red-500"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {symbols.length > 5 && (
                <Link
                    href="/watchlist"
                    className="block mt-2 text-xs text-center text-emerald-500 hover:text-emerald-400"
                >
                    View all {symbols.length} stocks →
                </Link>
            )}
        </Card>
    );
}
