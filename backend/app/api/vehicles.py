from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate, VehicleOut
from app.auth.dependencies import require_fleet_manager, get_current_user
from app.models.user import User

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])

# Only Fleet Managers can add new vehicles to the database
@router.post("/", response_model=VehicleOut, status_code=status.HTTP_201_CREATED)
def create_vehicle(
    vehicle: VehicleCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(require_fleet_manager) 
):
    # Enforce mandatory business rule: Registration number must be unique
    existing = db.query(Vehicle).filter(Vehicle.registration_number == vehicle.registration_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Vehicle with this registration number already exists")
    
    new_vehicle = Vehicle(**vehicle.model_dump())
    db.add(new_vehicle)
    db.commit()
    db.refresh(new_vehicle)
    return new_vehicle

# Any authenticated user (Driver, Safety Officer, etc.) can view the fleet
@router.get("/", response_model=List[VehicleOut])
def get_vehicles(
    status: str = None, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Vehicle)
    # Allow frontend to filter by status (e.g., ?status=Available)
    if status:
        query = query.filter(Vehicle.status == status)
    return query.all()