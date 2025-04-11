
import React from 'react';
import { FileText, Image, BookOpen } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between border-b animate-fade-in">
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-full bg-gistify-300 flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-gistify-300 to-gistify-500 bg-clip-text text-transparent">
          Gistify
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>Text & PDF</span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground">
          <Image className="h-4 w-4" />
          <span>Images</span>
        </div>
        <button className="bg-gistify-300 text-white px-4 py-2 rounded-md hover:bg-gistify-400 transition-colors">
          Get Started
        </button>
      </div>
    </header>
  );
};

export default Header;
