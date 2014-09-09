from flask import render_template
from flask.ext.classy import FlaskView


class GuestView(FlaskView):
    route_base = '/'
    decorators = []

    def index(self):
        return render_template('index.html')
