from what_todo import db


class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    colour = db.Column(db.String(10))

    def __repr__(self):
        return '<Tag %r>' % self.name

    def json_view(self):
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

    def make_tags(self, tags_array):
        """
        Create and return an array, tags_models,
        populated with tag objects from database.
        If no tag exists already with specified name, a new one is created
        """
        if not tags_array:
            return tags_array
        tags_models = []
        for i in tags_array:
            tag = Tag.query.filter_by(name=i).first()
            if tag is None:
                tag = Tag(name=i)
            tags_models.append(tag)
        return tags_models
