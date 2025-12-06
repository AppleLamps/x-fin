// xAI Grok Configuration

export const AI_CONFIG = {
    // Primary model - use grok-4-1-fast if available
    primaryModel: process.env.XAI_MODEL || 'grok-4-1-fast',

    // Fallback model
    fallbackModel: process.env.XAI_FALLBACK_MODEL || 'grok-4-fast',

    // API endpoint
    apiUrl: 'https://api.x.ai/v1/responses',

    // Default tools configuration
    tools: {
        webSearch: {
            enabled: true,
            type: 'web_search' as const,
        },
        xSearch: {
            // Scaffolded but disabled by default
            enabled: false,
            type: 'x_search' as const,
        },
    },

    // Optional domain filters (for future use)
    allowedDomains: [] as string[],
    excludedDomains: [] as string[],

    // Cache settings
    cacheTtlSeconds: parseInt(process.env.CACHE_TTL_SECONDS || '300', 10),
};

export type ModelName = 'grok-4-1-fast' | 'grok-4-fast';
