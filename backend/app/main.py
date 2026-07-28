from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import auth as auth_router
from .routers import bookings as bookings_router
from .routers import resources as resources_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Studio Booking API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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
