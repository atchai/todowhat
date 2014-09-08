from flask.ext.classy import FlaskView
from flask import g, jsonify

from what_todo.models.tag import Tag


class TagsView(FlaskView):
    trailing_slash = False

    def index(self):
        """Get all tags from todos belonging to user from the server"""
        tagsResponse = []

        # For each tag in database, check if their todos belong to the user
        for tag in Tag.query.all():
            for todo in tag.todos.all():
                # If they do, add the tag to array
                if todo.user_id == g.user.id:
                    tagsResponse.append(tag)

        return jsonify(tags=[i.json_view() for i in tagsResponse])

    def get(self, id):
        """Get a single todo by its id"""
        dbTag = Tag.query.get(int(id))
        if dbTag is None:
            return jsonify({'response': 404}), 404
        return jsonify(dbTag.json_view()), 200
