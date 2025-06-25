from flask import Flask, request, jsonify, abort
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
from pymongo import MongoClient
from bson.objectid import ObjectId
import os

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Firebase Admin
cred = credentials.Certificate("firebase-adminsdk.json")  # 👈 you'll upload this file separately
firebase_admin.initialize_app(cred)

# Connect to MongoDB
client = MongoClient(os.getenv("MONGO_URI"))
db = client["expenses_db"]

# Verify token and get UID
def verify_token():
    header = request.headers.get("Authorization")
    if not header or not header.startswith("Bearer "):
        abort(401, "Unauthorized: Missing or malformed token")
    token = header.split(" ")[1]
    try:
        decoded = firebase_auth.verify_id_token(token)
        return decoded["uid"]
    except Exception as e:
        abort(401, f"Token verification failed: {str(e)}")

# Routes
@app.route("/expenses", methods=["GET"])
def get_expenses():
    uid = verify_token()
    expenses = list(db.expenses.find({"userId": uid}))
    for e in expenses:
        e["_id"] = str(e["_id"])
    return jsonify(expenses)

@app.route("/expenses", methods=["POST"])
def add_expense():
    uid = verify_token()
    data = request.get_json()
    data["userId"] = uid
    db.expenses.insert_one(data)
    return jsonify({"message": "Expense added"}), 201

@app.route("/expenses/<expense_id>", methods=["DELETE"])
def delete_expense(expense_id):
    uid = verify_token()
    db.expenses.delete_one({"_id": ObjectId(expense_id), "userId": uid})
    return jsonify({"message": "Expense deleted"}), 200

@app.route("/budget", methods=["GET"])
def get_budget():
    uid = verify_token()
    doc = db.budgets.find_one({"userId": uid})
    return jsonify(doc["budget"] if doc else 0)

@app.route("/budget", methods=["POST"])
def set_budget():
    uid = verify_token()
    data = request.get_json()
    db.budgets.update_one(
        {"userId": uid},
        {"$set": {"budget": data["budget"]}},
        upsert=True
    )
    return jsonify({"message": "Budget set"}), 200

@app.route("/summary", methods=["GET"])
def get_summary():
    uid = verify_token()
    expenses = list(db.expenses.find({"userId": uid}))
    total = sum(float(e["amount"]) for e in expenses)
    budget_doc = db.budgets.find_one({"userId": uid})
    budget = float(budget_doc["budget"]) if budget_doc else 0
    remaining = max(budget - total, 0)
    percent = round((total / budget * 100), 2) if budget else 0
    return jsonify({"total": total, "remaining": remaining, "percent_used": percent})

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Backend running!"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
