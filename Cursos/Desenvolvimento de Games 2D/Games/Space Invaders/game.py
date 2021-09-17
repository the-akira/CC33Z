from random import randint, choice
import pygame 

# Inicia funcionalidades da biblioteca PyGame
pygame.init()

# Definir FPS
clock = pygame.time.Clock()
fps = 60

# Configurações da tela do game
WIDTH, HEIGHT = 600, 800
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption('Space Invaders')

# Definir fontes
font30 = pygame.font.SysFont('dyuthi', 30)
font40 = pygame.font.SysFont('dyuthi', 40)

# Carregar efeitos sonoros
explosion_fx = pygame.mixer.Sound('sound/explosion.wav')
explosion_fx.set_volume(0.12)

explosion2_fx = pygame.mixer.Sound('sound/explosion2.wav')
explosion2_fx.set_volume(0.12)

laser_fx = pygame.mixer.Sound('sound/laser.wav')
laser_fx.set_volume(0.12)

# Definir variáveis do game
rows = 5 
cols = 5
alien_cooldown = 1000 # Milisegundos
last_alien_shot = pygame.time.get_ticks()
countdown = 3
last_count = pygame.time.get_ticks()
game_over = 0 # 0: game executando, 1: player venceu, -1: player perdeu

# Definir cores
RED = (255, 0, 0)
GREEN = (0, 255, 0)
YELLOW = (255, 255, 0)

# Carregar imagens
bg = pygame.image.load('img/background.png').convert_alpha()

# Função que desenha o fundo (background)
def draw_bg():
    screen.blit(bg, (0, 0))

# Definir a função para criar texto
def draw_text(text, font, text_color, x, y):
    img = font.render(text, True, text_color)
    screen.blit(img, (x, y))

# Criar a classe da nave espacial
class Spaceship(pygame.sprite.Sprite):
    def __init__(self, x, y, health):
        pygame.sprite.Sprite.__init__(self)
        self.image = pygame.image.load('img/spaceship.png').convert_alpha()
        self.rect = self.image.get_rect()
        self.rect.center = [x, y]
        self.health_start = health
        self.health_remaining = health
        self.last_shot = pygame.time.get_ticks()

    def update(self):
        # Setar velocidade de movimento
        speed = 8
        # Setar uma variável cooldown
        cooldown = 500 # milisegundos
        game_over = 0
        # Obter teclas pressionadas
        key = pygame.key.get_pressed()
        if key[pygame.K_LEFT] and self.rect.left > 0:
            self.rect.x -= speed
        if key[pygame.K_RIGHT] and self.rect.right < WIDTH:
            self.rect.x += speed
        # Registrar o tempo atual 
        time_now = pygame.time.get_ticks()
        # Atirar
        if key[pygame.K_SPACE] and time_now - self.last_shot > cooldown:
            laser_fx.play()
            bullet = Bullets(self.rect.centerx, self.rect.top)
            bullet_group.add(bullet)
            self.last_shot = time_now
        # Atualizar mask
        self.mask = pygame.mask.from_surface(self.image)
        # Desenhar barra de vida
        pygame.draw.rect(screen, RED, (self.rect.x, (self.rect.bottom + 10), self.rect.width, 15))
        if self.health_remaining > 0:
            pygame.draw.rect(screen, GREEN, (self.rect.x, (self.rect.bottom + 10), int(self.rect.width * (self.health_remaining / self.health_start)), 15))
        elif self.health_remaining <= 0:
            explosion = Explosion(self.rect.centerx, self.rect.centery, 3)
            explosion_group.add(explosion)
            self.kill()
            game_over = -1
        return game_over

# Criar a classe do projétil
class Bullets(pygame.sprite.Sprite):
    def __init__(self, x, y):
        pygame.sprite.Sprite.__init__(self)
        self.image = pygame.image.load('img/bullet.png').convert_alpha()
        self.rect = self.image.get_rect()
        self.rect.center = [x, y]

    def update(self):
        self.rect.y -= 5
        # Remover os projéteis quando eles somem da tela
        if self.rect.bottom < 0:
            self.kill()
        if pygame.sprite.spritecollide(self, alien_group, True):
            self.kill()
            explosion_fx.play()
            explosion = Explosion(self.rect.centerx, self.rect.centery, 2)
            explosion_group.add(explosion)

# Criar a classe dos aliens
class Aliens(pygame.sprite.Sprite):
    def __init__(self, x, y):
        pygame.sprite.Sprite.__init__(self)
        self.image = pygame.image.load(f'img/alien{randint(1,5)}.png').convert_alpha()
        self.rect = self.image.get_rect()
        self.rect.center = [x, y]
        self.move_counter = 0
        self.move_direction = 1 

    def update(self):
        self.rect.x += self.move_direction
        self.move_counter += 1 
        if abs(self.move_counter) > 75:
            self.move_direction *= -1
            self.move_counter *= self.move_direction

