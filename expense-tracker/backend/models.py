from sqlalchemy import Column, Integer, String, Float, Date
from database import Base
from datetime import date

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    amount = Column(Float)
    category = Column(String)
    date = Column(Date, default=date.today)
