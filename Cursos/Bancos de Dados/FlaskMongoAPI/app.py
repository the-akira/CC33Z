from flask import Flask, jsonify, request, render_template
from db import initialize_db
from models import Filme

app = Flask(__name__)

app.config['JSON_AS_ASCII'] = False
app.config['MONGODB_SETTINGS'] = {
    'db': 'filmes',
    'host': 'localhost',
    'port': 27017
}

initialize_db(app)

lista_filmes = [
    {
        'titulo': 'The Shawshank Redemption',
        'generos': ['Drama'],
        'ano_lancamento': 1995
    },
    {
       'titulo': 'The Godfather ',
       'generos': ['Crime', 'Drama'],
       'ano_lancamento': 1997
    }
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api')
def api():
    return {
        'sobre': 'MongoDB API Básica de Filmes',
        'versão': "0.0.2"
    }

@app.route('/listar_filmes')
def listar_filmes():
    return jsonify(lista_filmes)

@app.route('/filmes')
def filmes():
    filmes = Filme.objects()
    return jsonify(filmes)

@app.route('/filmes/<id>')
def filme(id):
    filme = Filme.objects.get(id=id)
    return jsonify(filme)

@app.route('/filmes', methods=['POST'])
def adicionar_filme():
    registro = request.get_json()
    filme = Filme(**registro).save()
    return jsonify(filme)

@app.route('/filmes/<id>', methods=['PUT'])
def atualizar_filme(id):
    registro = request.get_json()
    Filme.objects.get(id=id).update(**registro)
    return {'atualizado': id}, 200

@app.route('/filmes/<id>', methods=['DELETE'])
def deletar_filme(id):
    Filme.objects.get(id=id).delete()
    return {'removido': id}, 200

if __name__ == "__main__":
    app.run(debug=True)