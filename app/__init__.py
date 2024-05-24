from flask import Flask

def create_app():
    app = Flask(__name__)

    app.static_folder = 'templates/static'
    
    app.jinja_env.variable_start_string = '[['
    app.jinja_env.variable_end_string = ']]'
    
    from .routes import app_bp
    app.register_blueprint(app_bp)

    return app
