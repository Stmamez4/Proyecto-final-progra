from flask import Blueprint

books_blueprint = Blueprint('books', __name__)

@books_blueprint.route('/', methods=['GET'])
def list_books():
    return {"message": "List of books"}