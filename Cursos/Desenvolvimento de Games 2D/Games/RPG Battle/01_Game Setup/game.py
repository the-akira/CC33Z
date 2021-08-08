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

# Game Loop 
run = True  
while run:
    clock.tick(FPS)
    # Desenhar o background
    draw_bg()
    # Desenhar o painel
    draw_panel()
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            run = False  
    # Atualizar a janela
    pygame.display.update()

pygame.quit()