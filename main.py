"""
Created: 02/09/2024
Last Updated: 02/09/2024

Authors: Kyle Tranfaglia, Dustin O'Brien, & Timothy McKirgan

This program is the back-end functionality for the web-based application Discrete Mathematical Systems

"""
# Imports
from flask import Flask
from waitress import serve

app = Flask(__name__)

@app.route('/')
def startScreen():
    return render_template('templates/index.html')

@app.route('/index')
def indexScreen():
    return "Welcome to Index Screen"

# App startup
if __name__ == "main":
    serve(app, host="0.0.0.0", port=8000)
