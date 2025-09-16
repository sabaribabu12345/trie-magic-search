package autocomplete;

import java.util.*;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;

/**
 * Main CLI interface for the Autocomplete System
 */
public class Main {
    private static final String ANSI_RESET = "\u001B[0m";
    private static final String ANSI_GREEN = "\u001B[32m";
    private static final String ANSI_YELLOW = "\u001B[33m";
    private static final String ANSI_BLUE = "\u001B[34m";
    private static final String ANSI_CYAN = "\u001B[36m";
    private static final String ANSI_BOLD = "\u001B[1m";
    
    private AutocompleteSystem autocomplete;
    private Scanner scanner;
    private BufferedReader reader;
    
    public Main() {
        this.autocomplete = new AutocompleteSystem();
        this.scanner = new Scanner(System.in);
        this.reader = new BufferedReader(new InputStreamReader(System.in));
    }
    
    public void run() {
        printWelcome();
        
        while (true) {
            try {
                System.out.print(ANSI_CYAN + "\n> Enter prefix (or command): " + ANSI_RESET);
                String input = reader.readLine();
                
                if (input == null || input.equalsIgnoreCase("exit") || 
                    input.equalsIgnoreCase("quit")) {
                    break;
                }
                
                if (input.startsWith("/")) {
                    handleCommand(input);
                } else if (!input.trim().isEmpty()) {
                    handleSearch(input);
                }
            } catch (IOException e) {
                System.err.println("Error reading input: " + e.getMessage());
            }
        }
        
        printGoodbye();
    }
    
    private void handleSearch(String prefix) {
        List<WordFrequency> suggestions = autocomplete.getSuggestions(prefix);
        
        if (suggestions.isEmpty()) {
            System.out.println(ANSI_YELLOW + "No suggestions found." + ANSI_RESET);
            System.out.print("Would you like to add '" + prefix + "' as a new word? (y/n): ");
            String response = scanner.nextLine();
            
            if (response.equalsIgnoreCase("y")) {
                System.out.print("Enter initial frequency (1-20): ");
                try {
                    int freq = Integer.parseInt(scanner.nextLine());
                    autocomplete.addWord(prefix, freq);
                    System.out.println(ANSI_GREEN + "✓ Word added successfully!" + ANSI_RESET);
                } catch (NumberFormatException e) {
                    System.out.println(ANSI_YELLOW + "Invalid frequency. Word not added." + ANSI_RESET);
                }
            }
        } else {
            System.out.println(ANSI_BOLD + "\nTop suggestions for '" + prefix + "':" + ANSI_RESET);
            
            for (int i = 0; i < suggestions.size(); i++) {
                WordFrequency wf = suggestions.get(i);
                String frequencyBar = getFrequencyBar(wf.frequency);
                System.out.printf("  %d. %-20s %s freq: %d%n", 
                                  (i + 1), wf.word, frequencyBar, wf.frequency);
            }
            
            System.out.print("\nSelect a suggestion (1-" + suggestions.size() + 
                           ") or press Enter to skip: ");
            String selection = scanner.nextLine();
            
            if (!selection.isEmpty()) {
                try {
                    int index = Integer.parseInt(selection) - 1;
                    if (index >= 0 && index < suggestions.size()) {
                        String selectedWord = suggestions.get(index).word;
                        autocomplete.selectSuggestion(selectedWord);
                        System.out.println(ANSI_GREEN + "✓ Selected: " + selectedWord + 
                                         " (frequency increased)" + ANSI_RESET);
                    }
                } catch (NumberFormatException e) {
                    // Invalid selection, ignore
                }
            }
        }
    }
    
    private void handleCommand(String command) {
        switch (command.toLowerCase()) {
            case "/help":
                printHelp();
                break;
            case "/stats":
                autocomplete.printStatistics();
                break;
            case "/history":
                printHistory();
                break;
            case "/all":
                printAllWords();
                break;
            case "/add":
                addNewWord();
                break;
            case "/clear":
                System.out.print("\033[H\033[2J");
                System.out.flush();
                break;
            default:
                System.out.println(ANSI_YELLOW + "Unknown command. Type /help for available commands." + ANSI_RESET);
        }
    }
    
    private void printHistory() {
        List<String> history = autocomplete.getSearchHistory(10);
        if (history.isEmpty()) {
            System.out.println("No search history yet.");
        } else {
            System.out.println("\n=== Recent Searches ===");
            for (int i = 0; i < history.size(); i++) {
                System.out.println("  " + (i + 1) + ". " + history.get(i));
            }
        }
    }
    
    private void printAllWords() {
        List<WordFrequency> allWords = autocomplete.getAllWords();
        System.out.println("\n=== All Words in System ===");
        System.out.println("Total: " + allWords.size() + " words\n");
        
        int count = 0;
        for (WordFrequency wf : allWords) {
            System.out.printf("%-20s (freq: %d)    ", wf.word, wf.frequency);
            count++;
            if (count % 3 == 0) System.out.println();
            if (count >= 30) {
                System.out.println("\n... and " + (allWords.size() - 30) + " more");
                break;
            }
        }
        if (count % 3 != 0) System.out.println();
    }
    
    private void addNewWord() {
        System.out.print("Enter new word: ");
        String word = scanner.nextLine();
        System.out.print("Enter frequency (1-20): ");
        try {
            int freq = Integer.parseInt(scanner.nextLine());
            autocomplete.addWord(word, freq);
            System.out.println(ANSI_GREEN + "✓ Word added successfully!" + ANSI_RESET);
        } catch (NumberFormatException e) {
            System.out.println(ANSI_YELLOW + "Invalid frequency." + ANSI_RESET);
        }
    }
    
    private String getFrequencyBar(int frequency) {
        int bars = Math.min(frequency / 3, 5);
        StringBuilder bar = new StringBuilder();
        
        if (frequency >= 15) {
            bar.append(ANSI_GREEN);
        } else if (frequency >= 8) {
            bar.append(ANSI_YELLOW);
        } else {
            bar.append(ANSI_BLUE);
        }
        
        for (int i = 0; i < bars; i++) {
            bar.append("█");
        }
        for (int i = bars; i < 5; i++) {
            bar.append("░");
        }
        bar.append(ANSI_RESET);
        
        return bar.toString();
    }
    
    private void printWelcome() {
        System.out.println("\n" + ANSI_BOLD + ANSI_CYAN);
        System.out.println("╔════════════════════════════════════════╗");
        System.out.println("║     AUTOCOMPLETE SYSTEM WITH TRIE      ║");
        System.out.println("║         Optimized for O(k + log n)     ║");
        System.out.println("╚════════════════════════════════════════╝");
        System.out.println(ANSI_RESET);
        System.out.println("Type a prefix to see suggestions");
        System.out.println("Type /help for available commands");
        System.out.println("Type 'exit' or 'quit' to close\n");
    }
    
    private void printHelp() {
        System.out.println("\n=== Available Commands ===");
        System.out.println("  /help     - Show this help message");
        System.out.println("  /stats    - Show system statistics");
        System.out.println("  /history  - Show recent search history");
        System.out.println("  /all      - Show all words in system");
        System.out.println("  /add      - Add a new word to the system");
        System.out.println("  /clear    - Clear the screen");
        System.out.println("  exit/quit - Exit the program");
    }
    
    private void printGoodbye() {
        System.out.println("\n" + ANSI_CYAN);
        autocomplete.printStatistics();
        System.out.println("\nThank you for using Autocomplete System!");
        System.out.println("Goodbye!" + ANSI_RESET);
    }
    
    public static void main(String[] args) {
        new Main().run();
    }
}