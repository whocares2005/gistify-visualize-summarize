
import React from 'react';
import { FileText, ListOrdered, ImageIcon } from 'lucide-react';
import { OutputFormat } from '../types';

interface OutputFormatSelectorProps {
  selectedFormat: OutputFormat;
  onFormatChange: (format: OutputFormat) => void;
}

const OutputFormatSelector: React.FC<OutputFormatSelectorProps> = ({
  selectedFormat,
  onFormatChange,
}) => {
  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm animate-slide-up">
      <h2 className="text-xl font-semibold mb-4">Select Output Format</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => onFormatChange('gist')}
          className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center ${
            selectedFormat === 'gist'
              ? 'border-gistify-300 bg-gistify-100/50'
              : 'border-gray-200 hover:border-gistify-200 hover:bg-gistify-100/30'
          }`}
        >
          <FileText className="h-8 w-8 mb-2 text-gistify-400" />
          <span className="font-medium">Gist</span>
          <span className="text-xs text-muted-foreground mt-1">
            Concise text summary
          </span>
        </button>

        <button
          onClick={() => onFormatChange('bullets')}
          className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center ${
            selectedFormat === 'bullets'
              ? 'border-gistify-300 bg-gistify-100/50'
              : 'border-gray-200 hover:border-gistify-200 hover:bg-gistify-100/30'
          }`}
        >
          <ListOrdered className="h-8 w-8 mb-2 text-gistify-400" />
          <span className="font-medium">Bullet Points</span>
          <span className="text-xs text-muted-foreground mt-1">
            Key points in a list
          </span>
        </button>

        <button
          onClick={() => onFormatChange('image')}
          className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center ${
            selectedFormat === 'image'
              ? 'border-gistify-300 bg-gistify-100/50'
              : 'border-gray-200 hover:border-gistify-200 hover:bg-gistify-100/30'
          }`}
        >
          <ImageIcon className="h-8 w-8 mb-2 text-gistify-400" />
          <span className="font-medium">Image</span>
          <span className="text-xs text-muted-foreground mt-1">
            Visual representation
          </span>
        </button>
      </div>
    </div>
  );
};

export default OutputFormatSelector;
