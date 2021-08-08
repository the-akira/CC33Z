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

# Carregar imagens
# Imagem de fundo
bg_img = pygame.image.load('imagens/Background/background.png').convert_alpha()
# Imagem do painel
panel_img = pygame.image.load('imagens/Background/panel.png').convert_alpha()

# Função para desenhar o fundo
def draw_bg():
    screen.blit(bg_img, (0,0))

# Função para desenhar o painel
def draw_panel():
    screen.blit(panel_img, (0,HEIGHT - bottom_panel))

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
            self.frame_index = 0

    def draw(self):
        screen.blit(self.image, self.rect)

# Criar uma instância de cavaleiro
knight = Fighter(200, 260, 'Knight', 30, 10, 3)
# Criar instâncias de bandidos
bandit1 = Fighter(550, 270, 'Bandit', 20, 6, 1)
bandit2 = Fighter(700, 270, 'Bandit', 20, 6, 1)
# Lista de bandidos
bandit_list = []
bandit_list.append(bandit1)
bandit_list.append(bandit2)

# Game Loop 
run = True  
while run:
    clock.tick(FPS)
    # Desenhar o background
    draw_bg()
    # Desenhar o painel
    draw_panel()
    # Desenhar os lutadores
    knight.update()
    knight.draw()
    for bandit in bandit_list:
        bandit.update()
        bandit.draw()
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            run = False  
    # Atualizar a janela
    pygame.display.update()

pygame.quit()