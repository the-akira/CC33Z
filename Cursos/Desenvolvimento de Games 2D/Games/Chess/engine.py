"""
Essa classe é responsável por armazenar toda a informação sobre o estado atual do jogo de xadrez.
Também será responsável por determinar os movimentos válidos no estado atual.
Também será capaz de manter um registro de movimentos.
"""

class GameState:
    def __init__(self):
        # Tabuleiro é uma lista 2D 8x8, cada elemento da lista tem dois caracteres
        # O primeiro caracter representa a cor da peça 'b' = black e 'w' = white
        # O segundo caracter representa o tipo de peça: 
        # 'R' = 'Rook', 'N' = 'kNight', 'B' = 'Bishop', 'Q' = 'Queen', 'K' = 'King', 'p' = 'Pawn'
        # '--' representa um espaço vazio sem peça.
        self.board = [
            ["bR","bN","bB","bQ","bK","bB","bN","bR"],
            ["bp","bp","bp","bp","bp","bp","bp","bp"],
            ["--","--","--","--","--","--","--","--"],
            ["--","--","--","--","--","--","--","--"],
            ["--","--","--","--","--","--","--","--"],
            ["--","--","--","--","--","--","--","--"],
            ["wp","wp","wp","wp","wp","wp","wp","wp"],
            ["wR","wN","wB","wQ","wK","wB","wN","wR"],
        ]
        self.move_functions = {'p': self.get_pawn_moves, 'R': self.get_rook_moves, 'N': self.get_knight_moves,
                               'B': self.get_bishop_moves, 'Q': self.get_queen_moves, 'K': self.get_king_moves}
        self.white_to_move = True
        self.move_log = []
        self.white_king_location = (7,4)
        self.black_king_location = (0,4)
        self.check_mate = False
        self.stale_mate = False
        self.en_passant_possible = () # Coordenadas para o quadrado onde uma captura en passant é possível
        self.current_castling_rights = CastleRights(True, True, True, True)
        self.castle_rights_log = [CastleRights(self.current_castling_rights.wks, self.current_castling_rights.bks,
                                               self.current_castling_rights.wqs, self.current_castling_rights.bqs)]

    """
    Recebe um movimento como parâmetro e executa ele 
    """
    def make_move(self, move):
        self.board[move.start_row][move.start_col] = "--"
        self.board[move.end_row][move.end_col] = move.piece_moved
        self.move_log.append(move) # Registar o movimento
        self.white_to_move = not self.white_to_move # Alterar o turno
        # Atualizar a localização do rei (se movido)
        if move.piece_moved == 'wK':
            self.white_king_location = (move.end_row, move.end_col)
        elif move.piece_moved == 'bK':
            self.black_king_location = (move.end_row, move.end_col)
        # Promoção do peão
        if move.is_pawn_promotion:
            self.board[move.end_row][move.end_col] = move.piece_moved[0] + 'Q'
        # Movimento En Passant
        if move.is_en_passant_move:
            self.board[move.start_row][move.end_col] = '--' # Capturando o peão
        # Atualizar a variável en_passant_possible
        # Apenas quando o peão avança dois quadrados
        if move.piece_moved[1] == 'p' and abs(move.start_row - move.end_row) == 2:
            self.en_passant_possible = ((move.start_row + move.end_row)//2, move.start_col) 
        else:
            self.en_passant_possible = ()
        # Movimento Castle
        if move.is_castle_move:
            if move.end_col - move.start_col == 2: # Castle do lado do rei
                self.board[move.end_row][move.end_col-1] = self.board[move.end_row][move.end_col+1] # Move a torre
                self.board[move.end_row][move.end_col+1] = '--' # Apagar torre antiga
            else: # Castle do lado da rainha
                self.board[move.end_row][move.end_col+1] = self.board[move.end_row][move.end_col-2] # Move a torre
                self.board[move.end_row][move.end_col-2] = '--' # Apagar torre antiga
        # Atualizar castling rights - quando é um movimento de torre ou rei
        self.update_castle_rights(move)
        self.castle_rights_log.append(CastleRights(self.current_castling_rights.wks, self.current_castling_rights.bks,
                                               self.current_castling_rights.wqs, self.current_castling_rights.bqs))

    """
    Desfaz o último movimento executado
    """
    def undo_move(self):
        if len(self.move_log) != 0: # Garantir que há um movimento para desfazer
            move = self.move_log.pop()
            self.board[move.start_row][move.start_col] = move.piece_moved
            self.board[move.end_row][move.end_col] = move.piece_captured
            self.white_to_move = not self.white_to_move # Alterar o turno
            # Atualizar a localização do rei (se movido)
            if move.piece_moved == 'wK':
                self.white_king_location = (move.start_row, move.start_col)
            elif move.piece_moved == 'bK':
                self.black_king_location = (move.start_row, move.start_col)
            # Desfazer en passant
            if move.is_en_passant_move:
                self.board[move.end_row][move.end_col] = '--' # Deixar o quadrado de aterrissagem branco
                self.board[move.start_row][move.end_col] = move.piece_captured
                self.en_passant_possible = (move.end_row, move.end_col)
            # Desfazer um avanço de peão de dois quadrados
            if move.piece_moved[1] == 'p' and abs(move.start_row - move.end_row) == 2:
                self.en_passant_possible = ()
            # Desfazer castling rights
            self.castle_rights_log.pop() # Nos livramos do novo castle rights do movimento que estamos desfazendo
            # Setamos o castle rights atual para o último da lista
            new_rights = self.castle_rights_log[-1]
            self.current_castling_rights = CastleRights(new_rights.wks, new_rights.bks, new_rights.wqs, new_rights.bqs) 
            # Desfazer movimento castle
            if move.is_castle_move:
                if move.end_col - move.start_col == 2: # Lado do rei
                    self.board[move.end_row][move.end_col+1] = self.board[move.end_row][move.end_col-1]
                    self.board[move.end_row][move.end_col-1] = '--'
                else: # Lado da rainha
                    self.board[move.end_row][move.end_col-2] = self.board[move.end_row][move.end_col+1]
                    self.board[move.end_row][move.end_col+1] = '--'

    """
    Atualiza os castle rights dado um movimento
    """
    def update_castle_rights(self, move):
        if move.piece_moved == 'wK':
            self.current_castling_rights.wks = False
            self.current_castling_rights.wqs = False
        elif move.piece_moved == 'bK':
            self.current_castling_rights.bks = False
            self.current_castling_rights.bqs = False
        elif move.piece_moved == 'wR':
            if move.start_row == 7:
                if move.start_col == 0: # Torre esquerda
                    self.current_castling_rights.wqs = False
                elif move.start_col == 7: # Torre direita
                    self.current_castling_rights.wks = False
        elif move.piece_moved == 'bR':
            if move.start_row == 0:
                if move.start_col == 0: # Torre esquerda
                    self.current_castling_rights.bqs = False
                elif move.start_col == 7: # Torre direita
                    self.current_castling_rights.bks = False

    """
    Todos os movimentos considerando quando o Rei está em 'check'
    """
    def get_valid_moves(self):
        temp_en_passant_possible = self.en_passant_possible
        temp_castle_rights = CastleRights(self.current_castling_rights.wks, self.current_castling_rights.bks,
                                          self.current_castling_rights.wqs, self.current_castling_rights.bqs)
        # 1) Gerar todos os movimentos possíveis
        moves = self.get_all_possible_moves()
        if self.white_to_move:
            self.get_castle_moves(self.white_king_location[0], self.white_king_location[1], moves)
        else:
            self.get_castle_moves(self.black_king_location[0], self.black_king_location[1], moves)
        # 2) Para cada movimento, fazer o movimento
        for i in range(len(moves)-1, -1, -1):
            self.make_move(moves[i])
            # 3) Gerar todos os movimentos do oponente
            # 4) Para cada movimento do oponente, veja se ele ataca o seu Rei
            self.white_to_move = not self.white_to_move
            if self.in_check():
                # 5) Se eles estão atacando o seu Rei, não é um movimento válido
                moves.remove(moves[i])
            self.white_to_move = not self.white_to_move
            self.undo_move()
        if len(moves) == 0: # Ou é check mate ou stale mate
            if self.in_check():
                self.check_mate = True 
            else:
                self.stale_mate = True 
        else:
            self.check_mate = False
            self.stale_mate = False
        self.en_passant_possible = temp_en_passant_possible
        self.current_castling_rights = temp_castle_rights
        return moves

    """
    Determina se o jogador atual está em 'check'
    """
    def in_check(self):
        if self.white_to_move:
            return self.square_under_attack(self.white_king_location[0], self.white_king_location[1])
        else:
            return self.square_under_attack(self.black_king_location[0], self.black_king_location[1])

    """
    Determina se o inimigo pode atacar o quadrado row(linha), col(coluna)
    """
    def square_under_attack(self, row, col):
        self.white_to_move = not self.white_to_move # Alterar para o turno do oponente
        opp_moves = self.get_all_possible_moves()
        self.white_to_move = not self.white_to_move # Alterar turnos novamente
        for move in opp_moves:
            if move.end_row == row and move.end_col == col: # Quadrado está sob ataque
                return True 
        return False

    """
    Todos os movimentos sem considerar que o Rei'está em 'check'
    """
    def get_all_possible_moves(self):
        moves = []
        for row in range(len(self.board)): # Número de linhas
            for col in range(len(self.board[row])): # Número de colunas em uma linha
                turn = self.board[row][col][0]
                if (turn == 'w' and self.white_to_move) or (turn == 'b' and not self.white_to_move):
                    piece = self.board[row][col][1]
                    # Chama a função de movimento apropriada baseada no tipo de peça
                    self.move_functions[piece](row, col, moves) 
        return moves

    """
    Obtém todos os movimentos de peão para um peão localizado em linha, coluna e
    adiciona os movimentos à listas
    """
    def get_pawn_moves(self, row, col, moves):
        if self.white_to_move: # Peão branco se movimenta
            if self.board[row-1][col] == '--': # Peão avança um quadrado
                moves.append(Move((row, col), (row-1, col), self.board))
                if row == 6 and self.board[row-2][col] == '--': # Peão avança dois quadrados
                    moves.append(Move((row, col), (row-2, col), self.board))
            if col-1 >= 0: # Captura para a esquerda
                if self.board[row-1][col-1][0] == 'b': # Peça inimiga para capturar
                    moves.append(Move((row, col), (row-1, col-1), self.board))
                elif (row-1, col-1) == self.en_passant_possible:
                    moves.append(Move((row, col), (row-1, col-1), self.board, is_en_passant_move=True))
            if col+1 <= 7: # Captura para a direita
                if self.board[row-1][col+1][0] == 'b': # Peça inimiga para capturar
                    moves.append(Move((row, col), (row-1, col+1), self.board))
                elif (row-1, col+1) == self.en_passant_possible:
                    moves.append(Move((row, col), (row-1, col+1), self.board, is_en_passant_move=True))
        else: # Peão preto se movimenta
            if self.board[row+1][col] == '--': # Peão avança um quadrado
                moves.append(Move((row, col), (row+1, col), self.board))
                if row == 1 and self.board[row+2][col] == '--': # Peão avança dois quadrados
                    moves.append(Move((row, col), (row+2, col), self.board))
            if col-1 >= 0: # Captura para a esquerda
                if self.board[row+1][col-1][0] == 'w':
                    moves.append(Move((row, col), (row+1, col-1), self.board))
                elif (row+1, col-1) == self.en_passant_possible:
                    moves.append(Move((row, col), (row+1, col-1), self.board, is_en_passant_move=True))
            if col+1 <= 7: # Captura para a direita
                if self.board[row+1][col+1][0] == 'w':
                    moves.append(Move((row, col), (row+1, col+1), self.board))
                elif (row+1, col+1) == self.en_passant_possible:
                    moves.append(Move((row, col), (row+1, col+1), self.board, is_en_passant_move=True))

    """
    Obtém todos os movimentos de torre para uma torre localizado em linha, coluna e
    adiciona os movimentos à listas
    """
    def get_rook_moves(self, row, col, moves):
        directions = ((-1,0), (0,-1), (1,0), (0,1)) # cima, esquerda, baixo, direita
        enemy_color = 'b' if self.white_to_move else 'w'
        for d in directions:
            for i in range(1,8): # Torre move no máximo sete quadrados
                end_row = row + d[0] * i 
                end_col = col + d[1] * i 
                if 0 <= end_row < 8 and 0 <= end_col < 8: # No tabuleiro
                    end_piece = self.board[end_row][end_col]
                    if end_piece == '--': # Espaço vazio válido
                        moves.append(Move((row,col), (end_row,end_col), self.board))
                    elif end_piece[0] == enemy_color: # Peça inimiga válida
                        moves.append(Move((row,col), (end_row,end_col), self.board))
                        break
                    else: # Peça amiga inválida
                        break
                else: # Fora do tabuleiro
                    break

    """
    Obtém todos os movimentos de cavalo para um cavalo localizado em linha, coluna e
    adiciona os movimentos à listas
    """
    def get_knight_moves(self, row, col, moves):
        knight_moves = ((-2,-1),(-2,1),(-1,-2),(-1,2),(1,-2),(1,2),(2,-1),(2,1))
        ally_color = 'w' if self.white_to_move else 'b'
        for km in knight_moves:
            end_row = row + km[0]
            end_col = col + km[1]
            if 0 <= end_row < 8 and 0 <= end_col < 8:
                end_piece = self.board[end_row][end_col]
                if end_piece[0] != ally_color: # Não é uma peça aliada (é inimigo ou espaço vazio)
                    moves.append(Move((row, col), (end_row, end_col), self.board))

    """
    Obtém todos os movimentos de bispo para um bispo localizado em linha, coluna e
    adiciona os movimentos à listas
    """
    def get_bishop_moves(self, row, col, moves):
        directions = ((-1,-1), (-1,1), (1,-1), (1,1)) 
        enemy_color = 'b' if self.white_to_move else 'w'
        for d in directions:
            for i in range(1,8): # Bispo move no máximo sete quadrados
                end_row = row + d[0] * i 
                end_col = col + d[1] * i 
                if 0 <= end_row < 8 and 0 <= end_col < 8: # No tabuleiro
                    end_piece = self.board[end_row][end_col]
                    if end_piece == '--': # Espaço vazio válido
                        moves.append(Move((row,col), (end_row,end_col), self.board))
                    elif end_piece[0] == enemy_color: # Peça inimiga válida
                        moves.append(Move((row,col), (end_row,end_col), self.board))
                        break
                    else: # Peça amiga inválida
                        break
                else: # Fora do tabuleiro
                    break

    """
    Obtém todos os movimentos de rainha para uma rainha localizado em linha, coluna e
    adiciona os movimentos à listas
    """
    def get_queen_moves(self, row, col, moves):
        self.get_rook_moves(row, col, moves)
        self.get_bishop_moves(row, col, moves)

    """
    Obtém todos os movimentos de rei para um rei localizado em linha, coluna e
    adiciona os movimentos à listas
    """
    def get_king_moves(self, row, col, moves):
        king_moves = ((-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1))
        ally_color = 'w' if self.white_to_move else 'b'
        for i in range(8):
            end_row = row + king_moves[i][0]
            end_col = col + king_moves[i][1]
            if 0 <= end_row < 8 and 0 <= end_col < 8:
                end_piece = self.board[end_row][end_col]
                if end_piece[0] != ally_color: # Não é uma peça aliada (é inimigo ou espaço vazio)
                    moves.append(Move((row, col), (end_row, end_col), self.board))

    """
    Gerá todos os castle moves válidos para o rei em (linha, coluna) e adiciona eles para a lista de movimentos
    """
    def get_castle_moves(self, row, col, moves):
        if self.square_under_attack(row, col):
            return # Impossível fazer castle em 'check'
        if (self.white_to_move and self.current_castling_rights.wks) or (not self.white_to_move and self.current_castling_rights.bks):
            self.get_king_side_castle_moves(row, col, moves)
        if (self.white_to_move and self.current_castling_rights.wqs) or (not self.white_to_move and self.current_castling_rights.bqs):
            self.get_queen_side_castle_moves(row, col, moves)

    def get_king_side_castle_moves(self, row, col, moves):
        if self.board[row][col+1] == '--' and self.board[row][col+2] == '--':
            if not self.square_under_attack(row, col+1) and not self.square_under_attack(row, col+2):
                moves.append(Move((row,col),(row,col+2), self.board, is_castle_move=True))

    def get_queen_side_castle_moves(self, row, col, moves):
        if self.board[row][col-1] == '--' and self.board[row][col-2] == '--' and self.board[row][col-3] == '--':
            if not self.square_under_attack(row, col-1) and not self.square_under_attack(row, col-2):
                moves.append(Move((row,col),(row,col-2), self.board, is_castle_move=True))

class CastleRights:
    def __init__(self, wks, bks, wqs, bqs):
        self.wks = wks
        self.bks = bks 
        self.wqs = wqs 
        self.bqs = bqs

class Move:
    rank_to_rows = {"1":7,"2":6,"3":5,"4":4,"5":3,"6":2,"7":1,"8":0}
    rows_to_ranks = {v:k for k,v in rank_to_rows.items()}
    files_to_cols = {"a":0,"b":1,"c":2,"d":3,"e":4,"f":5,"g":6,"h":7}
    cols_to_files = {v:k for k,v in files_to_cols.items()}

    def __init__(self, start_square, end_square, board, is_en_passant_move=False, is_castle_move=False):
        self.start_row = start_square[0]
        self.start_col = start_square[1]
        self.end_row = end_square[0]
        self.end_col = end_square[1]
        self.piece_moved = board[self.start_row][self.start_col]
        self.piece_captured = board[self.end_row][self.end_col]
        self.is_pawn_promotion = False
        if (self.piece_moved == 'wp' and self.end_row == 0) or (self.piece_moved == 'bp' and self.end_row == 7):
            self.is_pawn_promotion = True
        self.is_en_passant_move = is_en_passant_move
        if self.is_en_passant_move:
            self.piece_captured = 'wp' if self.piece_moved == 'bp' else 'bp'
        self.is_castle_move = is_castle_move
        self.move_id = self.start_row * 1000 + self.start_col * 100 + self.end_row * 10 + self.end_col

    """
    Sobrescrever (Overriding) do método equals
    """
    def __eq__(self, other):
        if isinstance(other, Move):
            return self.move_id == other.move_id
        return False

    def get_chess_notation(self):
        return self.get_rank_file(self.start_row, self.start_col) + self.get_rank_file(self.end_row, self.end_col)

    def get_rank_file(self, row, col):
        return self.cols_to_files[col] + self.rows_to_ranks[row]