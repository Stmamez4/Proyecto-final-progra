from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from modules.auth.routes import auth_blueprint
from modules.books.routes import books_blueprint
from modules.users.routes import users_blueprint
from modules.loans.routes import loans_blueprint

def create_app():
    app = Flask(__name__)

    app.config.from_pyfile('config.py')

    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://user:pass@localhost:3307/bibliotecadb'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    app.register_blueprint(auth_blueprint, url_prefix='/auth')
    app.register_blueprint(books_blueprint, url_prefix='/books')
    app.register_blueprint(users_blueprint, url_prefix='/users')
    app.register_blueprint(loans_blueprint, url_prefix='/loans')

    return app

db = SQLAlchemy()

class Role(db.Model):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False)

    usuarios = db.relationship('User', back_populates='rol')

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    apellido = db.Column(db.String(100), nullable=False)
    correo = db.Column(db.String(100), unique=True, nullable=False)
    telefono = db.Column(db.String(20))
    numero_identificacion = db.Column(db.String(20), unique=True, nullable=False)
    rol_id = db.Column(db.Integer, db.ForeignKey('roles.id'), nullable=False)

    rol = db.relationship('Role', back_populates='usuarios')
    prestamos = db.relationship('Loan', back_populates='usuario')

class Book(db.Model):
    __tablename__ = 'books'
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(200), nullable=False)
    autor = db.Column(db.String(100), nullable=False)
    editorial = db.Column(db.String(100))
    anio_publicacion = db.Column(db.Integer)
    isbn = db.Column(db.String(13), unique=True, nullable=False)
    cantidad_disponible = db.Column(db.Integer, nullable=False, default=0)

    prestamos = db.relationship('Loan', back_populates='libro')

class Loan(db.Model):
    __tablename__ = 'loans'
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    libro_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
    fecha_prestamo = db.Column(db.Date, nullable=False)
    fecha_devolucion = db.Column(db.Date, nullable=True)

    usuario = db.relationship('User', back_populates='prestamos')
    libro = db.relationship('Book', back_populates='prestamos')

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)