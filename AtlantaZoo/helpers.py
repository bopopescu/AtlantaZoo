from flask import session, abort as flask_abort, make_response, jsonify
from Connect import connection


# def get_users():

def abort(status_code, **fields):
    flask_abort(make_response(jsonify(**fields), status_code))

def validate_registration(username, email):
    conn, curr = connection()


    #how to do with parameterization
    curr.execute("SELECT * FROM User WHERE username = %s;", (username, ))
    results = curr.fetchall()
    if len(results) > 0:
        return False

    curr.execute("SELECT * FROM User WHERE email = %s;", (email, ))

    results = curr.fetchall()
    if len(results) > 0:
        return False

    return True


def create_user(username, email, password, user_type):
    conn, curr = connection()

    if validate_registration(username, email):

        curr.execute("INSERT INTO User(username, email, password, user_type) "
                     "VALUES (%s, %s, %s, %s);", (username, email,
                                                   password, user_type))
        conn.commit()
        curr.close()
        conn.close()

        session['logged_in'] = True
        session['username'] = username

        return "User was successfully created"
    else:
        abort(400, message="Duplicate user given")

def login(username, password):
    conn, curr = connection()

    curr.execute('SELECT * FROM User where username = %s and password = %s', (username, password))
    row = curr.fetchone()
    if row is None:
        abort(401, message="Incorrect username or password")

    session['logged_in'] = True
    session['username'] = username

    curr.close()
    conn.close()

    return "Successfully logged in"

def create_exhibit(exhibit_name, water_feature, size):
    conn, curr = connection()
    curr.execute("INSERT INTO Exhibit(exhibit_name, water_feature, size) "
                 "VALUES (%s, %s, %s);", (exhibit_name, water_feature, size))
    conn.commit()
    curr.close()
    conn.close()

    session['create_exhibit'] = True
    session['exhibit_name'] = exhibit_name

    return "Exhibit was successfully created"

def create_animal(animal_name, species, animal_type, age, exhibit_name):
    conn, curr = connection()
    curr.execute("INSERT INTO Animal(animal_name, species, animal_type, age, exhibit_name) "
                 "VALUES (%s, %s, %s, %s, %s);", (animal_name, species, animal_type, age, exhibit_name))
    conn.commit()
    curr.close()
    conn.close()

    session['create_animal'] = True
    session['animal_name'] = animal_name
    session['species'] = species

    return "Animal was successfully created"

def create_show(show_name, show_time, staff_name, exhibit_name):
    conn, curr = connection()
    curr.execute("INSERT INTO `Show`(show_name, show_time, staff_name, exhibit_name) "
                 "VALUES (%s, %s, %s, %s);", (show_name, show_time, staff_name, exhibit_name))
    conn.commit()
    curr.close()
    conn.close()

    session['create_show'] = True
    session['show_name'] = show_name
    session['show_time'] = show_time

    return "Show was successfully created"

def delete_animal(animal_name, species):
    conn, curr = connection()

    curr.execute("DELETE FROM Animal "
                 "WHERE animal_name = %s and species = %s;",
                 (animal_name, species))

    conn.commit()
    curr.close()
    conn.close()

    return "Animal was successfully deleted"

def delete_show(show_name, show_time):
    conn, curr = connection()

    curr.execute("DELETE FROM `Show` WHERE show_name = %s and show_time = %s;", (show_name, show_time))

    conn.commit()
    curr.close()
    conn.close()

    return "Show was successfully deleted"
