import { GrokClient } from '@/lib/ai/grok-client';

describe('GrokClient', () => {
    describe('parseJsonResponse', () => {
        it('should parse valid JSON', () => {
            const json = '{"key": "value", "number": 42}';
            const result = GrokClient.parseJsonResponse<{ key: string; number: number }>(json);

            expect(result.key).toBe('value');
            expect(result.number).toBe(42);
        });

        it('should handle JSON wrapped in markdown code blocks', () => {
            const json = '```json\n{"key": "value"}\n```';
            const result = GrokClient.parseJsonResponse<{ key: string }>(json);

            expect(result.key).toBe('value');
        });

        it('should handle JSON with just triple backticks', () => {
            const json = '```\n{"key": "value"}\n```';
            const result = GrokClient.parseJsonResponse<{ key: string }>(json);

            expect(result.key).toBe('value');
        });

        it('should extract JSON from text with surrounding content', () => {
            const json = 'Here is the result:\n{"key": "value"}\nEnd of result';
            const result = GrokClient.parseJsonResponse<{ key: string }>(json);

            expect(result.key).toBe('value');
        });

        it('should handle nested objects', () => {
            const json = '{"outer": {"inner": "value"}, "array": [1, 2, 3]}';
            const result = GrokClient.parseJsonResponse<{
                outer: { inner: string };
                array: number[];
            }>(json);

            expect(result.outer.inner).toBe('value');
            expect(result.array).toEqual([1, 2, 3]);
        });

        it('should throw on invalid JSON', () => {
            const invalidJson = 'not valid json';

            expect(() => GrokClient.parseJsonResponse(invalidJson)).toThrow();
        });
    });

    describe('sanitizeText', () => {
        it('should remove HTML tags', () => {
            const text = '<script>alert("xss")</script>Hello <b>world</b>';
            const result = GrokClient.sanitizeText(text);

            expect(result).toBe('alert("xss")Hello world');
        });

        it('should remove javascript: protocol', () => {
            const text = 'Click javascript:alert("xss") here';
            const result = GrokClient.sanitizeText(text);

            expect(result).toBe('Click alert("xss") here');
        });

        it('should remove event handlers', () => {
            const text = 'onclick=alert("xss") content';
            const result = GrokClient.sanitizeText(text);

            expect(result).toBe('alert("xss") content');
        });

        it('should trim whitespace', () => {
            const text = '  Hello World  ';
            const result = GrokClient.sanitizeText(text);

            expect(result).toBe('Hello World');
        });

        it('should handle normal text unchanged', () => {
            const text = 'Normal market analysis text with numbers 123.45';
            const result = GrokClient.sanitizeText(text);

            expect(result).toBe(text);
        });
    });
});

describe('Market Summary Response Parsing', () => {
    it('should parse market summary response correctly', () => {
        const mockResponse = `{
      "sections": [
        { "title": "Macro/Fed", "summary": "Fed signals patience on rate cuts" },
        { "title": "Equities", "summary": "Broad market participation improves" }
      ]
    }`;

        const result = GrokClient.parseJsonResponse<{
            sections: Array<{ title: string; summary: string }>;
        }>(mockResponse);

        expect(result.sections.length).toBe(2);
        expect(result.sections[0].title).toBe('Macro/Fed');
        expect(result.sections[0].summary).toBe('Fed signals patience on rate cuts');
    });
});

describe('Ticker Brief Response Parsing', () => {
    it('should parse ticker brief response correctly', () => {
        const mockResponse = `{
      "overview": "Apple is a technology company",
      "bullCase": ["Strong services growth", "Ecosystem lock-in"],
      "bearCase": ["iPhone sales slowing", "China risks"],
      "keyRisks": ["Regulatory scrutiny"],
      "watchItems": ["iPhone 16 sales"]
    }`;

        const result = GrokClient.parseJsonResponse<{
            overview: string;
            bullCase: string[];
            bearCase: string[];
            keyRisks: string[];
            watchItems: string[];
        }>(mockResponse);

        expect(result.overview).toBe('Apple is a technology company');
        expect(result.bullCase.length).toBe(2);
        expect(result.bearCase.length).toBe(2);
        expect(result.keyRisks.length).toBe(1);
        expect(result.watchItems.length).toBe(1);
    });
});
