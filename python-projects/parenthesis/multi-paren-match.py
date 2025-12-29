"""
each open has a corresponding closed parenthesis
return false if the stack.pop() does not have the match

return boolean
"""

def multi_paren(input):

    matching = {')': '(', '}': '{', ']': '['}
    stack = []
    for char in input:
        if char in matching:
            if not stack or stack[-1] != matching[char]:
                return False
            stack.pop()
        else:
            stack.append(char)
                                           
    return len(stack) == 0


input = "{[()]}"
res = multi_paren(input)
print(res)
