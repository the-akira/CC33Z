import pygame
pygame.init()

# Resolução da tela
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 800
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption('Background Repetido')

# Carregar o tile a ser repetido
background = pygame.image.load('imagens/grass.png')

# Função que desenha o tile repetidamente
def draw_background(background_img):
    background_rect = background.get_rect()
    width = background_rect.width
    height = background_rect.height
    for i in range(SCREEN_WIDTH//width):
        for j in range(SCREEN_HEIGHT//height):
            screen.blit(background, pygame.Rect(i * width, j * height, width, height))

# Main Loop
running = True
while running:
    draw_background(background)
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
    pygame.display.update()

# Sair do game
pygame.quit()