import pygame
import random
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
TILE_SIZE = 40

# Variáveis de ação do player
moving_left = False 
moving_right = False
shoot = False
grenade = False
grenade_thrown = False

# Carregar imagens
bullet_img = pygame.image.load('images/icons/bullet.png').convert_alpha()
grenade_img = pygame.image.load('images/icons/grenade.png').convert_alpha()
health_box_img = pygame.image.load('images/icons/health_box.png').convert_alpha()
ammo_box_img = pygame.image.load('images/icons/ammo_box.png').convert_alpha()
grenade_box_img = pygame.image.load('images/icons/grenade_box.png').convert_alpha()
item_boxes = {
    'Health'  : health_box_img,
    'Ammo'    : ammo_box_img,
    'Grenade' : grenade_box_img
}

# Definir cores
BG = (144, 201, 120)
BROWN = (79, 53, 0)
WHITE = (255, 255, 255)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
BLACK = (0, 0, 0)

# Definir fonte
font = pygame.font.SysFont('Futura', 30)

def draw_text(text, font, text_color, x, y):
    img = font.render(text, True, text_color)
    screen.blit(img, (x, y))

def draw_bg():
    screen.fill(BG)
    pygame.draw.line(screen, BROWN, (0, 300), (WIDTH, 300), 5)

# Classe que representa um soldado
class Soldier(pygame.sprite.Sprite):
    def __init__(self, char_type, x, y, scale, speed, ammo, grenades):
        pygame.sprite.Sprite.__init__(self)
        self.alive = True
        self.char_type = char_type
        self.speed = speed
        self.ammo = ammo
        self.start_ammo = ammo
        self.shoot_cooldown = 0
        self.grenades = grenades
        self.health = 100
        self.max_health = self.health
        self.direction = 1
        self.vel_y = 0
        self.jump = False
        self.in_air = True
        self.flip = False
        self.animation_list = []
        self.frame_index = 0
        self.action = 0
        self.update_time = pygame.time.get_ticks()
        # Atributos específicos da AI
        self.move_counter = 0
        self.vision = pygame.Rect(0, 0, 150, 20)
        self.idling = False
        self.idling_counter = 0
        # Carregar todas as imagens
        animation_types = ['Idle', 'Run', 'Jump', 'Death']
        for animation in animation_types:
            # Resetar a lista de temporária de imagens
            temp_list = []
            # Contar o número de arquivos no diretório
            num_of_frames = len(os.listdir(f'images/{self.char_type}/{animation}'))
            for i in range(num_of_frames):
                img = pygame.image.load(f'images/{self.char_type}/{animation}/{i}.png').convert_alpha()
                img = pygame.transform.scale(img, (int(img.get_width() * scale), int(img.get_height() * scale)))
                temp_list.append(img)
            self.animation_list.append(temp_list)
        self.image = self.animation_list[self.action][self.frame_index]
        # Cria um retângulo a partir da imagem do player 
        self.rect = self.image.get_rect()
        self.rect.center = (x, y)

    def update(self):
        self.update_animation()
        self.check_alive()
        # Atualizar cooldown
        if self.shoot_cooldown > 0:
            self.shoot_cooldown -= 1

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

    def shoot(self):
        if self.shoot_cooldown == 0 and self.ammo > 0:
            self.shoot_cooldown = 20
            bullet = Bullet(self.rect.centerx + (0.75 * self.rect.size[0] * self.direction), self.rect.centery, self.direction)
            bullet_group.add(bullet)
            # Reduzir munição
            self.ammo -= 1

    def ai(self):
        if self.alive and player.alive:
            if self.idling == False and random.randint(1, 200) == 1:
                self.update_action(0) # 0 significa 'parado'
                self.idling = True 
                self.idling_counter = 50
            # Checar se a AI está próxima do player 
            if self.vision.colliderect(player.rect):
                # Parar de correr e enfrentar o player
                self.update_action(0) # 0 significa 'parado'
                self.shoot()
            else:
                if self.idling == False:
                    if self.direction == 1:
                        ai_moving_right = True 
                    else:
                        ai_moving_right = False
                    ai_moving_left = not ai_moving_right
                    self.move(ai_moving_left, ai_moving_right)
                    self.update_action(1) # 1 significa 'correr'
                    self.move_counter += 1
                    # Atualizar a visão da AI conforme o inimigo se move 
                    self.vision.center = (self.rect.centerx + 75 * self.direction, self.rect.centery)
                    if self.move_counter > TILE_SIZE:
                        self.direction *= -1
                        self.move_counter *= -1
                else:
                    self.idling_counter -= 1
                    if self.idling_counter <= 0:
                        self.idling = False

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
            if self.action == 3:
                self.frame_index = len(self.animation_list[self.action]) - 1
            else:
                self.frame_index = 0

    def update_action(self, new_action):
        # Checar se a nova ação é diferente da anterior
        if new_action != self.action:
            self.action = new_action
            # Atualizar as configurações da animação
            self.frame_index = 0
            self.update_time = pygame.time.get_ticks()

    def check_alive(self):
        if self.health <= 0:
            self.health = 0
            self.speed = 0 
            self.alive = False 
            self.update_action(3) # 3 = morto

    def draw(self):
        screen.blit(pygame.transform.flip(self.image, self.flip, False), self.rect)

