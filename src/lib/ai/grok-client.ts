import { AI_CONFIG, ModelName } from './config';

interface GrokTool {
    type: 'web_search' | 'x_search';
}

interface GrokMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface GrokResponseContent {
    type: string;
    text?: string;
}

interface GrokResponse {
    id: string;
    output: GrokResponseContent[];
    citations?: Array<{
        url: string;
        title?: string;
    }>;
    error?: {
        message: string;
        code: string;
    };
}

export interface GrokClientOptions {
    model?: ModelName;
    enableWebSearch?: boolean;
    enableXSearch?: boolean;
    allowedDomains?: string[];
    excludedDomains?: string[];
}

/**
 * Client for interacting with xAI's Grok API
 */
export class GrokClient {
    private apiKey: string;
    private model: ModelName;
    private tools: GrokTool[];

    constructor(options?: GrokClientOptions) {
        const apiKey = process.env.XAI_API_KEY;

        if (!apiKey) {
            throw new Error('XAI_API_KEY environment variable is required');
        }

        this.apiKey = apiKey;
        this.model = options?.model || (AI_CONFIG.primaryModel as ModelName);

        // Build tools array based on configuration
        this.tools = [];

        if (options?.enableWebSearch ?? AI_CONFIG.tools.webSearch.enabled) {
            this.tools.push({ type: 'web_search' });
        }

        if (options?.enableXSearch ?? AI_CONFIG.tools.xSearch.enabled) {
            this.tools.push({ type: 'x_search' });
        }
    }

    /**
     * Send a request to Grok API with tool support
     */
    async sendMessage(
        systemPrompt: string,
        userMessage: string
    ): Promise<{ text: string; citations: string[] }> {
        const messages: GrokMessage[] = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
        ];

        const requestBody = {
            model: this.model,
            messages,
            tools: this.tools.length > 0 ? this.tools : undefined,
        };

        try {
            const response = await fetch(AI_CONFIG.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorText = await response.text();

                // If primary model fails, try fallback
                if (this.model === AI_CONFIG.primaryModel && response.status === 404) {
                    console.warn(`Primary model ${this.model} not available, trying fallback`);
                    this.model = AI_CONFIG.fallbackModel as ModelName;
                    return this.sendMessage(systemPrompt, userMessage);
                }

                throw new Error(`Grok API error: ${response.status} - ${errorText}`);
            }

            const data: GrokResponse = await response.json();

            if (data.error) {
                throw new Error(`Grok API error: ${data.error.message}`);
            }

            // Extract text content from response
            const textContent = data.output
                ?.filter(item => item.type === 'text' && item.text)
                .map(item => item.text)
                .join('') || '';

            // Extract citations
            const citations = data.citations?.map(c => c.url) || [];

            return { text: textContent, citations };
        } catch (error) {
            console.error('Grok API request failed:', error);
            throw error;
        }
    }

    /**
     * Parse JSON response from Grok, handling potential formatting issues
     */
    static parseJsonResponse<T>(text: string): T {
        // Try to extract JSON from the response
        let jsonStr = text.trim();

        // Remove markdown code blocks if present
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.slice(7);
        } else if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.slice(3);
        }

        if (jsonStr.endsWith('```')) {
            jsonStr = jsonStr.slice(0, -3);
        }

        jsonStr = jsonStr.trim();

        // Try to find JSON object in the response
        const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonStr = jsonMatch[0];
        }

        try {
            return JSON.parse(jsonStr) as T;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_error) {
            console.error('Failed to parse JSON response:', jsonStr);
            throw new Error('Failed to parse AI response as JSON');
        }
    }

    /**
     * Sanitize AI response text (remove potentially harmful content)
     */
    static sanitizeText(text: string): string {
        // Remove any HTML tags
        let sanitized = text.replace(/<[^>]*>/g, '');

        // Remove any potential script injections
        sanitized = sanitized.replace(/javascript:/gi, '');
        sanitized = sanitized.replace(/on\w+=/gi, '');

        return sanitized.trim();
    }
}

// Export singleton for common use
let clientInstance: GrokClient | null = null;

export function getGrokClient(options?: GrokClientOptions): GrokClient {
    if (!clientInstance) {
        clientInstance = new GrokClient(options);
    }
    return clientInstance;
}
