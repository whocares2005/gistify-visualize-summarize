
import React from 'react';
import { SummaryResult } from '../types';
import KeywordHighlighter from './KeywordHighlighter';
import { Download, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface SummaryDisplayProps {
  summary: SummaryResult | null;
  isLoading: boolean;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary, isLoading }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (!summary) return;
    
    navigator.clipboard.writeText(summary.content);
    setCopied(true);
    toast.success('Summary copied to clipboard!');
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleDownload = () => {
    if (!summary) return;
    
    const element = document.createElement('a');
    
    const fileContent = summary.format === 'bullets' 
      ? summary.content
      : summary.content;
      
    const file = new Blob([fileContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `summary-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast.success('Summary downloaded successfully!');
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white p-6 rounded-lg shadow-sm animate-slide-up flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gistify-300 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gistify-500">Generating summary...</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="w-full bg-white p-6 rounded-lg shadow-sm animate-slide-up flex items-center justify-center h-64">
        <p className="text-muted-foreground">
          Upload content and select an output format to see the summary here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {summary.format === 'gist'
            ? 'Text Summary'
            : summary.format === 'bullets'
            ? 'Bullet Points'
            : 'Visual Summary'}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="p-2 rounded-md hover:bg-gray-100"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <Copy className="h-5 w-5 text-gray-500" />
            )}
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded-md hover:bg-gray-100"
            title="Download summary"
          >
            <Download className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        {summary.format === 'image' && summary.imageUrl ? (
          <div className="flex flex-col items-center">
            <img
              src={summary.imageUrl}
              alt="Visual summary"
              className="max-w-full rounded-lg shadow-sm"
            />
            <p className="mt-4 text-sm text-center text-muted-foreground">
              Visual representation of the content
            </p>
          </div>
        ) : summary.format === 'bullets' ? (
          <ul className="list-disc pl-5 space-y-2">
            {summary.content.split('\n').map((bullet, index) => (
              <li key={index}>
                <KeywordHighlighter text={bullet} keywords={summary.keywords} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="leading-relaxed">
            <KeywordHighlighter
              text={summary.content}
              keywords={summary.keywords}
            />
          </p>
        )}
      </div>
    </div>
  );
};

export default SummaryDisplay;
