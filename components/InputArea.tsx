import React from 'react';
import { useState, useCallback } from 'react';
import { IconFileUpload, IconSparkles } from './Icon';

interface InputAreaProps {
  onAnalyze: (texts: string[]) => void;
  isLoading: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onAnalyze, isLoading }) => {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        // Split by new line for multi-line text files
        setText(fileContent);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = useCallback(() => {
    const textsToAnalyze = text.split('\n').map(t => t.trim()).filter(t => t.length > 0);
    if(textsToAnalyze.length > 0) {
      onAnalyze(textsToAnalyze);
    }
  }, [text, onAnalyze]);
  
  return (
    <div className="bg-brand-surface p-6 rounded-lg shadow-lg h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Input Data</h2>
      
      <div className="flex-grow flex flex-col">
        <label htmlFor="text-input" className="text-sm font-medium text-brand-text-muted mb-2">
          Enter text (one per line for batch analysis)
        </label>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g., The service was exceptionally fast and friendly!"
          className="w-full flex-grow p-3 bg-brand-primary/50 border border-brand-primary rounded-md focus:ring-2 focus:ring-brand-secondary focus:outline-none transition duration-200 resize-none"
          rows={10}
        />
      </div>

      <div className="my-4 flex items-center">
        <div className="flex-grow border-t border-brand-primary"></div>
        <span className="flex-shrink mx-4 text-brand-text-muted">OR</span>
        <div className="flex-grow border-t border-brand-primary"></div>
      </div>

      <div>
        <label htmlFor="file-upload" className="w-full cursor-pointer bg-brand-primary hover:bg-opacity-80 text-brand-text font-semibold py-2 px-4 rounded-md inline-flex items-center justify-center transition duration-200">
          <IconFileUpload className="w-5 h-5 mr-2" />
          <span>Upload .txt File</span>
        </label>
        <input id="file-upload" type="file" className="hidden" accept=".txt" onChange={handleFileChange} />
        {fileName && <p className="text-sm text-brand-text-muted mt-2 truncate">File: {fileName}</p>}
      </div>
      
      <button
        onClick={handleSubmit}
        disabled={isLoading || text.trim() === ''}
        className="w-full mt-6 bg-brand-secondary hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center transition duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        <IconSparkles className="w-5 h-5 mr-2" />
        {isLoading ? 'Analyzing...' : 'Analyze Sentiment'}
      </button>
    </div>
  );
};
