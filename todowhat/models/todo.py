from flask import g

from todowhat import db
from todowhat.models.tag import Tag

todo_tags = db.Table(
    'todo_tags',
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id')),
    db.Column('todo_id', db.Integer, db.ForeignKey('todo.id'))
)


class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(255))
    done = db.Column(db.Boolean, default=False)
    order = db.Column(db.Integer, default=0)
    tags = db.relationship(
        'Tag',
        secondary=todo_tags,
        backref=db.backref('todos', lazy='dynamic'),
        lazy='dynamic'
    )
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    description = db.Column(db.String(255))
    reminder = db.Column(db.String)

    ignore_columns = ['id', 'user_id']

    def __repr__(self):
        return '<todo %r, Tags %r>' % (self.content, self.tags)

    def json_view(self):
        """Return this models attributes in json format"""
        return {
            'id': self.id,
            'content': self.content,
            'done': self.done,
            'order': self.order,
            'user': self.get_username(),
            'tags': self.serialize_tags(),
            'description': self.description,
            'reminder': self.reminder
        }

    def get_username(self):
        """Return a string of current user's username"""
        if self.user is None:
            return 'none'
        return self.user.username

    def serialize_tags(self):
        """Return this todos tags in easily serializeable format"""
        return [i.name for i in self.tags.all()]

    def set_dict_attr(self, request_data):
        """
        *args are strings of model attributes which are not
        to be manipulated by client requests.
        Model attributes are given by self.__table__.columns.
        If an attribute name of the model matches a key
        of the request_data dictionary, the attribute is updated.
        Tags are handled seperately by set_tags_attr as it is a relationship.
        """
        for attr in self.__table__.columns:
            if (attr.name in request_data and attr.name not in self.ignore_columns):
                setattr(self, attr.name, request_data[attr.name])
        if "tags" in request_data:
            self.set_tags_attr(request_data['tags'])

    def set_tags_attr(self, tags):
        """
        Takes an array of tags (strings). Uses todowhat.models.tag.make_tags
        to create an array of tag models from it. Replaces tags attribute of
        model with new array of tag models.
        """
        for i in self.tags.all():
                db.session.delete(i)
        db.session.commit()
        # Update with new array of tags returned from make_tags
        tags_models = Tag().create(tags)
        if tags_models:
            self.tags = tags_models

    def create(self, request_data):
        """
        Creates and saves new todo in the database.
        Sets user attribute to current user.
        Passes request_data dictionary to the
        set_dict_attr method
        """
        self.user = g.user
        self.set_dict_attr(request_data)
        self.set_tags_attr(request_data['tags'])
        db.session.add(self)
        db.session.commit()

    def clear_tags(self):
        for tag in self.tags.all():
            if not tag.todos.count():
                db.session.delete(tag)
