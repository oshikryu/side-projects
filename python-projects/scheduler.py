"""
Meeting Room Scheduler - Multiple Solutions
Including bonus challenges
"""

from typing import List, Tuple, Optional, Set
from bisect import bisect_left, insort
from datetime import datetime, timedelta
from collections import defaultdict
import heapq


# ============================================
# SOLUTION 1: Simple List-Based
# ============================================

class MeetingRoomSchedulerSimple:
    """
    Simple approach using sorted list
    Time: book O(n), is_available O(n), cancel O(n)
    Space: O(n)
    """
    def __init__(self):
        self.bookings: List[Tuple[int, int]] = []
    
    def book(self, start: int, end: int) -> bool:
        # Check for conflicts
        for s, e in self.bookings:
            # Conflict if intervals overlap
            if not (end <= s or start >= e):
                return False
        
        # No conflict, add booking
        self.bookings.append((start, end))
        self.bookings.sort()
        return True
    
    def is_available(self, start: int, end: int) -> bool:
        for s, e in self.bookings:
            if not (end <= s or start >= e):
                return False
        return True
    
    def cancel(self, start: int, end: int) -> bool:
        try:
            self.bookings.remove((start, end))
            return True
        except ValueError:
            return False
    
    def get_bookings(self) -> List[Tuple[int, int]]:
        return sorted(self.bookings)


# ============================================
# SOLUTION 2: Optimized with Binary Search
# ============================================

class MeetingRoomScheduler:
    """
    Optimized using binary search on sorted list
    Time: book O(n) worst case, O(log n) search + O(n) insert
          is_available O(log n)
          cancel O(n)
    Space: O(n)
    
    RECOMMENDED for interview
    """
    def __init__(self):
        self.bookings: List[Tuple[int, int]] = []
    
    def book(self, start: int, end: int) -> bool:
        if not self._check_available(start, end):
            return False
        
        # Insert in sorted position
        insort(self.bookings, (start, end))
        return True
    
    def is_available(self, start: int, end: int) -> bool:
        return self._check_available(start, end)
    
    def _check_available(self, start: int, end: int) -> bool:
        # Find position where this meeting would be inserted
        idx = bisect_left(self.bookings, (start, end))
        
        # Check overlap with previous meeting
        if idx > 0:
            prev_start, prev_end = self.bookings[idx - 1]
            if start < prev_end:  # Overlap
                return False
        
        # Check overlap with next meeting
        if idx < len(self.bookings):
            next_start, next_end = self.bookings[idx]
            if end > next_start:  # Overlap
                return False
        
        return True
    
    def cancel(self, start: int, end: int) -> bool:
        try:
            self.bookings.remove((start, end))
            return True
        except ValueError:
            return False
    
    def get_bookings(self) -> List[Tuple[int, int]]:
        return self.bookings.copy()


# ============================================
# BONUS 1: Multiple Meeting Rooms
# ============================================

class MultiRoomScheduler:
    """
    Handles multiple meeting rooms
    Uses min heap to track which room becomes available first
    """
    def __init__(self, num_rooms: int):
        self.num_rooms = num_rooms
        # Each room has its own sorted list of bookings
        self.rooms: List[List[Tuple[int, int]]] = [[] for _ in range(num_rooms)]
    
    def book(self, start: int, end: int) -> Tuple[bool, Optional[int]]:
        """
        Try to book in any available room
        Returns: (success, room_number or None)
        """
        for room_id in range(self.num_rooms):
            if self._is_room_available(room_id, start, end):
                insort(self.rooms[room_id], (start, end))
                return True, room_id
        return False, None
    
    def book_specific_room(self, room_id: int, start: int, end: int) -> bool:
        """Book a specific room"""
        if room_id >= self.num_rooms:
            return False
        
        if self._is_room_available(room_id, start, end):
            insort(self.rooms[room_id], (start, end))
            return True
        return False
    
    def _is_room_available(self, room_id: int, start: int, end: int) -> bool:
        bookings = self.rooms[room_id]
        idx = bisect_left(bookings, (start, end))
        
        if idx > 0:
            prev_start, prev_end = bookings[idx - 1]
            if start < prev_end:
                return False
        
        if idx < len(bookings):
            next_start, next_end = bookings[idx]
            if end > next_start:
                return False
        
        return True
    
    def find_available_rooms(self, start: int, end: int) -> List[int]:
        """Find all rooms available for a time slot"""
        available = []
        for room_id in range(self.num_rooms):
            if self._is_room_available(room_id, start, end):
                available.append(room_id)
        return available
    
    def get_room_bookings(self, room_id: int) -> List[Tuple[int, int]]:
        if room_id >= self.num_rooms:
            return []
        return self.rooms[room_id].copy()


