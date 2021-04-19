from math import sqrt

def prime_factors(n):
    while n % 2 == 0:
        print(2,end=" ")
        n /= 2
          
    for i in range(3,int(sqrt(n))+1,2):
        while n % i == 0:
            print(i,end=" ")
            n /= i

    if n > 2:
        print(int(n),end=" ")

prime_factors(555)