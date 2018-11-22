from flask import session, abort as flask_abort, make_response, jsonify
from Connect import connection

from datetime import datetime
from passlib.hash import argon2


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
                     "VALUES (%s, %s, %s, %s);", (username, email, argon2.hash(password), user_type))
        conn.commit()
        curr.close()
        conn.close()

        session['logged_in'] = True
        session['username'] = username

        return "User was successfully created"
    else:
        abort(400, message="Duplicate user given")

def login(email, password):
    conn, curr = connection()

    curr.execute('SELECT * FROM User where email = %s ', (email, ))
    row = curr.fetchone()
    if row is None:
        abort(401, message="Incorrect username or password")

    if not argon2.verify(password, row['password']):
        abort(401, message="Incorrect username or password")

    session['logged_in'] = True
    session['email'] = email

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

    return "Exhibit was successfully created"

def create_animal(animal_name, species, animal_type, age, exhibit_name):
    conn, curr = connection()
    curr.execute("INSERT INTO Animal(animal_name, species, animal_type, age, exhibit_name) "
                 "VALUES (%s, %s, %s, %s, %s);", (animal_name, species, animal_type, age, exhibit_name))
    conn.commit()
    curr.close()
    conn.close()

    return "Animal was successfully created"

def create_show(show_name, show_time, staff_name, exhibit_name):
    conn, curr = connection()
    curr.execute("INSERT INTO `Show`(show_name, show_time, staff_name, exhibit_name) "
                 "VALUES (%s, %s, %s, %s);", (show_name, datetime.fromtimestamp(int(show_time)), staff_name, exhibit_name))
    conn.commit()
    curr.close()
    conn.close()

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

    curr.execute("DELETE FROM `Show` WHERE show_name = %s and show_time = %s;",
                 (show_name, datetime.fromtimestamp(int(show_time))))

    conn.commit()
    curr.close()
    conn.close()

    return "Show was successfully deleted"

def delete_user(username):
    conn, curr = connection()

    curr.execute("DELETE FROM `User` WHERE username = %s;", (username,))

    conn.commit()
    curr.close()
    conn.close()

    return "User was successfully deleted"


def get_all_exhibits():
    conn, curr = connection()

    curr.execute("SELECT * FROM Exhibit")

    results = curr.fetchall()

    conn.commit()
    curr.close()
    conn.close()
    return results

# gets size, exhibit name, and water feature
# but not number of animals (call get_exhibit_animals for that)
def get_exhibit_details(exhibit):
    conn, curr = connection()

    curr.execute("SELECT * FROM Exhibit WHERE exhibit_name = %s", (exhibit, ))

    results = curr.fetchall()

    conn.commit()
    curr.close()
    conn.close()
    return results

def get_exhibit_animals(exhibit):
    conn, curr = connection()

    curr.execute("SELECT COUNT(*) FROM Animal WHERE exhibit_name = %s", (exhibit, ))

    results = curr.fetchone()

    conn.commit()
    curr.close()
    conn.close()
    return results

def get_all_animals():
    conn, curr = connection()

    curr.execute("SELECT * FROM Animal")

    results = curr.fetchall()

    conn.commit()
    curr.close()
    conn.close()
    return results

def get_all_shows():
    conn, curr = connection()

    curr.execute("SELECT * FROM `Show`")

    results = curr.fetchall()
    for result in results:
        result['show_time'] = int(result['show_time'].timestamp())

    conn.commit()
    curr.close()
    conn.close()
    return results

def get_all_visitors():
    conn, curr = connection()

    curr.execute("SELECT username, email FROM `User` WHERE user_type = \"Visitor\"")

    results = curr.fetchall()

    conn.commit()
    curr.close()
    conn.close()
    return results

def get_all_staff():
    conn, curr = connection()

    curr.execute("SELECT username, email FROM `User` WHERE user_type = \"Staff\"")

    results = curr.fetchall()

    conn.commit()
    curr.close()
    conn.close()
    return results

def get_animal(name, species):
    conn, curr = connection()

    curr.execute("SELECT * FROM test.Animal WHERE animal_name=%s AND species=%s", (name, species))

    results = curr.fetchall()

    conn.commit()
    curr.close()
    conn.close()
    return results

#log
def log_exhibit_visit(visitor_username, exhibit_name, visit_time):
    conn, curr = connection()

    curr.execute("INSERT INTO Visit_exhibit(visitor_username, exhibit_name, visit_time) VALUES (%s, %s, %s);",
                 (visitor_username, exhibit_name, datetime.fromtimestamp(int(visit_time))))

    conn.commit()
    curr.close()
    conn.close()
    return "Successfully logged exhibit visit!!!"

def log_show_visit(visitor_username, show_name, show_time):
    conn, curr = connection()

    curr.execute("INSERT INTO Visit_show(visitor_username, show_name, show_time) VALUES (%s, %s, %s);",
                 (visitor_username, show_name, datetime.fromtimestamp(int(show_time))))

    conn.commit()
    curr.close()
    conn.close()
    return "Successfully logged show visit!!!"

def log_note(staff_username, log_time, note, animal_name, animal_species):
    conn, curr = connection()

    curr.execute("INSERT INTO Note(staff_username, log_time, note, animal_name, animal_species) VALUES (%s, %s, %s, %s, %s);",
                 (staff_username, datetime.fromtimestamp(int(log_time,)), note, animal_name, animal_species ) )

    conn.commit()
    curr.close()
    conn.close()
    return "Successfully added note"