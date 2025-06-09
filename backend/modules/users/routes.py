from flask import Blueprint

users_blueprint = Blueprint('users', __name__)

@users_blueprint.route('/', methods=['GET'])
def list_users():
    return {"message": "List of users"}