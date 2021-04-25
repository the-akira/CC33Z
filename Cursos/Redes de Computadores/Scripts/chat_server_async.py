import asyncio

writers = []

def forward(writer, addr, message):
    for w in writers:
        if w != writer:
            w.write(f"{addr!r}: {message!r}\n".encode())

async def handle(reader, writer):
    writers.append(writer)
    addr = writer.get_extra_info('peername')
    message = f"{addr!r} está conectado!"
    print(message)
    forward(writer, addr, message)
    while True:
        data = await reader.read(100)
        message = data.decode().strip()
        forward(writer, addr, message)
        await writer.drain()
        if message == "exit":
            message = f"{addr!r} deseja fechar a conexão."
            print(message)
            forward(writer, "Servidor", message)
            break
    writers.remove(writer)
    writer.close()

async def main():
    server = await asyncio.start_server(handle, '127.0.0.1', 8888)
    addr = server.sockets[0].getsockname()
    print(f'Servindo no endereço: {addr}')
    async with server:
        await server.serve_forever()

asyncio.run(main())
# comando para conectar os clientes: 
# telnet localhost 8888