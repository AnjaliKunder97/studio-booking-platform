import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import auth as auth_router
from .routers import bookings as bookings_router
from .routers import resources as resources_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Studio Booking API")

# Comma-separated list of allowed origins, e.g.
# "http://localhost:5173,https://studio-booking.onrender.com"
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(resources_router.router)
app.include_router(bookings_router.router)


@app.get("/")
def root():
    return {"status": "ok"}