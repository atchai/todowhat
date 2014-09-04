from flask.ext.classy import FlaskView
from flask import g, request, jsonify, Blueprint

from what_todo import db
from what_todo.models.tag import Tag
from what_todo.models.todo import Todo

todos = Blueprint('todos', __name__)

#
# Todos API
#

class TodosView(FlaskView):
    trailing_slash = False

    def index(self):
        """Get all todos belonging to the user and return them"""
        todos_response = Todo.query.filter_by(user_id=g.user.id).all()
        return jsonify(todos=[i.json_view() for i in todos_response])

    def post(self):
        """Create a new todo"""
        request_data = request.get_json()

        request_tags = []
        request_order = 0
        # If array of tags was provided in request, set it to request_tags
        if "tags" in request_data:
            request_tags = request_data['tags']
        # If an order number was provided in request, set it to request_order
        if "order" in request_data:
            request_order = request_data['order']
        # Make a new todo in the database with given data
        make_todo(request_data['content'], request_tags, request_order)
        return jsonify({"result": 200})

    def get(self, id):
        """Get a single todo from the server"""
        db_todo = Todo.query.get(int(id))
        return jsonify(db_todo.json_view()), 200

    def put(self, id):
        """Update an existing todos attributes"""
        # Get the relevant todo from database
        db_todo = Todo.query.get(int(id))

        # Obtain the data from HTTP request
        request_data = request.get_json()
        # Update corresponding todo attributes if given in request
        if "content" in request_data:
            db_todo.content = request_data['content']
        if "order" in request_data:
            db_todo.order = request_data['order']
        if "done" in request_data:
            db_todo.done = request_data['done']
        if "description" in request_data:
            db_todo.description = request_data['description']
        if "tags" in request_data:
            # Remove all current tags on the todo
            for i in db_todo.tags.all():
                db.session.delete(i)
            db.session.commit()
            # Update with new array of tags returned from make_tags
            tags_models = make_tags(request_data['tags'])
            if len(tags_models) > 0:
                db_todo.tags = tags_models

        db.session.commit()
        return jsonify({'result': 200})

    def delete(self, id):
        """Delete a todo from the server"""
        db_todo = Todo.query.get(int(id))
        db.session.delete(db_todo)
        db.session.commit()
        # If the deleted todo held the last reference to a tag, delete that tag
        for tag in db_todo.tags.all():
            if tag.todos.count() == 0:
                db.session.delete(tag)
        db.session.commit()
        return jsonify({'response': 200})

TodosView.register(todos)


def make_todo(todo_content, tags_content, todo_order):
    """
    Create new todo in the database.
    todo_content is string,
    tags_content is an array of strings.
    """
    tags_models = make_tags(tags_content)
    todo = Todo(content=todo_content, order=todo_order)
    todo.user = g.user
    if len(tags_models) > 0:
        todo.tags = tags_models
    db.session.add(todo)
    db.session.commit()


def make_tags(tags_array):
    """
    Create and return an array, tags_models,
    populated with tag objects from database.
    If no tag exists already with specified name, a new one is created
    """
    if len(tags_array) == 0:
        return tags_array
    tags_models = []
    for i in tags_array:
        tag = Tag.query.filter_by(name=i).first()
        if tag is None:
            tag = Tag(name=i)
        tags_models.append(tag)
    return tags_models
