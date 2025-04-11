
import React, { useState } from 'react';
import Header from '../components/Header';
import FileUploader from '../components/FileUploader';
import OutputFormatSelector from '../components/OutputFormatSelector';
import SummaryDisplay from '../components/SummaryDisplay';
import ImageExplainer from '../components/ImageExplainer';
import { OutputFormat, SummaryResult, UploadedFile } from '../types';
import { toast } from 'sonner';

// Mock data for demonstration purposes
const mockSummary: Record<OutputFormat, SummaryResult> = {
  gist: {
    format: 'gist',
    content:
      'The document discusses artificial intelligence and its impact on modern society. It explores how machine learning algorithms have evolved over the past decade, enabling significant advancements in natural language processing, computer vision, and predictive analytics. The text highlights ethical considerations around AI, including privacy concerns, algorithmic bias, and the future of human-AI collaboration.',
    keywords: ['artificial intelligence', 'machine learning', 'natural language processing', 'algorithmic bias', 'privacy'],
  },
  bullets: {
    format: 'bullets',
    content:
      '• Artificial intelligence has transformed numerous industries in the modern world\n• Machine learning algorithms have evolved significantly over the past decade\n• Natural language processing enables computers to understand human communication\n• Computer vision allows machines to interpret and process visual information\n• Ethical considerations include privacy concerns and algorithmic bias\n• Human-AI collaboration will shape the future of the technology',
    keywords: ['artificial intelligence', 'machine learning', 'natural language processing', 'algorithmic bias', 'privacy'],
  },
  image: {
    format: 'image',
    content: 'Visual representation of artificial intelligence concepts',
    keywords: ['artificial intelligence', 'machine learning', 'neural networks'],
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad781?q=80&w=2532&auto=format&fit=crop',
  },
};

const mockImageExplanation = 
  "This image appears to be a digital visualization related to artificial intelligence or machine learning. It features a network of interconnected nodes or neural pathways represented in a blue color scheme against a dark background. This visual metaphor is commonly used to illustrate how AI systems process information through neural networks - mimicking the way human brains make connections. The bright, glowing points likely represent data or decision points within the AI system.";

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

  const handleGenerateSummary = () => {
    if (!uploadedFile) {
      toast.error('Please upload content first!');
      return;
    }

    setIsLoading(true);

    // Simulate API call with a timeout
    setTimeout(() => {
      setSummary(mockSummary[outputFormat]);
      setIsLoading(false);
      toast.success('Summary generated successfully!');
    }, 2000);
  };

  const handleExplainImage = (imageUrl: string) => {
    setIsExplaining(true);

    // Simulate API call with a timeout
    setTimeout(() => {
      setImageExplanation(mockImageExplanation);
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
