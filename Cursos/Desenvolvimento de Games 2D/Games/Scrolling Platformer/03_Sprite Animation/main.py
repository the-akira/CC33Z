import pygame
import os
pygame.init()

# Definições da tela
WIDTH = 800
HEIGHT = int(WIDTH * 0.8)
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption('Scrolling Platformer')

# Definir frame rate 
clock = pygame.time.Clock()
FPS = 60

# Definir váriaveis do game
GRAVITY = 0.75

# Variáveis de ação do player
moving_left = False 
moving_right = False

# Definir cores
BG = (144, 201, 120)
BROWN = (79, 53, 0)

def draw_bg():
    screen.fill(BG)
    pygame.draw.line(screen, BROWN, (0, 300), (WIDTH, 300), 5)

# Classe que representa um soldado
class Soldier(pygame.sprite.Sprite):
    def __init__(self, char_type, x, y, scale, speed):
        pygame.sprite.Sprite.__init__(self)
        self.alive = True
        self.char_type = char_type
        self.speed = speed
        self.direction = 1
        self.vel_y = 0
        self.jump = False
        self.in_air = True
        self.flip = False
        self.animation_list = []
        self.frame_index = 0
        self.action = 0
        self.update_time = pygame.time.get_ticks()
        # Carregar todas as imagens
        animation_types = ['Idle', 'Run', 'Jump']
        for animation in animation_types:
            # Resetar a lista de temporária de imagens
            temp_list = []
            # Contar o número de arquivos no diretório
            num_of_frames = len(os.listdir(f'images/{self.char_type}/{animation}'))
            for i in range(num_of_frames):
                img = pygame.image.load(f'images/{self.char_type}/{animation}/{i}.png')
                img = pygame.transform.scale(img, (int(img.get_width() * scale), int(img.get_height() * scale)))
                temp_list.append(img)
            self.animation_list.append(temp_list)
        self.image = self.animation_list[self.action][self.frame_index]
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
        # Pular 
        if self.jump == True and self.in_air == False:
            self.vel_y = -11
            self.jump = False
            self.in_air = True
        # Aplicar gravidade
        self.vel_y += GRAVITY
        if self.vel_y > 10:
            self.vel_y
        dy += self.vel_y
        # Checar colisão com o chão
        if self.rect.bottom + dy > 300:
            dy = 300 - self.rect.bottom
            self.in_air = False
        # Atualizar a posição do retângulo 
        self.rect.x += dx 
        self.rect.y += dy 

    def update_animation(self):
        # Atualizar animação 
        ANIMATION_COOLDOWN = 100
        # Atualizar imagem dependendo do frame atual
        self.image = self.animation_list[self.action][self.frame_index]
        # Checar se passou tempo suficiente desde a última atualização 
        if pygame.time.get_ticks() - self.update_time > ANIMATION_COOLDOWN:
            self.update_time = pygame.time.get_ticks()
            self.frame_index += 1
        # Se a animação acabou, então resetar ela para o início
        if self.frame_index >= len(self.animation_list[self.action]):
            self.frame_index = 0

    def update_action(self, new_action):
        # Checar se a nova ação é diferente da anterior
        if new_action != self.action:
            self.action = new_action
            # Atualizar as configurações da animação
            self.frame_index = 0
            self.update_time = pygame.time.get_ticks()

    def draw(self):
        screen.blit(pygame.transform.flip(self.image, self.flip, False), self.rect)

player = Soldier('player', 200, 200, 3, 5)
enemy = Soldier('enemy', 400, 245, 3, 5)

# Game Loop
run = True 
while run:
    clock.tick(FPS)
    draw_bg()
    # Desenhar o player e o inimigo  
    player.update_animation() 
    player.draw()
    enemy.draw()
    # Atualizar ações do player
    if player.alive: 
        if player.in_air:
            player.update_action(2) # 2 significa 'pulando'
        elif moving_left or moving_right:
            player.update_action(1) # 1 significa 'correndo'
        else:
            player.update_action(0) # 0 significa 'parado'
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
            if event.key == pygame.K_w and player.alive:
                player.jump = True
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