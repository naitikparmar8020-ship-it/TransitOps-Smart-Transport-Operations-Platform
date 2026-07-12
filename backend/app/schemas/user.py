# File: app/schemas/user.py
from pydantic import BaseModel, EmailStr

# Schema for User Login Request
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Schema for returning User Data (hides password)
class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True

# Schema for JWT Token Response
class Token(BaseModel):
    access_token: str
    token_type: str