from flask import Flask
from modules.db import db
from flask_marshmallow import Marshmallow
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_migrate import Migrate
from modules.auth.routes import auth_blueprint
from modules.books.routes import books_blueprint
from modules.users.routes import users_blueprint
from modules.loans.routes import loans_blueprint
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

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

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)