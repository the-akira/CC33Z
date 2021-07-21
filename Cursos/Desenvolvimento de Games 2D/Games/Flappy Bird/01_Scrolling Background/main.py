import pygame 

pygame.init()

clock = pygame.time.Clock()
fps = 60

WIDTH = 864
HEIGHT = 936
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption('Flappy Bird')

# Variáveis do game
ground_scroll = 0 
scroll_speed = 4

# Carregar imagens 
background = pygame.image.load('images/bg.png')
ground = pygame.image.load('images/ground.png')

run = True 
while run:
    clock.tick(fps)
    # Desenha o fundo
    screen.blit(background, (0,0))
    # Desenhar e fazer rolagem do chão
    screen.blit(ground, (ground_scroll,768))
    ground_scroll -= scroll_speed
    if abs(ground_scroll) > 35:
        ground_scroll = 0
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            run = False  

    pygame.display.update()

pygame.quit()