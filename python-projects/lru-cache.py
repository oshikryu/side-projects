class Node:
    """Doubly linked list node"""
    def __init__(self, key: int, value: int):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}
        self.head = Node(0,0)
        self.tail = Node(0,0)

        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node: Node) -> None:
        prev_node = node.prev
        next_node = node.next
        prev_node.next = next_node
        next_node.prev = prev_node

    def _add_to_tail(self, node: Node) -> None:
        prev_node = self.tail.prev
        prev_node.next = node
        node.prev = prev_node
        node.next = self.tail
        self.tail.next = node


    def get(self, key: int):
        if key not in self.cache:
            return -1

        node = self.cache[key]

        # move to tail
        self._remove(node)
        self._add_to_tail(node)

        return node.value

    def put(self, key: int, value: int) -> None:
        # Exists, update and add to tail
        if key in self.cache:
            node = self.cache[key]
            node.value = value
            self._remove(node)
            self._add_to_tail(node)

        # eviction case
        if len(self.cache) >= self.capacity:
            lru_node = self.head.next
            self._remove(lru_node)
            del self.cache[lru_node.key]


        new_node = Node(key, value)
        self.cache[key] = new_node
        self._add_to_tail(new_node)

        
    def display(self) -> None:
        """Helper method to visualize cache state"""
        items = []
        current = self.head.next
        while current != self.tail:
            items.append(f"{current.key}:{current.value}")
            current = current.next
        print(f"Cache (LRU -> MRU): [{' -> '.join(items)}]")
    

print("=== Example 1: Basic Operations ===")
cache = LRUCache(2)

cache.put(1, 1)
cache.display()  # [1:1]

cache.put(2, 2)
cache.display()  # [1:1 -> 2:2]

print(f"get(1): {cache.get(1)}")  # returns 1
cache.display()  # [2:2 -> 1:1] (1 moved to end)

cache.put(3, 3)  # evicts key 2
cache.display()  # [1:1 -> 3:3]

print(f"get(2): {cache.get(2)}")  # returns -1 (not found)

cache.put(4, 4)  # evicts key 1
cache.display()  # [3:3 -> 4:4]

print(f"get(1): {cache.get(1)}")  # returns -1
print(f"get(3): {cache.get(3)}")  # returns 3
cache.display()  # [4:4 -> 3:3]

print(f"get(4): {cache.get(4)}")  # returns 4
cache.display()  # [3:3 -> 4:4]


print("\n=== Example 2: Update Existing Key ===")
cache2 = LRUCache(2)

cache2.put(1, 1)
cache2.put(2, 2)
cache2.display()  # [1:1 -> 2:2]

cache2.put(1, 10)  # update key 1
cache2.display()  # [2:2 -> 1:10]

print(f"get(1): {cache2.get(1)}")  # returns 10


print("\n=== Example 3: Capacity 1 ===")
cache3 = LRUCache(1)

cache3.put(1, 1)
cache3.display()  # [1:1]

cache3.put(2, 2)  # evicts 1
cache3.display()  # [2:2]

print(f"get(1): {cache3.get(1)}")  # returns -1
print(f"get(2): {cache3.get(2)}")  # returns 2


print("\n=== Example 4: Access Pattern ===")
cache4 = LRUCache(3)

cache4.put(1, 100)
cache4.put(2, 200)
cache4.put(3, 300)
cache4.display()  # [1:100 -> 2:200 -> 3:300]

cache4.get(1)  # access 1
cache4.display()  # [2:200 -> 3:300 -> 1:100]

cache4.get(2)  # access 2
cache4.display()  # [3:300 -> 1:100 -> 2:200]

cache4.put(4, 400)  # evicts 3 (LRU)
cache4.display()  # [1:100 -> 2:200 -> 4:400]

print(f"get(3): {cache4.get(3)}")  # returns -1

