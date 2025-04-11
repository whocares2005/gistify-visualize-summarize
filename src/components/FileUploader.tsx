
import React, { useState, useCallback } from 'react';
import { Upload, File, FileText, Image as ImageIcon, X } from 'lucide-react';
import { InputType, UploadedFile } from '../types';
import { toast } from 'sonner';

interface FileUploaderProps {
  onFileUploaded: (uploadedFile: UploadedFile) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUploaded }) => {
  const [dragActive, setDragActive] = useState(false);
  const [inputType, setInputType] = useState<InputType>('text');
  const [textInput, setTextInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const processFile = useCallback((file: File) => {
    const fileType = file.type;
    
    if (fileType.includes('image') && inputType !== 'image') {
      setInputType('image');
    } else if (fileType === 'application/pdf' && inputType !== 'pdf') {
      setInputType('pdf');
    }

    setUploadedFile(file);

    if (fileType.includes('image')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (fileType.includes('text') || fileType === 'application/pdf' || fileType === 'application/json') {
      // Try to read text from appropriate files
      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result as string;
        onFileUploaded({
          type: fileType.includes('image') ? 'image' : (fileType === 'application/pdf' ? 'pdf' : 'text'),
          file,
          text: fileContent,
          preview: fileType.includes('image') ? URL.createObjectURL(file) : undefined
        });
      };
      reader.readAsText(file);
    } else {
      // For other file types, just pass the file without trying to read the content
      onFileUploaded({
        type: fileType.includes('image') ? 'image' : (fileType === 'application/pdf' ? 'pdf' : 'text'),
        file,
        preview: fileType.includes('image') ? URL.createObjectURL(file) : undefined
      });
    }

    toast.success(`File "${file.name}" uploaded successfully!`);
  }, [inputType, onFileUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  const handleSubmitText = useCallback(() => {
    if (textInput.trim()) {
      onFileUploaded({
        type: 'text',
        file: null,
        text: textInput
      });
      toast.success("Text submitted successfully!");
    } else {
      toast.error("Please enter some text first!");
    }
  }, [textInput, onFileUploaded]);

  const handleRemoveFile = useCallback(() => {
    setUploadedFile(null);
    setPreview(null);
    setTextInput('');
  }, []);

  const renderUploadArea = () => {
    if (uploadedFile) {
      return (
        <div className="relative mt-4 p-4 border rounded-lg">
          <button 
            onClick={handleRemoveFile} 
            className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-3">
            {inputType === 'image' && preview ? (
              <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded" />
            ) : (
              <File className="h-10 w-10 text-gistify-300" />
            )}
            <div>
              <p className="font-medium">{uploadedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(uploadedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (inputType === 'text') {
      return (
        <div className="mt-4">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Enter or paste your text here..."
            className="w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gistify-300"
          />
          <button
            onClick={handleSubmitText}
            disabled={!textInput.trim()}
            className="mt-2 bg-gistify-300 text-white px-4 py-2 rounded-md hover:bg-gistify-400 transition-colors disabled:opacity-50"
          >
            Summarize Text
          </button>
        </div>
      );
    }

    return (
      <div
        className={`drop-area mt-4 flex flex-col items-center justify-center ${dragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="h-10 w-10 text-gistify-300 mb-2" />
        <p className="font-medium">Drag & drop your {inputType === 'pdf' ? 'PDF' : 'image'} here</p>
        <p className="text-sm text-muted-foreground mb-4">or</p>
        <label className="cursor-pointer bg-gistify-300 text-white px-4 py-2 rounded-md hover:bg-gistify-400 transition-colors">
          Browse Files
          <input
            type="file"
            className="hidden"
            accept={inputType === 'pdf' ? '.pdf' : 'image/*'}
            onChange={handleChange}
          />
        </label>
      </div>
    );
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm animate-slide-up">
      <h2 className="text-xl font-semibold mb-4">Upload Content</h2>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setInputType('text')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
            inputType === 'text'
              ? 'bg-gistify-100 text-gistify-500'
              : 'hover:bg-gray-100'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Text</span>
        </button>
        <button
          onClick={() => setInputType('pdf')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
            inputType === 'pdf'
              ? 'bg-gistify-100 text-gistify-500'
              : 'hover:bg-gray-100'
          }`}
        >
          <File className="h-4 w-4" />
          <span>PDF</span>
        </button>
        <button
          onClick={() => setInputType('image')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
            inputType === 'image'
              ? 'bg-gistify-100 text-gistify-500'
              : 'hover:bg-gray-100'
          }`}
        >
          <ImageIcon className="h-4 w-4" />
          <span>Image</span>
        </button>
      </div>
      {renderUploadArea()}
    </div>
  );
};

export default FileUploader;
