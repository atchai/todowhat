from flask.ext.classy import FlaskView
from flask import url_for, flash, redirect
from flask.ext.login import logout_user


class LogoutView(FlaskView):
    def index(self):
        """Log a user out and redirect to login page"""
        logout_user()
        flash('Logged out successfully', 'success')
        return redirect(url_for('page.LoginView:index'))
