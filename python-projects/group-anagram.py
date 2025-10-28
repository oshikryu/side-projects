from typing import List

def group_anagrams(strs: List[str]) -> List[List[str]]:
    result = []
    mapper = dict()
    if len(strs) == 1:
        result.append(strs[0])
        return result
    elif len(strs) == 0:
        return [[""]]

    for el in strs:
        sorted_word_arr = sorted(el, key=lambda x :x)
        sorted_word = "".join(sorted_word_arr)
        
        if sorted_word in mapper:
            # mapper idx
            mapper[sorted_word].append(el)
        else:
            mapper[sorted_word] = [el]

    for val_array in mapper.values():
        result.append(val_array)

    return result

# debug your code below
# strs = ["listen", "silent", "enlist", "google", "gooegl"]
# strs = ["p"]
strs = [""]
print(group_anagrams(strs))
