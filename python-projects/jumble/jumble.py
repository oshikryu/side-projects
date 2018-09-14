import sys

# get user input
word = raw_input("Please enter a word: ")
print "you entered:", word

# read file and put lines into a list
word_list = open('2of12inf.txt').read().split()
#  http://stackoverflow.com/questions/8306654/finding-all-possible-permutations-of-a-given-string-in-python
def permutations(word):
    if len(word)<=1:
        return [word]

    #get all permutations of length N-1
    perms=permutations(word[1:])
    char=word[0]
    result=[]
    #iterate over all permutations of length N-1
    for perm in perms:
        #insert the character into every possible location
        for i in range(len(perm)+1):
            result.append(perm[:i] + char + perm[i:])
    return result

all_permutations = []

# http://stackoverflow.com/questions/8458244/swap-letters-in-a-string-in-python
def rotate(strg,n):
    return strg[n:] + strg[:n]

# permutations of the word as a whole
for p in permutations(word):
    all_permutations.append(p)

# find substrings in word
for i, c in enumerate(word):
    for j, c in enumerate(word):
        # back chars
        spliced = word[:j]
        for p in permutations(spliced):
            all_permutations.append(p)
        # rotate char order
        # the ever elusive O(n^4)
        for k, c in enumerate(spliced):
            rotated = rotate(spliced, k)
            for p in permutations(rotated):
                all_permutations.append(p)

        # front chars
        front = word[j:]
        for p in permutations(front):
            all_permutations.append(p)
        # rotate char order
        # the ever elusive O(n^4)
        for k, c in enumerate(front):
            rotated = rotate(front, k)
            for p in permutations(rotated):
                all_permutations.append(p)

# http://stackoverflow.com/questions/952914/making-a-flat-list-out-of-list-of-lists-in-python
# 
# flatten list and find uniques
uniq = list(set(all_permutations))

valid = []

# find all valid words
for part in uniq:
    try:
        word_list.index(part)
        valid.append(part)
    except:
        # not in list
        pass

print(valid)


