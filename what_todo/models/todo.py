from flask import g

from what_todo import db
from what_todo.models.tag import Tag

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
        tagArr = []
        for i in self.tags.all():
            tagArr.append(i.name)
        return tagArr

    def set_dict_attr(self, request_data):
        """
        Takes a dictionary of the request data,
        If an attribute of the model matches a key
        of the dictionary, the attribute is updated.
        Tags attribute is handled seperately by
        set_tags_attr because of many to many relationship.
        """

        for attr in self.__table__.columns:
            if attr.name in request_data and attr.name != 'tags':
                print attr.name
                setattr(self, attr.name, request_data[attr.name])

    def set_tags_attr(self, tags):
        """
        Takes an array of tags (strings). Uses what_todo.models.tag.make_tags
        to create an array of tag models from it. Replaces tags attribute of
        model with new array of tag models.
        """
        for i in self.tags.all():
                db.session.delete(i)
        db.session.commit()
        # Update with new array of tags returned from make_tags
        tags_models = Tag().make_tags(tags)
        if len(tags_models) > 0:
            self.tags = tags_models


    def make_todo(self, request_data):
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
