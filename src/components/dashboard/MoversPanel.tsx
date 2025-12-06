'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { MoversData, MoverStock } from '@/types';
import { MARKET_POLL_INTERVAL_MS } from '@/lib/config';

function StockRow({ stock }: { stock: MoverStock }) {
    const isPositive = stock.change >= 0;

    return (
        <Link
            href={`/ticker/${stock.symbol}`}
            className="flex items-center justify-between py-2 px-1 hover:bg-zinc-800/50 rounded transition-colors"
        >
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{stock.symbol}</span>
                <span className="text-xs text-zinc-500 truncate max-w-[60px]">
                    {stock.name}
                </span>
            </div>
            <div className="flex items-center gap-1.5">
                {isPositive ? (
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                <span
                    className={`text-xs font-medium ${isPositive ? 'text-emerald-500' : 'text-red-500'
                        }`}
                >
                    {isPositive ? '+' : ''}
                    {stock.changePercent.toFixed(2)}%
                </span>
            </div>
        </Link>
    );
}

export function MoversPanel() {
    const [data, setData] = useState<MoversData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/market');
                if (response.ok) {
                    const result = await response.json();
                    setData(result.movers);
                }
            } catch (error) {
                console.error('Failed to fetch movers:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
        const interval = setInterval(fetchData, MARKET_POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return (
            <Card className="p-4 bg-zinc-900/50 border-zinc-800">
                <Skeleton className="h-8 w-full mb-4" />
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-6 w-full" />
                    ))}
                </div>
            </Card>
        );
    }

    if (!data) {
        return (
            <Card className="p-4 bg-zinc-900/50 border-zinc-800">
                <p className="text-sm text-zinc-500">Unable to load movers</p>
            </Card>
        );
    }

    return (
        <Card className="p-4 bg-zinc-900/50 border-zinc-800">
            <Tabs defaultValue="gainers" className="w-full">
                <TabsList className="w-full bg-zinc-800/50 mb-3">
                    <TabsTrigger value="gainers" className="flex-1 text-xs data-[state=active]:bg-emerald-600">
                        Gainers
                    </TabsTrigger>
                    <TabsTrigger value="losers" className="flex-1 text-xs data-[state=active]:bg-red-600">
                        Losers
                    </TabsTrigger>
                    <TabsTrigger value="active" className="flex-1 text-xs data-[state=active]:bg-zinc-600">
                        Active
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="gainers" className="mt-0 space-y-0.5">
                    {data.gainers.slice(0, 5).map((stock) => (
                        <StockRow key={stock.symbol} stock={stock} />
                    ))}
                </TabsContent>

                <TabsContent value="losers" className="mt-0 space-y-0.5">
                    {data.losers.slice(0, 5).map((stock) => (
                        <StockRow key={stock.symbol} stock={stock} />
                    ))}
                </TabsContent>

                <TabsContent value="active" className="mt-0 space-y-0.5">
                    {data.active.slice(0, 5).map((stock) => (
                        <StockRow key={stock.symbol} stock={stock} />
                    ))}
                </TabsContent>
            </Tabs>
        </Card>
    );
}
