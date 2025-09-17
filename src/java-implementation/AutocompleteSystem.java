package autocomplete;

import java.util.*;

/**
 * Autocomplete System with learning capability
 */
public class AutocompleteSystem {
    private Trie trie;
    private List<String> searchHistory;
    private Map<String, Integer> wordUsageStats;
    
    public AutocompleteSystem() {
        this.trie = new Trie();
        this.searchHistory = new ArrayList<>();
        this.wordUsageStats = new HashMap<>();
        initializeWithDefaultWords();
    }
    
    /**
     * Initialize with preloaded words and frequencies
     */
    private void initializeWithDefaultWords() {
        String[][] defaultWords = {
            // Tech words
            {"application", "12"},
            {"apple", "15"},
            {"apply", "8"},
            {"app", "20"},
            {"api", "18"},
            {"algorithm", "7"},
            {"array", "10"},
            {"abstract", "6"},
            
            // Common words
            {"banana", "11"},
            {"band", "6"},
            {"bandit", "3"},
            {"bank", "14"},
            {"basketball", "9"},
            {"baseball", "7"},
            {"battery", "8"},
            
            // Animals & Nature
            {"cat", "16"},
            {"catalog", "5"},
            {"category", "8"},
            {"catering", "4"},
            {"dog", "13"},
            {"dolphin", "6"},
            {"dragon", "7"},
            
            // Programming
            {"function", "15"},
            {"frontend", "12"},
            {"framework", "10"},
            {"feature", "11"},
            {"factory", "7"},
            
            // Data
            {"data", "17"},
            {"database", "14"},
            {"dashboard", "9"},
            {"delete", "8"},
            {"design", "13"},
            {"developer", "15"},
            
            // Extra words
            {"elephant", "5"},
            {"engine", "10"},
            {"engineering", "12"},
            {"environment", "8"},
            {"example", "14"},
            {"execute", "6"},
            {"export", "9"}
        };
        
        for (String[] wordData : defaultWords) {
            trie.insert(wordData[0], Integer.parseInt(wordData[1]));
        }
        
        System.out.println("System initialized with " + defaultWords.length + " words");
    }
    
    /**
     * Get suggestions for a prefix
     */
    public List<WordFrequency> getSuggestions(String prefix) {
        if (prefix == null || prefix.trim().isEmpty()) {
            return new ArrayList<>();
        }
        return trie.search(prefix);
    }
    
    /**
     * Select a suggestion (increases its frequency for learning)
     */
    public void selectSuggestion(String word) {
        trie.updateFrequency(word, 1);
        searchHistory.add(0, word);
        if (searchHistory.size() > 50) {
            searchHistory.remove(searchHistory.size() - 1);
        }
        
        // Update usage statistics
        wordUsageStats.merge(word, 1, Integer::sum);
    }
    
    /**
     * Update frequency of an existing word
     */
    public void updateFrequency(String word, int increment) {
        trie.updateFrequency(word, increment);
        wordUsageStats.merge(word, increment, Integer::sum);
    }
    
    /**
     * Add a new word to the system
     */
    public void addWord(String word, int frequency) {
        trie.insert(word, frequency);
    }
    
    /**
     * Get search history
     */
    public List<String> getSearchHistory(int limit) {
        return searchHistory.size() > limit ? 
               searchHistory.subList(0, limit) : 
               new ArrayList<>(searchHistory);
    }
    
    /**
     * Get all words in the system
     */
    public List<WordFrequency> getAllWords() {
        return trie.getAllWords();
    }
    
    /**
     * Get usage statistics
     */
    public void printStatistics() {
        System.out.println("\n=== System Statistics ===");
        System.out.println("Total words in system: " + getAllWords().size());
        System.out.println("Recent searches: " + searchHistory.size());
        
        if (!wordUsageStats.isEmpty()) {
            System.out.println("\nTop 5 most selected words:");
            wordUsageStats.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(5)
                .forEach(entry -> System.out.println("  - " + entry.getKey() + 
                                                     " (selected " + entry.getValue() + " times)"));
        }
    }
}