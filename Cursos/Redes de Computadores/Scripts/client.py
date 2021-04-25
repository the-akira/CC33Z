import socket

def client_program():
    host = socket.gethostname() # já que ambos os códigos rodam no mesmo pc
    port = 5000 # número de porta do servidor

    client_socket = socket.socket() # instância
    client_socket.connect((host, port)) # conecta ao servidor

    message = input("-> ") # recebe input

    while message.lower().strip() != 'bye':
        client_socket.send(message.encode()) # envia mensagem
        data = client_socket.recv(1024).decode() #recebe resposta

        print('Received from server: {}'.format(data)) # apresenta no terminal

        message = input("-> ") # recebe input novamente

    client_socket.close() # fecha a conexão

if __name__ == '__main__':
    client_program()