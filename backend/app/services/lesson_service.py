from datetime import date, datetime
import json

from sqlalchemy.orm import Session

from app.models import (
    ExerciseAttempt,
    LessonAttempt,
    SkillProgress,
)
from app.repositories.course_repository import get_lesson
from app.repositories.lesson_repository import get_exercise
from app.repositories.progress_repository import get_user_progress


def get_lesson_data(db: Session, lesson_id: int):
    return get_lesson(db, lesson_id)


def check_answer(
    db: Session,
    lesson_id: int,
    exercise_id: int,
    answer: str,
    user_id: int = 1
):
    exercise = get_exercise(db, exercise_id)

    if not exercise or exercise.lesson_id != lesson_id:
        return None

    progress = get_user_progress(db, user_id)

    if exercise.type == "MATCH_PAIRS":
        try:
           submitted_pairs = json.loads(answer)

           correct = (
            submitted_pairs
            == exercise.config_json.get("pairs", [])
        )
        except Exception:
            correct = False
    else:
        correct = (
        answer.strip().lower()
        == (exercise.correct_answer or "").strip().lower()
    )

    # Find or create the current lesson attempt
    attempt = (
        db.query(LessonAttempt)
        .filter(
            LessonAttempt.user_id == user_id,
            LessonAttempt.lesson_id == lesson_id,
            LessonAttempt.status == "IN_PROGRESS"
        )
        .first()
    )

    if not attempt:
        attempt = LessonAttempt(
            user_id=user_id,
            lesson_id=lesson_id,
            status="IN_PROGRESS"
        )
        db.add(attempt)
        db.flush()
    if not correct:
        progress.hearts = max(0, progress.hearts - 1)
        attempt.hearts_lost += 1

    xp = 10 if correct else 0

    exercise_attempt = ExerciseAttempt(
        lesson_attempt_id=attempt.id,
        exercise_id=exercise_id,
        answer=answer,
        is_correct=correct
    )

    db.add(exercise_attempt)

    db.commit()
    db.refresh(progress)

    return {
        "is_correct": correct,
        "correct_answer": exercise.correct_answer,
        "hearts_remaining": progress.hearts,
        "xp_earned": xp
    }


def complete_lesson(
    db: Session,
    lesson_id: int,
    user_id: int = 1
):
    lesson = get_lesson(db, lesson_id)

    if not lesson:
        return None

    progress = get_user_progress(db, user_id)

    attempt = (
        db.query(LessonAttempt)
        .filter(
            LessonAttempt.user_id == user_id,
            LessonAttempt.lesson_id == lesson_id,
            LessonAttempt.status == "IN_PROGRESS"
        )
        .first()
    )

    if not attempt:
        return None
    answered_count = db.query(ExerciseAttempt).filter(
    ExerciseAttempt.lesson_attempt_id == attempt.id
    ).count()

    if answered_count < len(lesson.exercises):
      return None
    # Prevent awarding XP twice
    if attempt.status == "COMPLETED":
        return None

    attempt.status = "COMPLETED"
    attempt.completed_at = datetime.utcnow()

    xp = lesson.xp_reward

    attempt.xp_earned = xp

    progress.total_xp += xp

    # Find the skill belonging to this lesson
    skill = lesson.skill

    skill_progress = (
        db.query(SkillProgress)
        .filter(
            SkillProgress.user_id == user_id,
            SkillProgress.skill_id == skill.id
        )
        .first()
    )

    if skill_progress:
        skill_progress.completion_percentage = 100
        skill_progress.crown_level = 1
        skill_progress.status = "COMPLETED"
        skill_progress.completed_at = datetime.utcnow()

    # Unlock next skill
    next_skill = (
        db.query(type(skill))
        .filter(
            type(skill).unit_id == skill.unit_id,
            type(skill).position == skill.position + 1
        )
        .first()
    )

    if next_skill:
        next_progress = (
            db.query(SkillProgress)
            .filter(
                SkillProgress.user_id == user_id,
                SkillProgress.skill_id == next_skill.id
            )
            .first()
        )

        if next_progress:
            next_progress.status = "AVAILABLE"

    # Daily activity
    from app.models import DailyActivity

    today = date.today()

    activity = (
        db.query(DailyActivity)
        .filter(
            DailyActivity.user_id == user_id,
            DailyActivity.activity_date == today
        )
        .first()
    )

    if not activity:
        activity = DailyActivity(
            user_id=user_id,
            activity_date=today,
            xp_earned=0,
            lessons_completed=0
        )
        db.add(activity)

    activity.xp_earned += xp
    activity.lessons_completed += 1

    # Update streak
    if progress.last_activity_date != today:
        progress.current_streak += 1

    progress.last_activity_date = today

    if progress.current_streak > progress.longest_streak:
        progress.longest_streak = progress.current_streak

    db.commit()
    db.refresh(progress)

    return {
        "xp_earned": xp,
        "total_xp": progress.total_xp,
        "hearts": progress.hearts,
        "current_streak": progress.current_streak,
        "skill_progress": 100
    }