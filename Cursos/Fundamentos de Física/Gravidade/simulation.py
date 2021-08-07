"""
Bibliotecas necessárias:
pip install pygame
pip install pymunk
"""
import pygame, pymunk, sys 

def create_apple(space, pos):
    body = pymunk.Body(1, 100, body_type=pymunk.Body.DYNAMIC)
    body.position = pos
    shape = pymunk.Circle(body,50)
    space.add(body,shape)
    return shape

def draw_apples(apples):
    for apple in apples:
        pos_x = int(apple.body.position.x)
        pos_y = int(apple.body.position.y)
        apple_rect = apple_surface.get_rect(center=(pos_x,pos_y))
        screen.blit(apple_surface, apple_rect)

def create_newton(space, pos):
    body = pymunk.Body(body_type=pymunk.Body.STATIC)
    body.position = pos
    shape = pymunk.Circle(body,50)
    space.add(body,shape)
    return shape

def draw_newtons(balls):
    for ball in balls:
        pos_x = int(ball.body.position.x)
        pos_y = int(ball.body.position.y)
        newton_rect = newton.get_rect(center=(pos_x,pos_y))
        screen.blit(newton, newton_rect)

pygame.init()
screen = pygame.display.set_mode((800, 800))
pygame.display.set_caption('Simulação de Física')
clock = pygame.time.Clock()

space = pymunk.Space()
space.gravity = (0,500) # Horizontal, Vertical

apple_surface = pygame.image.load('apple.png').convert_alpha()
apples = []

clear_timer = pygame.USEREVENT 
pygame.time.set_timer(clear_timer, 10_000)

balls = []
balls.append(create_newton(space, (500, 500)))
balls.append(create_newton(space, (250, 600)))

background = pygame.image.load('sky.png').convert_alpha()
newton = pygame.image.load('newton.png').convert_alpha()

while True:
    screen.blit(background,(0,0))
    draw_apples(apples)
    draw_newtons(balls)
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        if event.type == pygame.MOUSEBUTTONDOWN:
            apples.append(create_apple(space,event.pos))
        if event.type == clear_timer:
            apples = []
    space.step(1/50)
    pygame.display.update()
    clock.tick(80)