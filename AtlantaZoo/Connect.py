import mysql.connector
from mysql.connector import errorcode


def connection():
    try:
      cnx = mysql.connector.connect(host='timbess.net',
                                    user='root',
                                    password='haoquyenjeanniehaha',
                                    database='test')
      curr = cnx.cursor(dictionary=True)
      return cnx, curr
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Something is wrong with your user name or password")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("Database does not exist")
        else:
            print(err)
            cnx.close()
        return "fail"

