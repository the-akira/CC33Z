try:
    print(x)
except:
    print("Algum erro ocorreu")
finally:
    print("O try e except foram finalizados")

x = -1

if x < 0:
    raise Exception("Desculpe, sem números menores que zero")