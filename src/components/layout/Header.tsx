'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, Share2, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/ticker/${searchQuery.toUpperCase().trim()}`);
            setSearchQuery('');
        }
    };

    return (
        <header className="h-14 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-6 sticky top-0 z-30">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input
                        type="text"
                        placeholder="Search for stocks, crypto, and more..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-200 placeholder:text-zinc-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                    />
                </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-2 ml-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800 gap-2"
                    disabled
                >
                    <Bell className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs">Price Alert</span>
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800 gap-2"
                    disabled
                >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs">Share</span>
                </Button>

                <Link href="/settings">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                    >
                        <Settings className="w-4 h-4" />
                    </Button>
                </Link>
            </div>
        </header>
    );
}
