from pydantic import BaseModel
from typing import Optional

class VehicleBase(BaseModel):
    registration_number: str
    name: str
    vehicle_type: str
    max_load_capacity: float
    odometer: float = 0.0
    acquisition_cost: float
    status: str = "Available"

class VehicleCreate(VehicleBase):
    pass

class VehicleOut(VehicleBase):
    id: int

    class Config:
        from_attributes = True