# ============================================
# BONUS 2: Recurring Meetings
# ============================================

class RecurringMeetingScheduler:
    """
    Supports one-time and recurring meetings
    """
    def __init__(self):
        self.one_time: List[Tuple[int, int]] = []
        self.recurring: List[Tuple[int, int, str, int]] = []  # (start, end, pattern, occurrences)
    
    def book(self, start: int, end: int) -> bool:
        """Book a one-time meeting"""
        if not self._check_available(start, end):
            return False
        insort(self.one_time, (start, end))
        return True
    
    def book_recurring(self, start: int, end: int, pattern: str, occurrences: int) -> bool:
        """
        Book recurring meeting
        pattern: 'daily', 'weekly' (7 days), 'biweekly' (14 days)
        occurrences: number of times to repeat
        """
        interval_map = {'daily': 24, 'weekly': 24 * 7, 'biweekly': 24 * 14}
        if pattern not in interval_map:
            return False
        
        interval = interval_map[pattern]
        
        # Check all occurrences for conflicts
        for i in range(occurrences):
            curr_start = start + (i * interval)
            curr_end = end + (i * interval)
            if not self._check_available(curr_start, curr_end):
                return False
        
        # All clear, book it
        self.recurring.append((start, end, pattern, occurrences))
        return True
    
    def _check_available(self, start: int, end: int) -> bool:
        # Check one-time meetings
        idx = bisect_left(self.one_time, (start, end))
        
        if idx > 0:
            prev_start, prev_end = self.one_time[idx - 1]
            if start < prev_end:
                return False
        
        if idx < len(self.one_time):
            next_start, next_end = self.one_time[idx]
            if end > next_start:
                return False
        
        # Check recurring meetings
        interval_map = {'daily': 24, 'weekly': 24 * 7, 'biweekly': 24 * 14}
        
        for r_start, r_end, pattern, occurrences in self.recurring:
            interval = interval_map[pattern]
            for i in range(occurrences):
                curr_start = r_start + (i * interval)
                curr_end = r_end + (i * interval)
                
                # Check overlap
                if not (end <= curr_start or start >= curr_end):
                    return False
        
        return True
    
    def get_all_meetings(self, time_range_start: int, time_range_end: int) -> List[Tuple[int, int, str]]:
        """Get all meetings (expanded recurring) within a time range"""
        meetings = []
        
        # Add one-time meetings
        for start, end in self.one_time:
            if start >= time_range_start and end <= time_range_end:
                meetings.append((start, end, "one-time"))
        
        # Expand recurring meetings
        interval_map = {'daily': 24, 'weekly': 24 * 7, 'biweekly': 24 * 14}
        
        for r_start, r_end, pattern, occurrences in self.recurring:
            interval = interval_map[pattern]
            for i in range(occurrences):
                curr_start = r_start + (i * interval)
                curr_end = r_end + (i * interval)
                
                if curr_start >= time_range_start and curr_end <= time_range_end:
                    meetings.append((curr_start, curr_end, f"recurring-{pattern}"))
        
        meetings.sort()
        return meetings


# ============================================
# BONUS 3: Find Next Available Slot
# ============================================

class SmartScheduler(MeetingRoomScheduler):
    """
    Extends basic scheduler with smart slot finding
    """
    
    def find_next_available_slot(self, duration: int, start_search: int = 0, 
                                 end_search: Optional[int] = None) -> Optional[Tuple[int, int]]:
        """
        Find the next available slot of given duration
        Returns: (start_time, end_time) or None if not found
        """
        if end_search is None:
            end_search = float('inf')
        
        # If no bookings, return immediately
        if not self.bookings:
            return (start_search, start_search + duration)
        
        # Check before first booking
        first_start, _ = self.bookings[0]
        if start_search + duration <= first_start:
            return (start_search, start_search + duration)
        
        # Check gaps between bookings
        for i in range(len(self.bookings) - 1):
            _, curr_end = self.bookings[i]
            next_start, _ = self.bookings[i + 1]
            
            gap_start = max(curr_end, start_search)
            gap_end = next_start
            
            if gap_end - gap_start >= duration and gap_start < end_search:
                return (gap_start, gap_start + duration)
        
        # Check after last booking
        _, last_end = self.bookings[-1]
        slot_start = max(last_end, start_search)
        if slot_start < end_search:
            return (slot_start, slot_start + duration)
        
        return None
    
    def find_all_available_slots(self, duration: int, start_time: int, 
                                end_time: int) -> List[Tuple[int, int]]:
        """Find all available slots within a time range"""
        slots = []
        current = start_time
        
        while current < end_time:
            slot = self.find_next_available_slot(duration, current, end_time)
            if slot is None:
                break
            
            slot_start, slot_end = slot
            if slot_end > end_time:
                break
            
            slots.append(slot)
            current = slot_end
        
        return slots


