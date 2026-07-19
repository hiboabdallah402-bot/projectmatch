import os
from typing import Optional

from flask import Flask, jsonify
from sqlalchemy.exc import IntegrityError
from werkzeug.exceptions import HTTPException

from config import config_by_name
from extensions import cors, db, jwt, migrate
from routes.applications import applications_bp
from routes.auth import auth_bp
from routes.collaboration import collaboration_bp
from routes.profile import profile_bp
from routes.projects import projects_bp


def create_app(config_name: Optional[str] = None) -> Flask:
    app = Flask(__name__)

    env_name = config_name or os.getenv("FLASK_ENV", "development")
    app.config.from_object(config_by_name.get(env_name, config_by_name["development"]))

    _init_extensions(app)
    import models  # noqa: F401
    if app.config.get("TESTING") or app.config.get("DEBUG") or os.getenv("AUTO_CREATE_TABLES", "0") == "1":
        with app.app_context():
            db.create_all()
    _register_routes(app)
    _register_home_route(app)
    _register_healthcheck(app)
    _register_error_handlers(app)
    _register_jwt_error_handlers()

    return app


def _init_extensions(app: Flask) -> None:
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    cors.init_app(
        app,
        resources={
            r"/api/*": {"origins": app.config["CORS_ORIGINS"]},
            r"/health": {"origins": app.config["CORS_ORIGINS"]},
        },
        supports_credentials=True,
    )


def _register_routes(app: Flask) -> None:
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(profile_bp, url_prefix="/api/profile")
    app.register_blueprint(projects_bp, url_prefix="/api/projects")
    app.register_blueprint(applications_bp, url_prefix="/api/applications")
    app.register_blueprint(collaboration_bp, url_prefix="/api/collaboration")


def _register_home_route(app: Flask) -> None:
    @app.get("/")
    def home():
        return (
            jsonify(
                {
                    "service": "ProjectMatch API",
                    "status": "running",
                    "message": "Welcome to the ProjectMatch backend",
                }
            ),
            200,
        )


def _register_healthcheck(app: Flask) -> None:
    @app.get("/health")
    def healthcheck():
        return jsonify({"status": "ok", "service": "ProjectMatch API"}), 200


def _register_error_handlers(app: Flask) -> None:
    @app.errorhandler(HTTPException)
    def handle_http_exception(error):
        return jsonify({"message": error.description}), error.code

    @app.errorhandler(IntegrityError)
    def handle_integrity_error(_error):
        db.session.rollback()
        return jsonify({"message": "Database integrity error"}), 400

    @app.errorhandler(Exception)
    def internal_error(_error):
        db.session.rollback()
        return jsonify({"message": "Internal server error"}), 500


def _register_jwt_error_handlers() -> None:
    @jwt.unauthorized_loader
    def unauthorized_loader(error_message):
        return jsonify({"message": error_message}), 401

    @jwt.invalid_token_loader
    def invalid_token_loader(error_message):
        return jsonify({"message": error_message}), 422

    @jwt.expired_token_loader
    def expired_token_loader(_jwt_header, _jwt_payload):
        return jsonify({"message": "Token has expired"}), 401

    @jwt.revoked_token_loader
    def revoked_token_loader(_jwt_header, _jwt_payload):
        return jsonify({"message": "Token has been revoked"}), 401

    @jwt.needs_fresh_token_loader
    def needs_fresh_token_loader(_jwt_header, _jwt_payload):
        return jsonify({"message": "Fresh token required"}), 401


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("FLASK_RUN_PORT", "5000")))
