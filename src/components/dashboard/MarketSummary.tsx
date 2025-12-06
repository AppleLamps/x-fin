'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, ExternalLink, AlertCircle } from 'lucide-react';
import { MarketSummaryResponse, MarketSummarySection } from '@/types';
import { useAppStore } from '@/lib/store';
import { CitationsModal } from '@/components/ui/CitationsModal';

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
}

export function MarketSummary() {
    const [data, setData] = useState<MarketSummaryResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { openCitationsModal, citationsModalOpen, citationsModalData, closeCitationsModal } = useAppStore();

    const fetchSummary = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/ai/market-summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ region: 'US' }),
            });

            if (!response.ok) throw new Error('Failed to fetch market summary');

            const result: MarketSummaryResponse = await response.json();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
    }, []);

    if (isLoading) {
        return (
            <Card className="p-5 bg-zinc-900/50 border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i}>
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-3/4 mt-1" />
                        </div>
                    ))}
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="p-5 bg-zinc-900/50 border-zinc-800">
                <div className="flex items-center gap-2 text-amber-500 mb-4">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">Unable to load market summary</span>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchSummary}
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                    <RefreshCw className="w-3 h-3 mr-2" />
                    Try Again
                </Button>
            </Card>
        );
    }

    return (
        <>
            <Card className="p-5 bg-zinc-900/50 border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-white">Market Summary</h2>
                    <div className="flex items-center gap-2">
                        {data && (
                            <span className="text-xs text-zinc-500">
                                Updated {formatTimeAgo(data.generatedAt)}
                            </span>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={fetchSummary}
                            disabled={isLoading}
                            className="h-7 w-7 p-0 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    {data?.sections.map((section: MarketSummarySection, index: number) => (
                        <div key={index} className="border-l-2 border-zinc-700 pl-3">
                            <h3 className="text-xs font-medium text-emerald-400 mb-1">
                                {section.title}
                            </h3>
                            <p className="text-sm text-zinc-300 leading-relaxed">
                                {section.summary}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Sources Link */}
                {data && data.citations.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-zinc-800">
                        <button
                            onClick={() => openCitationsModal(data.citations)}
                            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                            <ExternalLink className="w-3 h-3" />
                            Sources: {data.citations.length}
                        </button>
                    </div>
                )}

                {/* Disclaimer */}
                <p className="mt-4 text-[10px] text-zinc-600">
                    This summary is AI-generated and is not financial advice. Always conduct your own research.
                </p>
            </Card>

            <CitationsModal
                isOpen={citationsModalOpen}
                onClose={closeCitationsModal}
                citations={citationsModalData}
            />
        </>
    );
}
