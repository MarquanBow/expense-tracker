from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
import os

app = Flask(__name__)
CORS(app)

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["expenses_db"]
collection = db["expenses"]

@app.route("/expenses", methods=["GET"])
def get_expenses():
    expenses = []
    for expense in collection.find():
        expense["_id"] = str(expense["_id"])  # Convert ObjectId to string
        expenses.append(expense)
    return jsonify(expenses)

@app.route("/expenses", methods=["POST"])
def add_expense():
    data = request.json
    result = collection.insert_one(data)
    return jsonify({"_id": str(result.inserted_id)}), 201

@app.route("/expenses/<id>", methods=["DELETE"])
def delete_expense(id):
    result = collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 1:
        return ("", 204)
    return ("Not Found", 404)

@app.route("/budget", methods=["GET"])
def get_budget():
    budget = db["budget"].find_one({})
    if budget:
        budget["_id"] = str(budget["_id"])
        return jsonify(budget)
    return jsonify({"budget": 0}), 200

@app.route("/budget", methods=["POST"])
def set_budget():
    data = request.json
    amount = data.get("budget", 0)
    db["budget"].delete_many({})
    db["budget"].insert_one({"budget": amount})
    return jsonify({"budget": amount}), 201

@app.route("/summary", methods=["GET"])
def get_summary():
    from datetime import datetime
    now = datetime.now()
    first_day = datetime(now.year, now.month, 1)

    expenses = list(collection.find({"date": {"$gte": first_day.strftime("%Y-%m-%d")}}))

    total = sum(float(e["amount"]) for e in expenses)
    budget_doc = db["budget"].find_one({})
    budget = budget_doc["budget"] if budget_doc else 0

    return jsonify({
        "total": total,
        "budget": budget,
        "remaining": budget - total,
        "percentage_used": round(total / budget * 100, 2) if budget else 0,
    })

if __name__ == "__main__":
    app.run(debug=True)

if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)