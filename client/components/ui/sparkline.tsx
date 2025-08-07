import React from 'react';

interface SparklineProps {
  data: number[];
  color?: string;
  trend?: 'up' | 'down';
}

export function Sparkline({ data, color = '#2C8780', trend }: SparklineProps) {
  if (data.length < 2) return null;

  const width = 60;
  const height = 20;
  const padding = 2;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const trendColor = trend === 'up' ? '#10B981' : trend === 'down' ? '#EF4444' : color;

  return (
    <div className="sparkline">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <polyline
          points={points}
          className="sparkline path"
          style={{ stroke: trendColor }}
        />
        {/* Add a subtle glow effect */}
        <polyline
          points={points}
          className="sparkline path"
          style={{ 
            stroke: trendColor, 
            strokeWidth: 3, 
            opacity: 0.2,
            filter: 'blur(1px)'
          }}
        />
      </svg>
    </div>
  );
}
