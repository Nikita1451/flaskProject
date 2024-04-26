import smtplib, mimetypes, os
from email import encoders
from email.mime.audio import MIMEAudio
from email.mime.base import MIMEBase
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


def send_email(email, title, text, att):
    address_from = os.getenv("FROM")
    password = os.getenv("PASSWORD")
    msg = MIMEMultipart()
    msg["From"] = address_from
    msg["To"] = email
    msg["Subject"] = title
    body = text
    msg.attach(MIMEText(body, "plain"))
    process_attachments(msg, att)
    server = smtplib.SMTP_SSL(os.getenv("HOST"), os.getenv("PORT"))
    server.login(address_from, password)
    server.send_message(msg)
    server.quit()
    return True


def process_attachments(msg, att):
    for file in att:
        if os.path.isfile(file):
            attach_file(msg, file)
        elif os.path.exists(file):
            dir = os.listdir(file)
            for f in dir:
                attach_file(msg, f + "/" + file)


def attach_file(msg, file):
    attach_type = {"text": MIMEText, "image": MIMEImage, "audio": MIMEAudio}
    filename = os.path.basename(file)
    ctype, encoding = mimetypes.guess_type(file)
    if ctype is None or encoding is not None:
        ctype = "applicetion/octet-stream"
    maintype, subtype = ctype.split("/", 1)
    with open(file, mode="rb" if maintype != "text" else "r") as fp:
        if maintype in attach_type:
            file_ = attach_type[maintype](fp.read(), subtype=subtype)
        else:
            file_ = MIMEBase(maintype, subtype)
            file_.set_payload(fp.read())
            encoders.encode_base64(file_)
    file_.add_header("Content-Disposition", "attachment", filename=filename)
    msg.attach(file_)
