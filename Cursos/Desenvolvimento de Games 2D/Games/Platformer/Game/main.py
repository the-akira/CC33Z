from constants import *
from os import path
import pygame 
import pickle
pygame.init()

clock = pygame.time.Clock()

screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption('Platformer')

# Definir fonte
font = pygame.font.SysFont('Bauhaus 93', 70)
font_score = pygame.font.SysFont('Bauhaus 93', 30)

# Carregar imagens
sun = pygame.image.load('img/sun.png').convert_alpha()
background = pygame.image.load('img/sky2.png').convert_alpha()
restart_img = pygame.image.load('img/restart_btn.png').convert_alpha()
start_img = pygame.image.load('img/start_btn.png').convert_alpha()
exit_img = pygame.image.load('img/exit_btn.png').convert_alpha()

# Carregar sons
music = pygame.mixer.Sound('sounds/music.wav')
music.set_volume(0.25)
music.play(loops=-1)
coin_fx = pygame.mixer.Sound('sounds/coin.wav')
coin_fx.set_volume(0.4)
jump_fx = pygame.mixer.Sound('sounds/jump.wav')
jump_fx.set_volume(0.4)
game_over_fx = pygame.mixer.Sound('sounds/game_over.wav')
game_over_fx.set_volume(0.4)

def draw_text(text, font, text_color, x, y):
    img = font.render(text, True, text_color)
    screen.blit(img, (x, y))

# Função para resetar o level
def reset_level(level):
    player.reset(100, HEIGHT - 130)
    blob_group.empty()
    platform_group.empty()
    lava_group.empty()
    exit_group.empty()
    # Carregar o mapa do level e criar o mundo
    if path.exists(f'levels/level{level}_data'):
        pickle_in = open(f'levels/level{level}_data','rb')
        world_map = pickle.load(pickle_in)
    world = World(world_map)
    return world

class Button():
    def __init__(self, x, y, image):
        self.image = image
        self.rect = self.image.get_rect()
        self.rect.x = x 
        self.rect.y = y 
        self.clicked = False

    def draw(self):
        action = False

        # Obtém a posição do mouse
        pos = pygame.mouse.get_pos()

        # Checa mouseover e condições clicked
        if self.rect.collidepoint(pos):
            # Botão esquerdo do mouse foi clicado?
            if pygame.mouse.get_pressed()[0] == 1 and self.clicked == False:
                action = True
                self.clicked = True

        # Botão foi released (não está mais pressionado)
        if pygame.mouse.get_pressed()[0] == 0:
            self.clicked = False

        # Desenha o botão
        screen.blit(self.image, self.rect)

        return action

