import React from 'react';
import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputArea } from './components/InputArea';
import { ResultsDashboard } from './components/ResultsDashboard';
import { useSentimentAnalysis } from './hooks/useSentimentAnalysis';
import type { SentimentAnalysisResult } from './types';
import { Loader } from './components/Loader';

function App(): React.ReactNode {
  const { analyzeTexts, results, isLoading, error } = useSentimentAnalysis();
  const [showDashboard, setShowDashboard] = useState(false);

  const handleAnalysis = useCallback(async (texts: string[]) => {
    setShowDashboard(true);
    await analyzeTexts(texts);
  }, [analyzeTexts]);

  return (
    <div className="min-h-screen bg-brand-bg font-sans text-brand-text">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 xl:col-span-3">
            <InputArea onAnalyze={handleAnalysis} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-8 xl:col-span-9">
            {showDashboard ? (
              <>
                {isLoading && (
                  <div className="flex flex-col items-center justify-center h-96 bg-brand-surface rounded-lg">
                    <Loader />
                    <p className="mt-4 text-lg">Analyzing sentiment... this may take a moment.</p>
                  </div>
                )}
                {error && (
                   <div className="flex items-center justify-center h-96 bg-red-900/20 border border-red-500 rounded-lg p-4">
                     <p className="text-red-400 text-center">{error}</p>
                   </div>
                )}
                {!isLoading && !error && results.length > 0 && <ResultsDashboard results={results} />}
                {!isLoading && !error && results.length === 0 && (
                   <div className="flex items-center justify-center h-96 bg-brand-surface rounded-lg">
                     <p className="text-brand-text-muted">Analysis results will appear here.</p>
                   </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-96 bg-brand-surface rounded-lg">
                <p className="text-brand-text-muted text-lg">Enter text or upload a file to start analysis.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
