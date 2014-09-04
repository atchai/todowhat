#!flask/bin/python
from flask import Flask, g
from flask.ext.api import FlaskAPI, status, exceptions
from flask.ext.sqlalchemy import SQLAlchemy
from werkzeug import generate_password_hash
from flask.ext.login import LoginManager, login_user , logout_user , current_user , login_required

# Create database and loginmanager object
db = SQLAlchemy()    
login_manager = LoginManager()

# App factory
def create_app():

    app = Flask(__name__, static_url_path='')

    app.secret_key = 'str8 up inject SQL in2 bloodstream'
    app.config.from_object('config')

    # Setup login manager
    login_manager.init_app(app)
    login_manager.login_view = 'login.LoginView:index'
    login_manager.login_message = ''

    from models.user import User
    @login_manager.user_loader
    def load_user(id):
        return User.query.get(int(id))

    @app.before_request
    def before_request():
        g.user = current_user

    # Register Flask Classy Views with the application
    from what_todo.views.main import main
    from what_todo.views.todos import todos
    from what_todo.views.tags import tags
    from what_todo.views.register import register
    from what_todo.views.login import login
    from what_todo.views.logout import logout
    app.register_blueprint(login)
    app.register_blueprint(logout)
    app.register_blueprint(register)
    app.register_blueprint(tags)
    app.register_blueprint(todos)
    app.register_blueprint(main)

    # Setup database
    db.init_app(app)

    return app



import what_todo.views