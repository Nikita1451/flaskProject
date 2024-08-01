import inspect
import os
import requests
from flask import Flask, render_template, redirect, url_for, request, send_file
from flask_login import (
    LoginManager,
    login_user,
    login_required,
    logout_user,
    current_user,
)
from PIL import Image, ImageDraw, ImageFont
from data.user_fabric import UserFabric
from app.sender import send_email
from dotenv import load_dotenv
from forms.user import RegisterForm, LoginForm
from data.users import User

from data import db_session

app = Flask(__name__, static_url_path="/static")

load_dotenv()
login_manager = LoginManager()
login_manager.init_app(app)
app.config["SECRET_KEY"] = "yandexlyceum_secret _key"


@app.route("/diploms/<play_id>", methods=["GET", "POST"])
def diplom(play_id):
    if request.method == "POST":
        return render_template("base.html")
    return render_template(
        f"gr_1.html"
    )


@app.route("/diploms", methods=["GET", "POST"])
def diplom_sett():
    if request.method == "POST":
        if "email_button" in request.form:
            return render_template(
                "email_push.html"
            )
        if "push_email" in request.form:
            return redirect(
                f"/email/{request.form['firstName']} {request.form['lastName']}"
            )


@login_manager.user_loader
def load_user(user_id):
    db_sess = db_session.create_session()
    return db_sess.query(User).filter(User.id == user_id).first()


@app.route("/play/<int:fabric_id>")
@login_required
def play(fabric_id):
    return render_template(
        f"game_{fabric_id}.html"
    )
    # для других фабрик нужно добавить пути


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect("/")


@app.route("/")
def index():
    if not current_user.is_authenticated:
        return redirect(url_for("login"))
    # Достаем из БД, параметр passed из отдельной таблицы, соединяющей user and fabric
    db_ses = db_session.create_session()
    fabrik_passed = [int(i.fabric_id) for i in db_ses.query(UserFabric).filter(UserFabric.user_id == current_user.id)]

    fabrics = [
        {"id": 1, "title": "ЛТЗ", "image": "ltz.jpg", "passed": True},
        {"id": 2, "title": "СЧЗ", "image": "schz.jpg", "passed": True},
        {
            "id": 3,
            "title": "Людиновокабель",
            "image": "ludinovo_cabel.jpg",
            "passed": True,
        },
    ]
    for i in fabrics:
        if i["id"] in fabrik_passed:
            i["passed"] = True
        else:
            i["passed"] = False
    return render_template(
        "main.html",
        title="Заводы Людиново",
        fabrics=fabrics
    )


@app.route("/register", methods=["GET", "POST"])
def register():
    global f
    form = RegisterForm()
    if form.validate_on_submit():
        db_sess = db_session.create_session()
        if db_sess.query(User).filter(
                User.email == form.email.data
        ).first():
            return render_template(
                "register.html",
                title="Регистрация",
                form=form,
                message="Такой пользователь уже есть",
            )
        user = User(
            name=form.name.data,
            email=form.email.data,
            surname=form.surname.data
        )
        db_sess.add(user)
        db_sess.commit()
        f = True
        return redirect("/")
    return render_template(
        "register.html",
        title="Регистрация",
        form=form
    )


@app.route("/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        db_sess = db_session.create_session()
        user = db_sess.query(User).filter(
            User.email == form.email.data
        ).first()
        if user:
            login_user(
                user,
                remember=form.remember_me.data
            )
            return redirect("/")
        return redirect(
            "/register"
        )
    return render_template(
        "login.html",
        title="Авторизация",
        form=form
    )


@app.route("/add_score/<int:id>", methods=["GET", "POST"])
def add_score(id):
    db_sess = db_session.create_session()
    if db_sess.query(UserFabric).filter(
            UserFabric.user_id == current_user.id, UserFabric.fabric_id == id).first():
        return redirect(f"/diploms/{id}")
    user_fabric = UserFabric(user_id=current_user.id, fabric_id=id)
    db_sess.add(user_fabric)
    db_sess.commit()
    return redirect(f"/diploms/{id}")


@app.route("/email/<name_surname>", methods=["GET", "POST"])
def post_form(name_surname):
    email = current_user.email
    print(name_surname)
    add_text_to_image(name_surname)
    if send_email(
            email, "", "Спасибо за участие", ["gr1.png"]
    ):
        if os.path.exists("gr1.png"):
            os.remove("gr1.png")
        return redirect(url_for('index'))
    if os.path.exists("gr1.png"):
        os.remove("gr1.png")
    return redirect(url_for('index'))


def add_text_to_image(text, image_path="static/gramot.png", output_path="gr1.png", font_size=30,
                      text_color=(0, 0, 0), font_path=None):
    # Открываем изображение
    print(text)
    text = text.replace(' ', '\n')
    text = f"Спасибо за участие \n в развивающемся проекте Flask \n с кодовым названием БТПМ \n Данной грамотой награждается: \n {text}"
    image = Image.open(image_path)
    draw = ImageDraw.Draw(image)
    font = ImageFont.truetype("arial.ttf", size=font_size, encoding='UTF-8')
    # Определяем координаты для  выравнивания по центру
    x = 400
    y = 400
    print(x, y)
    # Добавляем текст на изображение
    draw.text((x, y), text, fill=text_color, font=font, align="center")
    # Сохраняем измененное изображение
    image.save(output_path)


@app.route("/secret")
def secret():
    response = requests.get("https://api.thecatapi.com/v1/images/search")
    image_url = response.json()[0]['url']
    # Загрузить изображение по URL-адресу
    image_path = 'image.jpg'
    with open(image_path, 'wb') as f:
        f.write(requests.get(image_url).content)
    # Отправить изображение клиенту
    return send_file('image.jpg', mimetype='image/jpg')


def main():
    db_session.global_init("db/blogs.db")
    app.run(debug=True)


if __name__ == "__main__":
    main()
