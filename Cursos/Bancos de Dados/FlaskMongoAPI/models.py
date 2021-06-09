from db import db

class Filme(db.Document):
    titulo = db.StringField(required=True, unique=True)
    generos = db.ListField(db.StringField(), required=True)
    ano_lancamento = db.IntField(4, required=True)