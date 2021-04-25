import socket

HOST = 'localhost'        
PORT = 12345     
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind((HOST,PORT))
s.listen(1)
print('Aguardando conexão...')
conn, addr = s.accept()
print('Conectado por: {}'.format(addr))

while True:
    data = conn.recv(1024)
    if not data: 
    	break
    print('Dados Recebidos: {}'.format(data))
    conn.sendall(data)

print('Fechando conexão.')
conn.close()