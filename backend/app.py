from flask import Flask
from modules.auth.routes import auth_blueprint
from modules.books.routes import books_blueprint
from modules.users.routes import users_blueprint
from modules.loans.routes import loans_blueprint

def create_app():
    app = Flask(__name__)

    app.config.from_pyfile('config.py')

    app.register_blueprint(auth_blueprint, url_prefix='/auth')
    app.register_blueprint(books_blueprint, url_prefix='/books')
    app.register_blueprint(users_blueprint, url_prefix='/users')
    app.register_blueprint(loans_blueprint, url_prefix='/loans')
 
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)