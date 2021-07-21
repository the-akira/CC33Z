from random import randint
import pygame 

pygame.init()

clock = pygame.time.Clock()
fps = 60

WIDTH = 864
HEIGHT = 936
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption('Flappy Bird')

# Definir fonte
font = pygame.font.SysFont('Bauhaus 93', 60)

# Definir cor
WHITE = (255, 255, 255)

# Variáveis do game
ground_scroll = 0 
scroll_speed = 4
flying = False
game_over = False
pipe_gap = 150
pipe_frequency = 1500 # milisegundos
last_pipe = pygame.time.get_ticks() - pipe_frequency
score = 0
pass_pipe = False 

# Carregar imagens 
background = pygame.image.load('images/bg.png')
ground = pygame.image.load('images/ground.png')
button_img = pygame.image.load('images/restart.png')

def draw_text(text, font, text_color, x, y):
    img = font.render(text, True, text_color)
    screen.blit(img, (x, y))

def reset_game():
    pipe_group.empty()
    flappy.rect.x = 100
    flappy.rect.y = int(HEIGHT/2)
    score = 0
    return score

class Bird(pygame.sprite.Sprite):
    def __init__(self, x, y):
        pygame.sprite.Sprite.__init__(self)
        self.images = []
        self.index = 0
        self.counter = 0
        for num in range(1,4):
            img = pygame.image.load(f'images/bird{num}.png')
            self.images.append(img)
        self.image = self.images[self.index]
        self.rect = self.image.get_rect()
        self.rect.center = [x, y]
        self.vel = 0
        self.clicked = False 

    def update(self):
        # Gravidade
        if flying == True:
            self.vel += 0.5 
            if self.vel > 8:
                self.vel = 8
            if self.rect.bottom < 768:
                self.rect.y += int(self.vel) 
        if game_over == False:
            # Pulo
            if pygame.mouse.get_pressed()[0] == 1 and self.clicked == False:
                self.clicked = True
                self.vel = -10
            if pygame.mouse.get_pressed()[0] == 0:
                self.clicked = False
            # Lidar com as animações
            self.counter += 1
            flap_cooldown = 5  
            if self.counter > flap_cooldown:
                self.counter = 0
                self.index += 1
                if self.index >= len(self.images):
                    self.index = 0
            self.image = self.images[self.index]
            # Rotacionar o pássaro 
            self.image = pygame.transform.rotate(self.images[self.index], self.vel * -2)
        else:
            self.image = pygame.transform.rotate(self.images[self.index], -90) 

class Pipe(pygame.sprite.Sprite):
    def __init__(self, x, y, position):
        pygame.sprite.Sprite.__init__(self)
        self.image = pygame.image.load('images/pipe.png')
        self.rect = self.image.get_rect()
        # Posição 1 é do topo e -1 é de baixo
        if position == 1:
            self.image = pygame.transform.flip(self.image, False, True)
            self.rect.bottomleft = [x, y - int(pipe_gap/2)]
        if position == -1:
            self.rect.topleft = [x, y + int(pipe_gap/2)]

    def update(self):
        self.rect.x -= scroll_speed
        # Checar se o cano saiu da tela e apagar ele 
        if self.rect.right < 0:
            self.kill()

class Button():
    def __init__(self, x, y, image):
        self.image = image 
        self.rect = self.image.get_rect()
        self.rect.topleft = (x, y)   

    def draw(self):
        action = False
        # Obter a posição do mouse 
        pos = pygame.mouse.get_pos()
        # Checar se o mouse está por cima do botão 
        if self.rect.collidepoint(pos):
            if pygame.mouse.get_pressed()[0] == 1:
                action = True 
        # Desenhar o botão
        screen.blit(self.image, (self.rect.x, self.rect.y)) 
        return action     

bird_group = pygame.sprite.Group()
pipe_group = pygame.sprite.Group()
flappy = Bird(100,int(HEIGHT/2))
bird_group.add(flappy)

# Criar a instância do botão reiniciar
button = Button(WIDTH//2 - 50, HEIGHT//2 - 100, button_img)

run = True 
while run:
    clock.tick(fps)
    # Desenha o fundo
    screen.blit(background, (0,0))
    # Desenhar o pássaro
    bird_group.draw(screen)
    bird_group.update()
    # Desenhar os canos
    pipe_group.draw(screen)
    # Desenhar e fazer rolagem do chão
    screen.blit(ground, (ground_scroll,768))
    # Checar a pontuação
    if len(pipe_group) > 0:
        if bird_group.sprites()[0].rect.left > pipe_group.sprites()[0].rect.left\
            and bird_group.sprites()[0].rect.right < pipe_group.sprites()[0].rect.right\
            and pass_pipe == False:
            pass_pipe = True
        if pass_pipe == True:
            if bird_group.sprites()[0].rect.left > pipe_group.sprites()[0].rect.right:
                score += 1
                pass_pipe = False
    draw_text(str(score), font, WHITE, int(WIDTH/2), 20)
    # Verificar por colisão
    if pygame.sprite.groupcollide(bird_group, pipe_group, False, False) or flappy.rect.top < 0:
        game_over = True
    # Checar se o pássaro alcançou o chão
    if flappy.rect.bottom >= 768:
        game_over = True 
        flying = False
    if game_over == False and flying == True:
        # Gerar novos canos
        time_now = pygame.time.get_ticks()
        if time_now - last_pipe > pipe_frequency:
            pipe_height = randint(-100,100)
            btm_pipe = Pipe(WIDTH,int(HEIGHT/2) + pipe_height, -1)
            top_pipe = Pipe(WIDTH,int(HEIGHT/2) + pipe_height, 1)
            pipe_group.add(btm_pipe)
            pipe_group.add(top_pipe)
            last_pipe = time_now
        # Mover o chão
        ground_scroll -= scroll_speed
        if abs(ground_scroll) > 35:
            ground_scroll = 0
        pipe_group.update()
    # Checar se o game acabou e resetar
    if game_over == True:
        if button.draw() == True:
            game_over = False
            score = reset_game()
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            run = False  
        if event.type == pygame.MOUSEBUTTONDOWN and flying == False and game_over == False:
            flying = True

    pygame.display.update()

pygame.quit()