from what_todo import db
from werkzeug import check_password_hash

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer , primary_key=True)
    username = db.Column(db.String(60), unique=True , index=True)
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
 
    def __repr__(self):
        return '<User %r>' % (self.username)