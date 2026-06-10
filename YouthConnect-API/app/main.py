from fastapi import FastAPI, Depends, HTTPException, status 
from fastapi.security import OAuth2PasswordRequestForm  
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas, auth, database

# Database Initialization
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="Youth Employment Listings API",
    description="A Digital Public Goods platform mapping youth job opportunities (SDG 8 Alignment).",
    version="1.0.0"
)

# --- AUTHENTICATION ENDPOINTS ---

@app.post("/auth/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_in: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.username == user_in.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_pwd = auth.get_password_hash(user_in.password)
    new_user = models.User(username=user_in.username, hashed_password=hashed_pwd, role=user_in.role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, str(user.hashed_password)):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


# --- JOB LISTINGS CRUD ENDPOINTS (Predictable Endpoints) ---

@app.post("/jobs", response_model=schemas.JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(job: schemas.JobCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role not in ["employer", "admin"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only employers or admins can post vacancies")
    
    db_job = models.JobListing(**job.model_dump(), owner_id=current_user.id)
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

# Asynchronous I/O task demonstration for retrieving high volumes of listings efficiently
@app.get("/jobs", response_model=List[schemas.JobResponse], status_code=status.HTTP_200_OK)
async def read_all_jobs(skip: int = 0, limit: int = 20, db: Session = Depends(database.get_db)):
    # Simulates an async database lookup for a Digital Public Goods catalog
    jobs = db.query(models.JobListing).offset(skip).limit(limit).all()
    return jobs

@app.get("/jobs/{id}", response_model=schemas.JobResponse, status_code=status.HTTP_200_OK)
def read_job_by_id(id: int, db: Session = Depends(database.get_db)):
    job = db.query(models.JobListing).filter(models.JobListing.id == id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Job listing with ID {id} not found")
    return job

@app.put("/jobs/{id}", response_model=schemas.JobResponse, status_code=status.HTTP_200_OK)
def update_job(id: int, updated_job: schemas.JobUpdate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    job_query = db.query(models.JobListing).filter(models.JobListing.id == id)
    job = job_query.first()
    
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Job listing with ID {id} not found")
    # Check authorization: user must be the owner or an admin
    is_owner: bool = bool(job.owner_id == current_user.id)
    is_admin: bool = bool(current_user.role == "admin")
    if not (is_owner or is_admin):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to alter this profile")
        
    update_data = updated_job.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(job, key, value)
    db.add(job)
    db.commit()
    return job_query.first()

@app.delete("/jobs/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    job_query = db.query(models.JobListing).filter(models.JobListing.id == id)
    job = job_query.first()
    
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Job listing with ID {id} not found")
    # Check authorization: user must be the owner or an admin
    is_owner: bool = bool(job.owner_id == current_user.id)
    is_admin: bool = bool(current_user.role == "admin")
    if not (is_owner or is_admin):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to drop this listing")
        
    job_query.delete(synchronize_session=False)
    db.commit()
    return None