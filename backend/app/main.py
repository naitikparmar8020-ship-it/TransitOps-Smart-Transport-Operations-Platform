from fastapi import FastAPI
# from app.database.database import engine, Base

app = FastAPI(title="TransitOps API")

@app.get("/")
def root():
    return {
        "message": "TransitOps Backend Running Successfully 🚀"
    }