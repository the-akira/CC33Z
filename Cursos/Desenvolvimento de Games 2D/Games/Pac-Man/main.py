import random
import pygame
import time

pygame.init()
SIZE = (WIDTH, HEIGHT) = 840, 960
display = pygame.display.set_mode(SIZE)
pygame.display.set_caption('Pac-Man')
map_image = pygame.image.load('images/map.png').convert_alpha()
clock = pygame.time.Clock()
FPS = 40

def load_image(file_name):
    image = pygame.image.load(f'images/{file_name}').convert_alpha()
    return image

def get_neighbours(cord, ignore_four):
    for delta_y, delta_x in [(-1, 0), (0, -1), (0, 1), (1, 0)]:
        new_y, new_x = cord[0] + delta_y, cord[1] + delta_x
        if (
            0 <= new_y < len(tiles) and
            0 <= new_x < len(tiles[0]) and
            tiles[new_y][new_x] != 3 and
            (ignore_four or tiles[new_y][new_x] != 4)
        ):
            yield new_y, new_x

def get_shortest_path(paths, end, seen=None, ignore_four=False):
    if seen is None:
        seen = set()
    new_paths = []
    for path in paths:
        for neighbour in get_neighbours(path[-1], ignore_four):
            if neighbour in seen:
                continue
            if neighbour == end:
                return path + [neighbour]
            new_paths.append(path + [neighbour])
            seen.add(neighbour)
    if not new_paths:
        return False
    return get_shortest_path(new_paths, end, seen, ignore_four)

