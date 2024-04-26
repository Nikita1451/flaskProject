import sqlalchemy
from .db_session import SqlAlchemyBase


class Fabrics(SqlAlchemyBase):
    __tablename__ = "fabric"
    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    fabric_name = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    imgs = sqlalchemy.Column(sqlalchemy.String, nullable=True)
