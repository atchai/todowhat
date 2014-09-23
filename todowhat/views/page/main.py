from flask.ext.login import login_required
from flask import render_template
from flask.ext.classy import FlaskView, route


class MainView(FlaskView):
    route_base = '/user'
    decorators = []

    @route('/<username>')
    @login_required
    def index(self, username):
        return render_template('index.html', guest=False)
