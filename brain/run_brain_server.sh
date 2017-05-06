#!/bin/bash
export FLASK_APP=brain_server.py
python -m flask run --host=0.0.0.0 --port=5000
