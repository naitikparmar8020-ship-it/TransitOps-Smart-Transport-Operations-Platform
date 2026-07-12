from sqlalchemy import create_engine,text
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("postgresql://postgres:Npaitiok@8780@db.rvjvqhmqjiiwmsnmrmie.supabase.co:5432/postgres")

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

try:
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    print("✅ Database Connected Successfully!")
except Exception as e:
    print("❌ Database Connection Failed")
    print(e)