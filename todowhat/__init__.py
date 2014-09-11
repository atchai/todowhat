#!/usr/bin/env python2
from flask import Flask, g
from flask.ext.login import LoginManager, current_user
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.mail import Mail

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
    login_manager.login_view = 'page.LoginView:index'
    login_manager.login_message = ''

    # Create instance of user
    from models.user import User

    @login_manager.user_loader
    def load_user(id):
        return User.query.get(int(id))

    # Make current logged in user accesible at g.user
    @app.before_request
    def before_request():
        g.user = current_user

    # Import blueprints from views modules
    from todowhat.views.page import page
    from todowhat.views.api import api
    from todowhat.views.error import error

    # Register blueprints
    app.register_blueprint(page)
    app.register_blueprint(api)
    app.register_blueprint(error)

    # Setup database
    db.init_app(app)

    # Setup email
    mail = Mail(app)

    return app
