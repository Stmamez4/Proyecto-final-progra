import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://user:pass@localhost:3307/bibliotecadb'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'supersecretkey')
