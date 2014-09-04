from flask.ext.classy import FlaskView
from flask import g, jsonify, Blueprint
from what_todo.models.tag import Tag

tags = Blueprint('tags', __name__)

class TagsView(FlaskView):
    trailing_slash=False

    def index(self):
        """Get all existing tags from the server"""
        tagsResponse = []
        for tag in Tag.query.all():
            for todo in tag.todos.all():
                if todo.user_id == g.user.id:
                    tagsResponse.append(tag)
        # tagsResponse = Tag.query.all()
        return jsonify(tags=[i.json_view() for i in tagsResponse])

    def get(self, id):
        id = int(id)
        dbTag = Tag.query.get(id)
        if dbTag == None:
            return jsonify({'response': 404}), 404
        return jsonify( dbTag.json_view() ), 200

TagsView.register(tags)