# ============================================
# TESTS AND EXAMPLES
# ============================================

print("="*60)
print("BASIC SCHEDULER TEST")
print("="*60)

scheduler = MeetingRoomScheduler()
print(f"Book 9-11: {scheduler.book(9, 11)}")  # True
print(f"Book 13-15: {scheduler.book(13, 15)}")  # True
print(f"Book 10-12: {scheduler.book(10, 12)}")  # False - conflict
print(f"Book 11-13: {scheduler.book(11, 13)}")  # True - boundary OK
print(f"Book 14-16: {scheduler.book(14, 16)}")  # False - conflict
print(f"Available 15-17: {scheduler.is_available(15, 17)}")  # True
print(f"Available 12-14: {scheduler.is_available(12, 14)}")  # False
print(f"Cancel 13-15: {scheduler.cancel(13, 15)}")  # True
print(f"Book 14-16: {scheduler.book(14, 16)}")  # True - now works
print(f"Bookings: {scheduler.get_bookings()}")

print("\n" + "="*60)
print("MULTI-ROOM SCHEDULER TEST")
print("="*60)

multi = MultiRoomScheduler(3)
print(f"Book 9-11: {multi.book(9, 11)}")  # (True, 0)
print(f"Book 9-10: {multi.book(9, 10)}")  # (True, 1) - different room
print(f"Book 9-11: {multi.book(9, 11)}")  # (True, 2)
print(f"Book 9-12: {multi.book(9, 12)}")  # (False, None) - all rooms busy
print(f"Available rooms 11-13: {multi.find_available_rooms(11, 13)}")
print(f"Room 0 bookings: {multi.get_room_bookings(0)}")

print("\n" + "="*60)
print("RECURRING MEETINGS TEST")
print("="*60)

recurring = RecurringMeetingScheduler()
print(f"Book one-time 9-11: {recurring.book(9, 11)}")
print(f"Book weekly 10-11 (3 times): {recurring.book_recurring(10, 11, 'weekly', 3)}")  # False - conflicts with 9-11
print(f"Book weekly 11-12 (3 times): {recurring.book_recurring(11, 12, 'weekly', 3)}")  # True
print(f"Meetings in range 0-200:")
meetings = recurring.get_all_meetings(0, 200)
for m in meetings[:5]:
    print(f"  {m}")

print("\n" + "="*60)
print("SMART SLOT FINDER TEST")
print("="*60)

smart = SmartScheduler()
smart.book(9, 11)
smart.book(13, 15)
smart.book(16, 18)

print(f"Find 2-hour slot starting from 0: {smart.find_next_available_slot(2, 0)}")
print(f"Find 2-hour slot starting from 11: {smart.find_next_available_slot(2, 11)}")
print(f"Find 1-hour slot starting from 11: {smart.find_next_available_slot(1, 11)}")
print(f"All 1-hour slots between 8-20: {smart.find_all_available_slots(1, 8, 20)}")

print("\n" + "="*60)
print("COMPLEXITY SUMMARY")
print("="*60)
print("""
Basic Scheduler:
  - book(): O(log n) to check + O(n) to insert = O(n)
  - is_available(): O(log n)
  - cancel(): O(n)
  - Space: O(n)

Multi-Room (k rooms):
  - book(): O(k * n) worst case
  - find_available_rooms(): O(k * log n)

Recurring Meetings:
  - book_recurring(): O(m * n) where m = occurrences
  - Expansion adds overhead

Smart Slot Finder:
  - find_next_available_slot(): O(n)
  - find_all_available_slots(): O(n * slots)

For millions of bookings, consider:
  - Segment tree for range queries: O(log n)
  - Interval tree: O(log n + k) where k = overlapping intervals
  - Database with indexed queries
""")
