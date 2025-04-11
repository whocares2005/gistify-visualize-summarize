
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [inputText, setInputText] = useState("");
  const [gist, setGist] = useState("");
  const [bulletPoints, setBulletPoints] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);

  // Generate summaries when input text changes
  useEffect(() => {
    if (inputText.trim()) {
      generateSummary(inputText);
    } else {
      setGist("");
      setBulletPoints([]);
      setKeywords([]);
    }
  }, [inputText]);

  // Function to generate summary from input text
  const generateSummary = (text: string) => {
    // Extract keywords (simple implementation - extract words longer than 4 chars that aren't common)
    const stopWords = new Set([
      "about", "above", "after", "again", "against", "all", "and", "any", "are", "because", 
      "been", "before", "being", "below", "between", "both", "but", "can", "did", "does", 
      "doing", "down", "during", "each", "few", "for", "from", "further", "had", "has", 
      "have", "having", "her", "here", "hers", "herself", "him", "himself", "his", "how", 
      "into", "its", "itself", "just", "more", "most", "myself", "nor", "now", "off", 
      "once", "only", "other", "our", "ours", "ourselves", "out", "over", "own", "same", 
      "she", "should", "some", "such", "than", "that", "the", "their", "theirs", "them", 
      "themselves", "then", "there", "these", "they", "this", "those", "through", "too", 
      "under", "until", "very", "was", "were", "what", "when", "where", "which", "while", 
      "who", "whom", "why", "will", "with", "you", "your", "yours", "yourself", "yourselves"
    ]);

    const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const extractedKeywords = [...new Set(words.filter(word => !stopWords.has(word)))].slice(0, 10);
    setKeywords(extractedKeywords);

    // Create gist (shortened version of the text)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const shortGist = sentences.length > 1 
      ? sentences.slice(0, 2).join(". ") + "." 
      : text.length > 100 
        ? text.substring(0, 100) + "..." 
        : text;
    setGist(shortGist);

    // Create bullet points - extract key sentences or split by concepts
    let points: string[] = [];
    if (sentences.length > 1) {
      points = sentences
        .filter(s => s.trim().length > 3)
        .slice(0, 5)
        .map(s => s.trim());
    } else {
      // If only one sentence, try to break it into phrases
      const phrases = text.split(/[,;]/g).filter(p => p.trim().length > 0);
      points = phrases.slice(0, 3).map(p => p.trim());
    }
    setBulletPoints(points);
  };

  // Function to highlight keywords in text
  const highlightKeywords = (text: string) => {
    if (!text || keywords.length === 0) return text;
    
    let highlightedText = text;
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      highlightedText = highlightedText.replace(
        regex, 
        match => `<span class="bg-blue-100 dark:bg-blue-900 px-1 rounded">${match}</span>`
      );
    });
    
    return highlightedText;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Real-time Text Summarizer
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Enter your text below and instantly get a concise summary and key points
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="input-text" className="text-lg">Your Text</Label>
              <Textarea
                id="input-text"
                placeholder="Enter or paste your text here..."
                className="h-40 mt-2 text-base"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>

            {(gist || bulletPoints.length > 0) && (
              <div className="space-y-6 mt-8 animate-in fade-in">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Gist</h2>
                  <div 
                    className="text-base text-gray-700 dark:text-gray-300"
                    dangerouslySetInnerHTML={{ __html: highlightKeywords(gist) }}
                  />
                </Card>

                {bulletPoints.length > 0 && (
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Key Points</h2>
                    <ul className="list-disc pl-6 space-y-2">
                      {bulletPoints.map((point, index) => (
                        <li 
                          key={index} 
                          className="text-base text-gray-700 dark:text-gray-300"
                          dangerouslySetInnerHTML={{ __html: highlightKeywords(point) }}
                        />
                      ))}
                    </ul>
                  </Card>
                )}

                {keywords.length > 0 && (
                  <div className="mt-4">
                    <details className="text-sm">
                      <summary className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                        Keywords detected ({keywords.length})
                      </summary>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {keywords.map((keyword, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </details>
                  </div>
                )}
              </div>
            )}

            {!inputText && (
              <div className="text-center p-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg mt-4">
                <p className="text-gray-500 dark:text-gray-400">
                  Enter some text to see the real-time summary
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