class ItemBox(pygame.sprite.Sprite):
    def __init__(self, item_type, x, y):
        pygame.sprite.Sprite.__init__(self)
        self.item_type = item_type
        self.image = item_boxes[self.item_type]
        self.rect = self.image.get_rect()
        self.rect.midtop = (x + TILE_SIZE // 2, y + (TILE_SIZE - self.image.get_height()))

    def update(self):
        # Checar se o player coletou a caixa
        if pygame.sprite.collide_rect(self, player):
            # Checar o tipo de caixa que o player coletou
            if self.item_type == 'Health':
                player.health += 25
                if player.health > player.max_health:
                    player.health = player.max_health
            elif self.item_type == 'Ammo':
                player.ammo += 15
            elif self.item_type == 'Grenade':
                player.grenades += 3
            # Remover a caixa de item
            self.kill()

class HealthBar():
    def __init__(self, x, y, health, max_health):
        self.x = x 
        self.y = y 
        self.health = health 
        self.max_health = max_health

    def draw(self, health):
        # Atualizar a vida do player 
        self.health = health 
        # Calcular a proporação da vida do player
        ratio = self.health / self.max_health
        pygame.draw.rect(screen, BLACK, (self.x - 2, self.y - 2, 154, 24))
        pygame.draw.rect(screen, RED, (self.x, self.y, 150, 20))
        pygame.draw.rect(screen, GREEN, (self.x, self.y, 150 * ratio, 20))

class Bullet(pygame.sprite.Sprite):
    def __init__(self, x, y, direction):
        pygame.sprite.Sprite.__init__(self)
        self.speed = 10
        self.image = bullet_img 
        self.rect = self.image.get_rect()
        self.rect.center = (x, y)
        self.direction = direction

    def update(self):
        # Mover o projétil
        self.rect.x += (self.direction * self.speed)
        # Checar se o projétil saiu da tela 
        if self.rect.right < 0 or self.rect.left > WIDTH:
            self.kill()
        # Checar colisão com personagens 
        if pygame.sprite.spritecollide(player, bullet_group, False):
            if player.alive:
                player.health -= 5
                self.kill()
        for enemy in enemy_group:
            if pygame.sprite.spritecollide(enemy, bullet_group, False):
                if enemy.alive:
                    enemy.health -= 25
                    self.kill()

class Grenade(pygame.sprite.Sprite):
    def __init__(self, x, y, direction):
        pygame.sprite.Sprite.__init__(self)
        self.timer = 100
        self.vel_y = -11
        self.speed = 7
        self.image = grenade_img 
        self.rect = self.image.get_rect()
        self.rect.center = (x, y)
        self.direction = direction

    def update(self):
        self.vel_y += GRAVITY
        dx = self.direction * self.speed 
        dy = self.vel_y

        # Checar colisão com o chão
        if self.rect.bottom + dy > 300:
            dy = 300 -self.rect.bottom
            self.speed = 0

        # Checar por colisão com paredes
        if self.rect.left + dx < 0 or self.rect.right + dx > WIDTH:
            self.direction *= -1
            dx = self.direction * self.speed 

        # Atualizar a posição da granada
        self.rect.x += dx 
        self.rect.y += dy

        # Countdown timer
        self.timer -= 1
        if self.timer <= 0:
            self.kill()
            explosion = Explosion(self.rect.x, self.rect.y, 0.5)
            explosion_group.add(explosion)
            # Causar dano a qualquer um que esteja perto
            if abs(self.rect.centerx - player.rect.centerx) < TILE_SIZE * 2 and abs(self.rect.centery - player.rect.centery) < TILE_SIZE * 2:
                player.health -= 50
            for enemy in enemy_group:
                if abs(self.rect.centerx - enemy.rect.centerx) < TILE_SIZE * 2 and abs(self.rect.centery - enemy.rect.centery) < TILE_SIZE * 2:
                    enemy.health -= 50

class Explosion(pygame.sprite.Sprite):
    def __init__(self, x, y, scale):
        pygame.sprite.Sprite.__init__(self)
        self.images = []
        for num in range(1,6):
            img = pygame.image.load(f'images/explosion/exp{num}.png').convert_alpha()
            img = pygame.transform.scale(img, (int(img.get_width() * scale), int(img.get_height() * scale)))
            self.images.append(img)
        self.frame_index = 0
        self.image = self.images[self.frame_index] 
        self.rect = self.image.get_rect()
        self.rect.center = (x, y)
        self.counter = 0

    def update(self):
        EXPLOSION_SPEED = 4
        # Atualizar a animação da explosão
        self.counter += 1 
        if self.counter >= EXPLOSION_SPEED:
            self.counter = 0 
            self.frame_index += 1
            # Se a animação está completa, então deletar a explosão
            if self.frame_index >= len(self.images):
                self.kill()
            else:
                self.image = self.images[self.frame_index]

# Criar grupos de sprites
enemy_group = pygame.sprite.Group()
bullet_group = pygame.sprite.Group()
grenade_group = pygame.sprite.Group()
explosion_group = pygame.sprite.Group()
item_box_group = pygame.sprite.Group()

# Criar caixas de itens
item_box = ItemBox('Health', 100, 259)
item_box_group.add(item_box)
item_box = ItemBox('Ammo', 430, 259)
item_box_group.add(item_box)
item_box = ItemBox('Grenade', 470, 259)
item_box_group.add(item_box)

# Player e inimigos
player = Soldier('player', 200, 200, 1.65, 5, 20, 5)
health_bar = HealthBar(10, 10, player.health, player.health)
enemy = Soldier('enemy', 400, 200, 1.65, 2, 20, 0)
enemy2 = Soldier('enemy', 500, 200, 1.65, 2, 20, 0)
enemy_group.add(enemy)
enemy_group.add(enemy2)

# Game Loop
run = True 
while run:
    clock.tick(FPS)
    draw_bg()
    # Apresentar a vida do player 
    health_bar.draw(player.health)
    # Apresentar a munição do player
    draw_text('AMMO: ', font, WHITE, 10, 35)
    for x in range(player.ammo):
        screen.blit(bullet_img, (90 + (x * 10), 40))
    # Apresentar as granadas do player
    draw_text('GRENADES: ', font, WHITE, 10, 60)
    for x in range(player.grenades):
        screen.blit(grenade_img, (135 + (x * 15), 60))
    # Desenhar o player e o inimigo  
    player.update() 
    player.draw()
    for enemy in enemy_group:
        enemy.ai()
        enemy.update()
        enemy.draw()
    # Atualizar e desenhar grupos 
    bullet_group.update()
    grenade_group.update()
    explosion_group.update()
    item_box_group.update()
    bullet_group.draw(screen)
    grenade_group.draw(screen)
    explosion_group.draw(screen)
    item_box_group.draw(screen)
    # Atualizar ações do player
    if player.alive: 
        # Atirar projéteis
        if shoot:
            player.shoot()
        # Arremessar granadas
        elif grenade and grenade_thrown == False and player.grenades > 0:
            grenade = Grenade(player.rect.centerx + (0.5 * player.rect.size[0] * player.direction), player.rect.top, player.direction)
            grenade_group.add(grenade)
            # Reduzir granadas
            player.grenades -= 1
            grenade_thrown = True
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
            if event.key == pygame.K_SPACE:
                shoot = True 
            if event.key == pygame.K_q:
                grenade = True 
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
            if event.key == pygame.K_SPACE:
                shoot = False    
            if event.key == pygame.K_q:
                grenade = False 
                grenade_thrown = False 
    # Atualizar a tela
    pygame.display.update()

pygame.quit()