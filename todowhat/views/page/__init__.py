from flask import Blueprint

from todowhat.views.page.login import LoginView
from todowhat.views.page.logout import LogoutView
from todowhat.views.page.main import MainView
from todowhat.views.page.register import RegisterView
from todowhat.views.page.guest import GuestView
from todowhat.views.page.legal import LegalView

page = Blueprint('page', __name__)

LoginView.register(page)
LogoutView.register(page)
MainView.register(page)
RegisterView.register(page)
GuestView.register(page)
LegalView.register(page)
