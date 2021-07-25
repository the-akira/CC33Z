import pygame
pygame.init()

# Definição da tela (500x500 pixels)
screen = pygame.display.set_mode([500, 500])
pygame.display.set_caption("Exemplo - Carregar Sprite")

# Carregar o sprite
sprite = pygame.image.load('imagens/wizard.png').convert_alpha()
# Aumentar a escala do sprite em 1.5
sprite = pygame.transform.rotozoom(sprite, 0, 1.5)
# Obter o retângulo e posicionar ele no centro
sprite_rect = sprite.get_rect(center=(250,250))

# Rodar até que o usuário clique para fechar
running = True
while running:
    # O usuário clicou no botão de fechar da janela?
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Preencher o background com branco
    screen.fill((255, 255, 255))
    # Desenhar o sprite no centro da tela
    screen.blit(sprite, sprite_rect)
    # Atualizar a janela
    pygame.display.flip()

# Sair do game
pygame.quit()