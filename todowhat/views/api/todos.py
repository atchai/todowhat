from flask.ext.classy import FlaskView
from flask import g, request, jsonify
from flask.ext.login import login_required

from todowhat import db
from todowhat.models.todo import Todo

#
# Todos API
#


class TodosView(FlaskView):
    trailing_slash = False
    decorators = [login_required]

    def index(self):
        """Get all todos belonging to the user and return them"""
        todos_response = Todo.query.filter_by(user_id=g.user.id).all()
        return jsonify(todos=[i.json_view() for i in todos_response])

    def post(self):
        """Create a new todo"""
        request_data = request.get_json()
        Todo().create(request_data)
        return jsonify({"result": 201}), 201

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
        # Update attributes of model with the request data
        db_todo.set_dict_attr(request_data)
        db.session.add(db_todo)
        db.session.commit()
        return jsonify({'result': 200}), 200

    def delete(self, id):
        """Delete a todo from the server"""
        db_todo = Todo.query.get(int(id))
        db_todo.clear_tags()
        db.session.delete(db_todo)
        db.session.commit()
        # If the deleted todo held the last reference to a tag, delete that tag
        return jsonify({'response': 200}), 200
