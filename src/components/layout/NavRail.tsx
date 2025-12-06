'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    TrendingUp,
    Bitcoin,
    Calendar,
    Filter,
    Star,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

interface NavItem {
    icon: React.ElementType;
    label: string;
    href: string;
    isPlaceholder?: boolean;
}

const navItems: NavItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: TrendingUp, label: 'Markets', href: '/markets' },
    { icon: Bitcoin, label: 'Crypto', href: '/crypto', isPlaceholder: true },
    { icon: Calendar, label: 'Earnings', href: '/earnings', isPlaceholder: true },
    { icon: Filter, label: 'Screener', href: '/screener', isPlaceholder: true },
    { icon: Star, label: 'Watchlist', href: '/watchlist' },
];

export function NavRail() {
    const pathname = usePathname();
    const { isNavCollapsed, toggleNav } = useAppStore();

    return (
        <nav
            className={cn(
                'fixed left-0 top-0 h-full bg-zinc-950 border-r border-zinc-800 z-40 transition-all duration-300 flex flex-col',
                isNavCollapsed ? 'w-16' : 'w-56'
            )}
        >
            {/* Logo */}
            <div className="h-14 flex items-center justify-center border-b border-zinc-800 px-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">XF</span>
                    </div>
                    {!isNavCollapsed && (
                        <span className="text-lg font-semibold text-white">X-Fin</span>
                    )}
                </Link>
            </div>

            {/* Nav Items */}
            <div className="flex-1 py-4 space-y-1 px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.isPlaceholder ? '#' : item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                                isActive
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200',
                                item.isPlaceholder && 'opacity-50 cursor-not-allowed'
                            )}
                            onClick={(e) => item.isPlaceholder && e.preventDefault()}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {!isNavCollapsed && (
                                <span className="text-sm font-medium truncate">
                                    {item.label}
                                    {item.isPlaceholder && (
                                        <span className="ml-2 text-xs text-zinc-500">(Soon)</span>
                                    )}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Collapse Toggle */}
            <div className="p-2 border-t border-zinc-800">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleNav}
                    className="w-full justify-center text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                    {isNavCollapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <>
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            <span className="text-xs">Collapse</span>
                        </>
                    )}
                </Button>
            </div>
        </nav>
    );
}
