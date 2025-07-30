import React from 'react';
import { useMemo } from 'react';
import type { SentimentAnalysisResult } from '../types';
import { Sentiment } from '../types';

// Recharts is loaded globally via a script tag in index.html.
// We access it inside the component to ensure it's available at render time.

interface SentimentChartProps {
  results: SentimentAnalysisResult[];
}

const COLORS = {
  [Sentiment.Positive]: '#22c55e', // text-sentiment-positive
  [Sentiment.Negative]: '#ef4444', // text-sentiment-negative
  [Sentiment.Neutral]: '#6b7280',  // text-sentiment-neutral
};

export const SentimentChart: React.FC<SentimentChartProps> = ({ results }) => {
  const Recharts = (window as any).Recharts;

  const data = useMemo(() => {
    const counts = {
      [Sentiment.Positive]: 0,
      [Sentiment.Negative]: 0,
      [Sentiment.Neutral]: 0,
    };
    results.forEach(r => {
      if(r.sentiment in counts) {
        counts[r.sentiment]++;
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).filter(d => d.value > 0);
  }, [results]);

  if (!Recharts) {
    return <div className="text-center text-brand-text-muted h-64 flex items-center justify-center">Chart library is loading...</div>;
  }
  
  const { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } = Recharts;

  if (data.length === 0) {
    return <div className="text-center text-brand-text-muted h-64 flex items-center justify-center">No data to display chart.</div>;
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
              const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
              const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
              return (
                <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                  {`${(percent * 100).toFixed(0)}%`}
                </text>
              );
            }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name as Sentiment]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a2e', // brand-bg
              borderColor: '#0f3460', // brand-primary
            }}
          />
          <Legend formatter={(value) => <span style={{color: '#dcdcdc'}}>{value}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
