from flask import session, abort as flask_abort, make_response, jsonify
from Connect import connection

from datetime import datetime
from passlib.hash import argon2


def _generate_filters(filters):
    sql = []
    for ind, (col, val) in enumerate(filters.items()):
        if ind == 0:
            sql.append(' WHERE {col} = %s '.format(col=col))
        else:
            sql.append(' AND {col} = %s '.format(col=col))

    return ' '.join(sql), list(filters.values())


# def get_users():


def abort(status_code, **fields):
    flask_abort(make_response(jsonify(**fields), status_code))


def validate_registration(username, email):
    conn, curr = connection()

    # how to do with parameterization
    curr.execute("SELECT * FROM User WHERE username = %s;", (username,))
    results = curr.fetchall()
    if len(results) > 0:
        return False

    curr.execute("SELECT * FROM User WHERE email = %s;", (email,))

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

    curr.close()
    conn.close()
    return results

def get_exhibit_details(exhibit):
    conn, curr = connection()

    query = "SELECT exhibit_name, water_feature, size, COUNT(exhibit_name) as 'total_animal' " \
            "FROM Exhibit NATURAL JOIN Animal " \
            "WHERE exhibit_name = %s" \
            "GROUP BY exhibit_name"

    curr.execute(query, (exhibit, ))


    results = curr.fetchall()

    curr.close()
    conn.close()
    return results


def get_all_animals():
    conn, curr = connection()

    curr.execute("SELECT * FROM Animal")

    results = curr.fetchall()

    curr.close()
    conn.close()
    return results

def get_all_shows():
    conn, curr = connection()

    curr.execute("SELECT * FROM `Show`")

    results = curr.fetchall()
    for result in results:
        result['show_time'] = int(result['show_time'].timestamp())

    curr.close()
    conn.close()
    return results

def get_show(**filters):
    conn, curr = connection()

    sql, values = _generate_filters(filters)
    curr.execute("SELECT * FROM test.Show {};".format(sql), values)

    results = curr.fetchall()
    for result in results:
        result['show_time'] = int(result['show_time'].timestamp())

    curr.close()
    conn.close()
    return results


def get_user_by_username(username):
    conn, curr = connection()

    curr.execute("SELECT * FROM test.User WHERE username = %s", (username,))

    results = curr.fetchall()

    curr.close()
    conn.close()
    return results[0]

def get_all_visitors():
    conn, curr = connection()

    curr.execute("SELECT username, email FROM `User` WHERE user_type = \"Visitor\"")

    results = curr.fetchall()

    curr.close()
    conn.close()
    return results

def get_all_staff():
    conn, curr = connection()

    curr.execute("SELECT username, email FROM `User` WHERE user_type = \"Staff\"")

    results = curr.fetchall()

    curr.close()
    conn.close()
    return results

def get_animal(name, species):
    conn, curr = connection()

    curr.execute("SELECT * FROM Animal WHERE animal_name=%s AND species=%s", (name, species))

    results = curr.fetchall()

    curr.close()
    conn.close()
    return results


def search_animal(name, species, type, min_age, max_age, exhibit):
    conn, curr = connection()

    if name is None:
        name = ""
    if species is None:
        species = ""
    if type is None:
        type = ""
    if min_age is None:
        min_age = "0"
    if max_age is None:
        max_age = "1000000000"
    if exhibit is None:
        exhibit = ""


    query = "SELECT * FROM Animal " \
            "WHERE (%s = '' OR animal_name LIKE '%" + name + "%')" \
            " AND (%s = '' OR species LIKE '%" + species + "%')" \
            " AND (%s = '' OR animal_type LIKE '%" + type + "%')" \
            " AND age BETWEEN " + min_age + " AND " + max_age + \
            " AND (%s = '' OR exhibit_name LIKE '%" + exhibit + "%')"

    curr.execute(query, (name, species, type, exhibit))

    results = curr.fetchall()
    curr.close()
    conn.close()
    return results


def search_exhibit(name, water, min_size, max_size, min_animal, max_animal):
    conn, curr = connection()

    if name is None:
        name = ""
    if water is None:
        water = ""
    if min_size is None:
        min_size = "0"
    if max_size is None:
        max_size = "1000000000"
    if min_animal is None:
        min_animal = "0"
    if max_animal is None:
        max_animal = "1000000000"

    query = "SELECT exhibit_name, water_feature, size, COUNT(exhibit_name) as 'total_animals' " \
            "FROM Exhibit NATURAL JOIN Animal " \
            "WHERE (%s = '' OR exhibit_name LIKE '%" + name + "%')" \
            " AND (%s ='' OR water_feature LIKE '%" + water + "%')" \
            " AND (size BETWEEN " + min_size + " AND " + max_size + ")" \
            " GROUP BY exhibit_name" \
            " HAVING COUNT(exhibit_name) >= " + min_animal + " AND COUNT(exhibit_name) <= " + max_animal

    curr.execute(query, (name, water))

    results = curr.fetchall()
    curr.close()
    conn.close()
    return results


