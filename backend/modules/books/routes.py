from flask import Blueprint, request, jsonify
from modules.models import Book
from modules.db import db

books_blueprint = Blueprint('books', __name__)

@books_blueprint.route('/', methods=['GET', 'OPTIONS'])
def list_books():
    if request.method == 'OPTIONS':
        return '', 204
    books = Book.query.all()
    books_list = [{
        "id": book.id,
        "title": book.titulo,
        "author": book.autor,
        "isbn": book.isbn,
        "quantity": book.cantidad_disponible
    } for book in books]
    return jsonify(books_list), 200

@books_blueprint.route('/', methods=['POST', 'OPTIONS'])
def create_book():
    if request.method == 'OPTIONS':
        return '', 204
    data = request.get_json()
    if not all(key in data for key in ["title", "author", "isbn", "quantity"]):
        return jsonify({"error": "Faltan campos obligatorios"}), 400
    if Book.query.filter_by(isbn=data["isbn"]).first():
        return jsonify({"error": "El ISBN ya está registrado"}), 400
    book = Book(
        titulo=data["title"],
        autor=data["author"],
        isbn=data["isbn"],
        cantidad_disponible=data["quantity"]
    )
    db.session.add(book)
    db.session.commit()
    return jsonify({"message": "Libro creado exitosamente"}), 201

@books_blueprint.route('/<int:id>', methods=['PUT', 'OPTIONS'])
def update_book(id):
    if request.method == 'OPTIONS':
        return '', 204
    book = Book.query.get_or_404(id)
    data = request.get_json()
    book.titulo = data.get("title", book.titulo)
    book.autor = data.get("author", book.autor)
    book.isbn = data.get("isbn", book.isbn)
    book.cantidad_disponible = data.get("quantity", book.cantidad_disponible)
    db.session.commit()
    return jsonify({"message": "Libro actualizado exitosamente"}), 200

@books_blueprint.route('/<int:id>', methods=['DELETE', 'OPTIONS'])
def delete_book(id):
    if request.method == 'OPTIONS':
        return '', 204
    book = Book.query.get_or_404(id)
    db.session.delete(book)
    db.session.commit()
    return jsonify({"message": "Libro eliminado exitosamente"}), 200

@books_blueprint.route('/<int:id>', methods=['GET', 'OPTIONS'])
def get_book(id):
    if request.method == 'OPTIONS':
        return '', 204
    book = Book.query.get_or_404(id)
    return jsonify({
        "id": book.id,
        "title": book.titulo,
        "author": book.autor,
        "isbn": book.isbn,
        "quantity": book.cantidad_disponible
    }), 200