import React from 'react';
import type { SentimentAnalysisResult } from '../types';
import { exportAsJSON, exportAsCSV, exportAsPDF } from '../utils/export';
import { IconDocumentDownload } from './Icon';

interface ExportButtonsProps {
  results: SentimentAnalysisResult[];
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ results }) => {
  if (results.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-brand-text-muted mr-2 hidden sm:inline">Export as:</span>
      <button onClick={() => exportAsJSON(results)} className="p-2 bg-brand-primary hover:bg-opacity-80 rounded-md transition" title="Export as JSON">
        JSON
      </button>
      <button onClick={() => exportAsCSV(results)} className="p-2 bg-brand-primary hover:bg-opacity-80 rounded-md transition" title="Export as CSV">
        CSV
      </button>
      <button onClick={() => exportAsPDF(results)} className="p-2 bg-brand-primary hover:bg-opacity-80 rounded-md transition" title="Export as PDF">
        PDF
      </button>
    </div>
  );
};
