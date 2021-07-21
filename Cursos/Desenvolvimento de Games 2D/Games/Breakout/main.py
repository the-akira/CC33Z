import pygame

pygame.init()

WIDTH, HEIGHT = 600, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption('Breakout')

# Definir fonte
font = pygame.font.SysFont('dyuthi', 30)

# Definir cores
bg = (234, 228, 184)
block_red = (242, 85, 96)
block_green = (86, 174, 87)
block_blue = (69, 177, 232)
paddle = (142, 135, 123)
outline = (100, 100, 100)
ball_color = (0, 0, 0)
text_color = (78, 81, 139)

# Definir variáveis do game
cols = 6
rows = 6
clock = pygame.time.Clock()
fps = 60
live_ball = False
game_over = 0

# Função para apresentar textos na tela 
def draw_text(text, font, text_color, x, y):
    img = font.render(text, True, text_color)
    screen.blit(img, (x, y))

# Classe parede de tijolos
class Wall():
    def __init__(self):
        self.width = WIDTH // cols 
        self.height = 50

    def create_wall(self):
        self.blocks = []
        # definir uma lista vazia para um bloco individual
        block_individual = []
        for row in range(rows):
            # Resetar a lista de linhas de bloco
            block_row = []
            # Iterar sob cada coluna na respectiva linha
            for col in range(cols):
                # Gerar posições x e y para cada bloco e criar um retângulo a partir delas
                block_x = col * self.width 
                block_y = row * self.height
                rect = pygame.Rect(block_x, block_y, self.width, self.height)
                # Atribuir a força do bloco baseado na linha
                if row < 2:
                    strength = 3
                elif row < 4:
                    strength = 2
                elif row < 6:
                    strength = 1
                # Criar uma lista para armazenar o retângulo e os dados de cores
                block_individual = [rect, strength]
                # Anexar o bloco individual a linha de blocos
                block_row.append(block_individual)
            # Anexar a linha para a lista completa de blocos
            self.blocks.append(block_row)

    def draw_wall(self):
        for row in self.blocks:
            for block in row:
                # Atribuir uma cor baseado na força do bloco
                if block[1] == 3:
                    block_color = block_blue
                elif block[1] == 2:
                    block_color = block_green
                elif block[1] == 1:
                    block_color = block_red 
                pygame.draw.rect(screen, block_color, block[0])
                pygame.draw.rect(screen, bg, block[0], 2)

# Classe paddle
class Paddle():
    def __init__(self):
        # Definir as variáveis do paddle
        self.reset()

    def move(self):
        # Resetar a direção de movimento
        self.direction = 0
        key = pygame.key.get_pressed()
        if key[pygame.K_LEFT] and self.rect.left > 0:
            self.rect.x -= self.speed 
            self.direction = -1
        if key[pygame.K_RIGHT] and self.rect.right < WIDTH:
            self.rect.x += self.speed 
            self.direction = 1

    def draw(self):
        pygame.draw.rect(screen, paddle, self.rect)
        pygame.draw.rect(screen, outline, self.rect, 3)

    def reset(self):
        self.height = 20
        self.width = int(WIDTH / cols)
        self.x = int((WIDTH / 2) - (self.width / 2))
        self.y = HEIGHT - (self.height * 2)
        self.speed = 10 
        self.rect = pygame.Rect(self.x, self.y, self.width, self.height)
        self.direction = 0 

