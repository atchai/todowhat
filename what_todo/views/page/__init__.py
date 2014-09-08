from flask import Blueprint

from what_todo.views.page.login import LoginView
from what_todo.views.page.logout import LogoutView
from what_todo.views.page.main import MainView
from what_todo.views.page.register import RegisterView

page = Blueprint('page', __name__)

LoginView.register(page)
LogoutView.register(page)
MainView.register(page)
RegisterView.register(page)
