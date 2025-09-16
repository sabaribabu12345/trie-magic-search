package autocomplete;

import java.util.*;

/**
 * Trie data structure for efficient prefix-based word storage and retrieval
 */
public class Trie {
    private TrieNode root;
    
    public Trie() {
        this.root = new TrieNode();
    }
    
    /**
     * Insert a word with its frequency into the Trie
     * Time Complexity: O(m) where m is the length of the word
     */
    public void insert(String word, int frequency) {
        if (word == null || word.isEmpty()) return;
        
        TrieNode current = root;
        String lowerWord = word.toLowerCase();
        
        for (char ch : lowerWord.toCharArray()) {
            current.children.putIfAbsent(ch, new TrieNode());
            current = current.children.get(ch);
        }
        
        current.isEndOfWord = true;
        current.frequency = Math.max(current.frequency, frequency);
        current.word = lowerWord;
    }
    
    /**
     * Update frequency of an existing word or insert if not exists
     */
    public void updateFrequency(String word, int increment) {
        if (word == null || word.isEmpty()) return;
        
        TrieNode current = root;
        String lowerWord = word.toLowerCase();
        
        for (char ch : lowerWord.toCharArray()) {
            if (!current.children.containsKey(ch)) {
                // Word doesn't exist, insert it
                insert(word, increment);
                return;
            }
            current = current.children.get(ch);
        }
        
        if (current.isEndOfWord) {
            current.frequency += increment;
        } else {
            current.isEndOfWord = true;
            current.frequency = increment;
            current.word = lowerWord;
        }
    }
    
    /**
     * Search for all words with given prefix and return top 5 by frequency
     * Time Complexity: O(k + n log n) where k = prefix length, n = matching words
     */
    public List<WordFrequency> search(String prefix) {
        List<WordFrequency> results = new ArrayList<>();
        if (prefix == null || prefix.isEmpty()) return results;
        
        TrieNode current = root;
        String lowerPrefix = prefix.toLowerCase();
        
        // Navigate to the prefix node
        for (char ch : lowerPrefix.toCharArray()) {
            if (!current.children.containsKey(ch)) {
                return results; // Prefix not found
            }
            current = current.children.get(ch);
        }
        
        // Collect all words with this prefix
        collectWords(current, results);
        
        // Sort by frequency (descending) and then lexicographically
        results.sort((a, b) -> {
            if (b.frequency != a.frequency) {
                return Integer.compare(b.frequency, a.frequency);
            }
            return a.word.compareTo(b.word);
        });
        
        // Return top 5 results
        return results.size() > 5 ? results.subList(0, 5) : results;
    }
    
    /**
     * Helper method to collect all words from a node using DFS
     */
    private void collectWords(TrieNode node, List<WordFrequency> results) {
        if (node.isEndOfWord) {
            results.add(new WordFrequency(node.word, node.frequency));
        }
        
        for (TrieNode child : node.children.values()) {
            collectWords(child, results);
        }
    }
    
    /**
     * Get all words in the Trie (for debugging/statistics)
     */
    public List<WordFrequency> getAllWords() {
        List<WordFrequency> results = new ArrayList<>();
        collectWords(root, results);
        results.sort((a, b) -> Integer.compare(b.frequency, a.frequency));
        return results;
    }
}

/**
 * Helper class to store word-frequency pairs
 */
class WordFrequency {
    String word;
    int frequency;
    
    public WordFrequency(String word, int frequency) {
        this.word = word;
        this.frequency = frequency;
    }
    
    @Override
    public String toString() {
        return word + " (freq: " + frequency + ")";
    }
}