# Classe da bola
class Ball():
    def __init__(self, x, y):
        self.reset(x, y)

    def move(self):
        # Threshold de colisão
        collision_thresh = 5
        # Iniciar assumindo que a parede foi destruída completamente
        wall_destroyed = 1
        row_count = 0
        for row in wall.blocks:
            item_count = 0
            for item in row:
                # Checar colisão
                if self.rect.colliderect(item[0]):
                    # Checar se a colisão vem de cima
                    if abs(self.rect.bottom - item[0].top) < collision_thresh and self.speed_y > 0:
                        self.speed_y *= -1
                    # Checar se a colisão vem de baixo
                    if abs(self.rect.top - item[0].bottom) < collision_thresh and self.speed_y < 0:
                        self.speed_y *= -1
                    # Checar se a colisão vem da esquerda
                    if abs(self.rect.right - item[0].left) < collision_thresh and self.speed_x > 0:
                        self.speed_x *= -1
                    # Checar se a colisão vem da direita
                    if abs(self.rect.left - item[0].right) < collision_thresh and self.speed_x < 0:
                        self.speed_x *= -1
                    # Reduzir a força do bloco ao causar dano a ele
                    if wall.blocks[row_count][item_count][1] > 1:
                        wall.blocks[row_count][item_count][1] -= 1
                    else:
                        wall.blocks[row_count][item_count][0] = (0, 0, 0, 0)
                # Checar se blocos ainda existem, neste caso, a parede não foi destruída
                if wall.blocks[row_count][item_count][0] != (0, 0, 0, 0):
                    wall_destroyed = 0
                # Aumentar o contador do item
                item_count += 1 
            # Aumentar o contador de linha
            row_count += 1
        # Após iterar por todos os blocos, checar se a parede foi destruída
        if wall_destroyed == 1:
            self.game_over = 1
        # Checar por colisões com paredes
        if self.rect.left < 0 or self.rect.right > WIDTH:
            self.speed_x *= -1
        # Checar por colisões com o topo e o rodapé da tela
        if self.rect.top < 0:
            self.speed_y *= -1
        if self.rect.bottom > HEIGHT:
            self.game_over = -1
        # Checar por colisões com o paddle 
        if self.rect.colliderect(player_paddle):
            # Checar se está colidindo por cima 
            if abs(self.rect.bottom - player_paddle.rect.top) < collision_thresh and self.speed_y > 0:
                self.speed_y *= -1
                self.speed_x += player_paddle.direction
                if self.speed_x > self.speed_max:
                    self.speed_x = self.speed_max
                elif self.speed_x < 0 and self.speed_x < -self.speed_max:
                    self.speed_x = -self.speed_max
            else:
                self.speed_x *= -1

        self.rect.x += self.speed_x 
        self.rect.y += self.speed_y
        return self.game_over

    def draw(self):
        pygame.draw.circle(screen, ball_color, (self.rect.x + self.ball_radius, self.rect.y + self.ball_radius), self.ball_radius)
        pygame.draw.circle(screen, ball_color, (self.rect.x + self.ball_radius, self.rect.y + self.ball_radius), self.ball_radius, 1)

    def reset(self, x, y):
        self.ball_radius = 10
        self.x = x - self.ball_radius
        self.y = y 
        self.rect = pygame.Rect(self.x, self.y, self.ball_radius * 2, self.ball_radius * 2)
        self.speed_x = 4 
        self.speed_y = -4
        self.speed_max = 5
        self.game_over = 0

# Criar parede
wall = Wall()
wall.create_wall()

# Criar paddle
player_paddle = Paddle()

# Criar bola
ball = Ball(player_paddle.x + (player_paddle.width // 2), player_paddle.y - player_paddle.height)

running = True 
while running:
    clock.tick(fps)
    screen.fill(bg)
    # Desenhar todos os objetos
    wall.draw_wall()
    player_paddle.draw()
    ball.draw()

    if live_ball:
        player_paddle.move()    
        game_over = ball.move()
        if game_over != 0:
            live_ball = False
    # Imprimir instruções do jogador
    if not live_ball:
        if game_over == 0:
            draw_text('Clique em algum lugar para iniciar', font, text_color, 100, HEIGHT // 2 + 100)
        elif game_over == 1:
            draw_text('Você VENCEU!', font, text_color, 220, HEIGHT // 2 + 50)
            draw_text('Clique em algum lugar para iniciar', font, text_color, 100, HEIGHT // 2 + 100)
        elif game_over == -1:
            draw_text('Você PERDEU!', font, text_color, 220, HEIGHT // 2 + 50)
            draw_text('Clique em algum lugar para iniciar', font, text_color, 100, HEIGHT // 2 + 100)

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.MOUSEBUTTONDOWN and live_ball == False:
            live_ball = True
            ball.reset(player_paddle.x + (player_paddle.width // 2), player_paddle.y - player_paddle.height)
            player_paddle.reset()
            wall.create_wall()
    pygame.display.update()

pygame.quit()