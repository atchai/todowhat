from flask.ext.classy import FlaskView
from flask import request, url_for, render_template, flash, redirect, session, Blueprint
from what_todo.models.user import User

register = Blueprint('register', __name__)
class RegisterView(FlaskView):
    def index(self):
        return render_template('register.html')

    def post(self):
        requestData = request.form
        username = requestData['username']
        pwdhash = generate_password_hash(requestData['password'])
        user = User(username=username, pwdhash=pwdhash)
        db.session.add(user)
        db.session.commit()
        flash('User successfully registered', 'info')
        return redirect(url_for('login.LoginView:index'))

RegisterView.register(register)