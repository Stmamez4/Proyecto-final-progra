from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from modules.models import Loan, Book, User
from app import db

reports_blueprint = Blueprint('reports', __name__)

def admin_required():
    user = get_jwt_identity()
    if not user or user.get('role') != 'admin':
        return False
    return True

@reports_blueprint.route('/loans-by-book', methods=['GET'])
@jwt_required()
def loans_by_book():
    if not admin_required():
        return jsonify({"error": "Acceso denegado"}), 403
    isbn = request.args.get('isbn')
    title = request.args.get('title')
    query = Book.query
    if isbn:
        query = query.filter(Book.isbn == isbn)
    if title:
        query = query.filter(Book.titulo.ilike(f"%{title}%"))
    books = query.all()
    result = []
    for book in books:
        loans = Loan.query.filter_by(libro_id=book.id).all()
        result.append({
            "book": {
                "id": book.id,
                "title": book.titulo,
                "isbn": book.isbn
            },
            "loans": [
                {
                    "id": loan.id,
                    "user_id": loan.usuario_id,
                    "borrow_date": loan.fecha_prestamo,
                    "return_date": loan.fecha_devolucion
                } for loan in loans
            ]
        })
    return jsonify(result), 200

@reports_blueprint.route('/loans-by-user', methods=['GET'])
@jwt_required()
def loans_by_user():
    if not admin_required():
        return jsonify({"error": "Acceso denegado"}), 403
    user_id = request.args.get('user_id')
    email = request.args.get('email')
    query = User.query
    if user_id:
        query = query.filter(User.id == user_id)
    if email:
        query = query.filter(User.correo == email)
    users = query.all()
    result = []
    for user in users:
        loans = Loan.query.filter_by(usuario_id=user.id).all()
        result.append({
            "user": {
                "id": user.id,
                "name": f"{user.nombre} {user.apellido}",
                "email": user.correo
            },
            "loans": [
                {
                    "id": loan.id,
                    "book_id": loan.libro_id,
                    "borrow_date": loan.fecha_prestamo,
                    "return_date": loan.fecha_devolucion
                } for loan in loans
            ]
        })
    return jsonify(result), 200
