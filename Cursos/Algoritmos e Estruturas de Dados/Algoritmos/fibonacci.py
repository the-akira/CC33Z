cache = {
    0: 0,
    1: 1,
    2: 1,
    3: 2,
}

def fibonacci_recursive(n):
    if cache.get(n, None) is None:
        if n % 2:
            f1 = fibonacci_recursive((n - 1) / 2)
            f2 = fibonacci_recursive((n + 1) / 2)
            cache[n] = f1 ** 2 + f2 ** 2
        else:
            f1 = fibonacci_recursive(n / 2 - 1)
            f2 = fibonacci_recursive(n / 2)
            cache[n] = (2 * f1 + f2) * f2
    return cache[n]

if __name__ == '__main__':
    print(fibonacci_recursive(6))
    print(fibonacci_recursive(9))
    print(fibonacci_recursive(100))