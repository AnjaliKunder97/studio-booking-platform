from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None


class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str] = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ResourceCreate(BaseModel):
    name: str
    description: Optional[str] = None
    location: Optional[str] = None


class ResourceOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    location: Optional[str] = None

    class Config:
        from_attributes = True


class BookingCreate(BaseModel):
    resource_id: int
    start_time: datetime
    end_time: datetime


class BookingOut(BaseModel):
    id: int
    resource_id: int
    user_id: int
    start_time: datetime
    end_time: datetime

    class Config:
        from_attributes = True
