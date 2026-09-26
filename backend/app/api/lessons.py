from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.services.lesson_service import complete_lesson
from app.database.database import get_db
from app.schemas.exercise import AnswerRequest
from app.schemas.lesson import LessonResponse
from app.schemas.progress import AnswerResponse
from app.services.lesson_service import (
    get_lesson_data,
    check_answer
)
from app.repositories.progress_repository import get_user_progress

router = APIRouter(
    prefix="/api",
    tags=["Lessons"]
)


@router.get(
    "/lessons/{lesson_id}",
    response_model=LessonResponse
)
def get_lesson(
    lesson_id: int,
    db: Session = Depends(get_db)
):
    lesson = get_lesson_data(db, lesson_id)

    if not lesson:
        raise HTTPException(
            status_code=404,
            detail="Lesson not found"
        )

    return lesson


@router.post(
    "/lessons/{lesson_id}/answer",
    response_model=AnswerResponse
)
def submit_answer(
    lesson_id: int,
    request: AnswerRequest,
    db: Session = Depends(get_db)
):
    result = check_answer(
    db,
    lesson_id,
    request.exercise_id,
    request.answer
)

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Exercise not found"
        )

    progress = get_user_progress(db, 1)

    xp = 10 if result["is_correct"] else 0

    if not result["is_correct"]:
        progress.hearts = max(
            0,
            progress.hearts - 1
        )

    db.commit()
    db.refresh(progress)

    return {
        "is_correct": result["is_correct"],
        "correct_answer": result["correct_answer"],
        "hearts_remaining": progress.hearts,
        "xp_earned": xp
    }

@router.post(
    "/lessons/{lesson_id}/complete"
)
def finish_lesson(
    lesson_id: int,
    db: Session = Depends(get_db)
):
    result = complete_lesson(db, lesson_id)

    if not result:
        raise HTTPException(
            status_code=400,
            detail="Lesson cannot be completed"
        )

    return result