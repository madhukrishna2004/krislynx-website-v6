from flask import Blueprint, render_template, request, session, redirect
from firebase_admin_init import db
from datetime import date
from auth.middleware import login_required

employee_bp = Blueprint("employee", __name__)

@employee_bp.route("/employee/eod")
@login_required("EMPLOYEE")
def eod_form():
    return render_template("employee/eod.html")

@employee_bp.route("/employee/eod/submit", methods=["POST"])
@login_required("EMPLOYEE")
def submit_eod():
    emp_id = session["uid"]
    today = str(date.today())
    db.collection("eods").document(emp_id).collection("days").document(today).set({
        "tasks": request.form["tasks"],
        "hours": request.form["hours"],
        "blockers": request.form["blockers"],
        "tomorrow_plan": request.form["tomorrow"],
        "submitted_at": today
    })
    return redirect("/employee/dashboard")
