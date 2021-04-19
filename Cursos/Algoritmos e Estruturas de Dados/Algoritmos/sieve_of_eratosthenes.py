def primes_sieve(n):
    not_prime, primes = set(), []

    for i in range(2, n):
        if i in not_prime:
            continue

        for j in range(i*i, n, i):
            not_prime.add(j)

        primes.append(i)

    return primes

print(primes_sieve(50));