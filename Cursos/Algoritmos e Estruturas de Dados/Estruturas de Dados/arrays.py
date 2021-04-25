import array as arr 

# Criando um array de integers
a = arr.array('i',[1,2,3])

# Imprimindo elementos do array a
for i in range(len(a)):
	print(a[i])

# Criando um array de floats
b = arr.array('d',[1.7,2.55,3.345])

# Imprimindo elementos do array b
for i in range(len(b)):
	print(b[i])

# Adicionando o elemento 4 na posição 1 do array a
a.insert(1,4)
print(a)

# Adicionando um elemento no array b com append
b.append(3.1)
print(b)

# Acessando elementos do array a
print(f'Elemento na posição 0 = {a[0]}')
print(f'Elemento na posição 1 = {a[1]}')
print(f'Elemento na última posição = {a[-1]}')

# Removendo o último elemento do array a
a.pop()
print(a)

# Removendo um elemento específico do array a
a.remove(4)
print(a)

# Extendendo o array a com três elementos
a.extend([5,7,9])
print(a)

# Descobrindo o índice de um elemento do array a
print(a.index(7))

# Slicing do array a
print(f'Elementos 0 até 2 = {a[0:3]}')
print(f'Elementos 2 até o fim = {a[2::]}')

# Alterando o primeiro elemento
a[0] = 13

# Invertendo os elementos do array
a.reverse()
print(a)

# Concatenando dois arrays
ímpares = arr.array('i', [1, 3, 5])
pares = arr.array('i', [2, 4, 6])
números = ímpares + pares 
print(números)