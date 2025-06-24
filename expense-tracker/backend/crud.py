from sqlalchemy.orm import Session
from models import Expense
from datetime import date

def get_expenses(db: Session):
    return db.query(Expense).all()

def add_expense(db: Session, name: str, amount: float, category: str, expense_date: date):
    expense = Expense(name=name, amount=amount, category=category, date=expense_date)
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense

def delete_expense(db: Session, expense_id: int):
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if expense:
        db.delete(expense)
        db.commit()
        return True
    return False
