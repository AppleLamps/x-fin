'use client';

import useSWR from 'swr';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { SectorData } from '@/types';
import { REFRESH_INTERVAL_MS } from '@/lib/config';

const fetchSectors = async (): Promise<SectorData[]> => {
    const response = await fetch('/api/market');

    if (!response.ok) {
        throw new Error('Failed to fetch sectors');
    }

    const result = await response.json();
    return result.sectors ?? [];
};

export function SectorPerformance() {
    const { data, error, isLoading } = useSWR<SectorData[]>(
        'sector-performance',
        fetchSectors,
        {
            refreshInterval: REFRESH_INTERVAL_MS,
        }
    );

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

    if (error) {
        return (
            <Card className="p-4 bg-zinc-900/50 border-zinc-800">
                <p className="text-sm text-zinc-500">Unable to load sectors</p>
            </Card>
        );
    }

    if (!data || data.length === 0) {
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
