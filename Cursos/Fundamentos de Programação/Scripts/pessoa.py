class Pessoa:
    def __init__(self, nome, sobrenome):
        self.nome = nome
        self.sobrenome = sobrenome
    def imprimir_nome(self):
        print(self.nome, self.sobrenome)

class Estudante(Pessoa):
    pass

p = Pessoa("Isaac", "Newton")
p.imprimir_nome()

e = Estudante("Immanuel", "Kant")
e.imprimir_nome()