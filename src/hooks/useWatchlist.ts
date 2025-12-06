'use client';

import { useState, useEffect, useCallback } from 'react';
import { WatchlistItem } from '@/types';

const WATCHLIST_STORAGE_KEY = 'xfin-watchlist';
const DEFAULT_SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];

export function useWatchlist() {
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load watchlist from localStorage on mount
    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored) as WatchlistItem[];
                setWatchlist(parsed);
            } else {
                // Initialize with default symbols
                const defaultList: WatchlistItem[] = DEFAULT_SYMBOLS.map(symbol => ({
                    symbol,
                    addedAt: new Date().toISOString(),
                }));
                setWatchlist(defaultList);
                localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(defaultList));
            }
        } catch (error) {
            console.error('Failed to load watchlist:', error);
            setWatchlist([]);
        }

        setIsLoaded(true);
    }, []);

    // Save to localStorage whenever watchlist changes
    useEffect(() => {
        if (!isLoaded || typeof window === 'undefined') return;

        try {
            localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
        } catch (error) {
            console.error('Failed to save watchlist:', error);
        }
    }, [watchlist, isLoaded]);

    const addSymbol = useCallback((symbol: string) => {
        const upperSymbol = symbol.toUpperCase().trim();

        if (!upperSymbol || watchlist.some(item => item.symbol === upperSymbol)) {
            return false; // Already exists or invalid
        }

        setWatchlist(prev => [
            ...prev,
            { symbol: upperSymbol, addedAt: new Date().toISOString() },
        ]);

        return true;
    }, [watchlist]);

    const removeSymbol = useCallback((symbol: string) => {
        const upperSymbol = symbol.toUpperCase();
        setWatchlist(prev => prev.filter(item => item.symbol !== upperSymbol));
    }, []);

    const isInWatchlist = useCallback((symbol: string) => {
        return watchlist.some(item => item.symbol === symbol.toUpperCase());
    }, [watchlist]);

    const clearWatchlist = useCallback(() => {
        setWatchlist([]);
    }, []);

    const resetToDefaults = useCallback(() => {
        const defaultList: WatchlistItem[] = DEFAULT_SYMBOLS.map(symbol => ({
            symbol,
            addedAt: new Date().toISOString(),
        }));
        setWatchlist(defaultList);
    }, []);

    return {
        watchlist,
        symbols: watchlist.map(item => item.symbol),
        addSymbol,
        removeSymbol,
        isInWatchlist,
        clearWatchlist,
        resetToDefaults,
        isLoaded,
    };
}
