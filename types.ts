export enum Sentiment {
  Positive = 'positive',
  Negative = 'negative',
  Neutral = 'neutral',
}

export interface SentimentAnalysisResult {
  id: string;
  text: string;
  sentiment: Sentiment;
  confidence: number;
  keywords: string[];
  explanation: string;
}
