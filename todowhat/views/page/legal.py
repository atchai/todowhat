from flask.ext.classy import FlaskView, route
from flask import request, url_for, render_template, flash, redirect
from flask.ext.login import login_user


class LegalView(FlaskView):
    route_base = '/'

    @route('/terms/')
    def terms(self):
        return render_template('terms.html')

    @route('/privacy/')
    def privacy(self):
        return render_template('privacy.html')
