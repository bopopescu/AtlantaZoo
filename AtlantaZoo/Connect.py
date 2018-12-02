from flask import current_app
from pymysql import Connect
from pymysql.cursors import DictCursor
from pymysql.err import MySQLError


def connection():
    from helpers import abort

    cnx = None
    try:
        cnx = Connect(host='timbess.net',
                      user='root',
                      password='haoquyenjeanniehaha',
                      database='test')
        curr = cnx.cursor(cursor=DictCursor)
        return cnx, curr
    except MySQLError as e:
        if cnx is not None:
            cnx.close()
        current_app.logger.exception(e)
        abort(500, message='Failed to connect to database')
