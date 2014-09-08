from flask.ext.classy import FlaskView
from flask import request, url_for, render_template, flash, redirect
from werkzeug import generate_password_hash

from what_todo import db
from what_todo.models.user import User


class RegisterView(FlaskView):
    def index(self):
        return render_template('register.html')

    def post(self):
        """Register a new user"""
        requestData = request.form

        # Grab username and password from request
        # Generate a hash from password so its not stored in plaintext
        username = requestData['username']
        pwdhash = generate_password_hash(requestData['password'])

        # Check if user with given username already exists
        user = User.query.filter_by(username=username).first()

        # If not, create a new user and redirect to login page
        if user is None:
            user = User(username=username, pwdhash=pwdhash)
            db.session.add(user)
            db.session.commit()
            flash('User successfully registered', 'info')
            return redirect(url_for('page.LoginView:index'))

        # Otherwise show error message
        flash('Username already taken', 'info')
        return redirect(url_for('page.RegisterView:index'))
