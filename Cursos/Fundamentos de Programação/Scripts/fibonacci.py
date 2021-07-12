def fib(x):
    """
    Assume x como inteiro >= 0
    Retorna o Fibonacci de x
    """
    if x == 0 or x == 1:
        return 1
    else:
        return fib(x - 1) + fib(x - 2)
		
print(fib(8)) 
print(fib(10))