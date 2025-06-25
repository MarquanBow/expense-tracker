from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
import os

# === Config ===
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["expenses_db"]

app = Flask(__name__)
CORS(app)

# === Expenses Routes ===
@app.route("/expenses", methods=["GET"])
def get_expenses():
    expenses = []
    for expense in db.expenses.find():
        expense["_id"] = str(expense["_id"])
        expenses.append(expense)
    return jsonify(expenses)

@app.route("/expenses", methods=["POST"])
def add_expense():
    data = request.get_json()
    result = db.expenses.insert_one(data)
    return jsonify({"inserted_id": str(result.inserted_id)})

@app.route("/expenses/<expense_id>", methods=["DELETE"])
def delete_expense(expense_id):
    result = db.expenses.delete_one({"_id": ObjectId(expense_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Expense not found"}), 404
    return jsonify({"deleted": True})

# === Budget Routes ===
@app.route("/budget", methods=["GET"])
def get_budget():
    budget = db.budget.find_one()
    return jsonify(budget.get("amount", 0) if budget else 0)

@app.route("/budget", methods=["POST"])
def set_budget():
    data = request.get_json()
    amount = data.get("budget", 0)
    db.budget.delete_many({})  # ensure only one
    db.budget.insert_one({"amount": amount})
    return jsonify({"budget": amount})

# === Summary Route ===
@app.route("/summary", methods=["GET"])
def get_summary():
    total = sum(float(e.get("amount", 0)) for e in db.expenses.find())
    budget_doc = db.budget.find_one()
    budget = budget_doc.get("amount", 0) if budget_doc else 0
    remaining = budget - total
    percent_used = round((total / budget) * 100, 2) if budget else 0

    return jsonify({
        "total": total,
        "remaining": remaining,
        "percent_used": percent_used
    })

# === Run App (Only Locally) ===
if __name__ == "__main__":
    app.run(debug=True)
