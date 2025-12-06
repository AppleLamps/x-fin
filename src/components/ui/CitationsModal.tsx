'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ExternalLink } from 'lucide-react';

interface CitationsModalProps {
    isOpen: boolean;
    onClose: () => void;
    citations: string[];
}

export function CitationsModal({ isOpen, onClose, citations }: CitationsModalProps) {
    // Extract domain from URL for display
    const getDomain = (url: string): string => {
        try {
            const domain = new URL(url).hostname;
            return domain.replace('www.', '');
        } catch {
            return url;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-white">Sources</DialogTitle>
                </DialogHeader>

                <div className="mt-2 space-y-2">
                    {citations.length === 0 ? (
                        <p className="text-sm text-zinc-500">No sources available</p>
                    ) : (
                        citations.map((citation, index) => (
                            <a
                                key={index}
                                href={citation}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors group"
                            >
                                <div className="w-6 h-6 rounded bg-zinc-700 flex items-center justify-center text-xs text-zinc-400">
                                    {index + 1}
                                </div>
                                <span className="flex-1 text-sm text-zinc-300 truncate group-hover:text-white">
                                    {getDomain(citation)}
                                </span>
                                <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" />
                            </a>
                        ))
                    )}
                </div>

                <p className="mt-4 text-[10px] text-zinc-600">
                    Sources are provided by AI web search and may not be comprehensive.
                </p>
            </DialogContent>
        </Dialog>
    );
}
