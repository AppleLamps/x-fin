import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ModelName } from './ai/config';

interface AppSettings {
    model: ModelName;
    enableWebSearch: boolean;
    enableXSearch: boolean;
}

interface AppState {
    // Settings
    settings: AppSettings;
    updateSettings: (settings: Partial<AppSettings>) => void;

    // UI State
    isNavCollapsed: boolean;
    toggleNav: () => void;

    // Citations modal
    citationsModalOpen: boolean;
    citationsModalData: string[];
    openCitationsModal: (citations: string[]) => void;
    closeCitationsModal: () => void;

    // Loading states
    isLoadingMarketSummary: boolean;
    setLoadingMarketSummary: (loading: boolean) => void;
    isLoadingTickerBrief: boolean;
    setLoadingTickerBrief: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            // Settings with defaults
            settings: {
                model: 'grok-4-1-fast',
                enableWebSearch: true,
                enableXSearch: false,
            },
            updateSettings: (newSettings) =>
                set((state) => ({
                    settings: { ...state.settings, ...newSettings },
                })),

            // UI State
            isNavCollapsed: false,
            toggleNav: () => set((state) => ({ isNavCollapsed: !state.isNavCollapsed })),

            // Citations modal
            citationsModalOpen: false,
            citationsModalData: [],
            openCitationsModal: (citations) =>
                set({ citationsModalOpen: true, citationsModalData: citations }),
            closeCitationsModal: () =>
                set({ citationsModalOpen: false, citationsModalData: [] }),

            // Loading states
            isLoadingMarketSummary: false,
            setLoadingMarketSummary: (loading) => set({ isLoadingMarketSummary: loading }),
            isLoadingTickerBrief: false,
            setLoadingTickerBrief: (loading) => set({ isLoadingTickerBrief: loading }),
        }),
        {
            name: 'xfin-storage',
            partialize: (state) => ({ settings: state.settings }),
        }
    )
);
