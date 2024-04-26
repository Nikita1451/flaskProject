from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired


class UserFabricForm(FlaskForm):
    user_id = StringField("user_id", validators=[DataRequired()])
    fabric_id = StringField("fabric_id", validators=[DataRequired()])
