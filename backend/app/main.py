from fastapi import FastAPI

app = FastAPI(
    title="TransitOps API",
    version="1.0.0"
)

@app.get("/")
def home():
    return {
        "message": "Welcome to TransitOps API"
    }

@app.get("/health")
def health():
    return {
        "status": "Backend Running Successfully"
    }
