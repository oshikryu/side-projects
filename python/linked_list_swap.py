# class Node<Value> {
#    Node<Value> next;
#    final Value value;
# }

# A -> B -> C -> D -> E
# B -> A -> D -> C -> E

# A -> B -> C -> D -> E -> F
# B -> A -> D -> C -> F -> E


# Node<?> swap(Node<?> node) {

# }

class Node:
    def __init__(self, *args, **kwargs):
        self.next = kwargs['next']
        self.value = kwargs['value']
        

# def filter_nodes(node_list):  
def filter_nodes(a):
    
    node_list = []
    while (a):
        node_list.append(a)
        a = a.next
    
    for idx, node in enumerate(node_list):
        # first element
        if idx == 0:
            pass
        
        if idx % 2 == 1:
            last_next = node.next
            node_list[idx - 1].next = last_next
            
            new_prev = node_list[idx - 1]
            node_list[idx-1] = node_list[idx]
            node_list[idx] = new_prev
            
    [print(node.value) for node in node_list]
    
#     return node_list[0]
    no
            

d = Node(next=None, value='D')
c = Node(next=d, value='C')
b = Node(next=c, value='B')
a = Node(next=b, value='A')
    

result = swap(a)

while (result):
    print result.value
    result = result.next


filter_nodes(node_list)
