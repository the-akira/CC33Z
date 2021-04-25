import socket

def server_program():
    host = socket.gethostname() # obtém o hostname
    port = 5000  # inicia a porta

    server_socket = socket.socket()  # obtém instância
    server_socket.bind((host, port)) # faz bind do endereço de host e port 
    print("Aguardando Conexão...")

    # configura quantos clientes o server pode ouvir simultaneamente
    server_socket.listen(2)
    conn, address = server_socket.accept() # aceita nova conexão
    print("Conexão de: {}".format(str(address)))
    while True:
        # recebe stream de dados. não aceitará pacote de dados maior que 1024 bytes
        data = conn.recv(1024).decode()
        if not data:
            # Se dados não forem recebidos: break
            break
        print("Do usuário conectado: {}".format(str(data)))
        data = input('-> ')
        conn.send(data.encode()) # Envia dados para o client

    conn.close() # Fecha a conexão

if __name__ == '__main__':
    server_program()