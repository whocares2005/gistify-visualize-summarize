
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

    // If image is uploaded, automatically trigger image explanation
    if (file.type === 'image' && file.preview) {
      handleExplainImage(file.preview);
    }
  };

  const handleFormatChange = (format: OutputFormat) => {
    setOutputFormat(format);
  };

  const generateMockSummary = (content: string, format: OutputFormat): SummaryResult => {
    // Extract some keywords from the content
    const words = content.split(/\s+/);
    const potentialKeywords = words.filter(word => 
      word.length > 4 && !['about', 'their', 'there', 'these', 'those', 'which', 'would'].includes(word.toLowerCase())
    );
    
    // Take up to 5 keywords
    const keywords = Array.from(new Set(
      potentialKeywords.slice(0, Math.min(potentialKeywords.length, 15))
    )).slice(0, 5);
    
    // Create a basic summary
    let summaryContent = '';
    
    if (format === 'gist') {
      // Create a paragraph summary
      summaryContent = `This content discusses ${keywords.join(', ')}. `;
      summaryContent += `It contains approximately ${words.length} words and covers various aspects related to the main topics.`;
    } else if (format === 'bullets') {
      // Create bullet points
      summaryContent = `• The content is about ${keywords[0] || 'various topics'}\n`;
      summaryContent += `• It discusses ${keywords[1] || 'several concepts'} and ${keywords[2] || 'related ideas'}\n`;
      summaryContent += `• ${keywords[3] ? `${keywords[3]} is mentioned as an important element` : 'Various elements are discussed'}\n`;
      summaryContent += `• The content contains approximately ${words.length} words\n`;
      summaryContent += `• ${keywords[4] ? `${keywords[4]} is also referenced in the content` : 'Multiple references are made to support the main points'}`;
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
    return "This image appears to be a visual representation of content. The details shown in the image may include graphical elements, text, or other visual information that relates to the subject matter. Without more context, it's difficult to provide a specific explanation of what the image contains.";
  };

  const handleGenerateSummary = () => {
    if (!uploadedFile) {
      toast.error('Please upload content first!');
      return;
    }

    setIsLoading(true);

    // Get the content from the uploaded file
    const content = uploadedFile.text || `Content from ${uploadedFile.file?.name || 'uploaded file'}`;

    // Simulate API call with a timeout
    setTimeout(() => {
      const mockSummary = generateMockSummary(content, outputFormat);
      setSummary(mockSummary);
      setIsLoading(false);
      toast.success('Summary generated successfully!');
    }, 2000);
  };

  const handleExplainImage = (imageUrl: string) => {
    setIsExplaining(true);

    // Simulate API call with a timeout
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
