from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import engine, Base
from app.models.user import User 
from app.models.vehicle import Vehicle # <-- ADD THIS (creates the table)
from app.api import auth, vehicles # <-- ADD vehicles HERE

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TransitOps API",
    description="Smart Transport Operations Platform Backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers here
app.include_router(auth.router)
app.include_router(vehicles.router) # <-- ADD THIS (activates the endpoints)

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "TransitOps API is running smoothly."}