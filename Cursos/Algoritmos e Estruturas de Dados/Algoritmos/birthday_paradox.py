from math import sqrt, log, ceil

def calcular(p):
    return ceil(sqrt(2*365*log(1/(1-p))))

print(calcular(0.50))