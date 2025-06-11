from app import create_app
from modules.db import db
from modules.models import Role

app = create_app()
with app.app_context():
    roles = ["Administrador", "Gestor", "Usuario"]
    for nombre in roles:
        if not Role.query.filter_by(nombre=nombre).first():
            db.session.add(Role(nombre=nombre))
    db.session.commit()
    print("Roles creados correctamente")
