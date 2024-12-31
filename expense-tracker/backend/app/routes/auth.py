from pymongo import MongoClient 
from passlib.hash import bcrypt
from bson import ObjectId

#Connect to MongoDb
MONGO_URL = "mongodb+srv://MarquanB:Kairo915!@cluster0.wsgra.mongodb.net/"
client = MongoClient(MONGO_URL)
db = client['expense_tracker'] #database
users_collection = db['users'] #users collection

def register_user(email, password):
    # Check if the email is already registered
    existing_user = users_collection.find_one({"email": email})
    if existing_user:
        return {"error": "Email already registered"}

    # Hash the password
    hashed_password = bcrypt.hash(password)

    # Insert the user into the database
    new_user = {
        "email": email,
        "password": hashed_password
    }
    users_collection.insert_one(new_user)

    return {"message": "User registered successfully"}


def login_user(email, password):
    # Find the user by email
    user = users_collection.find_one({"email": email})
    if not user:
        return {"error": "User not found"}

    # Verify the password
    if not bcrypt.verify(password, user["password"]):
        return {"error": "Invalid password"}

    # Optionally return user data (e.g., for generating a session or token)
    return {"message": "Login successful", "user_id": str(user["_id"])}
