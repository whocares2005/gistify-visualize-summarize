
import React from 'react';
import { Image as ImageIcon, FileText } from 'lucide-react';

interface ImageExplainerProps {
  imageUrl: string;
  explanation: string | null;
  isLoading: boolean;
}

const ImageExplainer: React.FC<ImageExplainerProps> = ({
  imageUrl,
  explanation,
  isLoading,
}) => {
  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm animate-slide-up">
      <h2 className="text-xl font-semibold mb-4">Image Explanation</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="border rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt="Uploaded image"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="h-5 w-5 text-gistify-400" />
            <h3 className="font-medium">Original Image</h3>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-gistify-400" />
            <h3 className="font-medium">Explanation</h3>
          </div>
          {isLoading ? (
            <div className="bg-gray-50 p-4 rounded-lg h-full flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-3 border-gistify-300 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2 text-sm text-gistify-500">Analyzing image...</p>
              </div>
            </div>
          ) : explanation ? (
            <div className="bg-gray-50 p-4 rounded-lg h-full overflow-y-auto">
              <p className="text-sm leading-relaxed">{explanation}</p>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg h-full flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Upload an image to see an explanation here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageExplainer;
