'''
You are running a classroom and suspect that some of your students are passing around the answer to a multiple-choice question disguised as a random note.

Your task is to write a function that, given a list of words and a note, finds and returns the word in the list that is scrambled inside the note, if any exists. If none exist, it returns the result "-" as a string. There will be at most one matching word. The letters don't need to be in order or next to each other. The letters cannot be reused.

Example:  
words = ["baby", "referee", "cat", "dada", "dog", "bird", "ax", "baz"]

=> sorted ["abby]
note1 = "ctay"
find(words, note1) => "cat"   (the letters do not have to be in order)  
  
note2 = "bcanihjsrrrferet"
find(words, note2) => "cat"   (the letters do not have to be together)  
  
note3 = "tbaykkjlga"
find(words, note3) => "-"     (the letters cannot be reused)  
  
note4 = "bbbblkkjbaby"
find(words, note4) => "baby"    
  
note5 = "dad"
find(words, note5) => "-"    
  
note6 = "breadmaking"
find(words, note6) => "bird"    

note7 = "dadaa"
find(words, note7) => "dada"    

All Test Cases:
find(words, note1) -> "cat"
find(words, note2) -> "cat"
find(words, note3) -> "-"
find(words, note4) -> "baby"
find(words, note5) -> "-"
find(words, note6) -> "bird"
find(words, note7) -> "dada"
  
Complexity analysis variables:  
  
W = number of words in `words`  
S = maximal length of each word or of the note  

'''

words = ["baby", "referee", "cat", "dada", "dog", "bird", "ax", "baz"]
note1 = "ctay"
note2 = "bcanihjsrrrferet" # should have cat
note3 = "tbaykkjlga"
note4 = "bbbblkkjbaby"
note5 = "dad"
note6 = "breadmaking"
note7 = "dadaa"

"""
assuming note is always lowercase alphanumeric

Strategy:
1. For each word, check if all its letters can be found in the note
2. Each letter in the note can only be used once
3. Use a character frequency counter to track available letters in the note
"""
def findHiddenWord(words: list, note: str) -> str:
    # edge cases
    if len(words) == 0 or note == '':
        return '-'

    # Helper function to check if a word can be found in the note
    def canFormWord(word: str, note: str) -> bool:
        # Create a frequency counter for the note
        note_counter = {}
        for char in note:
            note_counter[char] = note_counter.get(char, 0) + 1

        # Try to use characters from note_counter to form the word
        for char in word:
            if char not in note_counter or note_counter[char] == 0:
                return False
            note_counter[char] -= 1

        return True

    # Check each word to see if it can be formed from the note
    for word in words:
        if canFormWord(word, note):
            return word

    return '-'

# Test all cases
print("Testing all cases:")
print(f"note1 ('ctay'): {findHiddenWord(words, note1)} -> Expected: 'cat'")
print(f"note2 ('bcanihjsrrrferet'): {findHiddenWord(words, note2)} -> Expected: 'cat'")
print(f"note3 ('tbaykkjlga'): {findHiddenWord(words, note3)} -> Expected: '-'")
print(f"note4 ('bbbblkkjbaby'): {findHiddenWord(words, note4)} -> Expected: 'baby'")
print(f"note5 ('dad'): {findHiddenWord(words, note5)} -> Expected: '-'")
print(f"note6 ('breadmaking'): {findHiddenWord(words, note6)} -> Expected: 'bird'")
print(f"note7 ('dadaa'): {findHiddenWord(words, note7)} -> Expected: 'dada'")
