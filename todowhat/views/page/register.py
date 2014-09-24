from flask.ext.classy import FlaskView
from flask import request, url_for, render_template, flash, redirect
from werkzeug import generate_password_hash

from todowhat import db
from todowhat.models.user import User
from flask.ext.mail import Mail, Message

mail = Mail()


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
            try:
                user = User(username=username, pwdhash=pwdhash)
            except AssertionError:
                flash('Forbidden character detected in username', 'warning')
                return redirect(url_for('page.RegisterView:index'))
            db.session.add(user)
            db.session.commit()
            print user.get_activation_link()
            flash("""
                    We\'ve sent you an email. Please click the link in the
                    email to complete the creation of your account.
                    """, 'info')
            link = user.get_activation_link()
            body = render_template("email.html", link=link)
            self.send_email('Account activation',
                            'activate@todowhat.herokuapp.com',
                            [username], body)
            return redirect(url_for('page.LoginView:index'))

        # Otherwise show error message
        flash('Username already taken', 'info')
        return redirect(url_for('page.RegisterView:index'))

    def send_email(self, subject, sender, recipients, html_body):
        msg = Message(subject, sender=sender, recipients=recipients)
        msg.html = html_body
        mail.send(msg)
