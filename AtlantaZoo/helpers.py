from flask import session
from Connect import connection

# def get_users():


def validate_registration(username, email):
    conn, curr = connection()

    # curr.execute("SELECT * FROM User WHERE username = %s;", (thwart(username), ))
    #how to do with parameterization
    curr.execute("SELECT * FROM User WHERE username = %s;", (username, ))
    results = curr.fetchall()
    if len(results) > 0:
        return False

    # curr.execute("SELECT * FROM User WHERE email = %s;", (thwart(email), ))
    curr.execute("SELECT * FROM User WHERE email = %s;", (email, ))

    results = curr.fetchall()
    if len(results) > 0:
        return False

    return True


def create_user(username, email, password, user_type):
    conn, curr = connection()

    if validate_registration(username, email):
        # curr.execute("INSERT INTO User(username, email, password, user_type) "
        #              "VALUES (%s, %s, %s, %s);", (thwart(username), thwart(email),
        #                                            thwart(password), thwart(user_type)))

        curr.execute("INSERT INTO User(username, email, password, user_type) "
                     "VALUES (%s, %s, %s, %s);", (username, email,
                                                   password, user_type))
        conn.commit()
        curr.close()
        conn.close()

        #someone said you should not do this part here, it should be only use for testing
        # with app.test_request_context():
        session['logged_in'] = True
        session['username'] = username

        return "User was successfully created"
    else:
        return "There is a duplicate username or email. Cannot create user"

def login(username, password):
    conn, curr = connection()

    curr.execute('SELECT * FROM User where username = %s and password = %s', (username, password))
    row = curr.fetchone()
    if row is None:
        return "Username/password incorrect"

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
    # session['species'] = species

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


