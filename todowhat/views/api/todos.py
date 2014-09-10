from flask.ext.classy import FlaskView
from flask import g, request, jsonify, abort
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
        # Get the relevant todo from database
        db_todo = Todo.query.get(int(id))
        if self.check_auth(db_todo):
            return jsonify(db_todo.json_view()), 200

    def put(self, id):
        """Update an existing todos attributes"""
        # Get the relevant todo from database
        db_todo = Todo.query.get(int(id))
        if self.check_auth(db_todo):
            # Obtain the data from HTTP request
            request_data = request.get_json()
            # Update attributes of model with the request data
            db_todo.set_dict_attr(request_data)
            db.session.add(db_todo)
            db.session.commit()
            return jsonify({'result': 200}), 200

    def delete(self, id):
        """Delete a todo from the server"""
        # Get the relevant todo from database
        db_todo = Todo.query.get(int(id))
        if self.check_auth(db_todo):
            db_todo.clear_tags()
            db.session.delete(db_todo)
            db.session.commit()
            # If deleted todo held the last reference to a tag, delete that tag
            return jsonify({'response': 200}), 200

    def check_auth(self, db_todo):
        # If no todo exists with requested id return 404 error
        if not db_todo:
            abort(404)
        # If todo belongs to logged in user return True
        if db_todo.user_id == g.user.id:
            return True
        # Else return 404 error
        return abort(401)
