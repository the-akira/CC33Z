import pygame
pygame.init()

# Definição da tela (500x500 pixels)
screen = pygame.display.set_mode([500, 500])
pygame.display.set_caption("Exemplo - Círculo")

# Rodar até que o usuário clique para fechar
running = True
while running:
    # O usuário clicou no botão de fechar da janela?
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Preencher o background com preto
    screen.fill((0, 0, 0))
    # Desenhar um círculo sólido branco no centro da tela
    pygame.draw.circle(screen, (255, 255, 255), (250, 250), 75)
    # Atualizar a janela
    pygame.display.flip()

# Sair do game
pygame.quit()