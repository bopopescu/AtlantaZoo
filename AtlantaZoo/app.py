from werkzeug.exceptions import HTTPException
from flask import Flask, request, jsonify, session, make_response
from flask_cors import CORS

import helpers

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.secret_key = 'super secret key'


@app.route('/login', methods=['POST'])
def login():
    return jsonify(message=helpers.login(request.json['email'], request.json['password']))


# just for testing who is logged in
@app.route('/whoami', methods=['GET'])
def whoami():
    return jsonify(username=session['username'])


@app.route('/users', methods=['POST'])
def create_user():
    return jsonify(message=helpers.create_user(request.json['username'],
                                               request.json['email'],
                                               request.json['password'],
                                               request.json['user_type']))


@app.route('/staff', methods=['GET'])
def get_all_staff():
    return jsonify(message=helpers.get_all_staff())


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


@app.route('/exhibits', methods=['POST'])
def create_exhibit():
    return jsonify(message=helpers.create_exhibit(request.json['exhibit_name'],
                                                  request.json['water_feature'],
                                                  request.json['size']))


@app.route('/shows', methods=['POST'])
def create_show():
    return jsonify(message=helpers.create_show(request.json['show_name'],
                                               request.json['show_time'],
                                               request.json['staff_name'],
                                               request.json['exhibit_name']))


@app.route('/shows', methods=['GET'])
def get_all_shows():
    return jsonify(message=helpers.get_all_shows())


@app.route('/animals', methods=['GET'])
def get_all_animals():
    name = request.args.get('name')
    species = request.args.get('species')
    if name and species:
        return jsonify(message=helpers.get_animal(name, species))

    return jsonify(message=helpers.get_all_animals())


@app.route('/animals/<animal_name>/<species>', methods=['DELETE'])
def delete_animal(animal_name, species):
    return jsonify(message=helpers.delete_animal(animal_name, species))


@app.route('/shows/<show_name>/<show_time>', methods=['DELETE'])
def delete_show(show_name, show_time):
    return jsonify(message=helpers.delete_show(show_name, show_time))


@app.route('/users/<username>', methods=['DELETE'])
def delete_user(username):
    return jsonify(message=helpers.delete_user(username))


# log_exhibit_visit
@app.route('/visit_exhibit', methods=['POST'])
def log_exhibit_visit():
    return jsonify(message=helpers.log_exhibit_visit(request.json['visitor_username'],
                                                     request.json['exhibit_name'],
                                                     request.json['visit_time']))

#log_show_visit
@app.route('/visit_show', methods=['POST'])
def log_show_visit():
    return jsonify(message=helpers.log_show_visit(request.json['visitor_username'],
                                                  request.json['show_name'],
                                                  request.json['show_time']))
#log_note
@app.route('/notes', methods=['POST'])
def log_note():
    return jsonify(message=helpers.log_note(request.json['staff_username'],
                                            request.json['log_time'],
                                            request.json['note'],
                                            request.json['animal_name'],
                                            request.json['animal_species']))

@app.errorhandler(HTTPException)
def general_errors(e: HTTPException):
    return make_response(jsonify(message=e.description), e.code)


@app.errorhandler(Exception)
def general_errors(e):
    return make_response(jsonify(message=repr(e)), 500)


if __name__ == '__main__':
    app.run(debug=True)
