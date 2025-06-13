from flask_jwt_extended import get_jwt_identity
from functools import wraps
from flask import jsonify
from modules.models import User, Role

def role_required(roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            identity = get_jwt_identity()
            user_id = identity.get("id") if isinstance(identity, dict) else identity
            user = User.query.get(user_id)
            user_role = user.rol.nombre if user and user.rol else None
            if not user or user_role not in roles:
                return jsonify({'error': 'No autorizado'}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator
