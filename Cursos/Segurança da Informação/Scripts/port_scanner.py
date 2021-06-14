import socket
import sys

host = 'scanme.nmap.org'
target = socket.gethostbyname(host) 
   
try:
    for port in range(1,65535):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        socket.setdefaulttimeout(1)
        result = s.connect_ex((target,port))
        if result == 0:
            print("Porta {} está aberta".format(port))
        s.close()
except socket.gaierror:
        print("Hostname não pode ser resolvido")
        sys.exit()
except socket.error:
        print("Servidor não está respondendo")
        sys.exit()
except KeyboardInterrupt:
        print("Saindo do Programa...")
        sys.exit()