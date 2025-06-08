from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from modules.auth.routes import auth_blueprint
from modules.books.routes import books_blueprint
from modules.users.routes import users_blueprint
from modules.loans.routes import loans_blueprint
from flask import Blueprint, request, jsonify

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

auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    return jsonify({"message": "Logeado", "data": data})

@auth_blueprint.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    return jsonify({"message": "Registrado", "data": data})

books_blueprint = Blueprint('books', __name__)

@books_blueprint.route('/', methods=['GET'])
def list_books():
    books = Book.query.all()
    return jsonify([{
        "id": book.id,
        "titulo": book.titulo,
        "autor": book.autor,
        "isbn": book.isbn
    } for book in books])

@books_blueprint.route('/<int:book_id>', methods=['GET'])
def get_book(book_id):
    book = Book.query.get_or_404(book_id)
    return jsonify({
        "id": book.id,
        "titulo": book.titulo,
        "autor": book.autor,
        "isbn": book.isbn
    })

@books_blueprint.route('/', methods=['POST'])
def create_book():
    data = request.get_json()
    new_book = Book(
        titulo=data['titulo'],
        autor=data['autor'],
        editorial=data.get('editorial'),
        anio_publicacion=data.get('anio_publicacion'),
        isbn=data['isbn'],
        cantidad_disponible=data.get('cantidad_disponible', 0)
    )
    db.session.add(new_book)
    db.session.commit()
    return jsonify({"message": "Nuevo libro registrado", "book_id": new_book.id})

@books_blueprint.route('/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    data = request.get_json()
    book = Book.query.get_or_404(book_id)

    book.titulo = data.get('titulo', book.titulo)
    book.autor = data.get('autor', book.autor)
    book.editorial = data.get('editorial', book.editorial)
    book.anio_publicacion = data.get('anio_publicacion', book.anio_publicacion)
    book.isbn = data.get('isbn', book.isbn)
    book.cantidad_disponible = data.get('cantidad_disponible', book.cantidad_disponible)

    db.session.commit()
    return jsonify({"message": "Libro actualizado", "book_id": book.id})

@books_blueprint.route('/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    book = Book.query.get_or_404(book_id)
    db.session.delete(book)
    db.session.commit()
    return jsonify({"message": "Libro eliminado", "book_id": book.id})

users_blueprint = Blueprint('users', __name__)

@users_blueprint.route('/', methods=['GET'])
def list_users():
    users = User.query.all()
    return jsonify([{
        "id": user.id,
        "nombre": user.nombre,
        "apellido": user.apellido,
        "correo": user.correo
    } for user in users])

@users_blueprint.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({
        "id": user.id,
        "nombre": user.nombre,
        "apellido": user.apellido,
        "correo": user.correo
    })

@users_blueprint.route('/', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = User(
        nombre=data['nombre'],
        apellido=data['apellido'],
        correo=data['correo'],
        telefono=data.get('telefono'),
        numero_identificacion=data['numero_identificacion'],
        rol_id=data['rol_id']
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Nuevo usuario creado", "user_id": new_user.id})

@users_blueprint.route('/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    user = User.query.get_or_404(user_id)

    user.nombre = data.get('nombre', user.nombre)
    user.apellido = data.get('apellido', user.apellido)
    user.correo = data.get('correo', user.correo)
    user.telefono = data.get('telefono', user.telefono)
    user.numero_identificacion = data.get('numero_identificacion', user.numero_identificacion)
    user.rol_id = data.get('rol_id', user.rol_id)

    db.session.commit()
    return jsonify({"message": "Usuario actualizado", "user_id": user.id})

@users_blueprint.route('/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "Usuario eliminado", "user_id": user.id})

loans_blueprint = Blueprint('loans', __name__)

@loans_blueprint.route('/', methods=['GET'])
def list_loans():
    loans = Loan.query.all()
    return jsonify([{
        "id": loan.id,
        "usuario_id": loan.usuario_id,
        "libro_id": loan.libro_id,
        "fecha_prestamo": loan.fecha_prestamo,
        "fecha_devolucion": loan.fecha_devolucion
    } for loan in loans])

@loans_blueprint.route('/<int:loan_id>', methods=['GET'])
def get_loan(loan_id):
    loan = Loan.query.get_or_404(loan_id)
    return jsonify({
        "id": loan.id,
        "usuario_id": loan.usuario_id,
        "libro_id": loan.libro_id,
        "fecha_prestamo": loan.fecha_prestamo,
        "fecha_devolucion": loan.fecha_devolucion
    })

@loans_blueprint.route('/', methods=['POST'])
def create_loan():
    data = request.get_json()
    new_loan = Loan(
        usuario_id=data['usuario_id'],
        libro_id=data['libro_id'],
        fecha_prestamo=data['fecha_prestamo'],
        fecha_devolucion=data.get('fecha_devolucion')
    )
    db.session.add(new_loan)
    db.session.commit()
    return jsonify({"message": "Nuevo prestamo registrado", "loan_id": new_loan.id})

@loans_blueprint.route('/<int:loan_id>', methods=['PUT'])
def update_loan(loan_id):
    data = request.get_json()
    loan = Loan.query.get_or_404(loan_id)

    loan.usuario_id = data.get('usuario_id', loan.usuario_id)
    loan.libro_id = data.get('libro_id', loan.libro_id)
    loan.fecha_prestamo = data.get('fecha_prestamo', loan.fecha_prestamo)
    loan.fecha_devolucion = data.get('fecha_devolucion', loan.fecha_devolucion)

    db.session.commit()
    return jsonify({"message": "prestamo actualizado", "loan_id": loan.id})

@loans_blueprint.route('/<int:loan_id>', methods=['DELETE'])
def delete_loan(loan_id):
    loan = Loan.query.get_or_404(loan_id)
    db.session.delete(loan)
    db.session.commit()
    return jsonify({"message": "prestamo eliminado", "loan_id": loan.id})

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)