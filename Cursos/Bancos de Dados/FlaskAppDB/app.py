from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 
db = SQLAlchemy(app)

class Tutorial(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(100))
    autor = db.Column(db.String(100))
    url = db.Column(db.String(250))

    def __repr__(self):
        return f"Titulo = {self.titulo}"

@app.route('/')
def index():
    tutoriais = Tutorial.query.all()
    return render_template('index.html', tutoriais=tutoriais)

@app.route("/adicionar", methods=["POST"])
def adicionar():
    titulo = request.form.get("titulo")
    autor = request.form.get("autor")
    url = request.form.get("url")
    novo_tutorial = Tutorial(titulo=titulo, autor=autor, url=url)
    db.session.add(novo_tutorial)
    db.session.commit()
    return redirect(url_for("index"))

@app.route("/deletar/<int:tutorial_id>")
def deletar(tutorial_id):
    tutorial = Tutorial.query.filter_by(id=tutorial_id).first()
    db.session.delete(tutorial)
    db.session.commit()
    return redirect(url_for("index"))

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)