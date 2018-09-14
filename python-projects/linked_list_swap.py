# Swap the odd indexed nodes in a linked list by passing only the node
# print out the results
# should run in O(n)

# A -> B -> C -> D -> E
# B -> A -> D -> C -> E

# A -> B -> C -> D -> E -> F
# B -> A -> D -> C -> F -> E


class Node:
    def __init__(self, *args, **kwargs):
        self.next = kwargs['next']
        self.value = kwargs['value']


def swap(cur):
    idx = 0
    while (cur.next):
        if idx == 0:
            # if first element, set itself as previous
            prev = cur
            # update cur to the next
            cur = cur.next

        elif idx % 2 == 1:
            if idx == 1:
                # if very first odd node, set it as the new root
                root_node = cur
            # link the previous node's next to the current node's next
            prev.next = cur.next
            # link the current node's next as the previous node
            cur.next = prev
            # update cur to the absolute next node, which so happens to be the
            # previous' next
            cur = prev.next
        else:
            # if not odd, update prev's next to the absolute next node
            prev.next = cur.next
            # turn the current node into the new prev
            prev = cur
            # update cur to the next
            cur = cur.next
        idx += 1

    # check to see if the last node is odd
    if idx % 2 == 1:
        # if it is odd, then update link to last node with the previous
        cur.next = prev
        # otherwise it will infinite loop
        prev.next = None

    # print
    n = root_node
    while (n.next):
        print(n.value)
        n = n.next
    print(n.value)

if __name__ == '__main__':
    f = Node(next=None, value='F')
    e = Node(next=f, value='E')
    d = Node(next=e, value='D')
    c = Node(next=d, value='C')
    b = Node(next=c, value='B')
    a = Node(next=b, value='A')

    new_root = swap(a)
