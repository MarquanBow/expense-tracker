from pymongo import MongoClient

# MongoDB connection string
# MONGO_URL = "mongodb://localhost:27017"  # For local MongoDB
MONGO_URL = "mongodb+srv://MarquanB:Kairo915!@cluster0.wsgra.mongodb.net/"  # For MongoDB Atlas
client = MongoClient(MONGO_URL)
db = client['expense_tracker']  # Database name

# Access collections
users_collection = db['users']
expenses_collection = db['expenses']

# Ensure indexes for better performance
users_collection.create_index("email", unique=True)
expenses_collection.create_index("user_id")
