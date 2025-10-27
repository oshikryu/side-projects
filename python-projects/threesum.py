from typing import List
"""
is the list presorted?
list size, constraints


unique combinations
return a list of values, not the indexes

always returns zero for the sum
"""
def three_sum(nums: List[int]) -> List[List[int]]:
    triplets = []
    nums.sort(key= lambda x: x)

    # decrement 2 to account for two pointers surrounding
    for idx in range(len(nums) - 2):
        # check for dupes in the outer loop
        if idx > 0 and nums[idx] == nums[idx - 1]:
            continue

        left = idx + 1
        right = len(nums) - 1

        # we need to do a second inner loop
        while left < right:
            # what is our base case?
            total = nums[idx] + nums[left] + nums[right]
            if total == 0:
                triplets.append([nums[idx], nums[left], nums[right]])
                # when modifying the sorted list, skip to the next non-duplicate
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                right -= 1
                left += 1
            elif total > 0:
                right -= 1
            elif total < 0:
                left += 1
            else:
                print("should not reach this case")
    return triplets
    
print(three_sum([0, 1, -1]))
