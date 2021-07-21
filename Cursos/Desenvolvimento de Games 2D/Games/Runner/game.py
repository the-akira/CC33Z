from random import randint, choice
from sys import exit
import pygame 
pygame.init()

class Player(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        player_walk_1 = pygame.image.load('images/Player/player_walk1.png').convert_alpha()
        player_walk_2 = pygame.image.load('images/Player/player_walk2.png').convert_alpha()
        self.player_walk = [player_walk_1, player_walk_2]
        self.player_index = 0
        self.player_jump = pygame.image.load('images/Player/jump.png').convert_alpha()
        self.image = self.player_walk[self.player_index]
        self.rect = self.image.get_rect(midbottom=(80, 300))
        self.gravity = 0
        self.jump_sound = pygame.mixer.Sound('sounds/jump.wav')
        self.jump_sound.set_volume(0.25)

    def player_input(self):
        keys = pygame.key.get_pressed()
        if keys[pygame.K_SPACE] and self.rect.bottom >= 300:
            self.gravity = -20
            self.jump_sound.play()

    def apply_gravity(self):
        self.gravity += 1  
        self.rect.y += self.gravity
        if self.rect.bottom >= 300:
            self.rect.bottom = 300

    def animation_state(self):
        if self.rect.bottom < 300:
            self.image = self.player_jump
        else:
            self.player_index += 0.1
            if self.player_index >= len(self.player_walk): 
                self.player_index = 0
            self.image = self.player_walk[int(self.player_index)]

    def update(self):
        self.player_input()
        self.apply_gravity()
        self.animation_state()

class Obstacle(pygame.sprite.Sprite):
    def __init__(self, type):
        super().__init__()
        if type == 'rat':
            rat_1 = pygame.image.load('images/Rat/rat1.png').convert_alpha()
            rat_2 = pygame.image.load('images/Rat/rat2.png').convert_alpha()
            self.frames = [rat_1, rat_2]
            y_pos = 300
        else: 
            bat_1 = pygame.image.load('images/Bat/bat1.png').convert_alpha()
            bat_2 = pygame.image.load('images/Bat/bat2.png').convert_alpha()
            bat_3 = pygame.image.load('images/Bat/bat3.png').convert_alpha()
            bat_4 = pygame.image.load('images/Bat/bat4.png').convert_alpha()
            self.frames = [bat_1, bat_2, bat_3, bat_4]   
            y_pos = 160 
        self.animation_index = 0        
        self.image = self.frames[self.animation_index]
        self.rect = self.image.get_rect(midbottom=(randint(900,1100),y_pos))

    def animation_state(self):
        self.animation_index += 0.1
        if self.animation_index >= len(self.frames):
            self.animation_index = 0
        self.image = self.frames[int(self.animation_index)]

    def update(self):
        self.animation_state()
        self.rect.x -= 5
        self.destroy()

    def destroy(self):
        if self.rect.x <= -100:
            self.kill()

# Função que retorna a pontuação do player
def display_score():
    current_time = int(pygame.time.get_ticks() / 1000) - start_time 
    score_surface = font.render(f'Score: {current_time}', False, (255, 255, 255))
    score_rect = score_surface.get_rect(center=(400,32))
    screen.blit(score_surface, score_rect)
    return current_time

# Função que trata a colisão com o sprite
def collision_sprite():
    if pygame.sprite.spritecollide(player.sprite, obstacle_group, False):
        obstacle_group.empty()
        return False
    else:
        return True

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
music = pygame.mixer.Sound('sounds/EricMatyas-OurMountain.wav')
music.set_volume(0.18)
music.play(loops=-1)

# Grupos
player = pygame.sprite.GroupSingle()
player.add(Player())
obstacle_group = pygame.sprite.Group()

# Carrega o plano de fundo e o chão
background = pygame.image.load('images/background.png').convert()
ground = pygame.image.load('images/ground.png').convert()

# Tela de Entrada
player_stand = pygame.image.load('images/Player/player.png').convert_alpha()
player_stand = pygame.transform.rotozoom(player_stand, 0, 2)
player_stand_rect = player_stand.get_rect(center=(400,200))

# Informações do Game
game_name = font.render('The Viking Runner!', False, (0, 0, 0))
game_name_rect = game_name.get_rect(center=(400, 65))

game_message = font.render('Press Space to Run', False, (0, 0, 0))
game_message_rect = game_message.get_rect(center=(400, 345))

# Timer
obstacle_timer = pygame.USEREVENT + 1
pygame.time.set_timer(obstacle_timer, 1500)

while True:
    # Eventos do Game
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            exit()
        if game_active:
            if event.type == obstacle_timer:
                obstacle_group.add(Obstacle(choice(['bat','rat','rat','rat'])))      
        else:
            if event.type == pygame.KEYDOWN and event.key == pygame.K_SPACE:
                game_active = True
                start_time = int(pygame.time.get_ticks() / 1000)

    if game_active:
        screen.blit(background, (0,0))
        screen.blit(ground, (0, 300))
        score = display_score()

        player.draw(screen)
        player.update()

        obstacle_group.draw(screen)
        obstacle_group.update()

        game_active = collision_sprite()
    else:
        screen.fill((174,222,203))
        screen.blit(player_stand, player_stand_rect)

        score_message = font.render(f'Your score: {score}', False, (0, 0, 0))
        score_message_rect = score_message.get_rect(center=(400, 345))
        screen.blit(game_name, game_name_rect)

        if score == 0:
            screen.blit(game_message, game_message_rect)
        else:
            screen.blit(score_message, score_message_rect)

    pygame.display.update()
    clock.tick(fps)