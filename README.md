# TodoWhat
Todowhat is a task management tool built with backbone.js and Flask.

## Demo
[Demo on heroku](https://todowhat.herokuapp.com)

## Documentation
Todowhat was built as an intern project by Andrew Low at [Atchai Digital](http://www.atchai.com). There are several resources available to help others use it as a didactic tool:

* [Blog posts](http://atchai.com/blog/naked-internship-part-1-introducing-todowhat)
* [User stories](https://github.com/atchai/todowhat/wiki/User-Stories)

## Installation
```
git clone git@github.com:atchai/todowhat.git
cd todowhat
sudo apt-get install npm python-pip python-dev
sudo pip install virtualenv
virtualenv flask
. flask/bin/activate
pip install -r requirements.txt
npm install
gulp
./db_create.py
./run.py
```

In your browser, navigate to:
``` http://127.0.0.1:5000 ```

### Development
While developing, use ```gulp watch``` to continuously watch JavaScript source files for changes and recompile.

### Testing
**JavaScript/Front-end testing:**
```
npm test
```
**Python/Back-end testing:**
(must activate the virtualenv)
```
./tests.py
```
