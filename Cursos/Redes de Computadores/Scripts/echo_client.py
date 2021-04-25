import socket

HOST = 'localhost'
PORT = 12345                  
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((HOST,PORT))
s.sendall(b'Hello, World!')
data = s.recv(1024)
s.close()
print('Recebido: {}'.format(repr(data)))