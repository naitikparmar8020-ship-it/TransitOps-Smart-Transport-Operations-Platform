from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.driver import Driver
from app.schemas.driver import DriverCreate, DriverOut
from app.auth.dependencies import require_fleet_manager, get_current_user
from app.models.user import User

router = APIRouter(prefix="/drivers", tags=["Drivers"])

@router.post("/", response_model=DriverOut, status_code=status.HTTP_201_CREATED)
def create_driver(
    driver: DriverCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_fleet_manager)
):
    existing = db.query(Driver).filter(Driver.license_number == driver.license_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Driver with this license already exists")
    
    new_driver = Driver(**driver.model_dump())
    db.add(new_driver)
    db.commit()
    db.refresh(new_driver)
    return new_driver

@router.get("/", response_model=List[DriverOut])
def get_drivers(
    status: str = None, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Driver)
    if status:
        query = query.filter(Driver.status == status)
    return query.all()