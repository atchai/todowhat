from what_todo import db

todo_tags = db.Table('todo_tags',
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id')),
    db.Column('todo_id', db.Integer, db.ForeignKey('todo.id'))
)


class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(255))
    done = db.Column(db.Boolean, default = False)
    order = db.Column(db.Integer, default = 0)
    tags = db.relationship('Tag', 
            secondary=todo_tags,
            backref=db.backref('todos', lazy='dynamic'),
            lazy='dynamic')
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    def __repr__(self):
        return '<todo %r, Tags %r>' % (self.content, self.tags)

    def json_view (self):
        """Return this models attributes in json format"""
        return {
            'id': self.id, 
            'content': self.content,
            'done': self.done,
            'order': self.order,
            'user': self.get_username(),
            'tags': self.serialize_tags()
            }

    def get_username(self):
        if self.user == None:
            return 'none'
        return self.user.username

    def serialize_tags(self):
       """Return this todos tags in easily serializeable format"""
       tagArr = []
       for i in self.tags.all():
        tagArr.append(i.name)
       return tagArr