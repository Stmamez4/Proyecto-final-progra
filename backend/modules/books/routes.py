from flask import Blueprint, request, jsonify
from modules.models import Book
from app import db

books_blueprint = Blueprint('books', __name__)

# Listar todos los libros
@books_blueprint.route('/books', methods=['GET'])
def list_books():
    books = Book.query.all()
    books_list = [{
        "id": book.id,
        "title": book.titulo,
        "author": book.autor,
        "isbn": book.isbn,
        "quantity": book.cantidad_disponible
    } for book in books]
    return jsonify(books_list), 200

# Crear un nuevo libro
@books_blueprint.route('/books', methods=['POST'])
def create_book():
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

# Actualizar un libro existente
@books_blueprint.route('/books/<int:id>', methods=['PUT'])
def update_book(id):
    book = Book.query.get_or_404(id)
    data = request.get_json()
    book.titulo = data.get("title", book.titulo)
    book.autor = data.get("author", book.autor)
    book.isbn = data.get("isbn", book.isbn)
    book.cantidad_disponible = data.get("quantity", book.cantidad_disponible)
    db.session.commit()
    return jsonify({"message": "Libro actualizado exitosamente"}), 200

# Eliminar un libro
@books_blueprint.route('/books/<int:id>', methods=['DELETE'])
def delete_book(id):
    book = Book.query.get_or_404(id)
    db.session.delete(book)
    db.session.commit()
    return jsonify({"message": "Libro eliminado exitosamente"}), 200