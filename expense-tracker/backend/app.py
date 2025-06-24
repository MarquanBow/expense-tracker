from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
import os

app = Flask(__name__)
CORS(app)

MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority")
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

if __name__ == "__main__":
    app.run(debug=True)
