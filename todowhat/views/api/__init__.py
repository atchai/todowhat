from flask import Blueprint

from todowhat.views.api.tags import TagsView
from todowhat.views.api.todos import TodosView
from todowhat.views.api.auth import AuthView

# API views
api = Blueprint('api', __name__)

TagsView.register(api)
TodosView.register(api)
AuthView.register(api)
