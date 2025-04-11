
import React from 'react';

interface KeywordHighlighterProps {
  text: string;
  keywords: string[];
}

const KeywordHighlighter: React.FC<KeywordHighlighterProps> = ({ text, keywords }) => {
  if (!text || !keywords.length) return <>{text}</>;

  // Create a pattern for all keywords, escape special regex characters
  const pattern = keywords
    .map(keyword => keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
  
  const regex = new RegExp(`(${pattern})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        const isKeyword = keywords.some(
          keyword => part.toLowerCase() === keyword.toLowerCase()
        );
        
        return isKeyword ? (
          <span 
            key={i} 
            className="bg-gistify-200 text-gistify-800 px-1 rounded font-semibold"
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
};

export default KeywordHighlighter;
