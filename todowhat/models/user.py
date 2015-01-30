import os

from todowhat import db
from werkzeug import check_password_hash
from itsdangerous import URLSafeSerializer
from sqlalchemy.orm import validates
from flask import url_for
from flask import current_app as app


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(60), unique=True, index=True)
    pwdhash = db.Column(db.String())
    activated = db.Column(db.Boolean, default=False)
    todos = db.relationship('Todo', backref='user', lazy='dynamic')

    def check_password(self, password):
        return check_password_hash(self.pwdhash, password)

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return unicode(self.id)

    def is_email_activated(self):
        return self.activated

    @validates('username')
    def validate_username(self, key, username):
        assert '/' not in username
        assert '@' in username
        return username

    def get_serializer(self):
        return URLSafeSerializer(app.config['SECRET_KEY'])

    def get_activation_link(self):
        s = self.get_serializer()
        payload = s.dumps(self.id)
        return url_for('api.AuthView:activate_user',
                       payload=payload,
                       _external=True)

    def activate(self):
        self.activated = True
        db.session.add(self)
        db.session.commit()

    def __repr__(self):
        return '<User %r, activated %r>' % (self.username, self.activated)
