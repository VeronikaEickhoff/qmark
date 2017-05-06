#!/bin/bash

# make sure the Redis server is working on localhost:6379 before running
export FLASK_APP=brain_server.py
python -m flask run --host=0.0.0.0 --port=5000
