from sqlalchemy.orm import Session

from app.models import Exercise


def get_exercise(
    db: Session,
    exercise_id: int
):
    return (
        db.query(Exercise)
        .filter(Exercise.id == exercise_id)
        .first()
    )