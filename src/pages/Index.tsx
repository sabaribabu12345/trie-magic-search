import { useState, useCallback, useEffect } from 'react';
import { AutocompleteSystem, WordFrequency } from '@/lib/trie';
import { SearchBar } from '@/components/SearchBar';
import { StatsPanel } from '@/components/StatsPanel';
import { WordCloud } from '@/components/WordCloud';
import { Sparkles, Keyboard, Zap, Brain } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [autocomplete] = useState(() => new AutocompleteSystem());
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [allWords, setAllWords] = useState<WordFrequency[]>([]);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // Initialize word list
    setAllWords(autocomplete.getAllWords());
  }, [autocomplete]);

  const handleSearch = useCallback((prefix: string): WordFrequency[] => {
    return autocomplete.getSuggestions(prefix);
  }, [autocomplete]);

  const handleSelect = useCallback((word: string) => {
    autocomplete.selectSuggestion(word);
    setSearchHistory(autocomplete.getSearchHistory());
    setAllWords(autocomplete.getAllWords());
    forceUpdate({});
    
    toast.success(`Selected: ${word}`, {
      description: 'Frequency increased by 1',
      duration: 2000,
    });
  }, [autocomplete]);

  const handleAddWord = useCallback((word: string, frequency: number) => {
    autocomplete.addWord(word, frequency);
    setAllWords(autocomplete.getAllWords());
    forceUpdate({});
    
    toast.success(`Added: ${word}`, {
      description: `Initial frequency: ${frequency}`,
      duration: 2000,
    });
  }, [autocomplete]);

  const handleWordCloudClick = useCallback((word: string) => {
    handleSelect(word);
  }, [handleSelect]);

  const topWords = allWords.slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-5" />
        <div className="container mx-auto px-4 py-16 relative">
          {/* Title */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Intelligent Autocomplete
              </h1>
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience lightning-fast suggestions powered by a Trie data structure.
              The system learns from your selections and adapts over time.
            </p>
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Trie-Based</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">O(k + log n) Complexity</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full">
              <Keyboard className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Keyboard Navigation</span>
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar 
            onSearch={handleSearch}
            onSelect={handleSelect}
            onAddWord={handleAddWord}
            searchHistory={searchHistory}
          />

          {/* Stats Panel */}
          <StatsPanel 
            totalWords={allWords.length}
            topWords={topWords}
            recentSearches={searchHistory}
          />

          {/* Word Cloud */}
          <WordCloud 
            words={allWords}
            onWordClick={handleWordCloudClick}
          />

          {/* Instructions */}
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">How to Use</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <span className="text-primary font-bold">1.</span>
                  <p>Start typing in the search bar to see instant suggestions</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary font-bold">2.</span>
                  <p>Use arrow keys to navigate suggestions, Enter to select</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary font-bold">3.</span>
                  <p>Selected words increase in frequency and rank higher in future searches</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary font-bold">4.</span>
                  <p>Click words in the word cloud to quickly search and boost their frequency</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;