"""
Esse é o nosso arquivo principal.
Ele será responsável por lidar com o input do usuário e apresentar o GameState Object atual.
"""
import pygame as pg 
from engine import *

WIDTH = HEIGHT = 800
DIMENSION = 8 # Dimensão de um tabuleiro de xadrez é 8x8
SQUARE_SIZE = HEIGHT // DIMENSION
MAX_FPS = 15 
IMAGES = {}
colors = [(255,255,255),(128,128,128),(0,0,0)]

"""
Função que inicializará um dicionário global de imagens.
Será chamada apenas uma vez em main.
"""
def load_images():
    pieces = ["wp","wR","wN","wB","wK","wQ","bp","bR","bN","bB","bK","bQ"]
    # Podemos acessar uma imagem ao dizer, por exemplo: 'IMAGES["wK"]'
    for piece in pieces:
        IMAGES[piece] = pg.image.load(f"pieces/{piece}.png")
    
"""
O principal direcionador do nosso código.
Ele lidará com o input do usuário e a atualização dos gráficos.
"""
def main():
    pg.init()
    screen = pg.display.set_mode((WIDTH, HEIGHT))
    pg.display.set_caption("Xadrez")
    clock = pg.time.Clock()
    game_state = GameState()
    valid_moves = game_state.get_valid_moves()
    move_made = False # Variável Flag para quando um movimento é feito
    animate = False # Variável Flag para quando devemos animar um movimento
    load_images() # Carregamos as imagens apenas uma vez, antes do while loop
    # Nenhum quadrado é selecionado inicialmente, guardará o registro do último clique do user (tupla: (row, col))
    square_selected = ()
    # Mantém o registro dos cliques do usuário (duas tuplas: [(6,4),(4,4)])
    player_clicks = []
    game_over = False

    running = True
    while running:
        for event in pg.event.get():
            if event.type == pg.QUIT:
                running = False
            # Mouse handler
            elif event.type == pg.MOUSEBUTTONDOWN:
                if not game_over:
                    location = pg.mouse.get_pos() # Localização (x, y) do mouse
                    col = location[0] // SQUARE_SIZE
                    row = location[1] // SQUARE_SIZE
                    if square_selected == (row, col): # Checa se o usuário clicou o mesmo quadrado duas vezes
                        square_selected = () # Remover seleção
                        player_clicks = [] # Limpar os cliques do usuário
                    else:
                        square_selected = (row, col)
                        player_clicks.append(square_selected) # Adicionamos a lista para ambos o 1º e 2º cliques
                    if len(player_clicks) == 2: # Após o segundo clique queremos mover a peça
                        move = Move(player_clicks[0], player_clicks[1], game_state.board)
                        print(move.get_chess_notation())
                        for i in range(len(valid_moves)):
                            if move == valid_moves[i]:
                                game_state.make_move(valid_moves[i])
                                move_made = True
                                animate = True
                                square_selected = () # Resetar os cliques do usuário
                                player_clicks = []
                        if not move_made:
                            player_clicks = [square_selected]
            # Key handler
            elif event.type == pg.KEYDOWN:
                if event.key == pg.K_z: # Desfazer movimento quando 'z' for pressionada
                    game_state.undo_move()
                    move_made = True
                    animate = False
                if event.key == pg.K_r: # Reseta o tabuleiro quando 'r' for pressionada
                    game_state = GameState()
                    valid_moves = game_state.get_valid_moves()
                    square_selected = ()
                    player_clicks = []
                    move_made = False 
                    animate = False
                    game_over = False
        if move_made:
            if animate:
                animate_move(game_state.move_log[-1], screen, game_state.board, clock)
            valid_moves = game_state.get_valid_moves()
            move_made = False
            animate = False
        draw_game_state(screen, game_state, valid_moves, square_selected)
        if game_state.check_mate:
            game_over = True 
            if game_state.white_to_move:
                draw_text(screen, 'Preto Vence por Checkmate')
            else:
                draw_text(screen, 'Branco Vence por Checkmate')
        elif game_state.stale_mate:
            game_over = True 
            draw_text(screen, 'Stalemate')
        clock.tick(MAX_FPS)
        pg.display.flip()

