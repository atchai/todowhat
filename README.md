# What Todo
Todo app made with Backbone.js

## Demo
[Demo on heroku](http://atchai-whattodo.heroku.com)
## Installation
```
python virtualenv.py flask
sudo apt-get build-dep python-psycopg2
flask/bin/pip install -r requirements.txt
sudo npm install
gulp
./db_create.py
./run.py || gunicorn run:app
```
### Testing
```
npm test
```