from todowhat import db


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
        return [{'todo_id': i.id, 'todo_content': i.content} for i in self.todos.all()]

    def create(self, tags_list):
        """
        Create and return an list, populated with tag objects from database.
        If no tag exists already with specified name, a new one is created
        """
        tags_dict = {i.name: i for i in Tag.query.filter(Tag.name.in_(tags_list)).all()}
        return [tags_dict[key] if key in tags_dict else Tag(name=key) for key in tags_list]
