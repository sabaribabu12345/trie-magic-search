import React from 'react';
import { WordFrequency } from '@/lib/trie';
import { cn } from '@/lib/utils';

interface WordCloudProps {
  words: WordFrequency[];
  onWordClick: (word: string) => void;
}

export const WordCloud: React.FC<WordCloudProps> = ({ words, onWordClick }) => {
  const getFontSize = (frequency: number): string => {
    if (frequency >= 18) return 'text-2xl';
    if (frequency >= 14) return 'text-xl';
    if (frequency >= 10) return 'text-lg';
    if (frequency >= 6) return 'text-base';
    return 'text-sm';
  };

  const getOpacity = (frequency: number): string => {
    if (frequency >= 15) return 'opacity-100';
    if (frequency >= 10) return 'opacity-80';
    if (frequency >= 5) return 'opacity-60';
    return 'opacity-40';
  };

  return (
    <div className="mt-12 p-8 bg-card/50 backdrop-blur-sm border border-border rounded-2xl">
      <h3 className="text-lg font-semibold text-foreground mb-6 text-center">
        Word Cloud - Click to Search
      </h3>
      <div className="flex flex-wrap gap-4 justify-center items-center">
        {words.slice(0, 30).map((word) => (
          <button
            key={word.word}
            onClick={() => onWordClick(word.word)}
            className={cn(
              "px-3 py-1 rounded-lg transition-all duration-200",
              "hover:scale-110 hover:bg-accent hover:text-accent-foreground",
              "cursor-pointer",
              getFontSize(word.frequency),
              getOpacity(word.frequency)
            )}
            style={{
              color: `hsl(${260 + word.frequency * 2} 70% 60%)`,
            }}
          >
            {word.word}
          </button>
        ))}
      </div>
    </div>
  );
};