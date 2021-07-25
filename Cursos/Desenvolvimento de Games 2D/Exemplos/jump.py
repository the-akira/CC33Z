import pygame
pygame.init()

# Cores
BROWN = (34, 23, 28)
YELLOW = (227, 199, 133)

# Constantes
WIDTH = 350
HEIGHT = 350
GRAVITY = 0.9
FLOOR_Y_POS = 335
FPS = 60

# Tela
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption('Personagem Pulando')
# Relógio
clock = pygame.time.Clock()

# Carregar o sprite
sprite = pygame.image.load('imagens/crusader.png').convert_alpha()
sprite = pygame.transform.scale(sprite,(60,95))
sprite_rect = sprite.get_rect()

# Definir a velocidade na direção y e as posições x e y
y_speed = 0
x_pos = WIDTH // 2
y_pos = FLOOR_Y_POS

# Definir a coordenada x do sprite (centro)
sprite_rect.centerx = int(x_pos)

# Main Loop
running = True
while running:
    key_pressed = pygame.key.get_pressed()
    if y_speed == 0:
        if key_pressed[pygame.K_UP]: # Se apertar seta para cima: pular!
            y_speed -= 13
    else:
        y_pos += y_speed
        y_speed += GRAVITY

        if y_pos > FLOOR_Y_POS: # Para de cair quando alcançar o chão
            y_speed = 0
            y_pos = FLOOR_Y_POS

    # Atualizar a coordenada y do sprite
    sprite_rect.bottom = int(y_pos)

    # Preencher a tela e desenhar o chão e o sprite
    screen.fill(YELLOW)
    pygame.draw.rect(screen, BROWN, (0, 335, WIDTH, HEIGHT - 335)) # Chão
    screen.blit(sprite, sprite_rect)

    # Atualizar a tela a 60 FPS
    clock.tick(FPS)
    pygame.display.update()

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

pygame.quit()