# X-Fin: Market Intelligence Dashboard

A modern, AI-powered market intelligence dashboard inspired by Perplexity Finance. Built with Next.js 14, TypeScript, and powered by xAI's Grok model with web search capabilities.

![X-Fin Dashboard](docs/screenshot.png)

## Features

- 📊 **Real-time Market Overview** - Futures, VIX, sector performance, and market movers
- 🤖 **AI-Powered Analysis** - Market summaries and stock briefs using xAI Grok
- 🔍 **Web Search Integration** - AI uses real-time web search for up-to-date information
- 📚 **Source Citations** - Transparent sourcing for all AI-generated content
- ⭐ **Watchlist** - Track your favorite stocks with localStorage persistence
- 🎨 **Modern Dark UI** - Clean, professional design inspired by Perplexity Finance

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **State**: Zustand + localStorage
- **AI**: xAI Grok (grok-4-1-fast)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- xAI API key (optional for mock mode)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/x-fin.git
cd x-fin
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` and add your xAI API key:
```env
XAI_API_KEY=your-xai-api-key-here
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API route handlers
│   │   ├── ai/           # AI endpoints (market-summary, ticker-brief)
│   │   └── market/       # Market data endpoints
│   ├── ticker/[symbol]/  # Ticker detail page
│   ├── watchlist/        # Watchlist page
│   └── settings/         # Settings page
├── components/
│   ├── charts/           # Chart components (Sparkline)
│   ├── dashboard/        # Dashboard-specific components
│   ├── layout/           # Layout components (NavRail, Header)
│   ├── ticker/           # Ticker page components
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
├── lib/
│   ├── ai/              # xAI Grok client and prompts
│   ├── market-data/     # Market data providers
│   ├── cache.ts         # In-memory caching
│   └── store.ts         # Zustand store
└── types/               # TypeScript type definitions
```

## API Endpoints

### `POST /api/ai/market-summary`

Generate an AI-powered market summary.

**Request:**
```json
{
  "region": "US",
  "focus": "tech"
}
```

**Response:**
```json
{
  "generatedAt": "2024-01-15T10:30:00.000Z",
  "sections": [
    { "title": "Macro/Fed", "summary": "..." },
    { "title": "Equities Breadth", "summary": "..." }
  ],
  "citations": ["https://source1.com", "https://source2.com"]
}
```

### `POST /api/ai/ticker-brief`

Generate an AI analysis brief for a specific stock.

**Request:**
```json
{
  "symbol": "AAPL"
}
```

**Response:**
```json
{
  "symbol": "AAPL",
  "overview": "Apple Inc. is a global technology leader...",
  "bullCase": ["Strong services growth", "..."],
  "bearCase": ["iPhone sales slowing", "..."],
  "keyRisks": ["Regulatory scrutiny", "..."],
  "watchItems": ["iPhone 16 sales", "..."],
  "citations": ["https://source1.com"]
}
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `XAI_API_KEY` | Your xAI API key | Required for AI |
| `XAI_MODEL` | Primary Grok model | `grok-4-1-fast` |
| `XAI_FALLBACK_MODEL` | Fallback model | `grok-4-fast` |
| `CACHE_TTL_SECONDS` | Cache duration | `300` (5 min) |

### Model Configuration

The AI client is configured in `src/lib/ai/config.ts`:

```typescript
export const AI_CONFIG = {
  primaryModel: 'grok-4-1-fast',
  fallbackModel: 'grok-4-fast',
  tools: {
    webSearch: { enabled: true },
    xSearch: { enabled: false }, // Scaffolded
  },
};
```

## Adding Real Market Data

The project uses a provider pattern for market data. To add a real data source:

1. Create a new provider implementing `MarketDataProvider`:

```typescript
// src/lib/market-data/AlphaVantageProvider.ts
import { MarketDataProvider } from './MarketDataProvider';

export class AlphaVantageProvider implements MarketDataProvider {
  async getFuturesSnapshot() {
    // Implement API call to Alpha Vantage
  }
  
  async getVix() {
    // Implement
  }
  
  // ... other methods
}
```

2. Update the API routes to use your provider:

```typescript
// src/app/api/market/route.ts
import { AlphaVantageProvider } from '@/lib/market-data/AlphaVantageProvider';

const provider = new AlphaVantageProvider();
```

### Suggested Data Providers

- **Alpha Vantage** - Free tier available, good for getting started
- **Polygon.io** - Real-time data, WebSocket support
- **IEX Cloud** - Comprehensive market data
- **Yahoo Finance** - Free, unofficial API available

## Testing

Run the test suite:

```bash
npm run test
```

Tests cover:
- MockMarketDataProvider methods
- GrokClient JSON parsing and sanitization
- Response validation

## Future Extensions

The following features are scaffolded for future implementation:

- [ ] **Earnings Calendar** - Upcoming earnings dates
- [ ] **Stock Screener** - Filter stocks by criteria
- [ ] **Price Alerts** - Notifications for price movements
- [ ] **Portfolio View** - Track your holdings
- [ ] **X Search** - Search X/Twitter for sentiment
- [ ] **Domain Allowlist** - Trust specific sources

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.

## Disclaimer

This application is for educational and informational purposes only. The AI-generated content is not financial advice. Always conduct your own research before making investment decisions.

---

Built with ❤️ using [Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com), and [xAI](https://x.ai).
