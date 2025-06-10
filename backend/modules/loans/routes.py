from flask import Blueprint, request, jsonify
from modules.models import Loan, Book, User
from modules.db import db

loans_blueprint = Blueprint('loans', __name__)

@loans_blueprint.route('/loans', methods=['GET'])
def list_loans():
    loans = Loan.query.all()
    loans_list = [{
        "id": loan.id,
        "user": {"id": loan.user.id, "name": loan.user.name},
        "book": {
            "id": loan.book.id,
            "title": loan.book.title,
            "quantity": getattr(loan.book, 'quantity', getattr(loan.book, 'cantidad_disponible', None))
        },
        "borrow_date": loan.borrow_date,
        "return_date": loan.return_date,
    } for loan in loans]
    return jsonify(loans_list), 200

@loans_blueprint.route('/loans', methods=['POST'])
def create_loan():
    data = request.get_json()
    user_id = data.get("user_id")
    book_id = data.get("book_id")

    book = Book.query.get(book_id)
    if not book or book.quantity < 1:
        return jsonify({"error": "El libro no está disponible"}), 400

    loan = Loan(user_id=user_id, book_id=book_id, borrow_date=data.get("borrow_date"), return_date=data.get("return_date"))
    book.quantity -= 1
    db.session.add(loan)
    db.session.commit()
    return jsonify({"message": "Préstamo creado exitosamente"}), 201

@loans_blueprint.route('/loans/<int:id>', methods=['PUT'])
def update_loan(id):
    loan = Loan.query.get_or_404(id)
    data = request.get_json()
    loan.return_date = data.get("return_date", loan.return_date)
    db.session.commit()
    return jsonify({"message": "Préstamo actualizado exitosamente"}), 200

@loans_blueprint.route('/loans/<int:id>', methods=['DELETE'])
def delete_loan(id):
    loan = Loan.query.get_or_404(id)
    book = loan.book
    book.quantity += 1
    db.session.delete(loan)
    db.session.commit()
    return jsonify({"message": "Préstamo eliminado exitosamente"}), 200