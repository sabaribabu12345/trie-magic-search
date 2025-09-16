import React from 'react';
import { Database, Hash, TrendingUp, Zap } from 'lucide-react';
import { WordFrequency } from '@/lib/trie';

interface StatsPanelProps {
  totalWords: number;
  topWords: WordFrequency[];
  recentSearches: string[];
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ 
  totalWords, 
  topWords, 
  recentSearches 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
      {/* Total Words Card */}
      <div className="bg-card backdrop-blur-sm border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <Database className="w-8 h-8 text-primary" />
          <span className="text-3xl font-bold text-foreground">{totalWords}</span>
        </div>
        <h3 className="text-sm font-medium text-muted-foreground">Total Words</h3>
        <p className="text-xs text-muted-foreground mt-1">In the Trie structure</p>
      </div>

      {/* Top Words Card */}
      <div className="bg-card backdrop-blur-sm border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-6 h-6 text-accent" />
          <h3 className="text-sm font-medium text-foreground">Top Words</h3>
        </div>
        <div className="space-y-2">
          {topWords.slice(0, 3).map((word, index) => (
            <div key={word.word} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground">
                  #{index + 1}
                </span>
                <span className="text-sm text-foreground">{word.word}</span>
              </div>
              <span className="text-xs text-accent font-semibold">
                {word.frequency}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Card */}
      <div className="bg-card backdrop-blur-sm border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-6 h-6 text-primary" />
          <h3 className="text-sm font-medium text-foreground">Recent Activity</h3>
        </div>
        <div className="space-y-2">
          {recentSearches.slice(0, 3).map((search, index) => (
            <div key={index} className="flex items-center gap-2">
              <Hash className="w-3 h-3 text-muted-foreground" />
              <span className="text-sm text-foreground truncate">{search}</span>
            </div>
          ))}
          {recentSearches.length === 0 && (
            <span className="text-sm text-muted-foreground">No recent searches</span>
          )}
        </div>
      </div>
    </div>
  );
};