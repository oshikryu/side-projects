"""
"a balanced tree is one where the difference in height of the left and right subtrees is at most one, for all nodes in the given tree.
"""
class Node:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

def get_height(node):
    if not node:
        return 0

    l_height = get_height(node.left)
    r_height = get_height(node.right)

    return max(l_height, r_height) + 1



def is_balanced(node):
    if not node:
        return True

    l_height = get_height(node.left)
    r_height = get_height(node.right)

    height_diff = abs(l_height - r_height)

    if height_diff > 1:
        return False

    return is_balanced(node.left) and is_balanced(node.right)



root = Node(1)
root.left = Node(2)
root.right = Node(3)
root.left.left = Node(4)
root.left.right = Node(5)
root.right.right = Node(6)
print(is_balanced(root)) 
