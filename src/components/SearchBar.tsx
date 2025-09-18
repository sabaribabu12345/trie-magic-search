import React, { useState, useRef, useEffect } from 'react';
import { Search, TrendingUp, Clock, Sparkles, Plus } from 'lucide-react';
import { WordFrequency } from '@/lib/trie';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface SearchBarProps {
  onSearch: (prefix: string) => WordFrequency[];
  onSelect: (word: string) => void;
  onAddWord: (word: string, frequency: number) => void;
  searchHistory: string[];
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onSelect, onAddWord, searchHistory }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<WordFrequency[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newFrequency, setNewFrequency] = useState('10');
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim()) {
      const results = onSearch(query);
      setSuggestions(results);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex].word);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  const handleSelect = (word: string) => {
    setQuery(word);
    onSelect(word);
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const getFrequencyColor = (frequency: number): string => {
    if (frequency >= 15) return 'text-frequency-high';
    if (frequency >= 8) return 'text-frequency-medium';
    return 'text-frequency-low';
  };

  const getFrequencyBadge = (frequency: number): string => {
    if (frequency >= 15) return 'Popular';
    if (frequency >= 8) return 'Common';
    return 'Suggested';
  };

  const handleAddWord = () => {
    if (newWord.trim() && newFrequency) {
      const freq = parseInt(newFrequency);
      if (!isNaN(freq) && freq > 0) {
        onAddWord(newWord.trim(), freq);
        setNewWord('');
        setNewFrequency('10');
        setShowAddDialog(false);
        setQuery(newWord.trim());
      }
    }
  };

  return (
    <>
      <div className="relative w-full max-w-2xl mx-auto">
        {/* Search Input with Add Button */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300 rounded-2xl" />
          <div className="relative bg-search-bg backdrop-blur-sm border-2 border-search-border rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center px-6 py-4">
              <Search className="w-5 h-5 text-muted-foreground mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => query && setShowSuggestions(true)}
                placeholder="Start typing to search or add new word..."
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-lg"
                autoComplete="off"
              />
              <Button
                onClick={() => {
                  setNewWord(query || '');
                  setShowAddDialog(true);
                }}
                size="sm"
                variant="ghost"
                className="ml-2"
                title="Add new word"
              >
                <Plus className="w-4 h-4" />
              </Button>
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    setSuggestions([]);
                    inputRef.current?.focus();
                  }}
                  className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full mt-3 w-full bg-card backdrop-blur-md border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.word}
                  onClick={() => handleSelect(suggestion.word)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    "w-full px-6 py-3 flex items-center justify-between transition-all duration-150",
                    "hover:bg-suggestion-hover",
                    selectedIndex === index && "bg-suggestion-selected"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <span className="text-foreground font-medium">
                      {suggestion.word}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "text-xs font-semibold px-2 py-1 rounded-full bg-gradient-primary text-primary-foreground",
                      getFrequencyColor(suggestion.frequency)
                    )}>
                      {getFrequencyBadge(suggestion.frequency)}
                    </span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {suggestion.frequency}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-muted-foreground">No suggestions found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Try a different search term
              </p>
            </div>
          )}
        </div>
      )}

      {/* Recent Searches */}
      {!showSuggestions && searchHistory.length > 0 && (
        <div className="mt-4 px-2">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Recent searches</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchHistory.slice(0, 5).map((term, index) => (
              <button
                key={index}
                onClick={() => setQuery(term)}
                className="px-3 py-1 text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* Add Word Dialog */}
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Word</DialogTitle>
          <DialogDescription>
            Add a new word to the autocomplete system with its initial frequency.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="word">Word</Label>
            <Input
              id="word"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              placeholder="Enter a word"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddWord();
              }}
            />
          </div>
          <div>
            <Label htmlFor="frequency">Frequency (1-100)</Label>
            <Input
              id="frequency"
              type="number"
              value={newFrequency}
              onChange={(e) => setNewFrequency(e.target.value)}
              placeholder="10"
              min="1"
              max="100"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddWord}>
              Add Word
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};