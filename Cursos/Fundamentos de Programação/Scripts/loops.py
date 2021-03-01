x = 1
while x < 10:
	print(x)
	x += 1

a = 1
while a < 10:
	print(a)
	if a == 5:
		break
	a += 1

x = 0
while x < 10:
	x += 1
	if x == 5:
		continue
	print(x)