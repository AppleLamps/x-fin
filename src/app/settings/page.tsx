'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { Settings as SettingsIcon, Zap, Globe, Twitter } from 'lucide-react';

export default function SettingsPage() {
    const { settings, updateSettings } = useAppStore();

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <SettingsIcon className="w-6 h-6 text-zinc-400" />
                <h1 className="text-2xl font-bold text-white">Settings</h1>
            </div>

            {/* Model Selection */}
            <Card className="p-5 bg-zinc-900/50 border-zinc-800 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-5 h-5 text-emerald-500" />
                    <h2 className="text-lg font-semibold text-white">AI Model</h2>
                </div>

                <p className="text-sm text-zinc-400 mb-4">
                    Select the xAI Grok model to use for market analysis.
                </p>

                <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 cursor-pointer transition-colors">
                        <input
                            type="radio"
                            name="model"
                            value="grok-4-1-fast"
                            checked={settings.model === 'grok-4-1-fast'}
                            onChange={() => updateSettings({ model: 'grok-4-1-fast' })}
                            className="w-4 h-4 text-emerald-500 bg-zinc-700 border-zinc-600 focus:ring-emerald-500"
                        />
                        <div>
                            <span className="text-sm font-medium text-white">Grok 4.1 Fast</span>
                            <p className="text-xs text-zinc-500">Latest model with improved reasoning</p>
                        </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 cursor-pointer transition-colors">
                        <input
                            type="radio"
                            name="model"
                            value="grok-4-fast"
                            checked={settings.model === 'grok-4-fast'}
                            onChange={() => updateSettings({ model: 'grok-4-fast' })}
                            className="w-4 h-4 text-emerald-500 bg-zinc-700 border-zinc-600 focus:ring-emerald-500"
                        />
                        <div>
                            <span className="text-sm font-medium text-white">Grok 4 Fast</span>
                            <p className="text-xs text-zinc-500">Stable fallback model</p>
                        </div>
                    </label>
                </div>
            </Card>

            {/* Search Tools */}
            <Card className="p-5 bg-zinc-900/50 border-zinc-800 mb-6">
                <h2 className="text-lg font-semibold text-white mb-4">Search Tools</h2>

                <div className="space-y-4">
                    {/* Web Search */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
                        <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-blue-400" />
                            <div>
                                <span className="text-sm font-medium text-white">Web Search</span>
                                <p className="text-xs text-zinc-500">Search the web for market information</p>
                            </div>
                        </div>
                        <Button
                            variant={settings.enableWebSearch ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateSettings({ enableWebSearch: !settings.enableWebSearch })}
                            className={settings.enableWebSearch
                                ? 'bg-emerald-600 hover:bg-emerald-700'
                                : 'border-zinc-700 text-zinc-400'
                            }
                        >
                            {settings.enableWebSearch ? 'Enabled' : 'Disabled'}
                        </Button>
                    </div>

                    {/* X Search */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
                        <div className="flex items-center gap-3">
                            <Twitter className="w-5 h-5 text-zinc-400" />
                            <div>
                                <span className="text-sm font-medium text-white">X Search</span>
                                <p className="text-xs text-zinc-500">Search X/Twitter for sentiment (coming soon)</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled
                            className="border-zinc-700 text-zinc-500"
                        >
                            Coming Soon
                        </Button>
                    </div>
                </div>
            </Card>

            {/* API Info */}
            <Card className="p-5 bg-zinc-900/50 border-zinc-800">
                <h2 className="text-lg font-semibold text-white mb-4">API Configuration</h2>

                <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                        <span className="text-zinc-400">API Status</span>
                        <span className="text-emerald-400">● Connected</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                        <span className="text-zinc-400">Cache TTL</span>
                        <span className="text-zinc-300">5 minutes</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <span className="text-zinc-400">Data Source</span>
                        <span className="text-zinc-300">Mock (Development)</span>
                    </div>
                </div>

                <p className="mt-4 text-xs text-zinc-600">
                    Configure your XAI_API_KEY in .env.local to enable live AI features.
                </p>
            </Card>
        </div>
    );
}
