#!/usr/bin/env python2
from werkzeug import generate_password_hash
from flask.ext.testing import TestCase
from todowhat import create_app, db
from todowhat.models.user import User
from flask import json
import unittest


class BaseTestCase(TestCase):
    """Base class with app setup and helper functions for other
    test classes to inherit from.
    """

    def setUp(self):
        """Set up test database."""
        db.create_all()

    def tearDown(self):
        """Tear down test database."""
        db.session.close()
        db.drop_all()

    def create_app(self):
        """Create the app with testing config options."""
        return create_app('config.TestConfiguration')

    # Authentication helpers

    def login(self, username, password):
        """Login to application."""
        return self.client.post('/login/', data=dict(
            username=username,
            password=password
        ), follow_redirects=True)

    def logout(self):
        return self.client.get('/logout')

    def login_dummy_user(self):
        """Create a dummy user and log in with it."""
        self.make_dummy_user()
        self.login('admin@admin', 'admin')

    def make_dummy_user(self):
        """Create a dummy user and add it to the session."""
        pwdhash = generate_password_hash('admin')
        u = User(username='admin@admin', pwdhash=pwdhash, activated=True)
        db.session.add(u)
        db.session.commit()

    def make_second_dummy_user(self):
        """Creates a dummy user and adds it to the session."""
        pwdhash = generate_password_hash('admin')
        u = User(username='admin2@admin', pwdhash=pwdhash, activated=True)
        db.session.add(u)
        db.session.commit()

    def make_todo(self):
        """Post a dummy todo to the server."""
        data = json.dumps(dict(content='a unittest todo'))
        return self.client.post('/todos', data=data,
                                content_type='application/json')


class UnauthenticatedTests(BaseTestCase):
    """Test case for unauthenticated (no user logged in) scenarios."""

    def test_unauthenticated(self):
        """Ensure no user logged in by default."""
        response = self.client.get("/auth")
        self.assertEquals(response.json, dict(authenticated=False))

    def test_unauthenticated_get_todos(self):
        """Ensure attempt to get todos requires login."""
        response = self.client.get("/todos")
        self.assertRedirects(response, '/login/?next=%2Ftodos')

    def test_unauthenticated_get_tags(self):
        """Ensure attempt to get tags requires login."""
        response = self.client.get("/tags")
        self.assertRedirects(response, '/login/?next=%2Ftags')

    def test_unauthenticated_post_todos(self):
        """Ensure todos can not be created on server without login."""
        response = self.make_todo()
        self.assertRedirects(response, '/login/?next=%2Ftodos')


class AuthenticationTests(BaseTestCase):
    """Test case for authentication scenarios."""

    def test_user_can_login(self):
        """Ensure users can login to the application"""
        with self.client:
            # Create a dummy user and add it to the session
            self.make_dummy_user()
            # Login with the dummy user
            response = self.login('admin@admin', 'admin')
            self.assert_200(response, message=None)

    def test_user_can_register(self):
        """Ensure a new user can register.

        Register a dummy user. Check the newly created account
        is not activated. Go to account activation link then
        check user is now activated.
        """

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

    # Error Testing
    def test_404_error(self):
        """Ensure 404 raised on unexisting resource."""
        with self.client:
            response = self.client.get('/thisresourcedoesntexit')
            self.assert_404(response, message=None)

    def test_405_error(self):
        """Ensure 405 raised for forbidden methods."""
        with self.client:
            response = self.client.post('/tags',
                                        data="tag",
                                        content_type='application/json')
            self.assert_405(response, message=None)


class AuthorizationTests(BaseTestCase):
    """Test case for authorized (user logged in) scenarios."""

    def test_authorized_get_todos(self):
        """Ensure a logged in user can GET todos."""
        with self.client:
            self.login_dummy_user()
            response = self.client.get("/todos")
            self.assert_200(response, message=None)

    def test_authorized_post_todos(self):
        """Ensure a logged in user can create a todo on the server."""
        with self.client:
            # Create a dummy user and add it to the session
            self.login_dummy_user()

            response = self.make_todo()
            self.assert_status(response, 201, message=None)

    def test_authorized_put_todos(self):
        """Ensure a logged in user can PUT todos to update them."""
        with self.client:
            self.login_dummy_user()
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

    def test_authorized_delete_todo(self):
        """Ensure a logged in user can delete a todo."""
        with self.client:
            self.login_dummy_user()
            self.make_todo()

            response = self.client.delete('/todos/1')
            self.assert_200(response, message=None)
            response = self.client.get('/todos')
            self.assertEquals(response.json, dict(todos=[]))

    def test_post_todos_invalid_JSON(self):
        """Ensure a todo cannot be created if invalid JSON is posted."""
        with self.client:
            # Create a dummy user and add it to the session
            self.login_dummy_user()
            # Try to post the data to server
            response = self.client.post('/todos',
                                        data="This is totally valid JSON mate",
                                        content_type='application/json')
            self.assert_status(response, 400, message=None)


class UnauthorizedTests(BaseTestCase):
    """Test case for unauthorized (different user logged in) scenarios."""

    def make_todo_login_second_user(self):
        self.make_dummy_user()
        self.make_second_dummy_user()
        # Log the first user in and create a todo.
        self.login('admin@admin', 'admin')
        self.make_todo()
        # Log the first user out.
        self.logout()
        # Log the second user in.
        self.login('admin2@admin', 'admin')

    def test_unauthorized_get_todos(self):
        """Ensure a user cannot get the todos of another user."""
        with self.client:
            self.make_todo_login_second_user()
            response = self.client.get('/todos')
            # Response should return empty array of todos.
            self.assertEquals(response.json, dict(todos=[]))
            # Send GET for todo the first user created.
            response = self.client.get('/todos/1')
            self.assert_401(response, message=None)

    def test_unauthorized_put_todo(self):
        """Ensure a user cannot change the todos of another user."""
        with self.client:
            self.make_todo_login_second_user()
            data = json.dumps(dict(order=2))

            response = self.client.put('/todos/1', data=data,
                                       content_type='application/json')
            self.assert_401(response, message=None)

    def test_unauthorized_delete_todo(self):
        """Ensure a user cannot delete the todos of another user."""
        with self.client:
            self.make_todo_login_second_user()
            response = self.client.delete('/todos/1')
            self.assert_401(response, message=None)


if __name__ == '__main__':
    unittest.main()
