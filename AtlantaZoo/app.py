from werkzeug.exceptions import HTTPException
from flask import Flask, request, jsonify, session, make_response
from flask_cors import CORS

import helpers

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.secret_key = 'super secret key'


@app.route('/login', methods=['POST'])
def login():
    login_message = helpers.login(request.json['email'], request.json['password'])
    user = helpers.get_user_by_username(session['username'])
    return jsonify(message=login_message,
                   username=user['username'],
                   email=user['email'],
                   user_type=user['user_type'])


# just for testing who is logged in
@app.route('/whoami', methods=['GET'])
def whoami():
    user = helpers.get_user_by_username(session['username'])
    return jsonify(email=user['email'], username=user['username'],
                   user_type=user['user_type'])


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

@app.route('/exhibits', methods=['POST','GET'])
def create_exhibit():

    if request.method == 'POST':
        return jsonify(message=helpers.create_exhibit(request.json['exhibit_name'],
                                                  request.json['water_feature'],
                                                  request.json['size']))
    if request.method == 'GET':
        name = request.args.get('exhibit_name')
        water = request.args.get('water_feature')
        min_size = request.args.get('min_size')
        max_size = request.args.get('max_size')
        min_animal = request.args.get('min_animal_num')
        max_animal = request.args.get('max_animal_num')
        sort = request.args.get("sort")
        order = request.args.get("order")
        if name and not (water or min_size or max_size or min_animal or max_animal):
            return jsonify(message=helpers.get_exhibit_details(name))

        return jsonify(message=helpers.search_exhibit(name, water, min_size, max_size, min_animal, max_animal, sort, order))


@app.route('/shows', methods=['POST'])
def create_show():
    return jsonify(message=helpers.create_show(request.json['show_name'],
                                               request.json['show_time'],
                                               request.json['staff_name'],
                                               request.json['exhibit_name']))


@app.route('/shows', methods=['GET'])
def get_all_shows():
    staff_name = request.args.get('staff_name')
    show_name = request.args.get('show_name')
    date = request.args.get('show_time')
    exhibit = request.args.get('exhibit_name')
    sort = request.args.get("sort")
    order = request.args.get("order")
    if staff_name and not (show_name or date or exhibit):
        filters = request.args.to_dict()
        return jsonify(message=helpers.get_show(**filters))
    if staff_name or show_name or date or exhibit or order or sort:
        return jsonify(message=helpers.search_show(show_name, date, exhibit, staff_name, sort, order))
    return jsonify(message=helpers.get_all_shows())


@app.route('/animals', methods=['GET'])
def get_all_animals():
    name = request.args.get('name')
    species = request.args.get('species')
    animal_type = request.args.get('animal_type')
    min_age = request.args.get('min_age')
    max_age = request.args.get('max_age')
    exhibit_name = request.args.get('exhibit_name')
    sort = request.args.get("sort")
    order = request.args.get("order")

    if name and species and not(animal_type or min_age or max_age or exhibit_name):
        return jsonify(message=helpers.get_animal(name, species))

    if name or species or animal_type or min_age or max_age or exhibit_name or sort or order:
        return jsonify(message=helpers.search_animal(name, species, animal_type, min_age, max_age, exhibit_name, sort, order))

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
@app.route('/visit_exhibit', methods=['POST', 'GET'])
def log_exhibit_visit():
    if request.method == 'POST':
        return jsonify(message=helpers.log_exhibit_visit(request.json['visitor_username'],
                                                     request.json['exhibit_name']))
    if request.method == 'GET':
        visitor_name = request.args.get('visitor_username')
        exhibit_name = request.args.get('exhibit_name')
        date = request.args.get('time')
        min_visits = request.args.get('min_visits')
        max_visits = request.args.get('max_visits')
        sort = request.args.get("sort")
        order = request.args.get("order")
        return jsonify(message=helpers.search_exhibit_history(visitor_name, exhibit_name, date, min_visits, max_visits, sort, order))


#log_show_visit
@app.route('/visit_show', methods=['POST', 'GET'])
def log_show_visit():
    if request.method == 'POST':
        return jsonify(message=helpers.log_show_visit(request.json['visitor_username'],
                                                  request.json['show_name'],
                                                  request.json['show_time']))
    if request.method == 'GET':
        visitor_name = request.args.get('visitor_username')
        show_name = request.args.get('show_name')
        show_time = request.args.get('show_time')
        exhibit_name = request.args.get('exhibit_name')
        sort = request.args.get("sort")
        order = request.args.get("order")
        return jsonify(message=helpers.search_show_history(visitor_name, show_name, show_time, exhibit_name, sort, order))
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
