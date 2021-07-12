def maior_número(lista):
    # Testando se a lista está vazia
    if len(lista) == 0: 
        return None
    # Assumimos que o primeiro número é o maior
    # Inicialmente atribuímos ele a variável "maior"
    maior = lista[0]
    # Agora iremos percorrer a lista e comparar
    # cada número com o valor "maior". Qualquer que
    # seja o maior, vamos atribuir a variávelo "maior"
    for item in lista:
        if item > maior:
            maior = item
    # Depois de terminarmos de visitar todos os items
    # e comparar eles, vamos retornar o valor "maior"
    return maior 

# Testando o código
if __name__ == '__main__':
    lista = [40, 1, 7, 28, 4, 99, 13, 2]
    print(maior_número(lista))