from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.course import CourseResponse
from app.services.course_service import get_learning_path

router = APIRouter(
    prefix="/api",
    tags=["Course"]
)


@router.get("/course", response_model=CourseResponse)
def get_course(db: Session = Depends(get_db)):
    return get_learning_path(db)