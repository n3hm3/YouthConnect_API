from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Authentication Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserCreate(BaseModel):
    username: str
    password: str
    role: Optional[str] = "seeker"

class UserResponse(BaseModel):
    id: int
    username: str
    role: str

    class Config:
        from_attributes = True

# Job Listing Schemas (Strictly typed annotations)
class JobBase(BaseModel):
    title: str
    description: str
    company: str
    location: str
    salary_range: Optional[str] = None

class JobCreate(JobBase):
    pass

class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    salary_range: Optional[str] = None

class JobResponse(JobBase):
    id: int
    created_at: datetime
    owner_id: int

    class Config:
        from_attributes = True