from flask import session
from Connect import connection


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


