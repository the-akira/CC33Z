from button import Button
import pygame 
import csv 

pygame.init()

# Relógio
clock = pygame.time.Clock()
FPS = 60

# Definir fonte
font = pygame.font.SysFont('Futura', 30)

# Janela do Editor
WIDTH, HEIGHT = 800, 640
LOWER_MARGIN, SIDE_MARGIN = 100, 300
screen = pygame.display.set_mode((WIDTH + SIDE_MARGIN, HEIGHT + LOWER_MARGIN))
pygame.display.set_caption('Level Editor')

# Definir cores
GREEN = (144, 201, 120)
WHITE = (255, 255, 255)
RED = (200, 25, 25)

# Variáveis do Editor
ROWS = 16 
MAX_COLS = 150
TILE_SIZE = HEIGHT // ROWS
TILE_TYPES = 21
level = 0
current_tile = 0
scroll_left = False 
scroll_right = False 
scroll = 0 
scroll_speed = 1

# Carregar imagens
pine1_img = pygame.image.load('images/Background/pine1.png').convert_alpha()
pine2_img = pygame.image.load('images/Background/pine2.png').convert_alpha()
mountain_img = pygame.image.load('images/Background/mountain.png').convert_alpha()
sky_img = pygame.image.load('images/Background/sky_cloud.png').convert_alpha()
# Armazenar tiles em uma lista
img_list = []
for x in range(TILE_TYPES):
    img = pygame.image.load(f'images/Tiles/{x}.png').convert_alpha()
    img = pygame.transform.scale(img, (TILE_SIZE, TILE_SIZE))
    img_list.append(img)
save_img = pygame.image.load('images/Buttons/save_btn.png').convert_alpha()
load_img = pygame.image.load('images/Buttons/load_btn.png').convert_alpha()

# Criar lista vazia de tiles
world_data = []
for row in range(ROWS):
    r = [-1] * MAX_COLS
    world_data.append(r)

# Criar o chão
for tile in range(0, MAX_COLS):
    world_data[ROWS - 1][tile] = 0

# Função para apresentar texto na tela
def draw_text(text, font, text_color, x, y):
    img = font.render(text, True, text_color)
    screen.blit(img, (x, y))

# Criar função para desenhar o fundo
def draw_bg():
    screen.fill(GREEN)
    width = sky_img.get_width()
    for x in range(4):        
        screen.blit(sky_img, ((x * width) - scroll * 0.5, 0))
        screen.blit(mountain_img, ((x * width) - scroll * 0.6, HEIGHT - mountain_img.get_height() - 300))
        screen.blit(pine1_img, ((x * width) - scroll * 0.7, HEIGHT - pine1_img.get_height() - 150))
        screen.blit(pine2_img, ((x * width) - scroll * 0.8, HEIGHT - pine2_img.get_height()))

# Desenhar grid
def draw_grid():
    # Linhas verticais
    for c in range(MAX_COLS + 1):
        pygame.draw.line(screen, WHITE, (c * TILE_SIZE - scroll, 0), (c * TILE_SIZE - scroll, HEIGHT))
    # Linhas horizontais
    for c in range(ROWS + 1):
        pygame.draw.line(screen, WHITE, (0, c * TILE_SIZE), (WIDTH, c * TILE_SIZE))

# Função para desenhar os tiles do mapa
def draw_world():
    for y, row in enumerate(world_data):
        for x, tile in enumerate(row):
            if tile >= 0:
                screen.blit(img_list[tile], (x * TILE_SIZE - scroll, y * TILE_SIZE))

# Criar botões
save_button = Button(WIDTH // 2, HEIGHT + LOWER_MARGIN - 70, save_img, 1)
load_button = Button(WIDTH // 2 + 200, HEIGHT + LOWER_MARGIN - 70, load_img, 1)
# Fazer uma lista de botões
button_list = []
button_col = 0 
button_row = 0
for i in range(len(img_list)):
    tile_button = Button(WIDTH + (75 * button_col) + 50, (75 * button_row) + 50, img_list[i], 1)
    button_list.append(tile_button) 
    button_col += 1
    if button_col == 3:
        button_row += 1 
        button_col = 0

run = True 
while run:
    clock.tick(FPS)
    draw_bg()
    draw_grid()
    draw_world()
    draw_text(f'Level: {level}', font, WHITE, 10, HEIGHT + LOWER_MARGIN - 90)
    draw_text('Press UP or DOWN to change level', font, WHITE, 10, HEIGHT + LOWER_MARGIN - 60)
    # Salvar e carregar dados
    if save_button.draw(screen):
        # Salvar os dados do level
        with open(f'levels/level{level}_data.csv', 'w', newline='') as csvfile:
            writer = csv.writer(csvfile, delimiter=',')
            for row in world_data:
                writer.writerow(row)
    if load_button.draw(screen):
        # Carregar dados do level
        # Resetar scroll de volta para o início do level
        scroll = 0 
        try:
            with open(f'levels/level{level}_data.csv', newline='') as csvfile:
                reader = csv.reader(csvfile, delimiter=',')
                for x, row in enumerate(reader):
                    for y, tile in enumerate(row):
                        world_data[x][y] = int(tile)
        except FileNotFoundError:
            print('Arquivo não encontrado!')
    # Desenhar painel de tiles
    pygame.draw.rect(screen, GREEN, (WIDTH, 0, SIDE_MARGIN, HEIGHT))
    # Escolher um tile
    button_count = 0
    for button_count, i in enumerate(button_list):
        if i.draw(screen):
            current_tile = button_count
    # Destacar o tile selecionado
    pygame.draw.rect(screen, RED, button_list[current_tile].rect, 3)
    # Ajustar o mapa
    if scroll_left == True and scroll > 0:
        scroll -= 5 * scroll_speed
    if scroll_right == True and scroll < (MAX_COLS * TILE_SIZE) - WIDTH:
        scroll += 5 * scroll_speed
    # Adicionar novos tiles na tela
    # Obter a posição do mouse 
    pos = pygame.mouse.get_pos()
    x = (pos[0] + scroll) // TILE_SIZE
    y = pos[1] // TILE_SIZE
    # Checar se as coordenadas estão na área dos tiles 
    if pos[0] < WIDTH and pos[1] < HEIGHT:
        # Atualizar o valor do tile 
        if pygame.mouse.get_pressed()[0] == 1:
            if world_data[y][x] != current_tile:
                world_data[y][x] = current_tile
        if pygame.mouse.get_pressed()[2] == 1:
            world_data[y][x] = -1
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            run = False
        # Teclas pressionadas
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_UP:
                level += 1
            if event.key == pygame.K_DOWN and level > 0:
                level -= 1
            if event.key == pygame.K_LEFT:
                scroll_left = True
            if event.key == pygame.K_RIGHT:
                scroll_right = True
            if event.key == pygame.K_LSHIFT:
                scroll_speed = 5
        if event.type == pygame.KEYUP:
            if event.key == pygame.K_LEFT:
                scroll_left = False
            if event.key == pygame.K_RIGHT:
                scroll_right = False
            if event.key == pygame.K_LSHIFT:
                scroll_speed = 1
    pygame.display.update()

pygame.quit()