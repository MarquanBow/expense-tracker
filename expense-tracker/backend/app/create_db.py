from app.database import engine, Base

#Create all tables in the database
def create_database():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    create_database()