
export type InputType = 'text' | 'pdf' | 'image';

export type OutputFormat = 'gist' | 'bullets' | 'image';

export interface UploadedFile {
  type: InputType;
  file: File | null;
  text?: string;
  preview?: string;
}

export interface SummaryResult {
  format: OutputFormat;
  content: string;
  keywords: string[];
  imageUrl?: string;
}
