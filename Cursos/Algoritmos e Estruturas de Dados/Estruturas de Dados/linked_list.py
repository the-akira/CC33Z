class Node:
    def __init__(self, data):
        self.item = data
        self.ref = None

class LinkedList:
    def __init__(self):
        self.head = None

    def __repr__(self):
    	nodes = []
    	n = self.head
    	if self.head is None:
	        return "Lista está vazia"
    	while n:
    		nodes.append(repr(n.item))
    		n = n.ref
    	return 'Linked List = ' + ' -> '.join(nodes)

    def traverse_list(self):
	    if self.head is None:
	        print("Lista está vazia")
	        return
	    else:
	        n = self.head
	        while n is not None:
	            print(n.item)
	            n = n.ref

    def insert_at_start(self, data):
        new_node = Node(data)
        new_node.ref = self.head
        self.head= new_node  

    def delete_at_start(self):
    	if self.head is None:
    		print('A lista não possui elementos')
    		return
    	self.head = self.head.ref   

    def find(self, key):
    	if self.head is None:
    		print("Lista está vazia")
    		return 
    	n = self.head
    	while n is not None:
    		if n.item == key:
    			print('Item encontrado')
    			return True
    		n = n.ref 
    	print('Item não encontrado')
    	return False

    def size(self):
    	n = self.head
    	count = 0
    	while n != None:
    		count += 1
    		n = n.ref 
    	return count

    def reverse(self):
    	prev = None 
    	n = self.head 
    	while n is not None:
    		next = n.ref 
    		n.ref = prev 
    		prev = n 
    		n = next
    	self.head = prev

    def delete_at_end(self):
    	if self.head is None:
    		print('A lista não possui elementos')
    		return 
    	n = self.head 
    	while n.ref.ref is not None:
    		n = n.ref 
    	n.ref = None

    def delete_item(self, item):
    	if self.head is None:
    		print('A lista não possui elementos')
    		return 
    	if self.head.item == item:
    		self.head = self.head.ref 
    		return 
    	n = self.head 
    	while n.ref is not None:
    		if n.ref.item == item:
    			break
    		n = n.ref 
    	if n.ref is None:
    		print('Item não está na lista')
    	else:
    		n.ref = n.ref.ref

    def insert_after_item(self, item, data):
    	n = self.head 
    	while n is not None:
    		if n.item == item:
    			break
    		n = n.ref 
    	if n is None:
    		print('Item não está na lista')
    	else:
    		new_node = Node(data)
    		new_node.ref = n.ref 
    		n.ref = new_node

    def insert_before_item(self, item, data):
    	if self.head is None:
    		print('A lista não possui elementos')
    		return
    	if item == self.head.item:
    		new_node = Node(data)
    		new_node.ref = self.head 
    		self.head = new_node 
    		return 
    	n = self.head 
    	while n.ref is not None:
    		if n.ref.item == item:
    			break
    		n = n.ref 
    	if n.ref is None:
    		print('Item não está na lista')
    	else:
    		new_node = Node(data)
    		new_node.ref = n.ref 
    		n.ref = new_node

    def insert_at_end(self, data):
	    new_node = Node(data)
	    if self.head is None:
	        self.head = new_node
	        return
	    n = self.head
	    while n.ref is not None:
	        n = n.ref
	    n.ref = new_node

ll = LinkedList()
ll.insert_at_end(1)
ll.insert_at_end(2)
ll.insert_at_start(5)
ll.insert_at_start(8)
ll.traverse_list()
print(f'Tamanho da lista = {ll.size()}')
print(ll.find(8))
ll.reverse()
ll.delete_at_start()
ll.delete_at_end()
ll.insert_after_item(1,13)
ll.insert_before_item(1,27)
ll.delete_item(13)
print(ll)