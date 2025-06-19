"""
Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: Since intervals [1,3] and [2,6] overlap, merge them into [1,6].

Input: intervals = [[1,4],[4,5]]
Output: [[1,5]]
"""

def merge(intervals: list[list[int]]) -> list[list[int]]:
    if not intervals:
        return []
    # step one is sort?
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]

    for current in intervals[1:]:
        prev = merged[-1]
        if current[0] <= prev[1]:
            prev[1] = max(prev[1], current[1])
        else:
            merged.append(current)
    print(merged)
    return merged


intervals = [[1,3], [11,13], [2,6],[8,10],[15,18], [4,9]]
merge(intervals)
