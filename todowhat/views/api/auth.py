from flask import jsonify
from flask.ext.classy import FlaskView
from flask.ext.login import current_user


class AuthView(FlaskView):
    trailing_slash = False

    def index(self):
        if current_user.is_authenticated():
            return jsonify({"authenticated": True}), 200
        return jsonify({"authenticated": False}), 400
