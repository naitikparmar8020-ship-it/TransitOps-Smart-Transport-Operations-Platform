from sqlalchemy import Column, Integer, String, Float, Date
from app.database.database import Base

class Driver(Base):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    license_number = Column(String(50), unique=True, index=True, nullable=False)
    license_category = Column(String(20), nullable=False)
    license_expiry_date = Column(Date, nullable=False)
    contact_number = Column(String(20), nullable=False)
    safety_score = Column(Float, default=100.0)
    status = Column(String(30), default="Available") # Available, On Trip, Off Duty, Suspended