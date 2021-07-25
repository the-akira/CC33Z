import pygame
pygame.init()

# Cores
BLUE = ((0, 0, 255))
WHITE = ((255, 255, 255))

# Resolução
WIDTH = 800
HEIGHT = 500

# Tela
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption('Retângulo Transparente')

# Texto
font = pygame.font.SysFont('dyuthi', 38)
text_surf = font.render('Retângulo com Texto', True, WHITE)
text_rect = text_surf.get_rect()
text_rect.center = (WIDTH//2, HEIGHT//2)

# Retângulo
surface = pygame.Surface((400, 250))
surface.set_alpha(185)
surface_rect = surface.get_rect()
surface_rect.center = (WIDTH//2, HEIGHT//2)

# Loop Principal
running = True
while running:
    # Preenche o fundo da tela com azul
    screen.fill(BLUE)
    # Desenha o texto na tela
    screen.blit(text_surf, text_rect)
    # Desenha o retângulo transparente na tela
    screen.blit(surface, surface_rect)
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
    pygame.display.update()

pygame.quit()