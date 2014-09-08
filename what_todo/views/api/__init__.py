from flask import Blueprint

from what_todo.views.api.tags import TagsView
from what_todo.views.api.todos import TodosView

# API views
api = Blueprint('api', __name__)

TagsView.register(api)
TodosView.register(api)
