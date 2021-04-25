class Stack:
    def __init__(self):
        self.items = []

    def __str__(self):
        return 'Stack = {}'.format(self.items)

    def is_empty(self):
        return self.items == []

    def push(self, item):
        self.items.append(item)

    def clear(self):
        self.items = []

    def pop(self):
        if self.is_empty():
            raise Exception('Stack está vazia')
        return self.items.pop()

    def peek(self):
        if self.is_empty():
            raise Exception("Stack está vazia")
        return self.items[len(self.items)-1]

    def size(self):
        return len(self.items)

    def display(self):
        for item in self.items:
            print(item)

s = Stack()

for i in range(6):
    s.push(i)

print(f'Elemento removido: {s.pop()}')
print(f'Elemento removido: {s.pop()}')
print(f'Elemento do topo: {s.peek()}')
print(f'Está vazia? {s.is_empty()}')
print(f'Número de elementos = {s.size()}')
print(s)