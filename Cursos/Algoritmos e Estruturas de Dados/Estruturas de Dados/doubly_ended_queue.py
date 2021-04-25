from collections import deque 
      
dq = deque(['A','B','C'])  

dq.append('F')
dq.appendleft('G')

print(f'Elemento removido da esquerda = {dq.popleft()}')
print(f'Elemento removido da direita = {dq.pop()}')
print(f'Índice do B = {dq.index("B")}')
print(f'Quantos As existem na deque? {dq.count("A")}')

dq.extend(['W','V'])
dq.extendleft(['J','K'])

# Insertindo Y na posição 5
dq.insert(5,'Y')

# Rotacionado em 2 para a esquerda
dq.rotate(-2)

# Invertendo o deque
dq.reverse()

print(dq)