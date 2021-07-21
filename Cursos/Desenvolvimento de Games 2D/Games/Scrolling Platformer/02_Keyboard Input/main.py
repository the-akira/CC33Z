import pygame
pygame.init()

# Definições da tela
WIDTH = 800
HEIGHT = int(WIDTH * 0.8)
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption('Scrolling Platformer')

# Definir frame rate 
clock = pygame.time.Clock()
FPS = 60

# Variáveis de ação do player
moving_left = False 
moving_right = False

# Definir cores
BG = (144, 201, 120)

def draw_bg():
    screen.fill(BG)

# Classe que representa um soldado
class Soldier(pygame.sprite.Sprite):
    def __init__(self, char_type, x, y, scale, speed):
        pygame.sprite.Sprite.__init__(self)
        self.char_type = char_type
        self.speed = speed
        self.direction = 1
        self.flip = False
        # Carregar a imagem do player
        img = pygame.image.load(f'images/{self.char_type}/0.png')
        self.image = pygame.transform.scale(img, (int(img.get_width() * scale), int(img.get_height() * scale)))
        # Cria um retângulo a partir da imagem do player 
        self.rect = self.image.get_rect()
        self.rect.center = (x, y)

    def move(self, moving_left, moving_right):
        # Resetar variáveis de movimento
        dx = 0 
        dy = 0
        # Atribuir variáveis de movimento se mover para a direita ou esquerda
        if moving_left:
            dx = -self.speed
            self.flip = True 
            self.direction = -1
        if moving_right:
            dx = self.speed
            self.flip = False 
            self.direction = 1
        # Atualizar a posição do retângulo 
        self.rect.x += dx 
        self.rect.y += dy 

    def draw(self):
        screen.blit(pygame.transform.flip(self.image, self.flip, False), self.rect)

player = Soldier('player', 200, 200, 3, 5)
enemy = Soldier('enemy', 400, 200, 3, 5)

# Game Loop
run = True 
while run:
    clock.tick(FPS)
    draw_bg()
    # Desenhar o player e o inimigo   
    player.draw()
    enemy.draw()
    # Movimentar o player 
    player.move(moving_left, moving_right)
    for event in pygame.event.get():
        # Sair do game
        if event.type == pygame.QUIT:
            run = False
        # Teclas pressionadas
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_a:
                moving_left = True 
            if event.key == pygame.K_d:
                moving_right = True
            if event.key == pygame.K_ESCAPE:
                run = False
        # Teclas do teclado liberadas
        if event.type == pygame.KEYUP:
            if event.key == pygame.K_a:
                moving_left = False 
            if event.key == pygame.K_d:
                moving_right = False        
    # Atualizar a tela
    pygame.display.update()

pygame.quit()