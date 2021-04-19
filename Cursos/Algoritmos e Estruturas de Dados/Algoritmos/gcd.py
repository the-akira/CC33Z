def gcd(a, b):
	if b == 0:
		return a
	elif a > b:
		return gcd(a-b,b)
	else:
		return gcd(a,b-a)

if __name__ == '__main__':
	print(gcd(50,25))
	print(gcd(13,18))
	print(gcd(27,18))
	print(gcd(100,255))