# What Todo
Todo app made with Backbone.js

## Demo
[Demo on heroku](http://atchai-whattodo.heroku.com)
## Installation
```
sudo apt-get install npm python-pip python-dev
python virtualenv.py flask
sudo pip install virtualenv
virtualenv flask && source flask/bin/activate
pip install -r requirements.txt
sudo npm install
gulp
./db_create.py
./run.py || gunicorn run:app
```
### Testing
```
npm test
```
