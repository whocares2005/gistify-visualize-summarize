import React, { useState } from 'react';
import Header from '../components/Header';
import FileUploader from '../components/FileUploader';
import OutputFormatSelector from '../components/OutputFormatSelector';
import SummaryDisplay from '../components/SummaryDisplay';
import ImageExplainer from '../components/ImageExplainer';
import { OutputFormat, SummaryResult, UploadedFile } from '../types';
import { toast } from 'sonner';

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('gist');
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageExplanation, setImageExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  const handleFileUploaded = (file: UploadedFile) => {
    setUploadedFile(file);
    setSummary(null);
    setImageExplanation(null);

    if (file.type === 'image' && file.preview) {
      handleExplainImage(file.preview);
    }
  };

  const handleFormatChange = (format: OutputFormat) => {
    setOutputFormat(format);
  };

  const generateMockSummary = (content: string, format: OutputFormat): SummaryResult => {
    const words = content.split(/\s+/);
    
    const stopWords = [
      'about', 'after', 'all', 'also', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'because', 
      'been', 'before', 'being', 'between', 'both', 'but', 'by', 'came', 'can', 'come', 'could', 
      'did', 'do', 'does', 'each', 'for', 'from', 'get', 'got', 'has', 'had', 'he', 'have', 'her', 
      'here', 'him', 'himself', 'his', 'how', 'if', 'in', 'into', 'is', 'it', 'its', 'just', 'like', 
      'make', 'many', 'me', 'might', 'more', 'most', 'much', 'must', 'my', 'never', 'now', 'of', 
      'on', 'only', 'or', 'other', 'our', 'out', 'over', 'said', 'same', 'see', 'should', 'since', 
      'some', 'still', 'such', 'take', 'than', 'that', 'the', 'their', 'them', 'then', 'there', 
      'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'up', 'very', 'was', 'way', 
      'we', 'well', 'were', 'what', 'where', 'which', 'while', 'who', 'with', 'would', 'you', 'your'
    ];
    
    const potentialKeywords = words.filter(word => 
      word.length > 3 && !stopWords.includes(word.toLowerCase())
    );
    
    const uniqueKeywords = Array.from(new Set(potentialKeywords.map(k => k.toLowerCase())));
    const keywords = uniqueKeywords.slice(0, Math.min(uniqueKeywords.length, 8));
    
    let summaryContent = '';
    
    if (format === 'gist') {
      summaryContent = `Main focus: ${keywords.slice(0, 3).join(', ')}. `;
      
      if (keywords.length >= 3) {
        summaryContent += `Content discusses ${keywords[0]} in relation to ${keywords[1]} and ${keywords[2]}. `;
      }
      
      if (keywords.length > 3) {
        summaryContent += `Also covers ${keywords.slice(3, 6).join(', ')}. `;
      }
      
      summaryContent += `Approximately ${words.length} words total.`;
    } else if (format === 'bullets') {
      const mainPoint = keywords[0] || 'Main topic';
      const secondaryPoints = keywords.slice(1, 4);
      const tertiaryPoints = keywords.slice(4, 7);
      
      summaryContent = `• ${mainPoint}: Core subject\n`;
      
      if (secondaryPoints.length > 0) {
        summaryContent += `• Key aspects: ${secondaryPoints.join(', ')}\n`;
      }
      
      if (tertiaryPoints.length > 0) {
        summaryContent += `• Additional elements: ${tertiaryPoints.join(', ')}\n`;
      }
      
      summaryContent += `• Length: ${words.length} words`;
    }
    
    return {
      format,
      content: summaryContent,
      keywords,
      ...(format === 'image' && {
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad781?q=80&w=2532&auto=format&fit=crop',
      }),
    };
  };
  
  const generateMockImageExplanation = (imageUrl: string): string => {
    return "This image contains visual information that appears to represent key concepts related to the topic. The main elements highlight important details that support understanding the context.";
  };

  const handleGenerateSummary = () => {
    if (!uploadedFile) {
      toast.error('Please upload content first!');
      return;
    }

    setIsLoading(true);

    const content = uploadedFile.text || `Content from ${uploadedFile.file?.name || 'uploaded file'}`;

    setTimeout(() => {
      const mockSummary = generateMockSummary(content, outputFormat);
      setSummary(mockSummary);
      setIsLoading(false);
      toast.success('Summary generated successfully!');
    }, 2000);
  };

  const handleExplainImage = (imageUrl: string) => {
    setIsExplaining(true);

    setTimeout(() => {
      const explanation = generateMockImageExplanation(imageUrl);
      setImageExplanation(explanation);
      setIsExplaining(false);
      toast.success('Image explained successfully!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container py-8 px-4 mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <h1 className="text-3xl font-bold text-gistify-600">
              Simplify and Visualize Your Content
            </h1>
            <span className="px-3 py-1 bg-gistify-100 text-gistify-500 rounded-full text-sm font-medium">
              Beta
            </span>
          </div>
          <p className="text-muted-foreground">
            Upload text, PDFs, or images and get concise summaries, bullet points, 
            or visual representations. Gistify helps you extract the essence of information quickly.
          </p>

          <FileUploader onFileUploaded={handleFileUploaded} />

          {uploadedFile && (
            <>
              <OutputFormatSelector
                selectedFormat={outputFormat}
                onFormatChange={handleFormatChange}
              />

              <div className="flex justify-center">
                <button
                  onClick={handleGenerateSummary}
                  className="bg-gistify-300 hover:bg-gistify-400 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Generate Summary
                </button>
              </div>

              <SummaryDisplay summary={summary} isLoading={isLoading} />

              {uploadedFile.type === 'image' && uploadedFile.preview && (
                <ImageExplainer
                  imageUrl={uploadedFile.preview}
                  explanation={imageExplanation}
                  isLoading={isExplaining}
                />
              )}
            </>
          )}
        </div>
      </main>
      <footer className="py-6 border-t bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Gistify - All rights reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
