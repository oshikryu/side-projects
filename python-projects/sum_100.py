"""
 Write a function that takes a list of numbers between 1 and 99,
 and returns each pair of numbers that add up to 100.
 
 Examples: (input -> output)
 
 [ 90, 1, 10 ] -> [ [90, 10] ]
 
 [ 50, 5, 95, 95 ] -> [ [5, 95] ]
 
 [ 5, 5, 95, 95 ] -> [ [5, 95], [5, 95] ]

 [1,99]
 validation on input
 duplicates in the input are removed?
 return [ [], []]
"""
def get_pairs(arr):
    pairs = []
    used_indexes = []
    for idx, p in enumerate(arr):
        if idx not in used_indexes:
            complement = 100 - p
            complement_idx = next((_idx for _idx, x in enumerate(arr) if _idx != idx and _idx not in used_indexes and complement == x), None)
            if complement_idx is not None and complement_idx not in used_indexes:
                used_indexes.append(idx)
                used_indexes.append(complement_idx)

                pairs.append([arr[idx], arr[complement_idx]])

    return pairs



#  inp = [90, 1, 10]
#  inp = [50, 5, 95, 95]
#  inp = [ 5, 5, 95, 95 ]
inp = [ 95, 95, 5 ]
res = get_pairs(inp)
print(res)
