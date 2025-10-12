from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime

class Habit(BaseModel):
    id: Optional[str] = Field(default=None)
    name: str
    description: str
    streak: int = 0
    last_streak_date: Optional[datetime] = None
    last_updated: Optional[datetime] = None

# Authentication Models
class User(BaseModel):
    id: Optional[str] = Field(default=None)
    email: EmailStr
    full_name: str
    hashed_password: str
    is_active: bool = True
    created_at: Optional[datetime] = None

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    is_active: bool

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
