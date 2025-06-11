from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from modules.auth.utils import role_required
from modules.models import User
from modules.db import db
import re

users_blueprint = Blueprint('users', __name__)

def is_valid_email(email):
    regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return re.match(regex, email) is not None

@users_blueprint.route('/users', methods=['GET'])
@jwt_required()
@role_required(["Gestor", "Administrador"])
def list_users():
    users = User.query.all()
    users_list = [{"id": user.id, "name": user.name, "email": user.email, "role": user.role} for user in users]
    return jsonify(users_list), 200

@users_blueprint.route('/users', methods=['POST'])
@jwt_required()
@role_required(["Gestor", "Administrador"])
def create_user():
    data = request.get_json()
    required_fields = ['name', 'last_name', 'email', 'phone', 'id_number']
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"{field} es obligatorio"}), 400
    if not is_valid_email(data['email']):
        return jsonify({"error": "Correo inválido"}), 400
    if User.query.filter_by(id_number=data['id_number']).first():
        return jsonify({"error": "El número de identificación ya existe"}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "El correo ya está registrado"}), 400
    user = User(
        name=data['name'],
        last_name=data['last_name'],
        email=data['email'],
        phone=data['phone'],
        id_number=data['id_number'],
        role=data.get('role', 'user')
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "Usuario creado exitosamente"}), 201

@users_blueprint.route('/users/<int:id>', methods=['PUT'])
@jwt_required()
@role_required(["Gestor", "Administrador"])
def update_user(id):
    user = User.query.get_or_404(id)
    data = request.get_json()
    user.name = data.get("name", user.name)
    user.email = data.get("email", user.email)
    user.role = data.get("role", user.role)
    db.session.commit()
    return jsonify({"message": "Usuario actualizado exitosamente"}), 200

@users_blueprint.route('/users/<int:id>', methods=['DELETE'])
@jwt_required()
@role_required(["Gestor", "Administrador"])
def delete_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "Usuario eliminado exitosamente"}), 200