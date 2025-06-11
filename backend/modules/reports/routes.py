from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from modules.auth.utils import role_required
from modules.models import Loan, Book, User
from modules.db import db

reports_blueprint = Blueprint('reports', __name__)

@reports_blueprint.route('/reports/book/<int:book_id>', methods=['GET'])
@jwt_required()
@role_required(["Administrador"])
def get_book_loans(book_id):
    loans = Loan.query.filter_by(libro_id=book_id).all()
    if not loans:
        return jsonify({"error": "No hay préstamos registrados para este libro"}), 404
    loan_data = [
        {"loan_id": loan.id, "user_id": loan.usuario_id, "return_date": loan.fecha_devolucion, "is_active": loan.is_active}
        for loan in loans
    ]
    return jsonify({"loans": loan_data}), 200

@reports_blueprint.route('/reports/user/<int:user_id>', methods=['GET'])
@jwt_required()
@role_required(["Administrador"])
def get_user_loans(user_id):
    loans = Loan.query.filter_by(usuario_id=user_id).all()
    if not loans:
        return jsonify({"error": "No hay préstamos registrados para este usuario"}), 404
    loan_data = [
        {"loan_id": loan.id, "book_id": loan.libro_id, "return_date": loan.fecha_devolucion, "is_active": loan.is_active}
        for loan in loans
    ]
    return jsonify({"loans": loan_data}), 200

@reports_blueprint.route('/reports', methods=['GET'])
@jwt_required()
@role_required(["Administrador"])
def generate_report():
    filters = request.args
    isbn = filters.get('isbn')
    title = filters.get('title')
    user_name = filters.get('user_name')

    query = Loan.query.join(Book).join(User)

    if isbn:
        query = query.filter(Book.isbn.ilike(f"%{isbn}%"))
    if title:
        query = query.filter(Book.titulo.ilike(f"%{title}%"))
    if user_name:
        query = query.filter((User.nombre + ' ' + User.apellido).ilike(f"%{user_name}%"))

    loans = query.all()
    loan_data = [
        {
            "loan_id": loan.id,
            "book_title": loan.libro.titulo,
            "user_name": f"{loan.usuario.nombre} {loan.usuario.apellido}",
            "return_date": loan.fecha_devolucion,
            "is_active": loan.is_active,
        }
        for loan in loans
    ]
    return jsonify({"loans": loan_data}), 200
