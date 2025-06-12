from modules.models import Role

def get_all_roles():
    return Role.query.all()
