/**
 * Simple in-memory cache with TTL support
 */

interface CacheEntry<T> {
    data: T;
    expiresAt: number;
}

class MemoryCache {
    private cache: Map<string, CacheEntry<unknown>> = new Map();
    private defaultTtlMs: number;

    constructor(defaultTtlSeconds: number = 300) {
        this.defaultTtlMs = defaultTtlSeconds * 1000;
    }

    /**
     * Get a value from the cache
     */
    get<T>(key: string): T | null {
        const entry = this.cache.get(key) as CacheEntry<T> | undefined;

        if (!entry) {
            return null;
        }

        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    /**
     * Set a value in the cache
     */
    set<T>(key: string, data: T, ttlMs?: number): void {
        const expiresAt = Date.now() + (ttlMs ?? this.defaultTtlMs);
        this.cache.set(key, { data, expiresAt });
    }

    /**
     * Check if a key exists and is not expired
     */
    has(key: string): boolean {
        return this.get(key) !== null;
    }

    /**
     * Delete a specific key
     */
    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    /**
     * Clear all expired entries
     */
    cleanup(): void {
        const now = Date.now();
        const keys = Array.from(this.cache.keys());
        for (const key of keys) {
            const entry = this.cache.get(key);
            if (entry && now > entry.expiresAt) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * Clear the entire cache
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Get cache stats
     */
    getStats(): { size: number; keys: string[] } {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
        };
    }
}

// Export singleton instance
export const cache = new MemoryCache(
    parseInt(process.env.CACHE_TTL_SECONDS || '300', 10)
);

// Cache key generators
export const cacheKeys = {
    marketSummary: (region: string, focus?: string) =>
        `market-summary:${region}:${focus || 'general'}`,
    tickerBrief: (symbol: string) =>
        `ticker-brief:${symbol.toUpperCase()}`,
    futures: () => 'futures-snapshot',
    vix: () => 'vix-data',
    sectors: () => 'sector-performance',
    movers: () => 'movers-data',
    quote: (symbol: string) => `quote:${symbol.toUpperCase()}`,
};
