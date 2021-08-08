import pygame 

class Button:
    def __init__(self, surface, x, y, image, size_x, size_y):
        self.image = pygame.transform.scale(image, (size_x, size_y))
        self.rect = self.image.get_rect()
        self.rect.topleft = (x, y)
        self.clicked = False
        self.surface = surface

    def draw(self):
        action = False
        # Obter a posição do mouse
        pos = pygame.mouse.get_pos()
        # Checar por mouseover e condições de clique
        if self.rect.collidepoint(pos):
            if pygame.mouse.get_pressed()[0] == 1 and self.clicked == False:
                action = True
                self.clicked = True
        if pygame.mouse.get_pressed()[0] == 0:
            self.clicked = False
        # Desenhar o botão
        self.surface.blit(self.image, (self.rect.x, self.rect.y))
        return action