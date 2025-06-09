from flask import Blueprint

loans_blueprint = Blueprint('loans', __name__)

@loans_blueprint.route('/', methods=['GET'])
def list_loans():
    return {"message": "List of loans"}