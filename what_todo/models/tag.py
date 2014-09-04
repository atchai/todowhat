from what_todo import db

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