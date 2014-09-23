from flask.ext.classy import FlaskView
from flask import request, url_for, render_template, flash, redirect
from flask.ext.login import login_user

from todowhat.models.user import User


class LoginView(FlaskView):
    # trailing_slash = False

    def index(self):
        return render_template('login.html')

    def post(self):
        """Checks login credentials"""
        requestData = request.form
        username = requestData['username']

        # Check if user exists in database
        user = User.query.filter_by(username=username).first()

        # If no user with given username, redirect to login page with error
        if user is None:
            flash('Username is invalid', 'warning')
            return redirect(url_for('page.LoginView:index'))

        # Otherwise user exists.
        # If password hash matches, log the user in and redirect to index page
        if user.check_password(requestData['password']):
            if user.activated:
                login_user(user)
                return redirect(request.args.get('next') or url_for('page.MainView:index', username=username))
            else:
                flash('Please activate your account first by clicking on the link sent to your email.', 'warning')
                return redirect(url_for('page.LoginView:index'))

        # Otherwise redirect to login page with error message
        flash('Password is invalid', 'danger')
        return redirect(url_for('page.LoginView:index'))
