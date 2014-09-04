from flask.ext.login import login_required
from flask import render_template, Blueprint
from flask.ext.classy import FlaskView

#for index route
main = Blueprint('main', __name__)

class MainView(FlaskView):
    route_base = '/'
    decorators = [login_required]
    def index(self):
        return render_template('index.html')

MainView.register(main)