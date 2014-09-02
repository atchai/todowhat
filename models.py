from app import db
from sqlalchemy.orm import validates

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

    def __repr__(self):
        return '<todo %r, Tags %r>' % (self.content, self.tags)

    def json_view (self):
        """Return this models attributes in json format"""
        return {
            'id': self.id, 
            'content': self.content,
            'done': self.done,
            'order': self.order,
            'tags': self.serialize_tags()
            }


    def serialize_tags(self):
       """Return this todos tags in easily serializeable format"""
       tagArr = []
       for i in self.tags.all():
        tagArr.append(i.name)
       return tagArr


class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))

    def __repr__(self):
        return '<Tag %r>' % self.name

    def json_view (self):
        """Return this models attributes in json format"""
        return {
            'id': self.id, 
            'name': self.name, 
            'count': self.todos.count(),
            'todos': self.serialize_todos()
        }


    def serialize_todos(self):
        """Return this tags todos in easily serializeable format"""
        todoArr = []
        for i in self.todos.all():
            todoArr.append({'todo_id': i.id, 'todo_content': i.content})
        return todoArr



