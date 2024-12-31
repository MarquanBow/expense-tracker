from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "postgresql://postgres:password@localhost/expense_tracker"

#create the database engine
engine = create_engine(DATABASE_URL)

#create a session for database interaction
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#Base class for model definitions
Base = declarative_base()

#dependency to use in API routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()