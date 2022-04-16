from flask_sqlalchemy import SQLAlchemy
from flask import Flask, jsonify, request

import json

app = Flask(__name__)


class Config(object):
    DIALECT = 'mysql'
    DRIVER = 'pymysql'
    USERNAME = 'root'
    PASSWORD = 'soilDB_2021'
    HOST = '127.0.0.1'
    PORT = '3306'
    DATABASE = 'geocode'

    SQLALCHEMY_DATABASE_URI = '{}+{}://{}:{}@{}:{}/{}?charset=utf8'.format(
        DIALECT, DRIVER, USERNAME, PASSWORD, HOST, PORT, DATABASE
    )

    print(SQLALCHEMY_DATABASE_URI)
    SQLALCHEMY_COMMIT_ON_TEARDOWN = True
    SQLALCHEMY_TRACK_MODIFICATIONS = True


# 读取配置
app.config.from_object(Config)

# 创建数据库sqlalchemy工具对象
db = SQLAlchemy(app)


class GeoCode(db.Model):
    __tablename__ = 'geocode'
    code = db.Column(db.Integer, primary_key=True)
    countyCode = db.Column(db.Integer)
    type = db.Column(db.Integer)
    keyword = db.Column(db.String)
    street = db.Column(db.String)
    name = db.Column(db.String)
    lon_raw = db.Column(db.Float)
    lat_raw = db.Column(db.Float)
    coordSource_raw = db.Column(db.Integer)
    lon_group = db.Column(db.Float)
    lat_group = db.Column(db.Float)
    coordSource_group = db.Column(db.Integer)
    dist = db.Column(db.Float)
    checked = db.Column(db.Integer)
    rural_area = db.Column(db.Float)
    rural_population = db.Column(db.Float)

    def __init__(self, code, countyCode, keyword):
        self.code = code
        self.countyCode = countyCode
        self.keyword = keyword

db.create_all()

@app.route("/dataPost", methods=['GET', 'POST'])
def hello_world():
    provinceCode = request.form.get('provinceCode')
    countyCode = request.form.get('countyCode')

    # res = GeoCode.query.filter_by(countyCode=2307).first()
    sql = "SELECT * FROM {} WHERE countyCode = '{}'".format(provinceCode, countyCode)
    # return jsonify(res)
    return sql


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
