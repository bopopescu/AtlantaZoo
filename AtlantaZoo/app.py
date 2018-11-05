from flask import Flask, request, jsonify, session

import helpers

# from MySQLdb import escape_string as thwart
app = Flask(__name__)

app.secret_key = 'super secret key'

@app.route('/login', methods=['POST'])
def login():
    return jsonify(message=helpers.login(request.json['username'], request.json['password']))

#just for testing who is logged in
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



@app.route('/animals', methods=['POST'])
def create_animal():
    return jsonify(message=helpers.create_animal(request.json['animal_name'],
                                                 request.json['species'],
                                                 request.json['animal_type'],
                                                 request.json['age'],
                                                 request.json['exhibit_name']))

@app.route('/exhibit', methods=['POST'])
def create_exhibit():
    return jsonify(message=helpers.create_exhibit(request.json['exhibit_name'],
                                                  request.json['water_feature'],
                                                  request.json['size']))

@app.route('/show', methods=['POST'])
def create_show():
    return jsonify(message=helpers.create_show(request.json['show_name'],
                                               request.json['show_time'],
                                               request.json['staff_name'],
                                               request.json['exhibit_name']))

@app.route('/deleteAnimal', methods=['POST'])
def delete_animal():
    return jsonify(message=helpers.delete_animal(request.json['animal_name'],
                                                 request.json['species']))

@app.route('/deleteShow', methods=['POST'])
def delete_show():
    return jsonify(message=helpers.delete_show(request.json['show_name'],
                                                 request.json['show_time']))

if __name__ == '__main__':
    app.run(debug=True)
