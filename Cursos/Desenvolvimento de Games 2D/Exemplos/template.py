import pygame
 
# Definir cores
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GREEN = (0, 255, 0)
RED = (255, 0, 0)
BLUE = (0, 0, 255)

# Inicializar o módulo PyGame
pygame.init()
 
# Configurar a largura e a altura da tela (WIDTH, HEIGHT)
WIDTH, HEIGHT = (700, 500)
screen = pygame.display.set_mode((WIDTH, HEIGHT))
# Definir o título da tela 
pygame.display.set_caption("Meu Game")
 
# Relógio é usado para gerenciar o quão rápido a tela atualizada
clock = pygame.time.Clock()

# Rodar o loop até que o usuário clique no botão de fechar
rodando = True
# Main Loop
while rodando:
    # Eventos do Game
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            rodando = False

    # Preenchemos a tela com a cor branca
    screen.fill(WHITE)
 
    # Nesta seção deve ser inseridos os códigos de desenhar
 
    # Atualizamos a tela com tudo que desenhamos
    pygame.display.flip()
 
    # Limitamos os frames para 60 por segundo
    clock.tick(60)
 
# Fechamos a janela e saímos
pygame.quit()