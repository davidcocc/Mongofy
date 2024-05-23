from flask import Flask

def create_app():
    app = Flask(__name__)

    app.static_folder = 'templates/static'

    from .routes import app_bp
    app.register_blueprint(app_bp)

    return app
