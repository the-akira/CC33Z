import pygame
pygame.init()

class Player(object):
    def __init__(self, x, y, w, h):
        self.rect = pygame.rect.Rect(x, y, w, h)

    def handle_keys(self):
        key = pygame.key.get_pressed()
        if key[pygame.K_LEFT]:
            self.rect.left = max(20, self.rect.left - 1)
        if key[pygame.K_RIGHT]:
            self.rect.right = min(window.get_height() - 20, self.rect.right + 1)
        if key[pygame.K_UP]:
            self.rect.top = max(20, self.rect.top - 1)
        if key[pygame.K_DOWN]:
            self.rect.bottom = min(window.get_width() - 20, self.rect.bottom + 1)

    def draw(self, surface):
        pygame.draw.rect(surface, (0, 0, 128), self.rect)

WIDTH, HEIGHT = 240, 240
window = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption('Física')
clock = pygame.time.Clock()

player = Player(20, 20, 50, 50)
vec, vel = pygame.math.Vector2(1, 1), 0.85
ball_pos_x, ball_pos_y, ball_radius = 120, 120, 10

run = True
while run:
    clock.tick(120)
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            run = False
    player.handle_keys()  

    min_x, min_y = 20, 20
    max_x, max_y =  window.get_width() - 20, window.get_height() - 20
    ball_pos_x += vec[0] * vel
    ball_pos_y += vec[1] * vel

    if ball_pos_x - ball_radius < min_x:
        ball_pos_x = ball_radius + min_x
        vec[0] = -vec[0]
    if ball_pos_y - ball_radius < min_y:
        ball_pos_y = ball_radius + min_y
        vec[1] = -vec[1]
    if ball_pos_x + ball_radius > max_x:
        ball_pos_x = max_x - ball_radius
        vec[0] = -vec[0]
    if ball_pos_y + ball_radius > max_y:
        ball_pos_y = max_y - ball_radius
        vec[1] = -vec[1]

    ball = pygame.Rect((0,0), (ball_radius*2, ball_radius*2))
    ball.center = int(ball_pos_x), int(ball_pos_y)

    if player.rect.colliderect(ball):
        dx = ball_pos_x - player.rect.centerx
        dy = ball_pos_y - player.rect.centery
        if abs(dx) > abs(dy):
            if dx < 0:
                ball_pos_x = max(player.rect.left - ball_radius, ball_radius + min_x) 
                player.rect.left = int(ball_pos_x) + ball_radius
            else:
                ball_pos_x = min(player.rect.right + ball_radius, max_x - ball_radius)
                player.rect.right = int(ball_pos_x) - ball_radius
            if (dx < 0 and vec[0] > 0) or (dx > 0 and vec[0] < 0):
                vec.reflect_ip(pygame.math.Vector2(1, 0))
        else:
            if dy < 0:
                ball_pos_y = max(player.rect.top - ball_radius, ball_radius + min_y) 
                player.rect.top = int(ball_pos_y) + ball_radius
            else:
                ball_pos_y = min(player.rect.bottom + ball_radius, max_y - ball_radius)
                player.rect.bottom = int(ball_pos_y) - ball_radius
            ball_pos_y = player.rect.top - ball_radius if dy < 0 else player.rect.bottom + ball_radius
            if (dy < 0 and vec[1] > 0) or (dy > 0 and vec[1] < 0):
                vec.reflect_ip(pygame.math.Vector2(0, 1))

    window.fill((255, 255, 255))
    pygame.draw.rect(window, (0,0,0), (18, 18, 203, 203), 2)
    player.draw(window)
    pygame.draw.circle(window, (0, 255, 0), (round(ball_pos_x), round(ball_pos_y)), ball_radius)
    pygame.display.update()

pygame.quit()
exit()