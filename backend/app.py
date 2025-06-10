from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from modules.auth.routes import auth_blueprint
from modules.books.routes import books_blueprint
from modules.users.routes import users_blueprint
from modules.loans.routes import loans_blueprint
from flask import Blueprint, request, jsonify
from flask_marshmallow import Marshmallow
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from flask_migrate import Migrate

db = SQLAlchemy()
ma = Marshmallow()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    app.config.from_pyfile('config.py')

    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://user:pass@localhost:3307/bibliotecadb'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    app.config['JWT_SECRET_KEY'] = 'supersecretkey'
    jwt.init_app(app)

    db.init_app(app)
    ma.init_app(app)
    migrate.init_app(app, db) 

    app.register_blueprint(auth_blueprint, url_prefix='/auth')
    app.register_blueprint(books_blueprint, url_prefix='/books')
    app.register_blueprint(users_blueprint, url_prefix='/users')
    app.register_blueprint(loans_blueprint, url_prefix='/loans')
    from modules.reports.routes import reports_blueprint
    app.register_blueprint(reports_blueprint, url_prefix='/reports')

    return app



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
    contrasena = db.Column(db.String(200), nullable=False)

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


class RoleSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Role

    id = ma.auto_field()
    nombre = ma.auto_field()

class UserSchema(ma.SQLAlchemySchema):
    class Meta:
        model = User

    id = ma.auto_field()
    nombre = ma.auto_field()
    apellido = ma.auto_field()
    correo = ma.auto_field()
    telefono = ma.auto_field()
    numero_identificacion = ma.auto_field()
    rol_id = ma.auto_field()

class BookSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Book

    id = ma.auto_field()
    titulo = ma.auto_field()
    autor = ma.auto_field()
    editorial = ma.auto_field()
    anio_publicacion = ma.auto_field()
    isbn = ma.auto_field()
    cantidad_disponible = ma.auto_field()

class LoanSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Loan

    id = ma.auto_field()
    usuario_id = ma.auto_field()
    libro_id = ma.auto_field()
    fecha_prestamo = ma.auto_field()
    fecha_devolucion = ma.auto_field()

role_schema = RoleSchema()
user_schema = UserSchema()
users_schema = UserSchema(many=True)
book_schema = BookSchema()
books_schema = BookSchema(many=True)
loan_schema = LoanSchema()
loans_schema = LoanSchema(many=True)

auth_blueprint = Blueprint('auth', __name__)

from werkzeug.security import check_password_hash

@auth_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    correo = data.get('correo')
    password = data.get('password')
    user = User.query.filter_by(correo=correo).first()
    if user and check_password_hash(user.contrasena, password):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    return jsonify({"msg": "Credenciales inválidas"}), 401

@auth_blueprint.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'])
    new_user = User(
        nombre=data['nombre'],
        apellido=data['apellido'],
        correo=data['correo'],
        telefono=data.get('telefono'),
        numero_identificacion=data['numero_identificacion'],
        rol_id=data['rol_id'],
        contrasena=hashed_password
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Registrado", "user_id": new_user.id})

books_blueprint = Blueprint('books', __name__)

@books_blueprint.route('/', methods=['GET'])
@jwt_required()
def list_books():
    books = Book.query.all()
    return books_schema.jsonify(books)

@books_blueprint.route('/<int:book_id>', methods=['GET'])
@jwt_required()
def get_book(book_id):
    book = Book.query.get_or_404(book_id)
    return book_schema.jsonify(book) 

@books_blueprint.route('/', methods=['POST'])
@jwt_required()
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
@jwt_required()
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
@jwt_required()
def delete_book(book_id):
    book = Book.query.get_or_404(book_id)
    db.session.delete(book)
    db.session.commit()
    return jsonify({"message": "Libro eliminado", "book_id": book.id})

users_blueprint = Blueprint('users', __name__)

@users_blueprint.route('/', methods=['GET'])
@jwt_required()
def list_users():
    users = User.query.all()
    return users_schema.jsonify(users)

@users_blueprint.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return user_schema.jsonify(user)

@users_blueprint.route('/', methods=['POST'])
@jwt_required()
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
@jwt_required()
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
@jwt_required()
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "Usuario eliminado", "user_id": user.id})

loans_blueprint = Blueprint('loans', __name__)

@loans_blueprint.route('/', methods=['GET'])
@jwt_required()
def list_loans():
    loans = Loan.query.all()
    return loans_schema.jsonify(loans)

@loans_blueprint.route('/<int:loan_id>', methods=['GET'])
@jwt_required()
def get_loan(loan_id):
    loan = Loan.query.get_or_404(loan_id)
    return loan_schema.jsonify(loan)

@loans_blueprint.route('/', methods=['POST'])
@jwt_required()
def create_loan():
    data = request.get_json()
    existing_loan = Loan.query.filter_by(
        usuario_id=data['usuario_id'],
        libro_id=data['libro_id'],
        fecha_devolucion=None
    ).first()
    if existing_loan:
        return jsonify({"error": "El usuario ya tiene un préstamo activo para este libro"}), 400
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
@jwt_required()
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
@jwt_required()
def delete_loan(loan_id):
    loan = Loan.query.get_or_404(loan_id)
    db.session.delete(loan)
    db.session.commit()
    return jsonify({"message": "prestamo eliminado", "loan_id": loan.id})

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)