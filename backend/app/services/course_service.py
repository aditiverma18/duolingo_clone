from sqlalchemy.orm import Session

from app.repositories.course_repository import get_course
from app.models import SkillProgress


def get_learning_path(db: Session, user_id: int = 1):
    course = get_course(db)

    if not course:
        return None

    for unit in course.units:
        for skill in unit.skills:

            progress = db.query(SkillProgress).filter(
                SkillProgress.user_id == user_id,
                SkillProgress.skill_id == skill.id
            ).first()

            if progress:
                skill.status = progress.status
                skill.completion_percentage = (
                    progress.completion_percentage
                )
                skill.crown_level = progress.crown_level
            else:
                skill.status = "LOCKED"
                skill.completion_percentage = 0
                skill.crown_level = 0

    return course