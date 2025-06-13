from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash
from modules.models import User, Role
from modules.db import db

auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({"error": "Email y contraseña son obligatorios"}), 400

    user = User.query.filter_by(correo=email).first()
    if not user or user.contrasena != password:
        return jsonify({"error": "Credenciales inválidas"}), 401

    access_token = create_access_token(identity={"id": user.id, "role": user.rol.nombre})
    return jsonify({"token": access_token}), 200

@auth_blueprint.route('/roles', methods=['GET'])
def get_roles():
    roles = Role.query.all()
    return jsonify([{"id": r.id, "name": r.nombre} for r in roles])

@auth_blueprint.route('/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return '', 204
    data = request.get_json()
    print('Datos recibidos en registro:', data)
    required_fields = ["nombre", "apellido", "correo", "numero_identificacion", "rol_id", "password"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"El campo '{field}' es obligatorio"}), 400
    if User.query.filter_by(correo=data.get("correo")).first():
        return jsonify({"error": "El correo ya está registrado"}), 400
    if User.query.filter_by(numero_identificacion=data.get("numero_identificacion")).first():
        return jsonify({"error": "El número de identificación ya está registrado"}), 400

    nuevo_usuario = User(
        nombre=data.get("nombre"),
        apellido=data.get("apellido"),
        correo=data.get("correo"),
        telefono=data.get("telefono"),
        numero_identificacion=data.get("numero_identificacion"),
        rol_id=data.get("rol_id"),
        contrasena=data.get("password")
    )
    db.session.add(nuevo_usuario)
    db.session.commit()
    return jsonify({"msg": "Usuario registrado correctamente"}), 201