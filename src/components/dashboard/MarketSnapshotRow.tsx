'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkline } from '@/components/charts';
import { FuturesData, VixData } from '@/types';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { MARKET_POLL_INTERVAL_MS } from '@/lib/config';

interface MarketSnapshotData {
    futures: FuturesData[];
    vix: VixData;
}

export function MarketSnapshotRow() {
    const [data, setData] = useState<MarketSnapshotData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/market');
                if (!response.ok) throw new Error('Failed to fetch market data');
                const result = await response.json();
                setData({ futures: result.futures, vix: result.vix });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
        // Refresh at shared interval
        const interval = setInterval(fetchData, MARKET_POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="p-4 bg-zinc-900/50 border-zinc-800">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-6 w-20 mb-2" />
                        <Skeleton className="h-8 w-full" />
                    </Card>
                ))}
            </div>
        );
    }

    if (error || !data) {
        return (
            <Card className="p-4 bg-zinc-900/50 border-zinc-800">
                <p className="text-zinc-500 text-sm">Unable to load market data</p>
            </Card>
        );
    }

    const allItems = [
        ...data.futures,
        {
            symbol: 'VIX',
            name: 'VIX',
            price: data.vix.value,
            change: data.vix.change,
            changePercent: data.vix.changePercent,
            sparklineData: data.vix.sparklineData,
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {allItems.map((item) => {
                const isPositive = item.change >= 0;

                return (
                    <Card
                        key={item.symbol}
                        className="p-4 bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors"
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-zinc-500 font-medium">{item.name}</span>
                            {isPositive ? (
                                <TrendingUp className="w-3 h-3 text-emerald-500" />
                            ) : (
                                <TrendingDown className="w-3 h-3 text-red-500" />
                            )}
                        </div>

                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-lg font-semibold text-white">
                                {item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <span
                                className={`text-xs font-medium ${isPositive ? 'text-emerald-500' : 'text-red-500'
                                    }`}
                            >
                                {isPositive ? '+' : ''}
                                {item.changePercent.toFixed(2)}%
                            </span>
                        </div>

                        <Sparkline
                            data={item.sparklineData}
                            color={isPositive ? 'green' : 'red'}
                            height={28}
                        />
                    </Card>
                );
            })}
        </div>
    );
}
