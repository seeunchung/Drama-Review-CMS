import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface EpisodeTrendChartProps {
  data: { episode: number; count: number }[];
}

export const EpisodeTrendChart: React.FC<EpisodeTrendChartProps> = ({ data }) => {
  return (
    <div className="episode-trend-chart-panel panel">
      <div className="panel-header">
        <h3>회차별 리뷰 등록 추이</h3>
        <p>각 에피소드별 유저 반응(리뷰 수)을 분석하여 이탈 구간을 파악합니다.</p>
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--line-soft)" />
            <XAxis 
              dataKey="episode" 
              tickFormatter={(value) => `${value}화`}
              tick={{ fill: 'var(--ink-soft)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--line-soft)' }}
            />
            <YAxis 
              tick={{ fill: 'var(--ink-soft)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--line-soft)' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--surface-1)', 
                border: '1px solid var(--line-soft)',
                borderRadius: '12px',
                color: 'var(--ink-strong)'
              }}
              formatter={(value) => [`${value}개`, '리뷰 수']}
              labelFormatter={(label) => `${label}화 에피소드`}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="var(--accent)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorCount)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
