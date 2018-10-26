from flask import Flask, request, jsonify, session

import helpers

app = Flask(__name__)

app.secret_key = 'super secret key'

@app.route('/login', methods=['POST'])
def login():
    return jsonify(message=helpers.login(request.json['username'], request.json['password']))

@app.route('/whoami', methods=['GET'])
def whoami():
    return jsonify(username=session['username'])

@app.route('/users', methods=['POST'])
def create_user():
    return jsonify(message=helpers.create_user(request.json['username'],
                                               request.json['email'],
                                               request.json['password'],
                                               request.json['user_type']))
@app.route('/logout', methods=['GET'])
def logout():
    session.clear()
    return jsonify(message='You have successfully logged out')


if __name__ == '__main__':
    app.run(debug=True)
