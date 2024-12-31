from bson import ObjectId
from datetime import datetime

class User:
    def __init__(self, email, password, _id=None):
        self.email = email
        self.password = password
        self.id = str(_id) if _id else None

    def to_dict(self):
        return {
            "_id": ObjectId(self.id) if self.id else None,
            "email": self.email,
            "password": self.password
        }

    @staticmethod
    def from_dict(data):
        return User(
            email=data.get("email"),
            password=data.get("password"),
            _id=data.get("_id")
        )


class Expense:
    def __init__(self, user_id, category, amount, date, description=None, _id=None):
        self.user_id = str(user_id)
        self.category = category
        self.amount = float(amount)
        self.date = date if isinstance(date, datetime) else datetime.strptime(date, "%Y-%m-%d")
        self.description = description
        self.id = str(_id) if _id else None

    def to_dict(self):
        return {
            "_id": ObjectId(self.id) if self.id else None,
            "user_id": ObjectId(self.user_id),
            "category": self.category,
            "amount": self.amount,
            "date": self.date,
            "description": self.description
        }

    @staticmethod
    def from_dict(data):
        return Expense(
            user_id=data.get("user_id"),
            category=data.get("category"),
            amount=data.get("amount"),
            date=data.get("date"),
            description=data.get("description"),
            _id=data.get("_id")
        )