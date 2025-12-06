'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { SectorData } from '@/types';

export function SectorPerformance() {
    const [data, setData] = useState<SectorData[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/market');
                if (response.ok) {
                    const result = await response.json();
                    setData(result.sectors);
                }
            } catch (error) {
                console.error('Failed to fetch sectors:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return (
            <Card className="p-4 bg-zinc-900/50 border-zinc-800">
                <Skeleton className="h-4 w-32 mb-3" />
                <div className="space-y-2">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-5 w-full" />
                    ))}
                </div>
            </Card>
        );
    }

    if (!data) {
        return (
            <Card className="p-4 bg-zinc-900/50 border-zinc-800">
                <p className="text-sm text-zinc-500">Unable to load sectors</p>
            </Card>
        );
    }

    // Sort by absolute change for better visibility
    const sortedSectors = [...data].sort(
        (a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent)
    );

    return (
        <Card className="p-4 bg-zinc-900/50 border-zinc-800">
            <h3 className="text-sm font-semibold text-white mb-3">Sector Performance</h3>

            <div className="space-y-1.5">
                {sortedSectors.slice(0, 8).map((sector) => {
                    const isPositive = sector.changePercent >= 0;
                    const absPercent = Math.abs(sector.changePercent);
                    const maxWidth = 60; // Max bar width percentage

                    return (
                        <div key={sector.name} className="flex items-center gap-2">
                            <span className="text-xs text-zinc-400 w-24 truncate flex-shrink-0">
                                {sector.name}
                            </span>

                            <div className="flex-1 h-4 bg-zinc-800 rounded overflow-hidden">
                                <div
                                    className={`h-full rounded transition-all ${isPositive ? 'bg-emerald-600' : 'bg-red-600'
                                        }`}
                                    style={{
                                        width: `${Math.min(absPercent * 20, maxWidth)}%`,
                                    }}
                                />
                            </div>

                            <span
                                className={`text-xs font-medium w-12 text-right ${isPositive ? 'text-emerald-500' : 'text-red-500'
                                    }`}
                            >
                                {isPositive ? '+' : ''}
                                {sector.changePercent.toFixed(2)}%
                            </span>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
