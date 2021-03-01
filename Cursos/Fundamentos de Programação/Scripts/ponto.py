class Ponto :
	def __init__(self, x, y):
		self.x = x
		self.y = y

	def norma(self):
		n = (self.x**2 + self.y**2)**0.5
		return n
		
p = Ponto(2.0, 3.0)
print(p.norma())