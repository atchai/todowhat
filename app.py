#!flask/bin/python
from flask import Flask, request, url_for, jsonify, json, Response, render_template
from flask.ext.api import FlaskAPI, status, exceptions
from flask.ext.sqlalchemy import SQLAlchemy
app = Flask(__name__, static_url_path='')
app.config.from_object('config')

db = SQLAlchemy(app)
import models


def make_todo(todoContent, tagsContent, todoOrder):
    """
    Create new todo in the database
    todoContent is string,
    tagsContent is an array of strings.
    """
    tagsModels = make_tags(tagsContent)
    todo = models.Todo(content=todoContent, order=todoOrder)
    if len(tagsModels) > 0:
        todo.tags = tagsModels
    db.session.merge(todo)
    db.session.commit()

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
        tag = models.Tag.query.filter_by(name=i).first()
        if tag == None:
            tag = models.Tag(name=i)
        tagsModels.append(tag)
    return tagsModels


@app.route("/todos", methods=['GET', 'POST'])
def todos_list():
    """Post a new todo to the server, or get all existing ones"""
    if request.method == 'POST':
        if "application/json" in request.headers["Content-Type"]:
            #obtain the data from http request
            requestData = request.get_json()
            theTags = []
            theOrder = 0
            if "tags" in requestData:
                theTags = requestData['tags']
            if "order" in requestData:
                theOrder = requestData['order']
            #use this data to make a new todo on the server
            make_todo(requestData['content'], theTags, theOrder)

    #if request is GET
    todosResponse = models.Todo.query.all()
    return jsonify(todos=[i.json_view() for i in todosResponse])

@app.route("/todos/<int:todo_id>", methods=['DELETE'])
def delete_todo(todo_id):
    """Delete a todo from the server"""
    dbTodo = models.Todo.query.get(todo_id)
    db.session.delete(dbTodo)
    db.session.commit()
    #if the deleted todo held the last reference to a tag, delete that tag
    for tag in models.Tag.query.all():
        if tag.todos.count() == 0:
            db.session.delete(tag)
    db.session.commit()
    return jsonify({'result': 200})

@app.route("/todos/<int:todo_id>", methods=['POST', 'PUT'])
def edit_todo(todo_id):
    """Update an existing todos attributes"""
    if request.method == 'PUT' or 'POST':
        dbTodo = models.Todo.query.get(todo_id)

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


@app.route('/todos/<int:todo_id>', methods= ['GET'])
def get_single_todo(todo_id):
    """Get a single todo from the server"""
    dbTodo = models.Todo.query.get(todo_id)    
    return jsonify( dbTodo.json_view() ), 200

@app.route('/tags', methods = ['GET'])
def get_tags():
    """Get all existing tags from the server"""
    tagsResponse = models.Tag.query.all()
    return jsonify(tags=[i.json_view() for i in tagsResponse])    

@app.route("/tags/<int:tag_id>", methods=['DELETE'])
def delete_tag(tag_id):
    dbTag = models.Tag.query.get(tag_id)
    db.session.delete(dbTag)
    db.session.commit()
    return jsonify( {"result": 200})

@app.route("/tags/<int:tag_id>", methods=['GET'])
def show_tag(tag_id):
    dbTag = models.Tag.query.get(tag_id)
    return jsonify( dbTag.json_view() ), 200

@app.route("/", methods=['GET'])
def notes_list():
   return render_template('index.html')


