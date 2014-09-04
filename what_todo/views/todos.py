from flask.ext.classy import FlaskView
from what_todo import db
from flask import g, request, url_for, jsonify, json, Response, render_template, flash, redirect, session, abort, Blueprint
from what_todo.models.tag import Tag
from what_todo.models.todo import Todo

todos = Blueprint('todos', __name__)

class TodosView(FlaskView):
    trailing_slash=False
    def index(self):
        todosResponse = Todo.query.filter_by(user_id = g.user.id).all()
        return jsonify(todos=[i.json_view() for i in todosResponse])

    def post(self):
        requestData = request.get_json()
        theTags = []
        theOrder = 0
        theTags = requestData['tags'] if "tags" in requestData else theTags
        if "order" in requestData:
            theOrder = requestData['order']
        #use this data to make a new todo on the server
        make_todo(requestData['content'], theTags, theOrder)
        return jsonify( {"result": 200})

    def get(self, id):
        """Get a single todo from the server"""
        id = int(id)
        dbTodo = Todo.query.get(id)
        return jsonify( dbTodo.json_view() ), 200

    def put(self, id):
        id = int(id)
        dbTodo = Todo.query.get(id)
        #obtain the data from http request
        requestData = request.get_json()
        #update corresponding todo attributes
        if "content" in requestData:
            dbTodo.content = requestData['content']
        if "order" in requestData:
            dbTodo.order = requestData['order']
        if "done" in requestData:
            dbTodo.done = requestData['done']
        if "tags" in requestData:
            print requestData['tags']
            for i in dbTodo.tags.all():
                db.session.delete(i)
            db.session.commit()
            tagsModels = make_tags(requestData['tags'])
            if len(tagsModels) > 0:
                dbTodo.tags = tagsModels
        db.session.commit()
        return jsonify({'result': 200})

    def delete(self, id):
        id = int(id)
        """Delete a todo from the server"""
        dbTodo = Todo.query.get(id)
        db.session.delete(dbTodo)
        db.session.commit()
        #if the deleted todo held the last reference to a tag, delete that tag
        for tag in Tag.query.all():
            if tag.todos.count() == 0:
                db.session.delete(tag)
        db.session.commit()
        return jsonify({'response': 200})

TodosView.register(todos)

def make_todo(todoContent, tagsContent, todoOrder):
    """
    Create new todo in the database
    todoContent is string,
    tagsContent is an array of strings.
    """
    tagsModels = make_tags(tagsContent)
    todo = Todo(content=todoContent, order=todoOrder)
    todo.user = g.user
    if len(tagsModels) > 0:
        todo.tags = tagsModels
    db.session.add(todo)
    db.session.commit()
    print 'making a todo'

def make_tags(tagsArray):
    """
    Create and return an array, tagsModels,
    populated with tag objects from database.
    If no tag exists already with specified name, a new one is created
    """
    if len(tagsArray) == 0:
        return tagsArray
    tagsModels = []
    for i in tagsArray:
        tag = Tag.query.filter_by(name=i).first()
        if tag == None:
            tag = Tag(name=i)
        tagsModels.append(tag)
    return tagsModels

