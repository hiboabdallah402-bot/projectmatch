import os
from typing import Optional

from flask import Flask, jsonify

from config import config_by_name
from extensions import cors, db, jwt, migrate
from routes.applications import applications_bp
from routes.auth import auth_bp
from routes.profile import profile_bp
from routes.projects import projects_bp


def create_app(config_name: Optional[str] = None) -> Flask:
    app = Flask(__name__)

    env_name = config_name or os.getenv("FLASK_ENV", "development")
    app.config.from_object(config_by_name.get(env_name, config_by_name["development"]))

    _init_extensions(app)
    import models  # noqa: F401
    with app.app_context():
        db.create_all()
    _register_routes(app)
    _register_home_route(app)
    _register_healthcheck(app)

    return app


def _init_extensions(app: Flask) -> None:
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    cors.init_app(
        app,
        resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}},
        supports_credentials=True,
    )


def _register_routes(app: Flask) -> None:
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(profile_bp, url_prefix="/api/profile")
    app.register_blueprint(projects_bp, url_prefix="/api/projects")
    app.register_blueprint(applications_bp, url_prefix="/api/applications")


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


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("FLASK_RUN_PORT", "5000")))