def search_show(show_name, date, exhibit, staff_name):
    conn, curr = connection()

    if show_name is None:
        show_name = ""
    if date is None:
        date = ""
    else:
        date = datetime.fromtimestamp(int(date)).date()

    if exhibit is None:
        exhibit = ""

    query = "SELECT * FROM `Show` " \
            "WHERE staff_name = %s" \
            " AND (%s = '' OR show_name LIKE '%" + show_name + "%')" \
            " AND (%s = '' OR DATE(show_time) = %s)" \
            " AND (%s = '' OR exhibit_name LIKE '%" + exhibit + "%')"

    curr.execute(query, (staff_name, show_name, date, date, exhibit))

    results = curr.fetchall()
    curr.close()
    conn.close()
    return results


def search_show(show_name, date, exhibit, staff_name):
    conn, curr = connection()

    if show_name is None:
        show_name = ""
    if date is None:
        date = ""
    else:
        date = datetime.fromtimestamp(int(date)).date()

    if exhibit is None:
        exhibit = ""



    query = "SELECT * FROM `Show` " \
            "WHERE staff_name = %s" \
            " AND (%s = '' OR show_name LIKE '%" + show_name + "%')" \
            " AND (%s = '' OR DATE(show_time) = %s)" \
            " AND (%s = '' OR exhibit_name LIKE '%" + exhibit + "%')"

    curr.execute(query, (staff_name, show_name, date, date, exhibit))

    results = curr.fetchall()
    curr.close()
    conn.close()
    return results


def search_show_history(visitor_name, show_name, date, exhibit):
    conn, curr = connection()

    if show_name is None:
        show_name = ""
    if date is None:
        date = ""
    else:
        date = datetime.fromtimestamp(int(date)).date()

    if exhibit is None:
        exhibit = ""

    query = "SELECT DISTINCT visitor_username, Visit_show.show_name, Visit_show.show_time, exhibit_name " \
            "FROM Visit_show INNER JOIN `Show` ON Visit_show.show_name=`Show`.show_name " \
            "WHERE visitor_username = %s" \
            " AND (%s = '' OR Visit_show.show_name LIKE '%" + show_name + "%')" \
            " AND (%s = '' OR DATE(Visit_show.show_time) = %s)" \
            " AND (%s = '' OR exhibit_name LIKE '%" + exhibit + "%')"

    curr.execute(query, (visitor_name, show_name, date, date, exhibit))

    results = curr.fetchall()
    curr.close()
    conn.close()
    return results


def search_exhibit_history(visitor_name, exhibit_name, date, min_visits, max_visits):
    conn, curr = connection()

    if exhibit_name is None:
        exhibit_name = ""
    if date is None:
        date = ""
    else:
        date = datetime.fromtimestamp(int(date)).date()

    if min_visits is None:
        min_visits = "0"
    if max_visits is None:
        max_visits = "1000000000"

    query = "SELECT exhibit_name as exhibit, visit_time, (SELECT COUNT(exhibit_name) " \
            "FROM Visit_exhibit " \
            "WHERE visitor_username = %s" \
            " AND exhibit_name = exhibit) as num_visits " \
            "FROM Visit_exhibit " \
            "WHERE visitor_username = %s" \
            " AND (%s = '' OR exhibit_name LIKE '%" + exhibit_name + "%')" \
            " AND (%s = '' OR DATE(visit_time) = %s)" \
            " GROUP BY exhibit_name, visit_time" \
            " HAVING num_visits >= " + min_visits + " AND num_visits <= " + max_visits

    curr.execute(query, (visitor_name, visitor_name, exhibit_name, date, date))

    results = curr.fetchall()
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

    curr.execute(
        "INSERT INTO Note(staff_username, log_time, note, animal_name, animal_species) VALUES (%s, %s, %s, %s, %s);",
        (staff_username, datetime.fromtimestamp(int(log_time, )), note, animal_name, animal_species))

    conn.commit()
    curr.close()
    conn.close()
    return "Successfully added note"

