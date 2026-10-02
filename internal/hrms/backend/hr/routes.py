from flask import Blueprint, render_template, request, redirect
from firebase_admin_init import db
from auth.middleware import login_required

hr_bp = Blueprint("hr", __name__)

@hr_bp.route("/hr/employees")
@login_required("HR")
def employees():
    users = db.collection("users").where("role", "==", "EMPLOYEE").stream()
    return render_template("hr/employees.html", employees=users)

@hr_bp.route("/hr/employees/add", methods=["POST"])
@login_required("HR")
def add_employee():
    data = request.form
    db.collection("users").add({
        "name": data["name"],
        "email": data["email"],
        "role": "EMPLOYEE",
        "employee_id": data["employee_id"],
        "department": data["department"],
        "status": "ACTIVE"
    })
    return redirect("/hr/employees")
