class Stack():
    def __init__(self, **kwargs):
        self.stuff = []
        self.min_list = []
        
    def push(self, num):
        if self.min_list:
            self.set_min(num)
        else:
            self.min_list.append(num)
        return self.stuff.append(num)
        
    def peek(self):
        last_idx = len(self.stuff) - 1
        if self.stuff:
            return self.stuff[last_idx]
        
    def pop(self):
        if self.stuff:
            popped = self.stuff.pop()
            _min = self.get_min()
            if popped <= _min:
                self.min_list.pop()
            
            return popped
    
    def get_min(self):
        return self.min_list[len(self.min_list) - 1]
    
    def set_min(self, num):
        _min = self.get_min()
        if _min is not None or num < _min:
            self.min_list.append(num)
        return _min
        
        
    
# 5 -> 3 -> 7

stack = Stack()
stack.push(5) # [5]
stack.push(3) # [5, 3]
stack.push(7) # [5, 3]
stack.pop() # [5, 3]
stack.push(0) # [5, 3, 0]
stack.pop() # [5, 3]
stack.push(-3) # [5, 3, -3]

print(stack.peek())

stack.pop()

print(stack.peek()) # 3
        
