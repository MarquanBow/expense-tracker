from bson import ObjectId
from datetime import datetime
from pymongo import MongoClient

# MongoDB setup
MONGO_URL = "mongodb+srv://MarquanB:Kairo915!@cluster0.wsgra.mongodb.net/"
client = MongoClient(MONGO_URL)
db = client['expense_tracker']
expenses_collection = db['expenses']

# Add a new expense
def add_expense(user_id, category, amount, date, description):
    if not user_id or not category or not amount or not date:
        return {"error": "All fields except description are required"}

    # Convert date to datetime object
    try:
        date_obj = datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        return {"error": "Invalid date format. Use YYYY-MM-DD"}

    new_expense = {
        "user_id": ObjectId(user_id),
        "category": category,
        "amount": float(amount),
        "date": date_obj,
        "description": description
    }

    expenses_collection.insert_one(new_expense)
    return {"message": "Expense added successfully"}

# Get all expenses for a user
def get_expenses(user_id):
    if not user_id:
        return {"error": "User ID is required"}

    expenses = list(expenses_collection.find({"user_id": ObjectId(user_id)}))
    for expense in expenses:
        expense["_id"] = str(expense["_id"])
        expense["user_id"] = str(expense["user_id"])

    return expenses

# Delete an expense
def delete_expense(user_id, expense_id):
    if not user_id or not expense_id:
        return {"error": "User ID and Expense ID are required"}

    result = expenses_collection.delete_one({"_id": ObjectId(expense_id), "user_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        return {"error": "Expense not found or not authorized"}

    return {"message": "Expense deleted successfully"}