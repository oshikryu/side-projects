# it is the space between unmatched that we want
s = ")()())"

def valid(input):
    stack = [-1]
    max_length = 0
    for idx, c in enumerate(input):
        if c == "(":
            print("opening")
            stack.append(idx)
        else:
            stack.pop()
            if not stack:
                stack.append(idx)
            else:
                length = idx - stack[-1]
                max_length = max(max_length, length)

    return max_length


res = valid(s)
print(res)
