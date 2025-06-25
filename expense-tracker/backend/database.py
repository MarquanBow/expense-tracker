from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URI = os.environ.get("MONGO_URI", "your-local-or-default-connection")

client = AsyncIOMotorClient(MONGO_URI)
db = client.expenses_db
