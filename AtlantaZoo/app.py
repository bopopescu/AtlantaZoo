from flask import Flask, session
from Connect import connection
from MySQLdb import escape_string as thwart
app = Flask(__name__)

app.secret_key = 'super secret key'

def validate_registration(username, email):
    conn, curr = connection()

    curr.execute("SELECT * FROM User WHERE username = %s;", (thwart(username), ))
    results = curr.fetchall()
    if len(results) > 0:
        return False

    curr.execute("SELECT * FROM User WHERE email = %s;", (thwart(email), ))
    results = curr.fetchall()
    if len(results) > 0:
        return False

    return True


def create_user(username, email, password, user_type):
    conn, curr = connection()

    if validate_registration(username, email):
        curr.execute("INSERT INTO User(username, email, password, user_type) "
                     "VALUES (%s, %s, %s, %s);", (thwart(username), thwart(email),
                                                   thwart(password), thwart(user_type)))
        conn.commit()
        curr.close()
        conn.close()

        with app.test_request_context():
            session['logged_in'] = True
            session['username'] = username

        return "User was successfully created"
    else:
        return "There is a duplicate username or email. Cannot create user"


if __name__ == '__main__':
    app.run(debug=True)

