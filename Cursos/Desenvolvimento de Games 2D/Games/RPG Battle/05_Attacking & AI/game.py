import random
import pygame 
pygame.init()

# Definir o relógio para controlar o FPS
clock = pygame.time.Clock()
FPS = 60

# Janela do Game
bottom_panel = 150
WIDTH = 800 
HEIGHT = 400 + bottom_panel
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption('RPG Battle')

# Definir variáveis do game
current_fighter = 1 
total_fighters = 3 
action_cooldown = 0 
action_wait_time = 90
attack = False 
potion = False 
clicked = False

# Definir fontes
font = pygame.font.SysFont('dyuthi', 26)

# Definir cores
RED = (255, 0, 0)
GREEN = (0, 255, 0)
WHITE = (210, 210, 210)

# Carregar imagens
# Imagem de fundo
bg_img = pygame.image.load('imagens/Background/background.png').convert_alpha()
# Imagem do painel
panel_img = pygame.image.load('imagens/Background/panel.png').convert_alpha()
# Imagem da espada
sword_img = pygame.image.load('imagens/Icons/sword.png').convert_alpha()

# Função para desenhar texto
def draw_text(text, font, text_color, x, y):
    img = font.render(text, True, text_color)
    screen.blit(img, (x, y))

# Função para desenhar o fundo
def draw_bg():
    screen.blit(bg_img, (0,0))

# Função para desenhar o painel
def draw_panel():
    # Desenhar o retângulo do painel
    screen.blit(panel_img, (0,HEIGHT - bottom_panel))
    # Apresentar os status do cavaleiro
    draw_text(f'{knight.name} HP: {knight.hp}', font, WHITE, 100, HEIGHT - bottom_panel + 15)
    for count, i in enumerate(bandit_list):
        # Apresentar nome e vida
        draw_text(f'{i.name} HP: {i.hp}', font, WHITE, 550, (HEIGHT - bottom_panel + 15) + count * 60)

# Fighter class
class Fighter:
    def __init__(self, x, y, name, max_hp, strength, potions):
        self.name = name 
        self.max_hp = max_hp  
        self.hp = max_hp 
        self.strength = strength
        self.start_potions = potions
        self.potions = potions 
        self.alive = True 
        self.animation_list = []
        self.frame_index = 0
        self.action = 0 # 0 = Idle, 1 = Attack, 2 = Hurt, 3 = Dead
        self.update_time = pygame.time.get_ticks()
        # Carregar imagens Idle
        action_list = []
        for i in range(8):
            img = pygame.image.load(f'imagens/{self.name}/Idle/{i}.png')
            img = pygame.transform.scale(img, (img.get_width() * 3, img.get_height() * 3))
            action_list.append(img)
        self.animation_list.append(action_list)
        # Carregar imagens Attack
        action_list = []
        for i in range(8):
            img = pygame.image.load(f'imagens/{self.name}/Attack/{i}.png')
            img = pygame.transform.scale(img, (img.get_width() * 3, img.get_height() * 3))
            action_list.append(img)
        self.animation_list.append(action_list)
        self.image = self.animation_list[self.action][self.frame_index]
        self.rect = self.image.get_rect()
        self.rect.center = (x, y)

    def update(self):
        animation_cooldown = 100
        # Tratar animações
        # Atualizar imagem
        self.image = self.animation_list[self.action][self.frame_index]
        # Checar se tempo o suficiente passou desde a última atualização
        if pygame.time.get_ticks() - self.update_time > animation_cooldown:
            self.update_time = pygame.time.get_ticks()
            self.frame_index += 1
        # Se a animação se esgotou, resetar ela para o início
        if self.frame_index >= len(self.animation_list[self.action]):
            self.idle()

    def idle(self):
        # Setar variáveis para animação idle
        self.action = 0
        self.frame_index = 0
        self.update_time = pygame.time.get_ticks()

    def attack(self, target):
        # Causar dano ao inimigo
        rand = random.randint(-5,5)
        damage = self.strength + rand
        target.hp -= damage
        # Checar se o alvo morreu
        if target.hp < 1:
            target.hp = 0
            target.alive = False
        # Setar variáveis para animação attack
        self.action = 1 
        self.frame_index = 0
        self.update_time = pygame.time.get_ticks()

    def draw(self):
        screen.blit(self.image, self.rect)

