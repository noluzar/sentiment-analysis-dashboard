import React from 'react';
import type { SentimentAnalysisResult } from '../types';
import { SentimentChart } from './SentimentChart';
import { SentimentDetailCard } from './SentimentDetailCard';
import { ExportButtons } from './ExportButtons';

interface ResultsDashboardProps {
  results: SentimentAnalysisResult[];
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ results }) => {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Analysis Results</h2>
            <ExportButtons results={results} />
        </div>
        <div className="bg-brand-surface p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-center">Sentiment Distribution</h3>
          <SentimentChart results={results} />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">Comparative Analysis</h3>
        <div className="space-y-4">
          {results.map((result) => (
            <SentimentDetailCard key={result.id} result={result} />
          ))}
        </div>
      </div>
    </div>
  );
};
