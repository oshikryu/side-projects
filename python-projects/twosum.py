from typing import List

"""
is the list of nums sorted or unsorted?

edge cases
positive/negative values
empty list
no sum exists?

want to maintain the original list
returns list of indexes of the matching sums

new constraint of we want the first matching pair from left to right
"""
def two_sum(nums: List[int], target: int) -> List[int]:
    if len(nums) == 0:
        return []
    sorted_copy = [(idx, val) for idx, val in enumerate(nums)]
    sorted_copy.sort(key = lambda x:x[1])
    print(sorted_copy)

    left = 0
    right = len(sorted_copy) - 1

    while left < right:
        # identify base case
        total = sorted_copy[left][1] + sorted_copy[right][1]
        if total == target:

            # because it is sorted, duplicates will be adjacent to each other
            # decrement until it is not matching. This will be the first occurence
            while (right > left + 1 and sorted_copy[right][1] == sorted_copy[right - 1][1]):
                right -= 1

            # we need to resort the values after decrementing right pointer
            return [sorted_copy[left][0], sorted_copy[right][0]]
        elif total < target:
            left += 1
        else:
            right -= 1

    return []
    
# debug your code below
print(two_sum([2, 11, 15, 7], 9))
