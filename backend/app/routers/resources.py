from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/resources", tags=["resources"])


@router.get("/", response_model=List[schemas.ResourceOut])
def list_resources(db: Session = Depends(get_db)):
    return db.query(models.Resource).all()


@router.post("/", response_model=schemas.ResourceOut)
def create_resource(resource: schemas.ResourceCreate, db: Session = Depends(get_db)):
    # NOTE: intentionally left open (no auth) for demo/seeding purposes.
    # In a real product this would be an admin-only endpoint.
    db_resource = models.Resource(
        name=resource.name,
        description=resource.description,
        location=resource.location,
    )
    db.add(db_resource)
    db.commit()
    db.refresh(db_resource)
    return db_resource
