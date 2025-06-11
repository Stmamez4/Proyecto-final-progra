from flask import Blueprint, request, jsonify
from modules.models import Loan, Book, User
from modules.db import db
from flask_jwt_extended import jwt_required
from modules.auth.utils import role_required
from datetime import datetime

loans_blueprint = Blueprint('loans', __name__)

@loans_blueprint.route('/loans', methods=['GET'])
@jwt_required()
@role_required(["Gestor", "Administrador"])
def list_loans():
    loans = Loan.query.all()
    loans_list = [{
        "id": loan.id,
        "user": {"id": loan.usuario.id, "nombre": loan.usuario.nombre},
        "book": {
            "id": loan.libro.id,
            "titulo": loan.libro.titulo,
            "cantidad_disponible": getattr(loan.libro, 'cantidad_disponible', None)
        },
        "fecha_prestamo": loan.fecha_prestamo,
        "fecha_devolucion": loan.fecha_devolucion,
        "activo": getattr(loan, 'is_active', True)
    } for loan in loans]
    return jsonify(loans_list), 200

@loans_blueprint.route('/loans', methods=['POST'])
@jwt_required()
@role_required(["Gestor", "Administrador"])
def create_loan():
    data = request.get_json()
    user_id = data.get('user_id')
    book_id = data.get('book_id')
    return_date = data.get('return_date')

    if not user_id or not book_id or not return_date:
        return jsonify({"error": "user_id, book_id y return_date son obligatorios"}), 400

    user = User.query.get(user_id)
    book = Book.query.get(book_id)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404
    if not book:
        return jsonify({"error": "Libro no encontrado"}), 404
    if getattr(book, 'cantidad_disponible', 0) <= 0:
        return jsonify({"error": "No hay ejemplares disponibles del libro"}), 400
    if Loan.query.filter_by(usuario_id=user_id, libro_id=book_id, is_active=True).first():
        return jsonify({"error": "El usuario ya tiene un préstamo activo para este libro"}), 400
    if Loan.query.filter_by(libro_id=book_id, is_active=True).first():
        return jsonify({"error": "El libro ya está prestado a otro usuario"}), 400

    try:
        expected_return_date = datetime.strptime(return_date, '%Y-%m-%d')
    except ValueError:
        return jsonify({"error": "Formato de fecha inválido, use YYYY-MM-DD"}), 400

    new_loan = Loan(usuario_id=user_id, libro_id=book_id, fecha_prestamo=datetime.now().date(), fecha_devolucion=expected_return_date, is_active=True)
    book.cantidad_disponible -= 1
    db.session.add(new_loan)
    db.session.commit()
    return jsonify({"message": "Préstamo creado exitosamente"}), 201

@loans_blueprint.route('/loans/<int:loan_id>/return', methods=['POST'])
@jwt_required()
@role_required(["Gestor", "Administrador"])
def return_loan(loan_id):
    loan = Loan.query.get(loan_id)
    if not loan:
        return jsonify({"error": "Préstamo no encontrado"}), 404
    if not getattr(loan, 'is_active', True):
        return jsonify({"error": "El préstamo ya está cerrado"}), 400

    loan.is_active = False
    book = Book.query.get(loan.libro_id)
    if book:
        book.cantidad_disponible += 1

    db.session.commit()
    return jsonify({"message": "Préstamo devuelto exitosamente"}), 200

@loans_blueprint.route('/loans/<int:id>', methods=['PUT'])
@jwt_required()
@role_required(["Gestor", "Administrador"])
def update_loan(id):
    loan = Loan.query.get_or_404(id)
    data = request.get_json()
    loan.fecha_devolucion = data.get("return_date", loan.fecha_devolucion)
    db.session.commit()
    return jsonify({"message": "Préstamo actualizado exitosamente"}), 200

@loans_blueprint.route('/loans/<int:id>', methods=['DELETE'])
@jwt_required()
@role_required(["Gestor", "Administrador"])
def delete_loan(id):
    loan = Loan.query.get_or_404(id)
    book = loan.libro
    if book:
        book.cantidad_disponible += 1
    db.session.delete(loan)
    db.session.commit()
    return jsonify({"message": "Préstamo eliminado exitosamente"}), 200