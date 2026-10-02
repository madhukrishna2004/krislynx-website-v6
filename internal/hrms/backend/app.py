import os

from dotenv import load_dotenv
from flask import Flask

load_dotenv()

from auth.routes import auth_bp  # noqa: E402  (after env is loaded)
from employee.routes import employee_bp  # noqa: E402
from hr.routes import hr_bp  # noqa: E402

app = Flask(__name__)
app.secret_key = os.environ["SECRET_KEY"]  # fail fast rather than run with no session signing key
app.config.update(
    SESSION_COOKIE_SECURE=os.getenv("FLASK_ENV") != "development",
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
)

app.register_blueprint(auth_bp)
app.register_blueprint(hr_bp)
app.register_blueprint(employee_bp)

if __name__ == "__main__":
    # Debug mode exposes an interactive console; never enable it in production.
    app.run(debug=os.getenv("FLASK_DEBUG") == "1")