class Player():
    def __init__(self, x, y):
        self.reset(x, y)

    def update(self, game_over):
        dx = 0 
        dy = 0
        walk_cooldown = 5
        col_thresh = 20

        if game_over == 0:
            # Obtém as teclas pressionadas
            key = pygame.key.get_pressed()
            if key[pygame.K_SPACE] and self.jumped == False and self.in_air == False:
                jump_fx.play()
                self.vel_y = -15
                self.jumped = True 
            if key[pygame.K_SPACE] == False:
                self.jumped = False
            if key[pygame.K_LEFT]:
                dx -= 6
                self.counter += 1
                self.direction = -1
            if key[pygame.K_RIGHT]:
                dx += 6
                self.counter += 1
                self.direction = 1
            if key[pygame.K_LEFT] == False and key[pygame.K_RIGHT] == False:
                self.counter = 0
                self.index = 0
                if self.direction == 1:
                    self.image = self.images_right[self.index]
                if self.direction == -1:
                    self.image = self.images_left[self.index]

            # Executar as animações
            if self.counter > walk_cooldown:
                self.counter = 0
                self.index += 1 
                if self.index >= len(self.images_right):
                    self.index = 0
                if self.direction == 1:
                    self.image = self.images_right[self.index]
                if self.direction == -1:
                    self.image = self.images_left[self.index]

            # Adiciona gravidade
            self.vel_y += 1 
            if self.vel_y > 10:
                self.vel_y = 10
            dy += self.vel_y

            # Checar colisões
            self.in_air = True
            for tile in world.tile_list:
                # Checar por colisão na direção x
                if tile[1].colliderect(self.rect.x + dx, self.rect.y, self.width, self.height):
                    dx = 0
                # Checar por colisão na direção y 
                if tile[1].colliderect(self.rect.x, self.rect.y + dy, self.width, self.height):
                    # Checar se está abaixo do solo (pulando)
                    if self.vel_y < 0:
                        dy = tile[1].bottom - self.rect.top  
                        self.vel_y = 0
                    # Checar se está acima do solo (caindo)
                    elif self.vel_y >= 0:
                        dy = tile[1].top - self.rect.bottom
                        self.vel_y = 0
                        self.in_air = False

            # Checar por colisões com inimigos
            if pygame.sprite.spritecollide(self, blob_group, False):
                game_over = -1 
                game_over_fx.play()

            # Checar por colisões com lava
            if pygame.sprite.spritecollide(self, lava_group, False):
                game_over = -1 
                game_over_fx.play()

            # Checar por colisões com a porta de saída
            if pygame.sprite.spritecollide(self, exit_group, False):
                game_over = 1

            # Checar por colisões com as plataformas
            for platform in platform_group:
                # Colisão na direção x 
                if platform.rect.colliderect(self.rect.x + dx, self.rect.y, self.width, self.height):
                    dx = 0
                # Colisão na direção y
                if platform.rect.colliderect(self.rect.x, self.rect.y + dy, self.width, self.height):
                    # Checar se está abaixo da plataforma
                    if abs((self.rect.top + dy) - platform.rect.bottom) < col_thresh:
                        self.vel_y = 0
                        dy = platform.rect.bottom - self.rect.top
                    # Checar se está acima da plataforma
                    elif abs((self.rect.bottom + dy) - platform.rect.top) < col_thresh:
                        self.rect.bottom = platform.rect.top - 1
                        self.in_air = False
                        dy = 0
                    # Mover-se lateralmente com a plataforma
                    if platform.move_x != 0:
                        self.rect.x += platform.move_direction

            # Atualiza as coordenadas do player
            self.rect.x += dx 
            self.rect.y += dy

        # Player morreu?
        elif game_over == -1:
            self.image = self.dead_image
            draw_text('Você MORREU!', font, BROWN, (WIDTH // 2) - 150, HEIGHT // 2)
            if self.rect.y > 200:
                self.rect.y -= 5

        # Desenha o player na tela
        screen.blit(self.image, self.rect)

        return game_over

    def reset(self, x, y):
        self.images_right = []
        self.images_left = []
        self.index = 0
        self.counter = 0
        for num in range(1,5):
            img_right = pygame.image.load(f'img/knight{num}.png').convert_alpha()
            img_right = pygame.transform.scale(img_right, (55, 80))
            img_left = pygame.transform.flip(img_right, True, False)
            self.images_right.append(img_right)
            self.images_left.append(img_left)
        self.dead_image = pygame.image.load('img/phantom.png').convert_alpha()
        self.image = self.images_right[self.index]
        self.rect = self.image.get_rect()
        self.rect.x = x 
        self.rect.y = y
        self.width = self.image.get_width()
        self.height = self.image.get_height()
        self.vel_y = 0 
        self.jumped = False
        self.direction = 0
        self.in_air = True

class World():
    def __init__(self, data):
        self.tile_list = []

        dirt = pygame.image.load('img/dirt2.png').convert_alpha()
        grass = pygame.image.load('img/grass2.png').convert_alpha()

        row_count = 0
        for row in data:
            col_count = 0
            for tile in row:
                if tile == 1:
                    img = pygame.transform.scale(dirt, (tile_size, tile_size))
                    img_rect = img.get_rect()
                    img_rect.x = col_count * tile_size 
                    img_rect.y = row_count * tile_size
                    tile = (img, img_rect)
                    self.tile_list.append(tile)
                if tile == 2:
                    img = pygame.transform.scale(grass, (tile_size, tile_size))
                    img_rect = img.get_rect()
                    img_rect.x = col_count * tile_size 
                    img_rect.y = row_count * tile_size
                    tile = (img, img_rect)
                    self.tile_list.append(tile)
                if tile == 3:
                    blob = Enemy(col_count * tile_size, row_count * tile_size + 15)
                    blob_group.add(blob)
                if tile == 4:
                    platform = Platform(col_count * tile_size, row_count * tile_size, 1, 0)
                    platform_group.add(platform)
                if tile == 5:
                    platform = Platform(col_count * tile_size, row_count * tile_size, 0, 1)
                    platform_group.add(platform)                    
                if tile == 6:
                    lava = Lava(col_count * tile_size, row_count * tile_size + (tile_size // 2))
                    lava_group.add(lava)
                if tile == 7:
                    coin = Coin(col_count * tile_size + (tile_size // 2), row_count * tile_size + (tile_size // 2))
                    coin_group.add(coin)                    
                if tile == 8:
                    exit = Exit(col_count * tile_size, row_count * tile_size - (tile_size // 2))
                    exit_group.add(exit)
                col_count += 1
            row_count += 1 

    def draw(self):
        for tile in self.tile_list:
            screen.blit(tile[0], tile[1])

class Enemy(pygame.sprite.Sprite):
    def __init__(self, x, y):
        pygame.sprite.Sprite.__init__(self)
        self.image = pygame.image.load('img/blob.png').convert_alpha()
        self.rect = self.image.get_rect()
        self.rect.x = x 
        self.rect.y = y 
        self.move_direction = 1 
        self.move_counter = 0

    def update(self):
        self.rect.x += self.move_direction
        self.move_counter += 1
        if abs(self.move_counter) > 50:
            self.move_direction *= -1
            self.move_counter *= -1

class Platform(pygame.sprite.Sprite):
    def __init__(self, x, y, move_x, move_y):
        pygame.sprite.Sprite.__init__(self)
        img = pygame.image.load('img/platform.png').convert_alpha()
        self.image = pygame.transform.scale(img, (tile_size, tile_size // 2))
        self.rect = self.image.get_rect()
        self.rect.x = x 
        self.rect.y = y
        self.move_counter = 0 
        self.move_direction = 1
        self.move_x = move_x 
        self.move_y = move_y

    def update(self):
        self.rect.x += self.move_direction * self.move_x 
        self.rect.y += self.move_direction * self.move_y
        self.move_counter += 1
        if abs(self.move_counter) > 50:
            self.move_direction *= -1
            self.move_counter *= -1

class Lava(pygame.sprite.Sprite):
    def __init__(self, x, y):
        pygame.sprite.Sprite.__init__(self)
        img = pygame.image.load('img/lava.png').convert_alpha()
        self.image = pygame.transform.scale(img, (tile_size, tile_size // 2))
        self.rect = self.image.get_rect()
        self.rect.x = x 
        self.rect.y = y 

class Coin(pygame.sprite.Sprite):
    def __init__(self, x, y):
        pygame.sprite.Sprite.__init__(self)
        img = pygame.image.load('img/coin.png').convert_alpha()
        self.image = pygame.transform.scale(img, (tile_size // 2, tile_size // 2))
        self.rect = self.image.get_rect()
        self.rect.center = (x, y) 

class Exit(pygame.sprite.Sprite):
    def __init__(self, x, y):
        pygame.sprite.Sprite.__init__(self)
        img = pygame.image.load('img/exit.png').convert_alpha()
        self.image = pygame.transform.scale(img, (tile_size, int(tile_size * 1.5)))
        self.rect = self.image.get_rect()
        self.rect.x = x 
        self.rect.y = y 

player = Player(100, HEIGHT - 130)

blob_group = pygame.sprite.Group()
platform_group = pygame.sprite.Group()
lava_group = pygame.sprite.Group()
coin_group = pygame.sprite.Group()
exit_group = pygame.sprite.Group()

# Criar uma moeda para apresentar a pontuação
score_coin = Coin(tile_size // 2, tile_size // 2)
coin_group.add(score_coin)

# Carregar o mapa do level e criar o mundo
if path.exists(f'levels/level{level}_data'):
    pickle_in = open(f'levels/level{level}_data','rb')
    world_map = pickle.load(pickle_in)
world = World(world_map)

restart_button = Button(WIDTH // 2 - 50, HEIGHT // 2 - 50, restart_img)
start_button = Button(WIDTH // 2 - 350, HEIGHT // 2, start_img)
exit_button = Button(WIDTH // 2 + 150, HEIGHT // 2, exit_img)

playing = True
while playing:
    clock.tick(fps)

    screen.blit(background, (0,0))
    screen.blit(sun, (150,100))

    if main_menu == True:
        if exit_button.draw():
            playing = False
        if start_button.draw():
            main_menu = False
    else:
        world.draw()

        if game_over == 0:
            blob_group.update()
            platform_group.update()
            # Atualizar a pontuação
            # Checar se uma moeda foi coletada
            if pygame.sprite.spritecollide(player, coin_group, True):
                score += 1
                coin_fx.play()
            draw_text('X ' + str(score), font_score, WHITE, tile_size - 8, 17)

        blob_group.draw(screen)
        platform_group.draw(screen)
        lava_group.draw(screen)
        coin_group.draw(screen)
        exit_group.draw(screen)

        game_over = player.update(game_over)

        # Se o player morreu
        if game_over == -1:
            if restart_button.draw():
                world_map = []
                world = reset_level(level)
                game_over = 0
                score = 0

        # Se o player completou o level
        if game_over == 1:
            # Resetar o game e ir para o próximo level
            level += 1
            if level <= max_levels:
                # Resetar o level
                world_map = []
                world = reset_level(level)
                game_over = 0
            else:
                draw_text('Você VENCEU!', font, BROWN, (WIDTH // 2) - 150, HEIGHT // 2)
                # Reiniciar o Game
                if restart_button.draw():
                    level = 0
                    world_map = []
                    world = reset_level(level)
                    game_over = 0
                    score = 0

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            playing = False 

    pygame.display.update()

pygame.quit()