class HealthBar:
    def __init__(self, x, y, hp, max_hp):
        self.x = x 
        self.y = y 
        self.hp = hp 
        self.max_hp = max_hp

    def draw(self, hp):
        # Atualizar com nova vida 
        self.hp = hp
        # Calcular a razão da vida 
        ratio = self.hp / self.max_hp
        pygame.draw.rect(screen, RED, (self.x, self.y, 150, 20))
        pygame.draw.rect(screen, GREEN, (self.x, self.y, 150 * ratio, 20))

# Criar uma instância de cavaleiro
knight = Fighter(200, 260, 'Knight', 30, 10, 3)
# Criar instâncias de bandidos
bandit1 = Fighter(550, 270, 'Bandit', 20, 6, 1)
bandit2 = Fighter(700, 270, 'Bandit', 20, 6, 1)
# Lista de bandidos
bandit_list = []
bandit_list.append(bandit1)
bandit_list.append(bandit2)

# Barras de vida
knight_health_bar = HealthBar(100, HEIGHT - bottom_panel + 50, knight.hp, knight.max_hp)
bandit1_health_bar = HealthBar(550, HEIGHT - bottom_panel + 45, bandit1.hp, bandit1.max_hp)
bandit2_health_bar = HealthBar(550, HEIGHT - bottom_panel + 105, bandit2.hp, bandit2.max_hp)

# Game Loop 
run = True  
while run:
    clock.tick(FPS)
    # Desenhar o background
    draw_bg()
    # Desenhar o painel
    draw_panel()
    knight_health_bar.draw(knight.hp)
    bandit1_health_bar.draw(bandit1.hp)
    bandit2_health_bar.draw(bandit2.hp)
    # Desenhar os lutadores
    knight.update()
    knight.draw()
    for bandit in bandit_list:
        bandit.update()
        bandit.draw()
    # Control ações do jogador
    # Resetar as variáveis de ação
    attack = False
    potion = False
    target = None  
    # Ter certeza que o mouse está visível
    pygame.mouse.set_visible(True)
    pos = pygame.mouse.get_pos()
    for count, bandit in enumerate(bandit_list):
        if bandit.rect.collidepoint(pos):
            # Esconder o mouse
            pygame.mouse.set_visible(False)
            # Mostrar a espada no lugar do cursor do mouse 
            screen.blit(sword_img, pos)
            if clicked == True:
                attack = True
                target = bandit_list[count]
    # Ação do jogador 
    if knight.alive == True:
        if current_fighter == 1:
            action_cooldown += 1
            if action_cooldown >= action_wait_time:
                # Buscar pela ação do player
                # Atacar
                if attack == True and target != None:
                    knight.attack(target)
                    current_fighter += 1
                    action_cooldown = 0
    # Ação do inimigo
    for count, bandit in enumerate(bandit_list):
        if current_fighter == 2 + count:
            if bandit.alive == True:
                action_cooldown += 1
                if action_cooldown >= action_wait_time:
                    # Atacar
                    bandit.attack(knight)
                    current_fighter += 1
                    action_cooldown = 0
            else:
                current_fighter += 1
    # Se todos os lutadores tiveram um turno, então resetar
    if current_fighter > total_fighters:
        current_fighter = 1
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            run = False  
        if event.type == pygame.MOUSEBUTTONDOWN:
            clicked = True
        else:
            clicked = False
    # Atualizar a janela
    pygame.display.update()

pygame.quit()