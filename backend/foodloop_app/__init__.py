
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_security import Security, SQLAlchemyUserDatastore
from flask_cors import CORS
from flask_jwt_extended import JWTManager

# Initialize database
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite3"
    app.config["SECRET_KEY"] = "super-secret"
    app.config["SECURITY_PASSWORD_SALT"] = "super-secret"
    app.config["JWT_SECRET_KEY"] = "super-secret-jwt"
    CORS(app)

    db.init_app(app)
    jwt = JWTManager(app)

    # Setup Flask-Security-Too
    from .models import User, Role

    user_datastore = SQLAlchemyUserDatastore(db, User, Role)
    security = Security(app, user_datastore)

    # Register blueprints
    from .auth_routes import auth_bp
    from .retailer_routes import retailer_bp
    from .ngo_routes import ngo_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(retailer_bp)
    app.register_blueprint(ngo_bp)

    return app
