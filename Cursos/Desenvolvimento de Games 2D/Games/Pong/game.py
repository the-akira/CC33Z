import pygame 
pygame.init()

WIDTH = 600
HEIGHT = 500

clock = pygame.time.Clock()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption('Pong')

# Definir fonte
font = pygame.font.SysFont(None, 30)

# Definir variáveis do game
live_ball = False
margin = 50
cpu_score = 0 
player_score = 0
FPS = 60
winner = 0
speed_increase = 0

# Definir cores
BG = (0, 18, 54)
GREEN = (60, 255, 0)

# Função que desenha o tabuleiro
def draw_board():
    screen.fill(BG)
    pygame.draw.line(screen, GREEN, (0, margin), (WIDTH, margin), 3)

# Função que desenha o texto
def draw_text(text, font, text_color, x, y):
    img = font.render(text, True, text_color)
    screen.blit(img, (x, y))

class Paddle:
    def __init__(self, x, y):
        self.x = x 
        self.y = y
        self.rect = pygame.Rect(self.x, self.y, 20, 100)
        self.speed = 5  

    def move(self):
        key = pygame.key.get_pressed()
        if key[pygame.K_UP] and self.rect.top > margin:
            self.rect.move_ip(0, -1 * self.speed)
        if key[pygame.K_DOWN] and self.rect.bottom < HEIGHT:
            self.rect.move_ip(0, self.speed)

    def ai(self):
        # Inteligência Artificial para mover o paddle automaticamente
        # Mover para baixo
        if self.rect.centery < ball.rect.top and self.rect.bottom < HEIGHT:
            self.rect.move_ip(0, self.speed)
        # Mover para cima
        if self.rect.centery > ball.rect.bottom and self.rect.top > margin:
            self.rect.move_ip(0, -1 * self.speed)

    def draw(self):
        pygame.draw.rect(screen, GREEN, self.rect)

class Ball:
    def __init__(self, x, y):
        self.reset(x, y)

    def move(self): 
        # Detectar colisão
        # Checar colisão com a margem do topo
        if self.rect.top < margin:
            self.speed_y *= -1
        # Checar colisão com o inferior da tela
        if self.rect.bottom > HEIGHT:
            self.speed_y *= -1 
        # Checar colisão com os paddles
        if self.rect.colliderect(player_paddle) or self.rect.colliderect(cpu_paddle):
            self.speed_x *= -1
        # Checar se a bola saiu da tela
        if self.rect.left < 0:   
            self.winner = 1 
        if self.rect.right > WIDTH:
            self.winner = -1        
        # Atualizar a posição da bola 
        self.rect.x += self.speed_x
        self.rect.y += self.speed_y

        return self.winner

    def draw(self):
        pygame.draw.circle(screen, GREEN, (self.rect.x + self.ball_rad, self.rect.y + self.ball_rad), self.ball_rad) 

    def reset(self, x, y):
        self.x = x 
        self.y = y
        self.ball_rad = 8
        self.rect = pygame.Rect(self.x, self.y, self.ball_rad * 2, self.ball_rad * 2)
        self.speed_x = -4
        self.speed_y = 4   
        self.winner = 0 # 1 significa player pontuou, -1 significa CPU pontuou

# Criar paddles
player_paddle = Paddle(WIDTH - 40, HEIGHT//2 - 25)
cpu_paddle = Paddle(20, HEIGHT//2 - 25)

# Criar bolas de pong
ball = Ball(WIDTH - 60, HEIGHT//2 + 50)

# Main Loop
run = True
while run:
    clock.tick(FPS)
    # Desenhar tabuleiro e informações
    draw_board()
    draw_text(f'CPU: {cpu_score}', font, GREEN, 20, 15)
    draw_text(f'P1: {player_score}', font, GREEN, WIDTH - 70, 15)
    draw_text(f'BALL SPEED: {abs(ball.speed_x)}', font, GREEN, WIDTH//2 - 65, 15)
    # Desenhar paddles
    player_paddle.draw()
    cpu_paddle.draw()

    # Checar se o round está ativo
    if live_ball == True:
        speed_increase += 1
        # Mover a bola
        winner = ball.move()
        if winner == 0:
            # Mover paddle
            player_paddle.move()
            cpu_paddle.ai()
            # Desenhar a bola
            ball.draw()
        else:
            live_ball = False 
            if winner == 1:
                player_score += 1 
            elif winner == -1:
                cpu_score += 1

    # Imprimir instruções para o player
    if live_ball == False:
        if winner == 0:
            draw_text('CLICK ANYWHERE TO START', font, GREEN, 160, HEIGHT//2 - 100)
        if winner == 1:
            draw_text('YOU SCORED!', font, GREEN, 235, HEIGHT//2 - 100)
            draw_text('CLICK ANYWHERE TO START', font, GREEN, 160, HEIGHT//2 - 50)
        if winner == -1:
            draw_text('CPU SCORED!', font, GREEN, 235, HEIGHT//2 - 100)
            draw_text('CLICK ANYWHERE TO START', font, GREEN, 160, HEIGHT//2 - 50)

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            run = False 
        if event.type == pygame.MOUSEBUTTONDOWN and live_ball == False: 
            live_ball = True 
            ball.reset(WIDTH - 60, HEIGHT//2 + 50) 

    if speed_increase > 500:
        speed_increase = 0 
        if ball.speed_x < 0:
            ball.speed_x -= 1 
        if ball.speed_x > 0:
            ball.speed_x += 1 
        if ball.speed_y < 0:
            ball.speed_y -= 1 
        if ball.speed_y > 0:
            ball.speed_y += 1 

    pygame.display.update()

pygame.quit()