from flask import Blueprint, request, jsonify
from modules.models import User
from app import db

users_blueprint = Blueprint('users', __name__)

@users_blueprint.route('/users', methods=['GET'])
def list_users():
    users = User.query.all()
    users_list = [{"id": user.id, "name": user.name, "email": user.email, "role": user.role} for user in users]
    return jsonify(users_list), 200

@users_blueprint.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    if not all(key in data for key in ["name", "email", "role"]):
        return jsonify({"error": "Faltan campos obligatorios"}), 400
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "El correo ya está registrado"}), 400
    user = User(name=data["name"], email=data["email"], role=data["role"])
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "Usuario creado exitosamente"}), 201

@users_blueprint.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    user = User.query.get_or_404(id)
    data = request.get_json()
    user.name = data.get("name", user.name)
    user.email = data.get("email", user.email)
    user.role = data.get("role", user.role)
    db.session.commit()
    return jsonify({"message": "Usuario actualizado exitosamente"}), 200

@users_blueprint.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "Usuario eliminado exitosamente"}), 200

# Ejemplo de respuesta recomendada para error y éxito
# { "message": "Usuario creado exitosamente" }
# { "error": "El correo ya está registrado" }

# Ejemplo de respuesta recomendada para listado
# [
#   { "id": 1, "name": "Juan", "email": "juan@mail.com", "role": "admin" }
# ]

# Ejemplo de respuesta recomendada para login
# { "token": "jwt_token_aqui" }