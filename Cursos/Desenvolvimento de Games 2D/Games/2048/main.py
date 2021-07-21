from constants import cp
import numpy as np
import random
import pygame

N = 4

class Py2048:
    def __init__(self):
        self.grid = np.zeros((N, N), dtype=int)
        self.W = 400
        self.H = self.W
        self.spacing = 10

        pygame.init()
        pygame.display.set_caption("2048")
        pygame.font.init()
        self.myfont = pygame.font.SysFont('Comic Sans MS', 45)
        self.screen = pygame.display.set_mode((self.W, self.H))

    def __str__(self):
        return str(self.grid)

    def new_number(self, k=1):
        free_pos = list(zip(*np.where(self.grid == 0)))
        for pos in random.sample(free_pos, k=k):
            if random.random() < .1:
                self.grid[pos] = 4
            else:
                self.grid[pos] = 2

    @staticmethod
    def get_nums(this):
        this_n = this[this != 0]
        this_n_sum = []
        skip = False
        for j in range(len(this_n)):
            if skip:
                skip = False
                continue
            if j != len(this_n) - 1 and this_n[j] == this_n[j + 1]:
                new_n = this_n[j] * 2
                skip = True
            else:
                new_n = this_n[j]
            this_n_sum.append(new_n)
        return np.array(this_n_sum)

    def make_move(self, move):
        for i in range(N):
            if move in 'lr':
                this = self.grid[i, :]
            else:
                this = self.grid[:, i]

            flipped = False
            if move in 'rd':
                flipped = True
                this = this[::-1]

            this_n = self.get_nums(this)
            new_this = np.zeros_like(this)
            new_this[:len(this_n)] = this_n

            if flipped:
                new_this = new_this[::-1]
            if move in 'lr':
                self.grid[i, :] = new_this
            else:
                self.grid[:, i] = new_this

    def draw_game(self):
        self.screen.fill(cp['back'])

        for i in range(N):
            for j in range(N):
                n = self.grid[i][j]

                rect_x = j * self.W // N + self.spacing
                rect_y = i * self.H // N + self.spacing
                rect_w = self.W // N - 2 * self.spacing
                rect_h = self.H // N - 2 * self.spacing

                pygame.draw.rect(self.screen, cp[n], pygame.Rect(rect_x, rect_y, rect_w, rect_h))
                if n == 0:
                    continue
                text_surface = self.myfont.render(f'{n}', True, (0, 0, 0))
                text_rect = text_surface.get_rect(center=(rect_x + rect_w / 2, rect_y + rect_h / 2))
                self.screen.blit(text_surface, text_rect)

    @staticmethod
    def wait_for_key():
        while True:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    return 'q'
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_UP:
                        return 'u'
                    elif event.key == pygame.K_RIGHT:
                        return 'r'
                    elif event.key == pygame.K_LEFT:
                        return 'l'
                    elif event.key == pygame.K_DOWN:
                        return 'd'
                    elif event.key == pygame.K_q or event.key == pygame.K_ESCAPE:
                        return 'q'

    def game_over(self):
        grid_bu = self.grid.copy()
        for move in 'lrud':
            self.make_move(move)
            if not all((self.grid == grid_bu).flatten()):
                self.grid = grid_bu
                return False
        return True

    def play(self):
        self.new_number(k=2)

        while True:
            self.draw_game()
            pygame.display.flip()
            cmd = self.wait_for_key()
            if cmd == 'q':
                break

            old_grid = self.grid.copy()
            self.make_move(cmd)
            print(game.grid)
            if self.game_over():
                print('GAME OVER!')
                break

            if not all((self.grid == old_grid).flatten()):
                self.new_number()

if __name__ == '__main__':
    game = Py2048()
    game.play()