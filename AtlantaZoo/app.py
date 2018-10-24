from flask import Flask
from Connect import connection

app = Flask(__name__)


@app.route('/', methods=["GET","POST"])
def home_page():
    try:
        s = connection()
        return s
    except Exception as e:
        return(str(e))


if __name__ == '__main__':
    app.run(debug=True)
