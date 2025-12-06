'use client';

import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparklineProps {
    data: number[];
    color?: 'green' | 'red' | 'neutral';
    height?: number;
}

export function Sparkline({ data, color = 'neutral', height = 32 }: SparklineProps) {
    // Convert array to chart-compatible format
    const chartData = data.map((value, index) => ({ value, index }));

    const getColor = () => {
        switch (color) {
            case 'green':
                return '#10b981'; // emerald-500
            case 'red':
                return '#ef4444'; // red-500
            default:
                return '#a1a1aa'; // zinc-400
        }
    };

    return (
        <ResponsiveContainer width="100%" height={height}>
            <LineChart data={chartData}>
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke={getColor()}
                    strokeWidth={1.5}
                    dot={false}
                    isAnimationActive={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
