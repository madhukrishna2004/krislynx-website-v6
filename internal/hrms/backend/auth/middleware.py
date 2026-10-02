from functools import wraps

from flask import redirect, session


def login_required(role):
    """Allow the view only for a logged-in session with the given role."""

    def wrapper(fn):
        @wraps(fn)  # keeps distinct endpoint names; without it Flask raises on the 2nd decorated view
        def decorated(*args, **kwargs):
            if session.get("role") != role:
                return redirect("/hrms/login")
            return fn(*args, **kwargs)

        return decorated

    return wrapper
