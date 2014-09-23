import os

from flask import jsonify, abort, redirect, flash, url_for
from flask.ext.classy import FlaskView, route
from flask.ext.login import current_user
from todowhat.models.user import User
from itsdangerous import BadSignature, URLSafeSerializer


class AuthView(FlaskView):
    trailing_slash = False

    def index(self):
        """Check if a user is logged in."""
        if current_user.is_authenticated():
            return jsonify({"authenticated": True}), 200
        return jsonify({"authenticated": False}), 400

    def get_serializer(self):
        return URLSafeSerializer(os.environ['SECRET_KEY'])

    @route('/users/activate/<payload>')
    def activate_user(self, payload):
        """Activate a user account when they navigate to activation link."""
        s = self.get_serializer()
        try:
            user_id = s.loads(payload)
        except BadSignature:
            abort(404)

        user = User.query.get_or_404(user_id)
        user.activate()
        flash('User activated', 'success')
        return redirect(url_for('page.LoginView:index'))
