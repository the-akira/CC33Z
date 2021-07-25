import pygame
pygame.init()

# Classe que representa um personagem
class Link:
    def __init__(self):
        self.x_speed = -7
        self.frame1 = pygame.image.load('imagens/Link/link1.png')
        self.frame2 = pygame.image.load('imagens/Link/link2.png')
        self.frame3 = pygame.image.load('imagens/Link/link3.png')
        self.frame4 = pygame.image.load('imagens/Link/link4.png')
        self.frame5 = pygame.image.load('imagens/Link/link5.png')
        self.frame6 = pygame.image.load('imagens/Link/link6.png')
        self.frame7 = pygame.image.load('imagens/Link/link7.png')
        self.frame8 = pygame.image.load('imagens/Link/link8.png')
        self.image = self.frame1
        self.frame = 1
        self.FRAME_CHANGE_RATE = 3
        self.frame_counter = 0
        self.rect = self.image.get_rect()
        self.rect.y = 43

    def turn_back(self):
        self.x_speed *= -1
        self.image = pygame.transform.flip(self.image, True, False)

    def walk(self):
        if self.rect.left < 0:
            self.turn_back()
        elif self.rect.right > WIDTH:
            self.turn_back()
        self.rect.x += self.x_speed
        self.change_frame()

    def change_frame(self):
        self.frame_counter += 1

        if self.frame_counter >= self.FRAME_CHANGE_RATE:
            self.frame_counter = 0
            if self.frame == 1:
                self.image = self.frame1
                self.frame = 2
            elif self.frame == 2:
                self.image = self.frame2
                self.frame = 3
            elif self.frame == 3:
                self.image = self.frame3
                self.frame = 4
            elif self.frame == 4:
                self.image = self.frame4
                self.frame = 5
            elif self.frame == 5:
                self.image = self.frame5
                self.frame = 6
            elif self.frame == 6:
                self.image = self.frame6
                self.frame = 7
            elif self.frame == 7:
                self.image = self.frame7
                self.frame = 8
            elif self.frame == 8:
                self.image = self.frame8
                self.frame = 1

            if self.x_speed > 0:
                self.image = pygame.transform.flip(self.image, True, False)

# Definir constantes
WIDTH = 1000
HEIGHT = 170
FPS = 35
SKY = (110, 170, 210)

# Configurações básicas
clock = pygame.time.Clock()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption('Link Animation')

# Cria uma instância do personagem
link = Link()

# Main Loop
running = True
while running:
    pygame.display.update()
    clock.tick(FPS)

    # Preenche o fundo da tela
    screen.fill(SKY)
    
    # Desenha o personagem e atualiza sua animação
    link.walk()
    screen.blit(link.image, link.rect)

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

pygame.quit()