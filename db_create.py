#!/usr/bin/env python2
from migrate.versioning import api
from config import DevConfiguration

import os.path

from todowhat import db
from app import app

with app.app_context():
    db.create_all()

if not os.path.exists(DevConfiguration.SQLALCHEMY_MIGRATE_REPO):
    api.create(DevConfiguration.SQLALCHEMY_MIGRATE_REPO, 'database repository')
    api.version_control(DevConfiguration.SQLALCHEMY_DATABASE_URI, DevConfiguration.SQLALCHEMY_MIGRATE_REPO)
else:
    api.version_control(DevConfiguration.SQLALCHEMY_DATABASE_URI, DevConfiguration.SQLALCHEMY_MIGRATE_REPO, api.version(DevConfiguration.SQLALCHEMY_MIGRATE_REPO))
