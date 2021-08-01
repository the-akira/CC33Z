"""
Contador de números binários
"""

def count_binary(n):
     num = 0
     while n > num:
         yield bin(num)
         num += 1

for n in enumerate(count_binary(32)):
    print(f'{n[0]:02d} -> {int(n[1][2:]):05d}')