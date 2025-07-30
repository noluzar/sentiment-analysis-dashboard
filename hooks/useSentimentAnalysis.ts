import { useState, useCallback } from 'react';
import { getSentimentAnalysis } from '../services/geminiService';
import type { SentimentAnalysisResult } from '../types';

export const useSentimentAnalysis = () => {
  const [results, setResults] = useState<SentimentAnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeTexts = useCallback(async (texts: string[]) => {
    if (!texts || texts.length === 0 || texts.every(t => t.trim() === '')) {
      setError("Please provide some text to analyze.");
      setResults([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const analysisResults = await getSentimentAnalysis(texts);
      setResults(analysisResults);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unexpected error occurred.");
      }
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { analyzeTexts, results, isLoading, error };
};
