from typing import List

"""
limiting to two sentences

cases:
check list length and compare naively
check for duplicate sentence?
similar pairs are pre-defined arguments

approach:
loop O(n) for sentence 1

find the index of similar pairs in each sentence
compare the values at the index within the similar pairs tuple

define similarPairs tuple order (is sen1 word always first?)

sentence 1 -> indexes of sentence 2 where we want to check similar pairs

create graph from similar pairs to transform sentence 1 indexes to sentence 2 indexes

determine if the end result of sentence 1 matches end of sentence 2

return value is boolean
"""
def areSentencesSimilar(sentence1: List[str],
                        sentence2: List[str],
                        similarPairs: List[List[str]]) -> bool:

    # check the length
    sen1_len = len(sentence1)
    sen2_len = len(sentence2)

    if sen1_len != sen2_len:
        return False

    similar_indexes: List[int] = []
    for idx in range(len(sentence1)):
        if sentence1[idx] == sentence2[idx]:
            continue
        else:
            similar_indexes.append(idx)
    
    # map the sentence to the end state
    mapper = dict()
    for pair in similarPairs:
        mapper[pair[0]] = pair[1]

    def transform(sentence: List[str]) -> List[str]:
        for key, val in mapper.items():
            for idx in similar_indexes:
                if sentence[idx] in mapper:
                    sentence[idx] = mapper[sentence[idx]]
        return sentence

    end_sentence_1 = transform(sentence1)
    end_sentence_2 = transform(sentence2)
    print(end_sentence_1)
    print(end_sentence_2)

    return end_sentence_1 == end_sentence_2
    
# debug your code below
sentence1 = ["Let's", "code", "in", "Python"]
sentence2 = ["Let's", "program", "in", "Python"]
similarPairs = [["code", "program"]]

print(areSentencesSimilar(sentence1, sentence2, similarPairs))
