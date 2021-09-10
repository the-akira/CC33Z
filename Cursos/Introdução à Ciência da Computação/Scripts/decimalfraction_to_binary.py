"""
Função para converter decimal para binário
Até uma precisão-k após o ponto decimal
"""

def decimalfraction_to_binary(num, k) :
    binary = ""
    # Obter a parte integrante do número decimal
    integral = int(num)
    # Obter a parte fracional do número decimal
    fractional = num - integral
 
    # Converter a parte integral para o equivalente binário
    while integral:       
        rem = integral % 2
        binary += str(rem)
        integral //= 2
     
    # Reverter a string para obter o binário equivalente original
    binary = binary[::-1]
    binary += '.'
 
    # Converter a parte fracional para o equivalente binário
    while k:
        # Buscar o próximo bit na fração
        fractional *= 2
        fract_bit = int(fractional)
 
        if fract_bit == 1:            
            fractional -= fract_bit
            binary += '1'             
        else:
            binary += '0' 
        k -= 1
 
    return binary
 

if __name__ == "__main__" :    
    n = 0.09375
    k = 5
    print(decimalfraction_to_binary(n, k))
    n = 123.3
    k = 8
    print(decimalfraction_to_binary(n, k))
    n = 19.59375
    k = 5
    print(decimalfraction_to_binary(n, k))