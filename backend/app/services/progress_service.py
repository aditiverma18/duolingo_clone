from sqlalchemy.orm import Session

from app.repositories.progress_repository import get_user_progress


def get_progress(
    db: Session,
    user_id: int
):
    return get_user_progress(db, user_id)

def refill_hearts(db, user_id=1):
    progress = get_user_progress(db, user_id)

    if not progress:
        return None

    progress.hearts = 5
    db.commit()
    db.refresh(progress)

    return progress