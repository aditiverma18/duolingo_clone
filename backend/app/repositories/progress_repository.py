from sqlalchemy.orm import Session

from app.models import UserProgress


def get_user_progress(
    db: Session,
    user_id: int
):
    return (
        db.query(UserProgress)
        .filter(UserProgress.user_id == user_id)
        .first()
    )