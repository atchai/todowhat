from flask.ext.login import login_required
from flask import render_template
from flask.ext.classy import FlaskView


class MainView(FlaskView):
    route_base = '/'
    decorators = [login_required]

    def index(self):
        return render_template('index.html')
