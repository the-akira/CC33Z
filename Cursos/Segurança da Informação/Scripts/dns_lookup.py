import socket

addresses = [
    "google.com",
    "yahoo.com",
    "yandex.com"
]

for addr in addresses:
    ip = socket.gethostbyname(addr)
    print(f"{addr} -> {ip}")