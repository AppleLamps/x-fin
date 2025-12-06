'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Plus,
    X,
    TrendingUp,
    TrendingDown,
    Trash2,
    RotateCcw,
} from 'lucide-react';
import { useWatchlist } from '@/hooks/useWatchlist';
import { StockQuote } from '@/types';

export default function WatchlistPage() {
    const { symbols, addSymbol, removeSymbol, clearWatchlist, resetToDefaults, isLoaded } = useWatchlist();
    const [quotes, setQuotes] = useState<Record<string, StockQuote>>({});
    const [isLoadingQuotes, setIsLoadingQuotes] = useState(true);
    const [newSymbol, setNewSymbol] = useState('');

    // Fetch quotes
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
    }, [symbols, isLoaded]);

    const handleAddSymbol = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSymbol.trim()) {
            addSymbol(newSymbol);
            setNewSymbol('');
        }
    };

    if (!isLoaded) {
        return (
            <div className="p-6">
                <Skeleton className="h-8 w-48 mb-6" />
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Watchlist</h1>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={resetToDefaults}
                        className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={clearWatchlist}
                        className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-red-400"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear All
                    </Button>
                </div>
            </div>

            {/* Add Symbol Form */}
            <form onSubmit={handleAddSymbol} className="mb-6">
                <div className="flex gap-3">
                    <Input
                        type="text"
                        placeholder="Enter stock symbol (e.g., AAPL)"
                        value={newSymbol}
                        onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                        className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
                    />
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                    </Button>
                </div>
            </form>

            {/* Watchlist */}
            {symbols.length === 0 ? (
                <Card className="p-8 bg-zinc-900/50 border-zinc-800 text-center">
                    <p className="text-zinc-400 mb-4">Your watchlist is empty</p>
                    <p className="text-sm text-zinc-500">
                        Add stocks using the form above to track their performance.
                    </p>
                </Card>
            ) : (
                <div className="space-y-2">
                    {symbols.map((symbol) => {
                        const quote = quotes[symbol];
                        const isPositive = quote ? quote.change >= 0 : true;

                        return (
                            <Card
                                key={symbol}
                                className="p-4 bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <Link href={`/ticker/${symbol}`} className="flex-1">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">{symbol}</h3>
                                                {isLoadingQuotes ? (
                                                    <Skeleton className="h-4 w-32" />
                                                ) : quote ? (
                                                    <p className="text-sm text-zinc-400">{quote.name}</p>
                                                ) : null}
                                            </div>
                                        </div>
                                    </Link>

                                    <div className="flex items-center gap-4">
                                        {isLoadingQuotes ? (
                                            <Skeleton className="h-10 w-24" />
                                        ) : quote ? (
                                            <div className="text-right">
                                                <div className="text-lg font-semibold text-white">
                                                    ${quote.price.toFixed(2)}
                                                </div>
                                                <div
                                                    className={`flex items-center justify-end gap-1 text-sm ${isPositive ? 'text-emerald-500' : 'text-red-500'
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

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeSymbol(symbol)}
                                            className="text-zinc-500 hover:text-red-500 hover:bg-zinc-800"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            <p className="mt-6 text-xs text-zinc-600 text-center">
                Watchlist is stored locally in your browser.
            </p>
        </div>
    );
}
