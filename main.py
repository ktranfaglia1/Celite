"""
Created: 02/09/2024
Last Updated: 02/09/2024

Authors: Kyle Tranfaglia, Dustin O'Brien, & Timothy McKirgan

This program is the back-end functionality for the web-based application Discrete Mathematical Systems

"""
# Imports
from flask import Flask, render_template
from waitress import serve


lattice = [1, 0, 0 ,0,  1, 1, 1, 0, 1, 0]

app = Flask(__name__)

@app.route('/')
def startScreen():
    return render_template('index.html')
    return "Hello World"

# App startup
if __name__ == "main":
    serve(app, host="0.0.0.0", port=8000)
