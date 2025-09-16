// Trie Node class for the autocomplete system
export class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
  frequency: number;
  word: string;

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
    this.frequency = 0;
    this.word = "";
  }
}

// Word with frequency for ranking
export interface WordFrequency {
  word: string;
  frequency: number;
}

// Trie data structure implementation
export class Trie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  // Insert a word with its frequency
  insert(word: string, frequency: number = 1): void {
    if (!word) return;
    
    let current = this.root;
    
    for (const char of word.toLowerCase()) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char)!;
    }
    
    current.isEndOfWord = true;
    current.frequency = Math.max(current.frequency, frequency);
    current.word = word.toLowerCase();
  }

  // Update frequency of an existing word
  updateFrequency(word: string, increment: number = 1): void {
    let current = this.root;
    
    for (const char of word.toLowerCase()) {
      if (!current.children.has(char)) {
        // Word doesn't exist, insert it
        this.insert(word, increment);
        return;
      }
      current = current.children.get(char)!;
    }
    
    if (current.isEndOfWord) {
      current.frequency += increment;
    } else {
      // Word doesn't exist as complete word, insert it
      current.isEndOfWord = true;
      current.frequency = increment;
      current.word = word.toLowerCase();
    }
  }

  // Search for all words with given prefix
  search(prefix: string): WordFrequency[] {
    if (!prefix) return [];
    
    let current = this.root;
    
    // Navigate to the prefix node
    for (const char of prefix.toLowerCase()) {
      if (!current.children.has(char)) {
        return []; // Prefix not found
      }
      current = current.children.get(char)!;
    }
    
    // Collect all words with this prefix
    const results: WordFrequency[] = [];
    this.collectWords(current, results);
    
    // Sort by frequency (descending) and then lexicographically
    results.sort((a, b) => {
      if (b.frequency !== a.frequency) {
        return b.frequency - a.frequency;
      }
      return a.word.localeCompare(b.word);
    });
    
    // Return top 5 results
    return results.slice(0, 5);
  }

  // Helper method to collect all words from a node
  private collectWords(node: TrieNode, results: WordFrequency[]): void {
    if (node.isEndOfWord) {
      results.push({
        word: node.word,
        frequency: node.frequency
      });
    }
    
    for (const [_, childNode] of node.children) {
      this.collectWords(childNode, results);
    }
  }

  // Get all words (for debugging/display)
  getAllWords(): WordFrequency[] {
    const results: WordFrequency[] = [];
    this.collectWords(this.root, results);
    return results.sort((a, b) => b.frequency - a.frequency);
  }
}

// Autocomplete system
export class AutocompleteSystem {
  private trie: Trie;
  private searchHistory: string[] = [];

  constructor() {
    this.trie = new Trie();
    this.initializeWithDefaultWords();
  }

  // Initialize with default words and frequencies
  private initializeWithDefaultWords(): void {
    const defaultWords: [string, number][] = [
      // Tech words
      ['application', 12],
      ['apple', 15],
      ['apply', 8],
      ['app', 20],
      ['api', 18],
      ['algorithm', 7],
      ['array', 10],
      
      // Common words
      ['banana', 11],
      ['band', 6],
      ['bandit', 3],
      ['bank', 14],
      ['basketball', 9],
      
      // Animals & Nature
      ['cat', 16],
      ['catalog', 5],
      ['category', 8],
      ['catering', 4],
      ['dog', 13],
      ['dolphin', 6],
      ['dragon', 7],
      
      // Programming
      ['function', 15],
      ['frontend', 12],
      ['framework', 10],
      ['feature', 11],
      
      // Data
      ['data', 17],
      ['database', 14],
      ['dashboard', 9],
      ['delete', 8],
      ['design', 13],
      
      // Extra words
      ['elephant', 5],
      ['engine', 10],
      ['engineering', 12],
      ['environment', 8],
      ['example', 14],
      ['execute', 6],
      ['export', 9],
    ];

    for (const [word, frequency] of defaultWords) {
      this.trie.insert(word, frequency);
    }
  }

  // Get suggestions for a prefix
  getSuggestions(prefix: string): WordFrequency[] {
    if (!prefix || prefix.trim() === '') {
      return [];
    }
    return this.trie.search(prefix);
  }

  // Select a suggestion (increases its frequency)
  selectSuggestion(word: string): void {
    this.trie.updateFrequency(word, 1);
    this.searchHistory.unshift(word);
    if (this.searchHistory.length > 50) {
      this.searchHistory.pop();
    }
  }

  // Add a new word to the system
  addWord(word: string, frequency: number = 1): void {
    this.trie.insert(word, frequency);
  }

  // Get search history
  getSearchHistory(): string[] {
    return this.searchHistory.slice(0, 10);
  }

  // Get all words in the system
  getAllWords(): WordFrequency[] {
    return this.trie.getAllWords();
  }
}