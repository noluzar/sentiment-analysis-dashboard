import type { SentimentAnalysisResult } from '../types';

// These globals are defined by the scripts in index.html
declare var jspdf: any;
declare var Papa: any;

export const exportAsJSON = (data: SentimentAnalysisResult[]) => {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = "sentiment_analysis_results.json";
  link.click();
};

export const exportAsCSV = (data: SentimentAnalysisResult[]) => {
  const csvData = data.map(item => ({
    sentiment: item.sentiment,
    confidence: item.confidence,
    keywords: `"${item.keywords.join(", ")}"`,
    explanation: `"${item.explanation.replace(/"/g, '""')}"`,
    text: `"${item.text.replace(/"/g, '""')}"`
  }));
  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "sentiment_analysis_results.csv");
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportAsPDF = (data: SentimentAnalysisResult[]) => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF();

  doc.text("Sentiment Analysis Report", 14, 16);
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

  const tableColumn = ["Sentiment", "Confidence", "Text", "Explanation"];
  const tableRows: (string | number)[][] = [];

  data.forEach(item => {
    const row = [
      item.sentiment,
      item.confidence.toFixed(2),
      item.text.substring(0, 50) + (item.text.length > 50 ? '...' : ''),
      item.explanation.substring(0, 60) + (item.explanation.length > 60 ? '...' : '')
    ];
    tableRows.push(row);
  });
  
  (doc as any).autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 30,
    theme: 'grid',
    headStyles: { fillColor: [15, 52, 96] }, // #0f3460
    styles: {
      font: 'helvetica',
      fontSize: 8
    },
  });

  doc.save("sentiment_analysis_report.pdf");
};
