package autocomplete;

import java.util.*;

/**
 * TrieNode class representing each node in the Trie data structure
 */
public class TrieNode {
    Map<Character, TrieNode> children;
    boolean isEndOfWord;
    int frequency;
    String word;
    
    public TrieNode() {
        this.children = new HashMap<>();
        this.isEndOfWord = false;
        this.frequency = 0;
        this.word = "";
    }
}