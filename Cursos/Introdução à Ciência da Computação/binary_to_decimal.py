"""
Função que converte um número
binário para decimal
"""

def binary_to_decimal(binary):    
    decimal, i, n = 0, 0, 0
    while(binary != 0):
        dec = binary % 10
        decimal = decimal + dec * pow(2, i)
        binary = binary//10
        i += 1
    return decimal

print(f'100 = {binary_to_decimal(100)}')
print(f'11111111 = {binary_to_decimal(11111111)}')
print(f'101 = {binary_to_decimal(101)}')
print(f'1001 = {binary_to_decimal(1001)}')