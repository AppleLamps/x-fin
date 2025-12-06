import {
  MarketSnapshotRow,
  MarketSummary,
  WatchlistPanel,
  MoversPanel,
  SectorPerformance,
  LatestUpdates,
} from '@/components/dashboard';

export default function DashboardPage() {
  return (
    <div className="p-6 min-h-[calc(100vh-3.5rem)]">
      {/* Three Column Layout */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Main Content - Left/Center */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Market Snapshot Cards */}
          <section>
            <h1 className="text-lg font-semibold text-white mb-4">Markets</h1>
            <MarketSnapshotRow />
          </section>

          {/* Market Summary */}
          <section>
            <MarketSummary />
          </section>

          {/* Latest Updates */}
          <section>
            <LatestUpdates />
          </section>
        </div>

        {/* Right Rail */}
        <aside className="w-full xl:w-80 flex-shrink-0 space-y-4">
          {/* Watchlist */}
          <WatchlistPanel />

          {/* Movers */}
          <MoversPanel />

          {/* Sector Performance */}
          <SectorPerformance />
        </aside>
      </div>
    </div>
  );
}
