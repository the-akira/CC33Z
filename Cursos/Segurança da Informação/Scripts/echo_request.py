import subprocess
import sys

address = "www.tibia.com"

try:
    for ping in range(1,5):  
        res = subprocess.call(['ping', '-c', '3', address])
        if res == 0:
            print(f"ping to {address} OK")
        elif res == 2:
            print(f"Sem resposta de {address}")
        else:
            print(f"ping para {address} falhou!")
except KeyboardInterrupt:
     print("Saindo do Programa...")
     sys.exit()