# Criar a classe do projétil dos aliens
class AlienBullets(pygame.sprite.Sprite):
    def __init__(self, x, y):
        pygame.sprite.Sprite.__init__(self)
        self.image = pygame.image.load('img/alien_bullet.png').convert_alpha()
        self.rect = self.image.get_rect()
        self.rect.center = [x, y]

    def update(self):
        self.rect.y += 2
        # Remover os projéteis quando eles somem da tela
        if self.rect.top > HEIGHT:
            self.kill()
        if pygame.sprite.spritecollide(self, spaceship_group, False, pygame.sprite.collide_mask):
            self.kill()
            explosion2_fx.play()
            # Reduzir a vida da nave espacial
            spaceship.health_remaining -= 1
            explosion = Explosion(self.rect.centerx, self.rect.centery, 1)
            explosion_group.add(explosion)

# Criar a classe da explosão
class Explosion(pygame.sprite.Sprite):
    def __init__(self, x, y, size):
        pygame.sprite.Sprite.__init__(self)
        self.images = []
        for num in range(1,6):
            img = pygame.image.load(f'img/exp{num}.png').convert_alpha()
            if size == 1:
                img = pygame.transform.scale(img, (20, 20))
            if size == 2:
                img = pygame.transform.scale(img, (40, 40))
            if size == 3:
                img = pygame.transform.scale(img, (160, 160))
            # Adicionar a imagem para a lista
            self.images.append(img)
        self.index = 0 
        self.image = self.images[self.index]
        self.rect = self.image.get_rect()
        self.rect.center = [x, y]
        self.counter = 0

    def update(self):
        explosion_speed = 3 
        # Atualizar a animação da explosão
        self.counter += 1 
        if self.counter >= explosion_speed and self.index < len(self.images) - 1:
            self.counter = 0 
            self.index += 1 
            self.image = self.images[self.index]

        # Se a animação está completa, deletar a explosão
        if self.index >= len(self.images) - 1 and self.counter >= explosion_speed:
            self.kill()

# Criar grupos para sprites
spaceship_group = pygame.sprite.Group()
bullet_group = pygame.sprite.Group()
alien_group = pygame.sprite.Group()
alien_bullet_group = pygame.sprite.Group()
explosion_group = pygame.sprite.Group()

# Função que gera aliens
def create_aliens():
    for row in range(rows):
        for item in range(cols):
            alien = Aliens(100 + item * 100, 100 + row * 70)
            alien_group.add(alien)
# Gerar aliens!
create_aliens()

# Criar player
spaceship = Spaceship(int(WIDTH / 2), HEIGHT - 100, 3)
spaceship_group.add(spaceship)

running = True
while running:
    clock.tick(fps)

    # Desenhar o background
    draw_bg()

    if countdown == 0:
        # Criar projéteis dos aliens aleatoriamente
        # Registrar o tempo atual 
        time_now = pygame.time.get_ticks()
        # Buscar por um tiro 
        if time_now - last_alien_shot > alien_cooldown and len(alien_bullet_group) < 5 and len(alien_group) > 0:
            attacking_alien = choice(alien_group.sprites())
            alien_bullet = AlienBullets(attacking_alien.rect.centerx, attacking_alien.rect.bottom)
            alien_bullet_group.add(alien_bullet)
            last_alien_shot = time_now
        # Verificar se todos os aliens foram destruídos
        if len(alien_group) == 0:
            game_over = 1

        if game_over == 0:
            # Atualizar a nave espacial
            game_over = spaceship.update()
            # Atualizar grupos de sprites
            bullet_group.update()
            alien_group.update()
            alien_bullet_group.update()
        else:
            if game_over == -1:
                draw_text('GAME OVER!', font40, YELLOW, int(WIDTH / 2 - 110), int(HEIGHT / 2 + 50))
            if game_over == 1:
                draw_text('YOU WIN!', font40, YELLOW, int(WIDTH / 2 - 110), int(HEIGHT / 2 + 50))

    # Iniciar contagem regressiva para começar o game
    if countdown > 0:
        draw_text('GET READY!', font40, YELLOW, int(WIDTH / 2 - 110), int(HEIGHT / 2 + 50))
        draw_text(str(countdown), font40, YELLOW, int(WIDTH / 2 - 10), int(HEIGHT / 2 + 100))
        count_timer = pygame.time.get_ticks()
        if count_timer - last_count > 1000:
            countdown -= 1
            last_count = count_timer

    # Atualizar grupo da explosão
    explosion_group.update()

    # Desenhar grupos de sprites
    spaceship_group.draw(screen)
    bullet_group.draw(screen)
    alien_group.draw(screen)
    alien_bullet_group.draw(screen)
    explosion_group.draw(screen)

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    pygame.display.update()

pygame.quit()