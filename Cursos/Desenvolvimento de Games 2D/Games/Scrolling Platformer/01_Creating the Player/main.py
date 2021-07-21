import pygame
pygame.init()

# Definições da tela
WIDTH = 800
HEIGHT = int(WIDTH * 0.8)
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption('Scrolling Platformer')

# Classe que representa um soldado
class Soldier(pygame.sprite.Sprite):
    def __init__(self, x, y, scale):
        pygame.sprite.Sprite.__init__(self)
        # Carregar a imagem do player
        img = pygame.image.load('images/0.png')
        self.image = pygame.transform.scale(img, (int(img.get_width() * scale), int(img.get_height() * scale)))
        # Cria um retângulo a partir da imagem do player 
        self.rect = self.image.get_rect()
        self.rect.center = (x, y)

    def draw(self):
        screen.blit(self.image, self.rect)

# Criar duas instâncias do player
player = Soldier(200, 200, 3)
player2 = Soldier(400, 200, 3)

# Game Loop
run = True 
while run:
    # Desenhar os players   
    player.draw()
    player2.draw()
    for event in pygame.event.get():
        # Sair do game
        if event.type == pygame.QUIT:
            run = False
    # Atualizar a tela
    pygame.display.update()

pygame.quit()