"""
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with a length of 3.

Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with a length of 1.

Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with a length of 3.
Note that the answer must be a substring, "pwke" is a subsequence and not a substring.
"""

def length_of_longest_substring(s: str) -> int:
    char_set = set()
    left = 0
    max_length = 0
    
    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        max_length = max(max_length, right - left + 1)
    print(char_set)
    
    print(max_length)
    return max_length


s = "abcabcbb"
length_of_longest_substring(s)
