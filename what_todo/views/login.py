from flask.ext.classy import FlaskView
from flask import request, url_for, render_template, flash, redirect, Blueprint
from flask.ext.login import login_user
from what_todo.models.user import User

login = Blueprint('login', __name__)

class LoginView(FlaskView):
    def index(self):
        return render_template('login.html')

    def post(self):
        requestData = request.form
        username = requestData['username']
        user = User.query.filter_by(username=username).first()
        if user is None:
            flash('Username is invalid' , 'warning')
            return redirect(url_for('login.LoginView:index'))
        if user.check_password(requestData['password']):
            login_user(user)
            return redirect(request.args.get('next') or url_for('main.MainView:index'))
        flash('wrong password', 'danger')
        return redirect(url_for('login.LoginView:index'))

LoginView.register(login)