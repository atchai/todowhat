#!/usr/bin/env python2
from werkzeug import generate_password_hash
from flask.ext.testing import TestCase
from todowhat import create_app, db
from todowhat.models.user import User
from flask import json
import unittest


class TodoWhatTests(TestCase):

    # Setup
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

    # Authentication helpers

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

    def make_todo(self):
        data = json.dumps(dict(content='a unittest todo'))
        return self.client.post('/todos', data=data,
                                content_type='application/json')
    # Test methods

    # Authentication

    def test_unauthenticated(self):
        """Ensure no user logged in by default"""
        response = self.client.get("/auth")
        self.assertEquals(response.json, dict(authenticated=False))

    def test_users_can_login(self):
        """Ensure users can login to the application"""
        with self.client:
            # Create a dummy user and add it to the session
            self.make_dummy_user()
            # Login with the dummy user
            response = self.login('admin@admin', 'admin')
            self.assert_200(response, message=None)

    def test_user_can_register(self):
        """Ensure a new user can register, and that the newly
            created account is not activated. Then go to account
            activation link and check user is activated"""
        with self.client:
            data = dict(username="test@register.user", password="password")
            self.client.post('/register/',
                             data=data,
                             content_type='application/x-www-form-urlencoded')

            user = db.session.query(User).filter_by(
                username="test@register.user").first()
            self.assertEquals(user.activated, False)
            self.client.get(user.get_activation_link())
            self.assertEquals(user.activated, True)

    def test_unauthenticated_get_todos(self):
        """Ensure attempt to get todos requires login"""
        response = self.client.get("/todos")
        self.assertRedirects(response, '/login/?next=%2Ftodos')

    def test_unauthenticated_get_tags(self):
        """Ensure attempt to get tags requires login"""
        response = self.client.get("/tags")
        self.assertRedirects(response, '/login/?next=%2Ftags')

    def test_unauthenticated_post_todos(self):
        """Ensure todos can not be created on server without login"""
        response = self.make_todo()
        self.assertRedirects(response, '/login/?next=%2Ftodos')

    # Authorization

    def test_authorized_get_todos(self):
        """Ensure a logged in user can GET todos"""
        with self.client:
            self.make_dummy_user()
            self.login('admin@admin', 'admin')
            response = self.client.get("/todos")
            self.assert_200(response, message=None)

    def test_unauthorized_get_todos(self):
        """Ensure a user cannot get the todos of another user"""
        with self.client:
            # Create two dummy users.
            self.make_dummy_user()
            self.make_second_dummy_user()

            # Log the first user in and create a todo.
            self.login('admin@admin', 'admin')
            self.make_todo()
            # Log the first user out.
            self.logout()

            # Log the second user in, send GET to /todos
            self.login('admin2@admin', 'admin')
            response = self.client.get('/todos')
            # Response should return empty array of todos
            self.assertEquals(response.json, dict(todos=[]))
            # Send GET for todo the first user created
            response = self.client.get('/todos/1')
            self.assert_401(response, message=None)

    def test_authorized_put_todos(self):
        """Ensure a logged in user can PUT todos to update them"""
        with self.client:
            self.make_dummy_user()
            self.login('admin@admin', 'admin')
            # Create dummy data and make it json
            self.make_todo()

            # Try to update the order
            data = json.dumps(dict(order=2))
            response = self.client.put('/todos/1', data=data,
                                       content_type='application/json')
            self.assert_200(response, message=None)

            # Try to update the tags
            tags_data = dict(tags=['tag1', 'tag2'])
            data = json.dumps(tags_data)
            response = self.client.put('/todos/1', data=data,
                                       content_type='application/json')
            self.assert_200(response, message=None)

            # Check the tags are equal to what was sent in the PUT request
            response = self.client.get('/todos/1')
            self.assertEquals(response.json['tags'], tags_data['tags'])

    def test_authorized_post_todos(self):
        """Ensure a logged in user can create a todo on the server"""
        with self.client:
            # Create a dummy user and add it to the session
            self.make_dummy_user()
            # Login with the dummy user
            self.login('admin@admin', 'admin')

            response = self.make_todo()
            self.assert_status(response, 201, message=None)

    def test_post_todos_invalid_JSON(self):
        """Ensure a todo cannot be created if invalid JSON is posted"""
        with self.client:
            # Create a dummy user and add it to the session
            self.make_dummy_user()
            # Login with the dummy user
            self.login('admin@admin', 'admin')

            # Try to post the data to server
            response = self.client.post('/todos',
                                        data="This is totally valid JSON mate",
                                        content_type='application/json')
            self.assert_status(response, 400, message=None)

    def test_authorized_delete_todo(self):
        """Ensure a logged in user can delete a todo"""
        with self.client:
            self.make_dummy_user()
            # Login with the dummy user
            self.login('admin@admin', 'admin')

            #  # Create dummy data and make it json
            # data = json.dumps(dict(content='a unittest for delete todo'))

            # # Try to post the data to server
            # self.client.post('/todos', data=data,
            #                  content_type='application/json')
            self.make_todo()

            response = self.client.delete('/todos/1')
            self.assert_200(response, message=None)
            response = self.client.get('/todos')
            self.assertEquals(response.json, dict(todos=[]))

if __name__ == '__main__':
    unittest.main()
