from sqlalchemy import Column, Integer, String, Float
from app.database.database import Base

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    registration_number = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    vehicle_type = Column(String(50), nullable=False)
    max_load_capacity = Column(Float, nullable=False) # In kg
    odometer = Column(Float, default=0.0)
    acquisition_cost = Column(Float, nullable=False)
    status = Column(String(30), default="Available") # Statuses: Available, On Trip, In Shop, Retired