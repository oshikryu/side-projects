def min_parens(input):
    open_needed = 0
    open_count = 0

    for char in input:
        if char == "(":
            open_count += 1
        else:
            if open_count > 0:
                open_count -= 1
            else:
                open_needed += 1
            # handle closed
    return open_needed + open_count

#  input = "())"
input = "()))(("
res = min_parens(input)
print(res)
