def paren_matcher(inp):
    open_par = []
    output = []

    for char in inp:
        if char == ")":
            # check for open_parents
            if len(open_par) > 0:
                if open_par[-1] != None:
                    open_par.pop()
                    output.append(char)

        else:
            open_par.append(len(output))
            output.append(char)
    print(open_par)


    # filter out hanging open parenthesis
    # this bit keeps the indexes unshifted
    for idx in reversed(open_par):
        output.pop(idx)

    return "".join(output)
            



test_cases = [
    # Basic cases
    "()",           # Balanced pair
    "((()))",       # Nested balanced
    "()()()",       # Multiple balanced pairs
    "",             # Empty string

    # Unbalanced closing
    ")",            # Single closing
    "))",           # Multiple closing
    "())",          # Extra closing at end
    "())()",        # Extra closing in middle
    ")()",          # Opening closing at start
    ")()(",         # Mixed unbalanced

    # Unbalanced opening
    "(",            # Single opening
    "(((",          # Multiple opening
    "(()",          # Extra opening
    "(()(()",       # Multiple extra opening

    # Complex cases
    "(()()",        # Nested with missing closing
    "(()())",       # Nested balanced groups
    "()(()",        # Mixed balanced and unbalanced
    ")))(((",       # All unbalanced both sides
    "()(())",       # Balanced with nesting
    "((())())",     # Deeply nested balanced
    "()()(()())",   # Multiple groups with nesting
]

for inp in test_cases:
    res = paren_matcher(inp)
    print(f"Input: '{inp:15}' -> Output: '{res}'")
