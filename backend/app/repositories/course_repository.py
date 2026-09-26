from sqlalchemy.orm import Session, joinedload

from app.models import Course, Lesson, Unit, Skill


def get_course(db: Session):
    return (
        db.query(Course)
        .options(
            joinedload(Course.units)
            .joinedload(Unit.skills)
            .joinedload(Skill.lessons)
        )
        .first()
    )


def get_lesson(db: Session, lesson_id: int):
    return (
        db.query(Lesson)
        .options(
            joinedload(Lesson.exercises)
        )
        .filter(Lesson.id == lesson_id)
        .first()
    )