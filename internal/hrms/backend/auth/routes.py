from flask import Blueprint, render_template
from auth.middleware import login_required

hr_bp = Blueprint("hr", __name__)

@hr_bp.route("/hr/dashboard")
@login_required("HR")
def dashboard():
    return render_template("hr/dashboard.html")
