def fatorial(x):
	"""
	Essa é uma função recursiva
	Ela calcula o fatorial de um número inteiro
	"""
	if x == 1:
		return 1
	else:
		return (x * fatorial(x - 1))

y = 4
z = 10
print("O fatorial de {0} é {1}".format(y,fatorial(y))) 
print("O fatorial de {0} é {1}".format(z,fatorial(z))) 