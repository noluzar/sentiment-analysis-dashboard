import React from 'react';
import type { SentimentAnalysisResult } from '../types';
import { Sentiment } from '../types';
import { IconCheckCircle, IconXCircle, IconMinusCircle, IconLightBulb } from './Icon';

interface SentimentDetailCardProps {
  result: SentimentAnalysisResult;
}

const sentimentStyles = {
  [Sentiment.Positive]: {
    borderColor: 'border-sentiment-positive',
    bgColor: 'bg-sentiment-positive/10',
    textColor: 'text-sentiment-positive',
    icon: <IconCheckCircle className="w-6 h-6" />
  },
  [Sentiment.Negative]: {
    borderColor: 'border-sentiment-negative',
    bgColor: 'bg-sentiment-negative/10',
    textColor: 'text-sentiment-negative',
    icon: <IconXCircle className="w-6 h-6" />
  },
  [Sentiment.Neutral]: {
    borderColor: 'border-sentiment-neutral',
    bgColor: 'bg-sentiment-neutral/10',
    textColor: 'text-sentiment-neutral',
    icon: <IconMinusCircle className="w-6 h-6" />
  },
};

export const SentimentDetailCard: React.FC<SentimentDetailCardProps> = ({ result }) => {
  const styles = sentimentStyles[result.sentiment] || sentimentStyles[Sentiment.Neutral];
  const confidencePercentage = (result.confidence * 100).toFixed(1);

  return (
    <div className={`border-l-4 ${styles.borderColor} ${styles.bgColor} p-5 rounded-lg shadow-md transition-all hover:shadow-lg`}>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-3">
        <div className={`flex items-center gap-3 font-bold text-xl capitalize ${styles.textColor}`}>
          {styles.icon}
          <span>{result.sentiment}</span>
        </div>
        <div className="text-sm text-brand-text-muted mt-2 md:mt-0">
          Confidence: <span className={`font-semibold ${styles.textColor}`}>{confidencePercentage}%</span>
        </div>
      </div>
      
      <p className="text-brand-text mb-4 italic border-l-2 border-brand-primary pl-3">"{result.text}"</p>
      
      <div className="space-y-3">
        <div>
          <h4 className="font-semibold text-brand-text-muted mb-2">Sentiment Drivers (Keywords)</h4>
          <div className="flex flex-wrap gap-2">
            {result.keywords.map((keyword, index) => (
              <span key={index} className="bg-brand-primary text-brand-text text-sm font-medium px-3 py-1 rounded-full">
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-brand-text-muted mb-2 flex items-center">
             <IconLightBulb className="w-5 h-5 mr-2 text-yellow-400" />
             Explanation
          </h4>
          <p className="text-sm text-brand-text">{result.explanation}</p>
        </div>
      </div>
    </div>
  );
};
