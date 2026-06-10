# Youth Employment Listings API

A Digital Public Goods platform mapping youth job opportunities (SDG 8 Alignment).

## Overview

The YouthConnect API is a FastAPI-based REST service designed to connect job seekers with employment opportunities, with role-based access control for employers and administrators.

## Features

- **User Authentication** – JWT-based authentication with role-based access control
- **Job Listings Management** – Create, read, update, and delete job opportunities
- **Role-Based Authorization** – Support for seekers, employers, and administrators
- **PostgreSQL Database** – Persistent data storage with SQLAlchemy ORM

## Tech Stack

- **FastAPI** – Modern async web framework
- **SQLAlchemy** – SQL toolkit and ORM
- **PostgreSQL** – Database
- **Uvicorn** – ASGI server
- **python-jose** – JWT authentication
- **passlib** – Password hashing

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd YouthConnect-API
```

2. Create and activate virtual environment:
```bash
python -m venv .venv
.\.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Linux/Mac
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables:
```bash
# Create .env file with:
SECRET_KEY=your_secret_key_here
DATABASE_URL=postgresql://user:password@localhost/youthconnect_db
```

## Running the API

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

API documentation: `http://localhost:8000/docs` (Swagger UI)

## Project Structure

```
YouthConnect-API/
├── app/
│   ├── auth.py          # Authentication logic
│   ├── database.py      # Database configuration
│   ├── main.py          # Main API endpoints
│   ├── models.py        # SQLAlchemy models
│   └── schemas.py       # Pydantic schemas
├── .env                 # Environment variables
├── .gitignore          # Git ignore rules
├── requirements.txt    # Python dependencies
└── README.md          # This file
```

## API Endpoints

### Authentication
- `POST /auth/register` – Register a new user
- `POST /auth/login` – Login and get JWT token

### Job Listings
- `GET /jobs` – Get all job listings
- `GET /jobs/{id}` – Get a specific job listing
- `POST /jobs` – Create a new job listing (employer/admin only)
- `PUT /jobs/{id}` – Update a job listing (owner/admin only)
- `DELETE /jobs/{id}` – Delete a job listing (owner/admin only)

## License

MIT
