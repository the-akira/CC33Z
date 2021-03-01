import json

musica = '{"nome":"Empty Spaces", "artista": "Pink Floyd"}'
m = json.loads(musica)
print(m["artista"])

musica = {"nome":"Time", "artista": "Pink Floyd"}
m = json.dumps(musica)
print(m)