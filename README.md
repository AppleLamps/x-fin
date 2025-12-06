# X-Fin: Market Intelligence Dashboard

A modern, AI-powered market intelligence dashboard inspired by Perplexity Finance. Built with Next.js 14, TypeScript, and powered by xAI's Grok model with web search capabilities.

## ✨ Features

- 📊 **Real-time Market Overview** - Futures (S&P, Nasdaq, Dow), VIX, sector performance, and market movers
- 🤖 **AI-Powered Analysis** - Market summaries and stock briefs using xAI Grok with web search
- 🔍 **Web Search Integration** - AI uses real-time web search for up-to-date information
- 📚 **Source Citations** - Transparent sourcing for all AI-generated content
- ⭐ **Watchlist** - Track your favorite stocks with localStorage persistence
- 🎨 **Modern Dark UI** - Clean, professional design with responsive layout

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Charts | Recharts |
| State | Zustand + localStorage |
| AI | xAI Grok (grok-4-1-fast) |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- xAI API key (optional - app works with mock data)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/x-fin.git
cd x-fin

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Edit .env.local and add your xAI API key (optional)
# XAI_API_KEY=your-xai-api-key-here

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── ai/
│   │   │   ├── market-summary/   # POST - AI market summary
│   │   │   └── ticker-brief/     # POST - AI stock analysis
│   │   └── market/
│   │       ├── route.ts          # GET - All market data
│   │       └── quote/[symbol]/   # GET - Individual quote
│   ├── ticker/[symbol]/          # Stock detail page
│   ├── watchlist/                # Watchlist management
│   ├── settings/                 # App settings
│   ├── markets/                  # Markets page (placeholder)
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Dashboard
├── components/
│   ├── charts/
│   │   └── Sparkline.tsx         # Mini line charts
│   ├── dashboard/
│   │   ├── MarketSnapshotRow.tsx # Futures & VIX cards
│   │   ├── MarketSummary.tsx     # AI-generated summary
│   │   ├── WatchlistPanel.tsx    # Watchlist widget
│   │   ├── MoversPanel.tsx       # Gainers/Losers/Active
│   │   ├── SectorPerformance.tsx # Sector bars
│   │   └── LatestUpdates.tsx     # News cards
│   ├── layout/
│   │   ├── NavRail.tsx           # Left navigation
│   │   └── Header.tsx            # Top header with search
│   └── ui/                       # shadcn/ui components
├── hooks/
│   ├── useWatchlist.ts           # Watchlist persistence
│   └── use-toast.ts              # Toast notifications
├── lib/
│   ├── ai/
│   │   ├── config.ts             # Model configuration
│   │   ├── grok-client.ts        # xAI API client
│   │   └── prompts.ts            # System prompts
│   ├── market-data/
│   │   ├── MarketDataProvider.ts # Provider interface
│   │   └── MockMarketDataProvider.ts
│   ├── cache.ts                  # In-memory TTL cache
│   ├── store.ts                  # Zustand store
│   └── utils.ts                  # Utility functions
└── types/
    └── index.ts                  # TypeScript definitions
```

## 🔌 API Endpoints

### Market Summary

```http
POST /api/ai/market-summary
Content-Type: application/json

{
  "region": "US",      // optional, default: "US"
  "focus": "tech"      // optional, focus area
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
  "citations": ["https://...", "https://..."]
}
```

### Ticker Brief

```http
POST /api/ai/ticker-brief
Content-Type: application/json

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
  "citations": ["https://..."]
}
```

### Market Data

```http
GET /api/market
```

Returns futures, VIX, sectors, and movers data.

```http
GET /api/market/quote/AAPL
```

Returns quote for a specific symbol.

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `XAI_API_KEY` | Your xAI API key | Required for AI |
| `XAI_MODEL` | Primary Grok model | `grok-4-1-fast` |
| `XAI_FALLBACK_MODEL` | Fallback model | `grok-4-fast` |
| `CACHE_TTL_SECONDS` | Cache duration | `300` (5 min) |

### Model Configuration

Edit `src/lib/ai/config.ts`:

```typescript
export const AI_CONFIG = {
  primaryModel: 'grok-4-1-fast',
  fallbackModel: 'grok-4-fast',
  tools: {
    webSearch: { enabled: true },
    xSearch: { enabled: false }, // Coming soon
  },
};
```

## 📈 Adding Real Market Data

The app uses a provider pattern. To add a real data source:

1. **Create a new provider:**

```typescript
// src/lib/market-data/AlphaVantageProvider.ts
import { MarketDataProvider } from './MarketDataProvider';

export class AlphaVantageProvider implements MarketDataProvider {
  async getFuturesSnapshot() { /* ... */ }
  async getVix() { /* ... */ }
  async getSectorPerformance() { /* ... */ }
  async getGainersLosers() { /* ... */ }
  async getQuote(symbol: string) { /* ... */ }
  async getQuotes(symbols: string[]) { /* ... */ }
}
```

2. **Update API routes:**

```typescript
// src/app/api/market/route.ts
import { AlphaVantageProvider } from '@/lib/market-data/AlphaVantageProvider';

const provider = new AlphaVantageProvider(process.env.ALPHA_VANTAGE_KEY);
```

### Suggested Data Providers

- **Alpha Vantage** - Free tier, good for starting
- **Polygon.io** - Real-time, WebSocket support
- **IEX Cloud** - Comprehensive market data
- **Finnhub** - Real-time quotes and news

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

Tests cover:
- `MockMarketDataProvider` - all interface methods
- `GrokClient` - JSON parsing and text sanitization

## 📝 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Jest tests |

## 🔮 Roadmap

- [ ] Earnings Calendar integration
- [ ] Stock Screener with filters
- [ ] Price Alerts system
- [ ] Portfolio tracking
- [ ] X/Twitter search integration
- [ ] Domain allowlist for trusted sources
- [ ] Real-time WebSocket updates
- [ ] Mobile app version

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This application is for educational and informational purposes only. The AI-generated content is not financial advice. Always conduct your own research before making investment decisions.

---

Built with ❤️ using [Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com), and [xAI](https://x.ai).
