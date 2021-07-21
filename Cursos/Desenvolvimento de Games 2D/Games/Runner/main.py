from random import randint
from sys import exit
import pygame 
pygame.init()

# Função que retorna a pontuação do player
def display_score():
    current_time = int(pygame.time.get_ticks() / 1000) - start_time 
    score_surface = font.render(f'Score: {current_time}', False, (255, 255, 255))
    score_rect = score_surface.get_rect(center=(400,32))
    screen.blit(score_surface, score_rect)
    return current_time

# Função responsável por mover os obstáculos (ratos e morcegos)
def obstacle_movement(obstacle_list):
    if obstacle_list:
        for obstacle_rect in obstacle_list:
            obstacle_rect.x -= 4.5
            if obstacle_rect.bottom == 300:
                screen.blit(rat, obstacle_rect)
            else:
                screen.blit(bat, obstacle_rect)
        obstacle_list = [obstacle for obstacle in obstacle_list if obstacle.x > -100]
        return obstacle_list
    else:
        return []

# Função que trata a colisão entre player e obstáculos
def collisions(player, obstacles):
    if obstacles:
        for obstacle_rect in obstacles:
            if player.colliderect(obstacle_rect):
                return False
    return True

# Função que executa a animação de caminhada se o player estiver no chão
# e mostra a animação de pulo se ele não estiver no chão
def player_animation():
    global player, player_index
    if player_rect.bottom < 300:
        player = player_jump
    else:
        player_index += 0.1
        if player_index >= len(player_walk): 
            player_index = 0
        player = player_walk[int(player_index)]

# Configurações do Game
WIDTH, HEIGHT = 800, 400
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption('The Viking Runner!')
clock = pygame.time.Clock()
font = pygame.font.Font('font/Pixeltype.ttf', 50)
game_active = False
start_time = 0
score = 0
fps = 60

# Carrega o plano de fundo e o chão
background = pygame.image.load('images/background.png').convert()
ground = pygame.image.load('images/ground.png').convert()

# Carrega os obstáculos
# Rato
rat_frame_1 = pygame.image.load('images/Rat/rat1.png').convert_alpha()
rat_frame_2 = pygame.image.load('images/Rat/rat2.png').convert_alpha()
rat_frames = [rat_frame_1, rat_frame_2]
rat_frame_index = 0
rat = rat_frames[rat_frame_index]
# Morcego
bat_frame_1 = pygame.image.load('images/Bat/bat1.png').convert_alpha()
bat_frame_2 = pygame.image.load('images/Bat/bat2.png').convert_alpha()
bat_frame_3 = pygame.image.load('images/Bat/bat3.png').convert_alpha()
bat_frame_4 = pygame.image.load('images/Bat/bat4.png').convert_alpha()
bat_frames = [bat_frame_1, bat_frame_2, bat_frame_3, bat_frame_4]
bat_frame_index = 0
bat = bat_frames[bat_frame_index]

obstacle_rect_list = []

# Carrega o player
player_walk_1 = pygame.image.load('images/Player/player_walk1.png').convert_alpha()
player_walk_2 = pygame.image.load('images/Player/player_walk2.png').convert_alpha()
player_walk = [player_walk_1, player_walk_2]
player_index = 0
player_jump = pygame.image.load('images/Player/jump.png').convert_alpha()

player = player_walk[player_index]

player_rect = player.get_rect(midbottom=(80, 300))
player_gravity = 0

# Tela de Entrada
player_stand = pygame.image.load('images/Player/player.png').convert_alpha()
player_stand = pygame.transform.rotozoom(player_stand, 0, 2)
player_stand_rect = player_stand.get_rect(center=(400,200))

# Informações do Game
game_name = font.render('The Viking Runner!', False, (0, 0, 0))
game_name_rect = game_name.get_rect(center=(400, 65))

game_message = font.render('Press Space to Run', False, (0, 0, 0))
game_message_rect = game_message.get_rect(center=(400, 345))

# Timers
obstacle_timer = pygame.USEREVENT + 1
pygame.time.set_timer(obstacle_timer, 1500)

rat_animation_timer = pygame.USEREVENT + 2 
pygame.time.set_timer(rat_animation_timer, 500)

bat_animation_timer = pygame.USEREVENT + 3
pygame.time.set_timer(bat_animation_timer, 200)

while True:
    # Eventos do Game
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            exit()
        if game_active:
            if event.type == pygame.MOUSEBUTTONDOWN and player_rect.bottom >= 300:
                if player_rect.collidepoint(event.pos):
                    player_gravity = -20
            if event.type == pygame.KEYDOWN: 
                if event.key == pygame.K_SPACE and player_rect.bottom >= 300: 
                    player_gravity = -20
        else:
            if event.type == pygame.KEYDOWN and event.key == pygame.K_SPACE:
                game_active = True  
                start_time = int(pygame.time.get_ticks() / 1000)

        if game_active:
            if event.type == obstacle_timer:
                if randint(0,2):
                    obstacle_rect_list.append(rat.get_rect(bottomright=(randint(900,1100), 300)))
                else:
                    obstacle_rect_list.append(bat.get_rect(bottomright=(randint(900,1100), 160)))
            if event.type == rat_animation_timer:
                if rat_frame_index == 0:
                    rat_frame_index = 1
                else:
                    rat_frame_index = 0
                rat = rat_frames[rat_frame_index]
            if event.type == bat_animation_timer:
                if bat_frame_index == 0:
                    bat_frame_index = 1
                elif bat_frame_index == 1:
                    bat_frame_index = 2
                elif bat_frame_index == 2:
                    bat_frame_index = 3
                else:
                    bat_frame_index = 0
                bat = bat_frames[bat_frame_index]
    if game_active:
        screen.blit(background, (0,0))
        screen.blit(ground, (0, 300))
        score = display_score()

        player_gravity += 1
        player_rect.y += player_gravity
        if player_rect.bottom >= 300: 
            player_rect.bottom = 300
        player_animation()
        screen.blit(player, player_rect)

        # Movimento do obstáculo 
        obstacle_rect_list = obstacle_movement(obstacle_rect_list)
        # Colisões
        game_active = collisions(player_rect, obstacle_rect_list)
    else:
        screen.fill((174,222,203))
        screen.blit(player_stand, player_stand_rect)
        obstacle_rect_list.clear()
        player_rect.midbottom = (80, 300)
        player_gravity = 0

        score_message = font.render(f'Your score: {score}', False, (0, 0, 0))
        score_message_rect = score_message.get_rect(center=(400, 345))
        screen.blit(game_name, game_name_rect)

        if score == 0:
            screen.blit(game_message, game_message_rect)
        else:
            screen.blit(score_message, score_message_rect)

    pygame.display.update()
    clock.tick(fps)