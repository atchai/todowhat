#!/usr/bin/env python2
from flask import Flask, g
from flask.ext.login import LoginManager, current_user
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.mail import Mail
from werkzeug import generate_password_hash
from flask.ext.testing import TestCase
from todowhat import create_app, db
from todowhat.models.user import User
from flask import url_for, json
import unittest
import flask.ext.testing


class MyTest(TestCase):

    # Helper methods

    def setUp(self):
        """Set up test database"""
        db.create_all()

    def tearDown(self):
        """Tear down test database"""
        db.session.close()
        db.drop_all()

    def create_app(self):
        """Create the app with tests config"""
        return create_app('config.TestConfiguration')

    def login(self, username, password):
        """Helper function to login to application"""
        return self.client.post('/login/', data=dict(
            username=username,
            password=password
        ), follow_redirects=True)

    def logout(self):
        return self.client.get('/logout')

    def make_dummy_user(self):
        """Creates a dummy user and adds it to the session"""
        pwdhash = generate_password_hash('admin')
        u = User(username='admin@admin', pwdhash=pwdhash, activated=True)
        db.session.add(u)
        db.session.commit()

    def make_second_dummy_user(self):
        """Creates a dummy user and adds it to the session"""
        pwdhash = generate_password_hash('admin')
        u = User(username='admin2@admin', pwdhash=pwdhash, activated=True)
        db.session.add(u)
        db.session.commit()

    # Test methods
    def test_user_cant_other(self):
        with self.client:
            self.make_dummy_user()
            self.make_second_dummy_user()
            self.login('admin@admin', 'admin')
            data = dict(content='a unittest for 2 users todo')
            data = json.dumps(data)

            # Try to post the data to server
            self.client.post('/todos', data=data,
                             content_type='application/json')
            response1 = self.client.get('/todos')
            print response1.data

            self.logout()
            self.login('admin2@admin', 'admin')
            response2 = self.client.get('/todos')
            print response2.data

    def test_unauth(self):
        """Ensure no user logged in by default"""
        response = self.client.get("/auth")
        self.assertEquals(response.json, dict(authenticated=False))

    def test_get_todos_unauth(self):
        """Ensure attempt to get todos requires login"""
        response = self.client.get("/todos")
        self.assertRedirects(response, '/login/?next=%2Ftodos')

    def test_get_todos_auth(self):
        with self.client:
            self.make_dummy_user()
            self.login('admin@admin', 'admin')
            response = self.client.get("/todos")
            self.assert_200(response, message=None)
            # print response.data

    def test_users_can_login(self):
        """Ensure users can login to the application"""
        with self.client:
            # Create a dummy user and add it to the session
            self.make_dummy_user()
            # Login with the dummy user
            response = self.login('admin@admin', 'admin')
            self.assert_200(response, message=None)

    def test_post_todos_unauth(self):
        """Ensure todos can not be created on server without login"""

        # Create dummy data and make it json
        data = dict(content='a unittest todo')
        data = json.dumps(data)
        # Try to post the data to server
        response = self.client.post('/todos', data=data,
                                    content_type='application/json')
        self.assertRedirects(response, '/login/?next=%2Ftodos')

    def test_post_todos_auth(self):
        """Ensure a logged in user can create a todo on the server"""
        with self.client:
            # Create a dummy user and add it to the session
            self.make_dummy_user()
            # Login with the dummy user
            self.login('admin@admin', 'admin')

             # Create dummy data and make it json
            data = dict(content='a unittest todo')
            data = json.dumps(data)

            # Try to post the data to server
            response = self.client.post('/todos', data=data,
                                        content_type='application/json')
            self.assert_status(response, 201, message=None)

    def test_post_todos_invalid_JSON(self):
        """Ensure a todo cannot be created if invalid JSON is posted"""
        with self.client:
            # Create a dummy user and add it to the session
            self.make_dummy_user()
            # Login with the dummy user
            self.login('admin@admin', 'admin')

            # Try to post the data to server
            response = self.client.post('/todos', data="This is totally valid JSON mate",
                                        content_type='application/json')
            self.assert_status(response, 400, message=None)

    def test_delete_todo_auth(self):
        """Ensure a logged in user can delete a todo"""
        with self.client:
            self.make_dummy_user()
            # Login with the dummy user
            self.login('admin@admin', 'admin')

             # Create dummy data and make it json
            data = dict(content='a unittest for delete todo')
            data = json.dumps(data)

            # Try to post the data to server
            self.client.post('/todos', data=data,
                                        content_type='application/json')

            response = self.client.get('/todos')
            response = self.client.delete('/todos/1')
            self.assert_200(response, message=None)
            response = self.client.get('/todos')

if __name__ == '__main__':
    unittest.main()
