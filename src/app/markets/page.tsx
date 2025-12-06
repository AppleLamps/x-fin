import { Card } from '@/components/ui/card';
import { Construction } from 'lucide-react';

export default function MarketsPage() {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6">Markets</h1>

            <Card className="p-12 bg-zinc-900/50 border-zinc-800 text-center">
                <Construction className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">Coming Soon</h2>
                <p className="text-zinc-400 mb-4">
                    Detailed market overview with indices, sectors, and global markets.
                </p>
                <p className="text-sm text-zinc-500">
                    This feature is planned for a future release.
                </p>
            </Card>
        </div>
    );
}
