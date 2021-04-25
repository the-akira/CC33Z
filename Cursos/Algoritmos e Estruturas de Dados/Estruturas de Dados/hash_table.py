import collections

# Dicionário construído do Python
telefones = {
    'gabriel': 995566,
    'rafael': 927354,
    'samuel': 959834,
}

print(telefones)
print(telefones['samuel'])

quadrados = {x: x * x for x in range(10)}
print(quadrados)

# OrderedDict da biblioteca collections
d = collections.OrderedDict(um=1, dois=2, três=3)
print(d)

d['quatro'] = 4
print(d)

print(f'Chaves = {d.keys()}')
print(f'Valores = {d.values()}')
print(f'Items = {d.items()}')

# ChainMap da biblioteca collections
dict1 = {'a': 1, 'b': 2}
dict2 = {'c': 3, 'd': 4}
chain = collections.ChainMap(dict1, dict2)
print(chain)
print(chain['a'])
print(chain['d'])