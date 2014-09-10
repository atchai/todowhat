from todowhat import db
from werkzeug import check_password_hash
from itsdangerous import URLSafeSerializer
from sqlalchemy.orm import validates

from flask import url_for


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(60), unique=True, index=True)
    pwdhash = db.Column(db.String())
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

    @validates('username')
    def validate_username(self, key, username):
        assert '/' not in username
        return username

    def get_serializer(self):
        return URLSafeSerializer('str8 up inject SQL in2 bloodstream')

    def get_activation_link(self):
        s = self.get_serializer()
        payload = s.dumps(self.id)
        return url_for('api.AuthView:activate_user', payload=payload, _external=True)

    def __repr__(self):
        return '<User %r>' % (self.username)
