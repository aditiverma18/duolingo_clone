from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.repositories.progress_repository import get_user_progress
from app.schemas.progress import UserProgressResponse
from app.database.database import get_db
from app.services.progress_service import refill_hearts
from fastapi import Depends
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/api",
    tags=["User"]
)


@router.get(
    "/me",
    response_model=UserProgressResponse
)
def get_me(
    db: Session = Depends(get_db)
):
    return get_user_progress(db, 1)

@router.post("/me/hearts/refill")
def refill_user_hearts(
    db: Session = Depends(get_db),
):
    progress = refill_hearts(db, 1)

    return {
        "hearts": progress.hearts
    }