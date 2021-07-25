from random import randrange
import pygame
pygame.init()

# Definição da tela (500x500 pixels)
WIDTH, HEIGHT = 500, 500
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Exemplo - Classe Sprite")

# Carrega o background
bg = pygame.image.load('imagens/space.png').convert_alpha()

# Define a classe que representa um Alien
class Alien(pygame.sprite.Sprite):
    def __init__(self, x, y, scale):
        pygame.sprite.Sprite.__init__(self)
        img = pygame.image.load('imagens/alien.png').convert_alpha()
        self.image = pygame.transform.scale(img, (int(img.get_width() * scale), int(img.get_height() * scale)))
        self.rect = self.image.get_rect()
        self.rect.center = (x, y)

    def update(self):
        new_x = randrange(20,WIDTH - 100)
        new_y = randrange(20,HEIGHT - 150)
        self.rect.x = new_x 
        self.rect.y = new_y

# Define um evento de teleport
teleport_timer = pygame.USEREVENT
pygame.time.set_timer(teleport_timer, 500) # Milisegundos

# Cria um grupo para o alien, cria um alien e adiciona ele ao grupo
alien_group = pygame.sprite.Group()
alien = Alien(250, 250, 0.4)
alien_group.add(alien)

# Main Loop
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == teleport_timer:
            alien_group.update()

    # Desenhar o background
    screen.blit(bg,(0,0))
    # Desenhar o alien na tela
    alien_group.draw(screen)
    # Atualizar a janela
    pygame.display.flip()

# Sair do game
pygame.quit()