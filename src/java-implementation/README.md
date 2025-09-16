# Java Autocomplete System with Trie

## Overview
A complete autocomplete system implemented in Java using a Trie (prefix tree) data structure for efficient word storage and retrieval.

## Features
- **Trie Data Structure**: Efficient prefix-based search with O(k + log n) time complexity
- **Frequency-based Ranking**: Words ranked by frequency, with lexicographic ordering for ties
- **Dynamic Learning**: System learns from user selections by increasing word frequencies
- **CLI Interface**: Interactive command-line interface with colored output
- **Preloaded Dictionary**: 35+ example words with initial frequencies
- **Statistics Tracking**: Monitors usage patterns and popular searches

## Classes

### 1. TrieNode
- Represents each node in the Trie
- Stores children nodes, word completion status, frequency, and the complete word

### 2. Trie
- Core data structure implementation
- **Methods**:
  - `insert(word, frequency)`: Add new words
  - `search(prefix)`: Returns top 5 suggestions
  - `updateFrequency(word, increment)`: Learn from user behavior
  - `getAllWords()`: Retrieve all stored words

### 3. AutocompleteSystem
- Main system orchestrator
- Manages Trie, search history, and usage statistics
- Handles word initialization and user interactions

### 4. Main
- CLI interface with colored output
- Interactive commands and search functionality
- Visual frequency indicators

## How to Compile and Run

```bash
# Navigate to the java-implementation directory
cd src/java-implementation

# Compile all Java files
javac -d . *.java

# Run the main program
java autocomplete.Main
```

## Usage

### Basic Search
1. Type any prefix (e.g., "app")
2. View top 5 suggestions ranked by frequency
3. Select a suggestion to increase its frequency

### Commands
- `/help` - Show available commands
- `/stats` - Display system statistics
- `/history` - View recent searches
- `/all` - List all words in system
- `/add` - Add new words manually
- `/clear` - Clear screen
- `exit` or `quit` - Exit program

## Example Session

```
> Enter prefix: app
Top suggestions for 'app':
  1. app                 █████ freq: 20
  2. api                 ████░ freq: 18
  3. apple               ████░ freq: 15
  4. application         ███░░ freq: 12
  5. apply               ██░░░ freq: 8

Select a suggestion (1-5) or press Enter to skip: 3
✓ Selected: apple (frequency increased)
```

## Performance

- **Insertion**: O(m) where m = word length
- **Search**: O(k + n log n) where k = prefix length, n = matching words
- **Memory**: O(ALPHABET_SIZE * N * M) where N = number of words, M = average word length

## Testing

The system includes:
- 35+ preloaded test words
- Various word categories (tech, common, animals, programming)
- Frequency distribution from 3 to 20
- Edge case handling (empty input, invalid selections)

## Optimization Features

1. **HashMap for Children**: Uses HashMap instead of array for memory efficiency
2. **Early Termination**: Stops traversal when prefix not found
3. **Top-K Selection**: Returns only top 5 results to minimize sorting overhead
4. **Frequency Caching**: Stores complete words at end nodes to avoid reconstruction
5. **Case Insensitive**: Converts to lowercase for consistent matching

## Bonus Features Implemented

✅ **Dynamic Learning**: Selecting a suggestion increases its frequency
✅ **Search History**: Tracks recent searches (up to 50)
✅ **Usage Statistics**: Monitors most selected words
✅ **Add New Words**: Users can add words not in the system
✅ **Visual Indicators**: Color-coded frequency bars
✅ **Interactive CLI**: Rich command-line interface with multiple features

## Notes

- All searches are case-insensitive
- Frequencies are integers (higher = more relevant)
- System maintains lexicographic ordering for equal frequencies
- The Trie optimizes prefix searches while maintaining ranking efficiency