"""
Função que destaca o quadrado selecionado e os movimentos para a peça selecionada
"""
def high_lights_squares(screen, game_state, valid_moves, square_selected):
    if square_selected != ():
        row, col = square_selected
        # square_select é uma peça que pode ser movida
        if game_state.board[row][col][0] == ('w' if game_state.white_to_move else 'b'): 
            surf = pg.Surface((SQUARE_SIZE, SQUARE_SIZE))
            surf.set_alpha(100) # Valor de transparência
            surf.fill(pg.Color('blue'))
            screen.blit(surf, (col*SQUARE_SIZE, row*SQUARE_SIZE))
            # Destacar os movimentos deste quadrado
            surf.fill(pg.Color('yellow'))
            for move in valid_moves:
                if move.start_row == row and move.start_col == col:
                    screen.blit(surf, (move.end_col*SQUARE_SIZE, move.end_row*SQUARE_SIZE))

"""
Responsável por todo o gráfico no estado atual do jogo.
"""
def draw_game_state(screen, game_state, valid_moves, square_selected):
    draw_board(screen) # Desenha os quadrados no tabuleiro
    high_lights_squares(screen, game_state, valid_moves, square_selected)
    draw_pieces(screen, game_state.board) # Desenha as peças em cima dos quadrados

"""
Desenha os quadrados no tabuleiro.
"""
def draw_board(screen):
    # Desenha o tabuleiro xadrez
    for row in range(DIMENSION):
        for col in range(DIMENSION):
            color = colors[((row + col) % 2)]
            pg.draw.rect(screen, color, pg.Rect(col*SQUARE_SIZE, row*SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE))
    # Desenha as linhas pretas entre os quadrados
    for i in range(DIMENSION):
        pg.draw.line(screen, colors[2], (0, i * SQUARE_SIZE), (WIDTH, i * SQUARE_SIZE))
        for j in range(DIMENSION):
            pg.draw.line(screen, colors[2], (j * SQUARE_SIZE, 0), (j * SQUARE_SIZE, WIDTH))

"""
Desenha as peças no tabuleiro usando o GameState.board
"""
def draw_pieces(screen, board):
    for row in range(DIMENSION):
        for col in range(DIMENSION):
            piece = board[row][col]
            if piece != "--": # Verifica se a peça não é um quadrado vazio
                screen.blit(IMAGES[piece], pg.Rect(col*SQUARE_SIZE, row*SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE))

"""
Animar o movimento da peça
"""
def animate_move(move, screen, board, clock):
    delta_row = move.end_row - move.start_row
    delta_col = move.end_col - move.start_col
    frames_per_square = 10 # frames para mover um quadrado
    frame_count = (abs(delta_row) + abs(delta_col)) * frames_per_square
    for frame in range(frame_count + 1):
        row, col = (move.start_row + delta_row * frame/frame_count, move.start_col + delta_col * frame/frame_count)
        draw_board(screen)
        draw_pieces(screen, board)
        # Apagar a peça movida do seu quadrado final
        color = colors[(move.end_row + move.end_col) % 2]
        end_square = pg.Rect(move.end_col * SQUARE_SIZE, move.end_row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE)
        pg.draw.rect(screen, color, end_square)
        # Desenhar a peça capturada no retângulo
        if move.piece_captured != '--':
            screen.blit(IMAGES[move.piece_captured], end_square)
        # Desenhar a peça em movimento
        screen.blit(IMAGES[move.piece_moved], pg.Rect(col*SQUARE_SIZE, row*SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE))
        pg.display.flip()
        clock.tick(60)

"""
Função para desenhar o texto no centro da tela
"""
def draw_text(screen, text):
    font = pg.font.SysFont('ubuntumono', 50, True, False)
    text_object = font.render(text, 0, pg.Color('Black'))
    text_location = pg.Rect(0, 0, WIDTH, HEIGHT).move(WIDTH//2 - text_object.get_width()//2,
                                                      HEIGHT//2 - text_object.get_height()//2)
    screen.blit(text_object, text_location)
    text_object = font.render(text, 0, (235,73,52))
    screen.blit(text_object, text_location.move(2,2))

if __name__ == "__main__":
    main()