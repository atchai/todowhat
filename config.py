import os


class BaseConfiguration(object):
    DEBUG = True
    SECRET_KEY = 'flask-session-insecure-secret-key'
    HASH_ROUNDS = 100000

    # email server
    MAIL_SERVER = 'smtp.mandrillapp.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = False
    MAIL_USE_SSL = False
    MAIL_USERNAME = 'app29149508@heroku.com'
    MAIL_PASSWORD = 'tNmPygMAlNO5FbIs6V0X0g'
    # administrator list


class DevConfiguration(BaseConfiguration):
    basedir = os.path.abspath(os.path.dirname(__file__))

    if os.environ.get('DATABASE_URL') is None:
        SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')
    else:
        SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']

    SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'db_repository')


class TestConfiguration(BaseConfiguration):
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    MAIL_SUPPRESS_SEND = True
