import pygame

pygame.init()

WIDTH, HEIGHT = 300, 300

screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption('Jogo da Velha')

# Variáveis
line_width = 6
markers = []
clicked = False
player = 1
winner = 0 
game_over = False

# Cores
GREEN = (0, 255, 0)
RED = (255, 0, 0)
BLUE = (0, 0, 255)

# Fonte
font = pygame.font.SysFont(None, 40)

# Criar retângulo 'Play Again'
again_rect = pygame.Rect(WIDTH // 2 - 80, HEIGHT // 2, 160, 50)

def draw_grid():
    background = (255, 255, 200)
    grid = (25, 25, 25)
    screen.fill(background)
    for x in range(1,3):
        pygame.draw.line(screen, grid, (0, x * 100), (WIDTH, x * 100), line_width)
        pygame.draw.line(screen, grid, (x * 100, 0), ( x * 100, HEIGHT), line_width)

for x in range(3):
    row = [0] * 3
    markers.append(row)

def draw_markers():
    x_pos = 0
    for x in markers:
        y_pos = 0
        for y in x:
            if y == 1:
                pygame.draw.line(screen, GREEN, (x_pos * 100 + 15, y_pos * 100 + 15), (x_pos * 100 + 85, y_pos *100 + 85), line_width)
                pygame.draw.line(screen, GREEN, (x_pos * 100 + 15, y_pos * 100 + 85), (x_pos * 100 + 85, y_pos *100 + 15), line_width)
            if y == -1:
                pygame.draw.circle(screen, RED, (x_pos * 100 + 50, y_pos * 100 + 50), 38, line_width)
            y_pos += 1 
        x_pos += 1

def check_winner():
    global winner 
    global game_over
    y_pos = 0
    for x in markers:
        # checar colunas
        if sum(x) == 3:
            winner = 1
            game_over = True
        if sum(x) == -3:
            winner = 2
            game_over = True
        # checar linhas
        if markers[0][y_pos] + markers[1][y_pos] + markers[2][y_pos] == 3:
            winner = 1
            game_over = True
        if markers[0][y_pos] + markers[1][y_pos] + markers[2][y_pos] == -3:         
            winner = 2
            game_over = True
        y_pos += 1
    # checar diagonal
    if markers[0][0] + markers[1][1] + markers[2][2] == 3 or markers[2][0] + markers[1][1] + markers[0][2] == 3:
        winner = 1
        game_over = True    
    if markers[0][0] + markers[1][1] + markers[2][2] == -3 or markers[2][0] + markers[1][1] + markers[0][2] == -3:
        winner = 2
        game_over = True

def draw_winner(winner):
    win_text = f'Player {winner} wins!' 
    win_img = font.render(win_text, True, BLUE)
    pygame.draw.rect(screen, GREEN, (WIDTH // 2 - 100, HEIGHT // 2 - 60, 200, 50))
    screen.blit(win_img, (WIDTH // 2 - 96, HEIGHT // 2 - 50))   

    again_text = "Play Again?"
    again_img = font.render(again_text, True, BLUE)
    pygame.draw.rect(screen, GREEN, again_rect)
    screen.blit(again_img, (WIDTH // 2 - 80, HEIGHT // 2 + 10))

running = True
while running:
    draw_grid()
    draw_markers()

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False 
        if game_over == 0:
            if event.type == pygame.MOUSEBUTTONDOWN and clicked == False:
                clicked = True
            if event.type == pygame.MOUSEBUTTONUP and clicked == True:
                clicked = False
                pos = pygame.mouse.get_pos()
                cell_x = pos[0]
                cell_y = pos[1]
                if markers[cell_x // 100][cell_y // 100] == 0:
                    markers[cell_x // 100][cell_y // 100] = player
                    player *= -1
                    check_winner()

    if game_over == True:
        draw_winner(winner)
        # Checar por mouseclick para verificar se o usuário clicou em 'Play Again'
        if event.type == pygame.MOUSEBUTTONDOWN and clicked == False:
            clicked = True
        if event.type == pygame.MOUSEBUTTONUP and clicked == True:
            clicked = False
            pos = pygame.mouse.get_pos()
            if again_rect.collidepoint(pos):
                # Resetar variáveis
                markers = []
                pos = []
                player = 1
                winner = 0 
                game_over = False
                for x in range(3):
                    row = [0] * 3
                    markers.append(row)

    pygame.display.update()

pygame.quit()