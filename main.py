"""
Created: 02/09/2024
Last Updated: 02/09/2024

Authors: Kyle Tranfaglia, Dustin O'Brien, & Timothy McKirgan

This program is the back-end functionality for the web-based application Discrete Mathematical Systems

"""
# Imports
from flask import Flask, render_template, request
from waitress import serve

app = Flask(__name__)

@app.route('/')
@app.route('/index')
def index():
    return "Hello World!"

if __name__ == "main":
    serve(app, host="0.0.0.0", port=8000)