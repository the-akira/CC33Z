import pygame, sys, random 

class SpaceShip(pygame.sprite.Sprite):
    def __init__(self, path, x, y):
        super().__init__()
        self.uncharged = pygame.image.load(path).convert_alpha()
        self.charged = pygame.image.load('images/spaceshipcharged.png').convert_alpha()
        self.image = self.uncharged
        self.rect = self.image.get_rect(center=(x,y))
        self.shield_surface = pygame.image.load('images/shield.png').convert_alpha()
        self.health = 5

    def update(self):
        self.rect.center = pygame.mouse.get_pos()
        self.screen_constrain()
        self.display_health()

    def screen_constrain(self):
        if self.rect.right >= 1280:
            self.rect.right = 1280
        if self.rect.left <= 0:
            self.rect.left = 0

    def display_health(self):
        for index, shield in enumerate(range(self.health)):
            screen.blit(self.shield_surface, (10 + index * 40,10))

    def get_damage(self, damage_amount):
        self.health -= damage_amount

    def charge(self):
        self.image = self.charged

    def discharge(self):
        self.image = self.uncharged

class Meteor(pygame.sprite.Sprite):
    def __init__(self, path, x, y, x_speed, y_speed):
        super().__init__()
        self.image = pygame.image.load(path).convert_alpha()
        self.rect = self.image.get_rect(center=(x,y))
        self.x_speed = x_speed 
        self.y_speed = y_speed

    def update(self):
        self.rect.centerx += self.x_speed
        self.rect.centery += self.y_speed

        if self.rect.centery >= 800:
            self.kill()

class Laser(pygame.sprite.Sprite):
    def __init__(self, path, pos, speed):
        super().__init__()
        self.image = pygame.image.load(path).convert_alpha()
        self.rect = self.image.get_rect(center=pos)
        self.speed = speed

    def update(self):
        self.rect.centery -= self.speed
        if self.rect.centery <= -100:
            self.kill()

def main_game():
    global laser_active
    laser_group.draw(screen)
    spaceship_group.draw(screen)
    meteor_group.draw(screen)

    laser_group.update()
    spaceship_group.update()
    meteor_group.update()

    explosion1 = pygame.mixer.Sound('sounds/explo1.wav')
    explosion1.set_volume(0.15)
    explosion2 = pygame.mixer.Sound('sounds/explo2.wav')
    explosion2.set_volume(0.035)

    # Colisão
    if pygame.sprite.spritecollide(spaceship_group.sprite, meteor_group, True):
        spaceship_group.sprite.get_damage(1)
        explosion1.play()

    for laser in laser_group:
        pygame.sprite.spritecollide(laser, meteor_group, True)
        explosion2.play()

    # Laser timer
    if pygame.time.get_ticks() - laser_timer >= 1000:
        laser_active = True 
        spaceship_group.sprite.charge()

    return 1

def end_game():
    text_surface = game_font.render('Game Over', True, (255,255,255))
    text_rect = text_surface.get_rect(center=(WIDTH//2,HEIGHT//2 - 40))
    screen.blit(text_surface,text_rect)

    score_surface = game_font.render(f'Score: {score}', True, (255,255,255))
    score_rect = score_surface.get_rect(center=(WIDTH//2,HEIGHT//2 + 20))
    screen.blit(score_surface,score_rect)

pygame.init()
WIDTH, HEIGHT = 1280, 720
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption('Space Shooter')

pygame.mouse.set_visible(False)
clock = pygame.time.Clock()
game_font = pygame.font.Font('LazenbyCompSmooth.ttf',40)
score = 0
laser_timer = 0
laser_active = False

# Efeitos sonoros
music = pygame.mixer.Sound('sounds/FrozenJam.ogg')
music.set_volume(0.05)
music.play(loops=-1)

laser = pygame.mixer.Sound('sounds/laser.wav')
laser.set_volume(0.25)

spaceship = SpaceShip('images/spaceship.png', 400, 300)
spaceship_group = pygame.sprite.GroupSingle()
spaceship_group.add(spaceship)

meteor_group = pygame.sprite.Group()

METEOR_EVENT = pygame.USEREVENT
pygame.time.set_timer(METEOR_EVENT, 250) # Milisegundos

laser_group = pygame.sprite.Group()

background = pygame.image.load('images/starfield.png').convert_alpha()

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        if event.type == METEOR_EVENT:
            meteor_list = [
                'images/meteor1.png',
                'images/meteor2.png',
                'images/meteor3.png',
                'images/meteor4.png',
                'images/meteor5.png',
                'images/meteor6.png'
            ]
            meteor_image = random.choice(meteor_list)
            random_x_pos = random.randrange(0,1280)
            random_y_pos = random.randrange(-500,-50)
            random_x_speed = random.randrange(-1,1)
            random_y_speed = random.randrange(4,10)
            meteor = Meteor(meteor_image,random_x_pos,random_y_pos,random_x_speed,random_y_speed)
            meteor_group.add(meteor)
        if event.type == pygame.MOUSEBUTTONDOWN and laser_active:
            new_laser = Laser('images/laser.png', event.pos, 15)
            laser_group.add(new_laser)
            laser_active = False
            laser_timer = pygame.time.get_ticks()
            laser.play()
            spaceship_group.sprite.discharge()
        if event.type == pygame.MOUSEBUTTONDOWN and spaceship_group.sprite.health <= 0:
            spaceship_group.sprite.health = 5
            meteor_group.empty()
            score = 0

    screen.blit(background, (0,0))
    if spaceship_group.sprite.health > 0:
        score += main_game()
    else:
        end_game()

    pygame.display.update()
    clock.tick(60)