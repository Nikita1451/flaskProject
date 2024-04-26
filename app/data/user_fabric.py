import sqlalchemy
from .db_session import SqlAlchemyBase


class UserFabric(SqlAlchemyBase):
    __tablename__ = "users_fabric"
    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    user_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey("users.id"))
    fabric_id = sqlalchemy.Column(
        sqlalchemy.Integer, sqlalchemy.ForeignKey("fabric.id")
    )
