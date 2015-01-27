import os


class BaseConfiguration(object):
    """Shared configuration options for testing and development."""

    DEBUG = False
    SECRET_KEY = os.environ.get('SECRET_KEY', 'default_secret_key')

    # Email server settings
    MAIL_SERVER = 'smtp.mandrillapp.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = False
    MAIL_USE_SSL = False
    MAIL_USERNAME = os.environ.get('MANDRILL_USERNAME', 'app29765757@heroku.com')
    MAIL_PASSWORD = os.environ.get('MANDRILL_APIKEY', 'MshbA-KuRKHJJavgOI7PLA')
    ON_HEROKU = False


class DevConfiguration(BaseConfiguration):
    """Configuration options for development."""

    basedir = os.path.abspath(os.path.dirname(__file__))

    # See if app is running on heroku.
    if os.environ.get('DATABASE_URL') is None:
        SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir,
                                                              'app.db')
    else:
        SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
        ON_HEROKU = True

    SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'db_repository')


class TestConfiguration(BaseConfiguration):
    """Configuration options for testing"""

    # Use in-memory database for testing.
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    MAIL_SUPPRESS_SEND = True