class Entity(pygame.sprite.Sprite):
    def __init__(self, target=None):
        self.target = target
        self.facing = 'R'
        self.next_facing = None
        self.speed = 4  
        self.wall = {3, 4}
        self.dead = False
        self.god_mode = False
        self.god_mode_till = None
        self.scared = False
        self.spawn_tile = (10, 11)
        self.image_sets = {}
        self.facing_to_images = None
        self.images = None
        self.image = None
        self.rect = None
        self.rendered_first_cycle = False
        self.stuck = False
        self.frames_per_image = 6
        self.frame_idx = 0
        self.n_images = None
        self.image_idx = 0

    def add_images(self, name, file_name, n_images, image_order=None):
        raw_images = load_image(file_name)
        *_, width, height = raw_images.get_rect()
        gap = (width - height * n_images) // (n_images - 1)
        images = [
            raw_images.subsurface((height + gap) * idx, 0, height, height)
            for idx in range(n_images)
        ]
        if image_order:
            image_frames = len(images) // len(image_order)
            facing_to_images = {
                direction: images[idx: idx+image_frames]
                for direction, idx in zip(
                    image_order, range(0, n_images, n_images // len(image_order))
                )
            }
        else:
            image_frames = len(images)
            facing_to_images = None
        self.image_sets[name] = images, facing_to_images, image_frames

    def set_images(self, name):
        self.images, self.facing_to_images, self.n_images = self.image_sets[name]
        self.image = self.images[0]
        self.frame_idx = 0
        self.image_idx = 0
        self.rendered_first_cycle = False

    def set_rect(self, x_tile, y_tile):
        self.rect = self.image.get_rect()
        self.rect.center = (TILE_WIDTH * x_tile + 22, TILE_HEIGHT * y_tile + 22)

    def draw(self, surface):
        if not self.stuck or self.dead:
            self.frame_idx += 1
        if self.frame_idx == self.frames_per_image:
            self.frame_idx = 0
            self.image_idx += 1
        if self.image_idx == self.n_images:
            self.rendered_first_cycle = True
            self.image_idx = 0
        if self.facing_to_images is not None:
            self.image = self.facing_to_images[self.facing][self.image_idx]
        else:
            self.image = self.images[self.image_idx]
        if self.rect.x + self.rect.w >= WIDTH:
            self.rect.x += self.rect.w - WIDTH
        elif self.rect.x < 0:
            self.rect.x += WIDTH - self.rect.w
        surface.blit(self.image, self.rect)

    @property
    def left_top(self):
        return self.rect.x + 4, self.rect.y + 4

    @property
    def left_top_tile(self):
        x, y = self.left_top
        return y // TILE_HEIGHT, x // TILE_WIDTH

    @property
    def middle_cord(self):
        return self.rect.x + 24, self.rect.y + 24

    @property
    def middle_tile(self):
        x, y = self.middle_cord
        return y // TILE_HEIGHT, x // TILE_WIDTH

    @property
    def right_bottom(self):
        return self.rect.x + 43, self.rect.y + 43

    @property
    def right_bottom_tile(self):
        x, y = self.right_bottom
        return y // TILE_HEIGHT, x // TILE_WIDTH

    @property
    def ignore_four(self):
        return 4 not in self.wall

    def move_or_turn(self):
        x, y = self.left_top
        if x % TILE_WIDTH == 0 and y % TILE_HEIGHT == 0:
            available_directions = [
                direction for direction in ['R', 'L', 'U', 'D']
                if self.can_move_towards(direction, True)
            ]
            current_tile = self.middle_tile
            target_tile = self.target.middle_tile
            if self.dead and current_tile == self.spawn_tile:
                self.dead = False
                self.scared = False
                self.set_images('alive')
                self.speed = 4
            if self.dead:
                target_tile = self.spawn_tile
                path = get_shortest_path(
                    [[current_tile]],
                    target_tile,
                    ignore_four=self.ignore_four,
                )
                direction = self.get_direction(current_tile, path[1])
                self.facing = direction
            else:
                if random.random() > 0.2:
                    path = get_shortest_path(
                        [[current_tile]],
                        target_tile,
                        ignore_four=self.ignore_four,
                    )
                    if path:
                        direction = self.get_direction(current_tile, path[1])
                        if not self.scared:
                            self.facing = direction
                        else:
                            available_directions.remove(direction)
                            self.facing = random.choice(available_directions)
                    else:
                        self.facing = random.choice(available_directions)
                else:
                    self.facing = random.choice(available_directions)
        self.move()

    @staticmethod
    def get_direction(tile_from, tile_to):
        if tile_from[0] < tile_to[0]:
            return 'D'
        elif tile_from[0] > tile_to[0]:
            return 'U'
        elif tile_from[1] < tile_to[1]:
            return 'R'
        elif tile_from[1] > tile_to[1]:
            return 'L'

    def can_move_towards(self, direction, turning=False):
        x, y = self.left_top
        if not turning or (y % TILE_HEIGHT == 0 and x % TILE_WIDTH == 0):
            if direction == 'R':
                y_tile, x_tile = self.left_top_tile
                return tiles[y_tile][x_tile + 1] not in self.wall
            elif direction == 'L':
                y_tile, x_tile = self.right_bottom_tile
                return tiles[y_tile][x_tile - 1] not in self.wall
            elif direction == 'U':
                y_tile, x_tile = self.right_bottom_tile
                return tiles[y_tile - 1][x_tile] not in self.wall
            elif direction == 'D':
                y_tile, x_tile = self.left_top_tile
                return tiles[y_tile + 1][x_tile] not in self.wall
        return False

    def move(self):
        self.stuck = False
        if not self.can_move_towards(self.facing):
            self.stuck = True
            return False
        if self.facing == 'R':
            self.rect.move_ip(self.speed, 0)
        elif self.facing == 'L':
            self.rect.move_ip(-self.speed, 0)
        if self.facing == 'U':
            self.rect.move_ip(0, -self.speed)
        elif self.facing == 'D':
            self.rect.move_ip(0, self.speed)

    def does_collide(self, sprite):
        return pygame.sprite.collide_mask(self, sprite)

class SmallPill(pygame.sprite.Sprite):
    def __init__(self):
        self.image = load_image('pill.png').subsurface(0, 0, 30, 30)
        self.rect = self.image.get_rect()
        self.rect.center = (45, 45)

    def draw(self, surface, cord):
        self.rect.center = cord
        surface.blit(self.image, self.rect)

class BigPill(pygame.sprite.Sprite):
    def __init__(self):
        self.image = load_image('pill.png').subsurface(30, 0, 40, 30)
        self.rect = self.image.get_rect()
        self.rect.center = (45, 45)
        self.frames_per_image = 30
        self.frame_idx = 0
        self.show_image = True

    def draw(self, surface, cord):
        self.frame_idx += 1
        if self.frame_idx > self.frames_per_image:
            self.frame_idx = 0
            self.show_image = not self.show_image
        if self.show_image:
            self.rect.center = cord
            surface.blit(self.image, self.rect)

# 0 - empty | 1 - small_pill | 2 - big_pill | 3 - wall | 4 - pink wall
tiles = [
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
    [3, 2, 3, 3, 3, 1, 3, 3, 3, 1, 3, 1, 3, 3, 3, 1, 3, 3, 3, 2, 3],
    [3, 1, 3, 3, 3, 1, 3, 3, 3, 1, 3, 1, 3, 3, 3, 1, 3, 3, 3, 1, 3],
    [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
    [3, 1, 3, 3, 3, 1, 3, 1, 3, 3, 3, 3, 3, 1, 3, 1, 3, 3, 3, 1, 3],
    [3, 1, 3, 3, 3, 1, 3, 1, 1, 1, 3, 1, 1, 1, 3, 1, 3, 3, 3, 1, 3],
    [3, 1, 1, 1, 1, 1, 3, 3, 3, 0, 3, 0, 3, 3, 3, 1, 1, 1, 1, 1, 3],
    [3, 3, 3, 3, 3, 1, 3, 0, 0, 0, 0, 0, 0, 0, 3, 1, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 1, 3, 0, 3, 4, 4, 4, 3, 0, 3, 1, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 1, 3, 0, 3, 0, 0, 0, 3, 0, 3, 1, 3, 3, 3, 3, 3],
    [0, 0, 0, 0, 0, 1, 0, 0, 3, 0, 0, 0, 3, 0, 0, 1, 0, 0, 0, 0, 0],
    [3, 3, 3, 3, 3, 1, 3, 0, 3, 3, 3, 3, 3, 0, 3, 1, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 1, 3, 0, 0, 0, 0, 0, 0, 0, 3, 1, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 1, 3, 0, 3, 3, 3, 3, 3, 0, 3, 1, 3, 3, 3, 3, 3],
    [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
    [3, 1, 3, 3, 3, 1, 3, 3, 3, 1, 3, 1, 3, 3, 3, 1, 3, 3, 3, 1, 3],
    [3, 2, 1, 1, 3, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 3, 1, 1, 2, 3],
    [3, 3, 3, 1, 3, 1, 3, 1, 3, 3, 3, 3, 3, 1, 3, 1, 3, 1, 3, 3, 3],
    [3, 1, 1, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 1, 1, 3],
    [3, 1, 3, 3, 3, 3, 3, 3, 3, 1, 3, 1, 3, 3, 3, 3, 3, 3, 3, 1, 3],
    [3, 1, 3, 3, 3, 3, 3, 3, 3, 1, 3, 1, 3, 3, 3, 3, 3, 3, 3, 1, 3],
    [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
]
TILE_WIDTH, TILE_HEIGHT = WIDTH // len(tiles[0]), HEIGHT // len(tiles)

pac_man = Entity()
pac_man.add_images('alive', 'pac_man.png', 8, ('R', 'U', 'L', 'D'))
pac_man.add_images('death', 'pac_man_death.png', 12)
pac_man.set_images('alive')
pac_man.set_rect(10, 17)

enemies = {}
enemies_names = ['blinky', 'clyde', 'inky', 'pinky']
for enemy_name in enemies_names:
    enemies[enemy_name] = Entity(pac_man)
    enemies[enemy_name].add_images('alive', f'{enemy_name}.png', 8, ('R', 'L', 'U', 'D'))
    enemies[enemy_name].add_images('scared', 'ghost_scared.png', 2)
    enemies[enemy_name].add_images('eyes', 'ghost_eyes.png', 4, ('R', 'L', 'U', 'D'))
    enemies[enemy_name].set_images('alive')
    enemies[enemy_name].set_rect(10, 11)

small_pill = SmallPill()
big_pill = BigPill()
game_start = time.time()
ghosts_released = 0
release_time = 5

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            exit()
        elif event.type == pygame.KEYDOWN:
            if event.key == ord('w'):
                pac_man.next_facing = 'U'
            elif event.key == ord('a'):
                pac_man.next_facing = 'L'
            elif event.key == ord('s'):
                pac_man.next_facing = 'D'
            elif event.key == ord('d'):
                pac_man.next_facing = 'R'

    display.blit(map_image, (0, 0))

    time_since_start = time.time() - game_start
    if enemies_names and time_since_start // release_time + 1 > ghosts_released:
        ghosts_released += 1
        enemies[enemies_names.pop()].wall = {3}
    if pac_man.can_move_towards(pac_man.next_facing, True):
        pac_man.facing = pac_man.next_facing
        pac_man.next_facing = None
    if pac_man.god_mode and pac_man.god_mode_till < time.time():
        pac_man.god_mode = False
        pac_man.god_mode_till = None
        for enemy in enemies.values():
            if enemy.scared and not enemy.dead:
                enemy.scared = False
                enemy.set_images('alive')

    if not pac_man.dead:
        pac_man.move()
    pac_man.draw(display)

    pills_left = False
    for y, row in enumerate(tiles):
        for x, val in enumerate(row):
            if val == 1:
                pills_left = True
                cord = x * TILE_WIDTH + 20, y * TILE_HEIGHT + 20
                small_pill.draw(display, cord)
                if pac_man.does_collide(small_pill):
                    tiles[y][x] = 0
            if val == 2:
                pills_left = True
                cord = x * TILE_WIDTH + 15, y * TILE_HEIGHT + 20
                big_pill.draw(display, cord)
                if pac_man.does_collide(big_pill):
                    if 28 <= pac_man.rect.y <= 120 and 28 <= pac_man.rect.x <= 46:
                        tiles[2][1] = 0
                    if 700 <= pac_man.rect.x <= 760 and 600 <= pac_man.rect.y <= 680:
                        tiles[17][19] = 0
                    if 36 <= pac_man.rect.y <= 112 and 700 <= pac_man.rect.x <= 760:
                        tiles[2][19] = 0
                    if 30 <= pac_man.rect.x <= 72 and 640 <= pac_man.rect.y <= 676:
                        tiles[17][1] = 0
                    pac_man.god_mode = True
                    pac_man.god_mode_till = time.time() + 5
                    for enemy in enemies.values():
                        if not enemy.dead:
                            enemy.scared = True
                            enemy.set_images('scared')

    for enemy in enemies.values():
        if not pac_man.dead:
            enemy.move_or_turn()
        enemy.draw(display)
        if pac_man.does_collide(enemy) and not pac_man.dead:
            if not enemy.scared and not enemy.dead:
                pac_man.dead = True
                pac_man.set_images('death')
                pac_man.frames_per_image = 12
            elif not enemy.dead:
                enemy.dead = True
                enemy.set_images('eyes')
                enemy.speed = 8
                enemy.rect.x -= (enemy.rect.x + 4) % TILE_WIDTH
                enemy.rect.y -= (enemy.rect.y + 4) % TILE_HEIGHT

    if pills_left and (not pac_man.dead or not pac_man.rendered_first_cycle):
        pygame.display.update()
        clock.tick(FPS)