class Queue:
    def __init__(self):
        self.items = []

    def __str__(self):
        return 'Queue = {}'.format(self.items)

    def is_empty(self):
        return self.items == []

    def clear(self):
        self.items = []

    def enqueue(self, item):
        self.items.append(item)

    def front(self):
        if self.is_empty():
            raise Exception('Queue está vazia')
        return self.items[0]

    def rear(self):
        if self.is_empty():
            raise Exception('Queue está vazia')
        return self.items[-1]

    def dequeue(self):
        if self.is_empty():
            raise Exception('Queue está vazia')
        return self.items.pop(0)

    def size(self):
        return len(self.items)

    def display(self):
        for item in self.items:
            print(item)

q = Queue()

for i in range(6):
    q.enqueue(i)

print(f'Elemento removido: {q.dequeue()}')
print(f'Elemento removido: {q.dequeue()}')
print(f'Elemento da frente: {q.front()}')
print(f'Último elemento: {q.rear()}')
print(f'Está vazia? {q.is_empty()}')
print(f'Número de elementos = {q.size()}')
print(q)