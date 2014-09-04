from flask.ext.classy import FlaskView
from flask import url_for, flash, redirect, Blueprint
from flask.ext.login import logout_user
from what_todo.views.main import MainView

logout = Blueprint('logout', __name__)

class LogoutView(FlaskView):
    def index(self):
        logout_user()
        flash('Logged out successfully', 'success')
        return redirect(url_for('main.MainView:index')) 

LogoutView.register(logout)