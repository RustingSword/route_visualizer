#!/bin/sh
gunicorn app:app --error-logfile error.log --reload --capture-output -p server.pid -D
