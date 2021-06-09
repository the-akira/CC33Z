# Instalação

Dentro do diretório principal do FlaskMongoAPI:

Crie um ambiente virtual:

```
python3 -m venv venv
```

Ative-o:

```
source venv/bin/activate
```

ou no Windows:

```
venv\Scripts\activate
```

Instale as bibliotecas do projeto:

```
pip install -r requirements.txt
```

Execute o arquivo `app.py`:

```
python app.py
```

Navegue até a página principal `http://127.0.0.1:5000/`.

## Requisições

Solicitando, inserindo, atualizando e removendo dados da API.

### GET

```
curl -X GET http://localhost:5000/filmes
curl -X GET http://localhost:5000/filmes/60c0de2ac976bc0ae8a7da0b
```

### POST

```
curl -d '{"titulo":"Akira","generos":["Dystopian"],"ano_lancamento":1984}' -H "Content-Type: application/json" -X POST http://localhost:5000/filmes
```

### UPDATE

```
curl -d '{"titulo":"Akira","generos":["Dystopian","Anime"],"ano_lancamento":1988}' -H "Content-Type: application/json" -X PUT http://localhost:5000/filmes/60c0de2ac976bc0ae8a7da0b
```

### DELETE

```
curl -H "Content-Type: application/json" -X DELETE http://localhost:5000/filmes/60c0dd5fc976bc0ae8a7da0a
```