from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..deps import get_current_user

router = APIRouter(prefix="/bookings", tags=["bookings"])


@router.get("/", response_model=List[schemas.BookingOut])
def my_bookings(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return db.query(models.Booking).filter(models.Booking.user_id == current_user.id).all()


@router.get("/resource/{resource_id}", response_model=List[schemas.BookingOut])
def resource_bookings(resource_id: int, db: Session = Depends(get_db)):
    """Public endpoint so the frontend can render existing bookings as
    'unavailable' slots on a resource's calendar."""
    return (
        db.query(models.Booking)
        .filter(models.Booking.resource_id == resource_id)
        .all()
    )


@router.post("/", response_model=schemas.BookingOut)
def create_booking(
    booking: schemas.BookingCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if booking.end_time <= booking.start_time:
        raise HTTPException(status_code=400, detail="end_time must be after start_time")

    # Overlap check: does any existing booking for this resource intersect
    # the requested window? Two intervals [a_start, a_end) and [b_start, b_end)
    # overlap exactly when a_start < b_end AND a_end > b_start.
    overlap = (
        db.query(models.Booking)
        .filter(
            models.Booking.resource_id == booking.resource_id,
            models.Booking.start_time < booking.end_time,
            models.Booking.end_time > booking.start_time,
        )
        .first()
    )
    if overlap:
        raise HTTPException(
            status_code=409,
            detail="Dieser Zeitraum überschneidet sich mit einer bestehenden Buchung.",
        )

    db_booking = models.Booking(
        resource_id=booking.resource_id,
        user_id=current_user.id,
        start_time=booking.start_time,
        end_time=booking.end_time,
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking


@router.delete("/{booking_id}")
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your booking")

    db.delete(booking)
    db.commit()
    return {"detail": "Booking cancelled"}
