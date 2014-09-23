#!/usr/bin/env python2
from todowhat import create_app

app = create_app('config.DevConfiguration')

if __name__ == "__main__":
    app.run(host='0.0.0.0')
