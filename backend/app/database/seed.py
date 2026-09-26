from datetime import date

from app.database.database import Base, SessionLocal, engine
from app.models import (
    User,
    Course,
    Unit,
    Skill,
    Lesson,
    Exercise,
    UserProgress,
    SkillProgress,
    DailyActivity,
)


def seed_database():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # Prevent duplicate seed data
        if db.query(User).first():
            print("Database already seeded.")
            return

        # -------------------------
        # USER
        # -------------------------

        user = User(
            username="Aditi",
            email="aditi@example.com"
        )

        db.add(user)
        db.flush()

        # -------------------------
        # USER PROGRESS
        # -------------------------

        user_progress = UserProgress(
            user_id=user.id,
            total_xp=120,
            current_streak=5,
            longest_streak=7,
            hearts=5,
            gems=100,
            daily_goal=20,
            last_activity_date=date.today()
        )

        db.add(user_progress)

        # -------------------------
        # COURSE
        # -------------------------

        course = Course(
            name="Spanish",
            source_language="English",
            target_language="Spanish",
            description="Learn beginner Spanish"
        )

        db.add(course)
        db.flush()

        # =====================================================
        # LESSON QUESTION BANK
        # =====================================================
        #
        # Key:
        # (unit_number, skill_number, lesson_number)
        #
        # Each lesson has 5 different exercise types:
        # 1. Multiple Choice
        # 2. Translate
        # 3. Match Pairs
        # 4. Fill Blank
        # 5. Type Answer
        #
        # =====================================================

        lesson_questions = {

            # -------------------------------------------------
            # UNIT 1 - SKILL 1
            # -------------------------------------------------

            (1, 1, 1): [

                (
                    "MULTIPLE_CHOICE",
                    "What does 'Hola' mean?",
                    "Hello",
                    {
                        "options": [
                            "Hello",
                            "Goodbye",
                            "Thank you",
                            "Please"
                        ]
                    }
                ),

                (
                    "TRANSLATE",
                    "Translate: Gracias",
                    "Thank you",
                    {
                        "word_bank": [
                            "Thank",
                            "you",
                            "Hello",
                            "Goodbye"
                        ]
                    }
                ),

                (
                    "MATCH_PAIRS",
                    "Match the Spanish words with their meanings.",
                    None,
                    {
                        "pairs": [
                            {
                                "left": "Hola",
                                "right": "Hello"
                            },
                            {
                                "left": "Adios",
                                "right": "Goodbye"
                            },
                            {
                                "left": "Gracias",
                                "right": "Thank you"
                            }
                        ]
                    }
                ),

                (
                    "FILL_BLANK",
                    "Yo ___ agua.",
                    "bebo",
                    {
                        "acceptable_answers": [
                            "bebo"
                        ]
                    }
                ),

                (
                    "TYPE_ANSWER",
                    "Translate: Buenos dias",
                    "Good morning",
                    {}
                )
            ],

            # -------------------------------------------------
            # UNIT 1 - SKILL 1 - LESSON 2
            # -------------------------------------------------

            (1, 1, 2): [

                (
                    "MULTIPLE_CHOICE",
                    "What does 'Casa' mean?",
                    "House",
                    {
                        "options": [
                            "House",
                            "Car",
                            "School",
                            "Food"
                        ]
                    }
                ),

                (
                    "TRANSLATE",
                    "Translate: Perro",
                    "Dog",
                    {
                        "word_bank": [
                            "Dog",
                            "Cat",
                            "House",
                            "Water"
                        ]
                    }
                ),

                (
                    "MATCH_PAIRS",
                    "Match the Spanish words with their meanings.",
                    None,
                    {
                        "pairs": [
                            {
                                "left": "Casa",
                                "right": "House"
                            },
                            {
                                "left": "Perro",
                                "right": "Dog"
                            },
                            {
                                "left": "Gato",
                                "right": "Cat"
                            }
                        ]
                    }
                ),

                (
                    "FILL_BLANK",
                    "El gato ___ pequeño.",
                    "es",
                    {
                        "acceptable_answers": [
                            "es"
                        ]
                    }
                ),

                (
                    "TYPE_ANSWER",
                    "Translate: Buenas noches",
                    "Good night",
                    {}
                )
            ],

            # -------------------------------------------------
            # UNIT 1 - SKILL 2 - LESSON 1
            # -------------------------------------------------

            (1, 2, 1): [

                (
                    "MULTIPLE_CHOICE",
                    "What does 'Agua' mean?",
                    "Water",
                    {
                        "options": [
                            "Water",
                            "Bread",
                            "Milk",
                            "Coffee"
                        ]
                    }
                ),

                (
                    "TRANSLATE",
                    "Translate: Quiero agua",
                    "I want water",
                    {
                        "word_bank": [
                            "I",
                            "want",
                            "water",
                            "bread"
                        ]
                    }
                ),

                (
                    "MATCH_PAIRS",
                    "Match the Spanish words with their meanings.",
                    None,
                    {
                        "pairs": [
                            {
                                "left": "Agua",
                                "right": "Water"
                            },
                            {
                                "left": "Pan",
                                "right": "Bread"
                            },
                            {
                                "left": "Leche",
                                "right": "Milk"
                            }
                        ]
                    }
                ),

                (
                    "FILL_BLANK",
                    "Yo ___ una manzana.",
                    "como",
                    {
                        "acceptable_answers": [
                            "como"
                        ]
                    }
                ),

                (
                    "TYPE_ANSWER",
                    "Translate: Tengo hambre",
                    "I am hungry",
                    {}
                )
            ],

            # -------------------------------------------------
            # UNIT 1 - SKILL 2 - LESSON 2
            # -------------------------------------------------

            (1, 2, 2): [

                (
                    "MULTIPLE_CHOICE",
                    "What does 'Pan' mean?",
                    "Bread",
                    {
                        "options": [
                            "Bread",
                            "Water",
                            "Apple",
                            "Milk"
                        ]
                    }
                ),

                (
                    "TRANSLATE",
                    "Translate: Me gusta el pan",
                    "I like bread",
                    {
                        "word_bank": [
                            "I",
                            "like",
                            "bread",
                            "water"
                        ]
                    }
                ),

                (
                    "MATCH_PAIRS",
                    "Match the Spanish words with their meanings.",
                    None,
                    {
                        "pairs": [
                            {
                                "left": "Pan",
                                "right": "Bread"
                            },
                            {
                                "left": "Manzana",
                                "right": "Apple"
                            },
                            {
                                "left": "Leche",
                                "right": "Milk"
                            }
                        ]
                    }
                ),

                (
                    "FILL_BLANK",
                    "Yo ___ leche.",
                    "bebo",
                    {
                        "acceptable_answers": [
                            "bebo"
                        ]
                    }
                ),

                (
                    "TYPE_ANSWER",
                    "Translate: Quiero comida",
                    "I want food",
                    {}
                )
            ],

            # -------------------------------------------------
            # UNIT 2 - SKILL 1 - LESSON 1
            # -------------------------------------------------

            (2, 1, 1): [

                (
                    "MULTIPLE_CHOICE",
                    "What does 'Amigo' mean?",
                    "Friend",
                    {
                        "options": [
                            "Friend",
                            "Teacher",
                            "Student",
                            "Family"
                        ]
                    }
                ),

                (
                    "TRANSLATE",
                    "Translate: Mi amigo",
                    "My friend",
                    {
                        "word_bank": [
                            "My",
                            "friend",
                            "family",
                            "teacher"
                        ]
                    }
                ),

                (
                    "MATCH_PAIRS",
                    "Match the Spanish words with their meanings.",
                    None,
                    {
                        "pairs": [
                            {
                                "left": "Amigo",
                                "right": "Friend"
                            },
                            {
                                "left": "Madre",
                                "right": "Mother"
                            },
                            {
                                "left": "Padre",
                                "right": "Father"
                            }
                        ]
                    }
                ),

                (
                    "FILL_BLANK",
                    "Mi ___ es bueno.",
                    "amigo",
                    {
                        "acceptable_answers": [
                            "amigo"
                        ]
                    }
                ),

                (
                    "TYPE_ANSWER",
                    "Translate: Mi madre",
                    "My mother",
                    {}
                )
            ],

            # -------------------------------------------------
            # UNIT 2 - SKILL 1 - LESSON 2
            # -------------------------------------------------

            (2, 1, 2): [

                (
                    "MULTIPLE_CHOICE",
                    "What does 'Madre' mean?",
                    "Mother",
                    {
                        "options": [
                            "Mother",
                            "Father",
                            "Brother",
                            "Friend"
                        ]
                    }
                ),

                (
                    "TRANSLATE",
                    "Translate: Mi padre",
                    "My father",
                    {
                        "word_bank": [
                            "My",
                            "father",
                            "mother",
                            "friend"
                        ]
                    }
                ),

                (
                    "MATCH_PAIRS",
                    "Match the Spanish words with their meanings.",
                    None,
                    {
                        "pairs": [
                            {
                                "left": "Madre",
                                "right": "Mother"
                            },
                            {
                                "left": "Padre",
                                "right": "Father"
                            },
                            {
                                "left": "Hermano",
                                "right": "Brother"
                            }
                        ]
                    }
                ),

                (
                    "FILL_BLANK",
                    "Mi ___ es alto.",
                    "padre",
                    {
                        "acceptable_answers": [
                            "padre"
                        ]
                    }
                ),

                (
                    "TYPE_ANSWER",
                    "Translate: Mi hermano",
                    "My brother",
                    {}
                )
            ],

            # -------------------------------------------------
            # UNIT 2 - SKILL 2 - LESSON 1
            # -------------------------------------------------

            (2, 2, 1): [

                (
                    "MULTIPLE_CHOICE",
                    "What does 'Escuela' mean?",
                    "School",
                    {
                        "options": [
                            "School",
                            "House",
                            "Office",
                            "Park"
                        ]
                    }
                ),

                (
                    "TRANSLATE",
                    "Translate: La escuela",
                    "The school",
                    {
                        "word_bank": [
                            "The",
                            "school",
                            "house",
                            "park"
                        ]
                    }
                ),

                (
                    "MATCH_PAIRS",
                    "Match the Spanish words with their meanings.",
                    None,
                    {
                        "pairs": [
                            {
                                "left": "Escuela",
                                "right": "School"
                            },
                            {
                                "left": "Casa",
                                "right": "House"
                            },
                            {
                                "left": "Parque",
                                "right": "Park"
                            }
                        ]
                    }
                ),

                (
                    "FILL_BLANK",
                    "Voy a la ___.",
                    "escuela",
                    {
                        "acceptable_answers": [
                            "escuela"
                        ]
                    }
                ),

                (
                    "TYPE_ANSWER",
                    "Translate: El parque",
                    "The park",
                    {}
                )
            ],

            # -------------------------------------------------
            # UNIT 2 - SKILL 2 - LESSON 2
            # -------------------------------------------------

            (2, 2, 2): [

                (
                    "MULTIPLE_CHOICE",
                    "What does 'Parque' mean?",
                    "Park",
                    {
                        "options": [
                            "Park",
                            "School",
                            "House",
                            "Store"
                        ]
                    }
                ),

                (
                    "TRANSLATE",
                    "Translate: Voy al parque",
                    "I go to the park",
                    {
                        "word_bank": [
                            "I",
                            "go",
                            "to",
                            "the",
                            "park"
                        ]
                    }
                ),

                (
                    "MATCH_PAIRS",
                    "Match the Spanish words with their meanings.",
                    None,
                    {
                        "pairs": [
                            {
                                "left": "Parque",
                                "right": "Park"
                            },
                            {
                                "left": "Tienda",
                                "right": "Store"
                            },
                            {
                                "left": "Escuela",
                                "right": "School"
                            }
                        ]
                    }
                ),

                (
                    "FILL_BLANK",
                    "Voy al ___.",
                    "parque",
                    {
                        "acceptable_answers": [
                            "parque"
                        ]
                    }
                ),

                (
                    "TYPE_ANSWER",
                    "Translate: La tienda",
                    "The store",
                    {}
                )
            ],

            # -------------------------------------------------
            # UNIT 3 - SKILL 1 - LESSON 1
            # -------------------------------------------------

            (3, 1, 1): [

                (
                    "MULTIPLE_CHOICE",
                    "What does 'Rojo' mean?",
                    "Red",
                    {
                        "options": [
                            "Red",
                            "Blue",
                            "Green",
                            "Yellow"
                        ]
                    }
                ),

                (
                    "TRANSLATE",
                    "Translate: Azul",
                    "Blue",
                    {
                        "word_bank": [
                            "Blue",
                            "Red",
                            "Green",
                            "Yellow"
                        ]
                    }
                ),

                (
                    "MATCH_PAIRS",
                    "Match the colors with their meanings.",
                    None,
                    {
                        "pairs": [
                            {
                                "left": "Rojo",
                                "right": "Red"
                            },
                            {
                                "left": "Azul",
                                "right": "Blue"
                            },
                            {
                                "left": "Verde",
                                "right": "Green"
                            }
                        ]
                    }
                ),

                (
                    "FILL_BLANK",
                    "El cielo es ___.",
                    "azul",
                    {
                        "acceptable_answers": [
                            "azul"
                        ]
                    }
                ),

                (
                    "TYPE_ANSWER",
                    "Translate: Verde",
                    "Green",
                    {}
                )
            ],

            # -------------------------------------------------
            # UNIT 3 - SKILL 1 - LESSON 2
            # -------------------------------------------------

            (3, 1, 2): [

                (
                    "MULTIPLE_CHOICE",
                    "What does 'Verde' mean?",
                    "Green",
                    {
                        "options": [
                            "Green",
                            "Red",
                            "Black",
                            "White"
                        ]
                    }
                ),

                (
                    "TRANSLATE",
                    "Translate: Amarillo",
                    "Yellow",
                    {
                        "word_bank": [
                            "Yellow",
                            "Green",
                            "Blue",
                            "Red"
                        ]
                    }
                ),

                (
                    "MATCH_PAIRS",
                    "Match the colors with their meanings.",
                    None,
                    {
                        "pairs": [
                            {
                                "left": "Verde",
                                "right": "Green"
                            },
                            {
                                "left": "Amarillo",
                                "right": "Yellow"
                            },
                            {
                                "left": "Blanco",
                                "right": "White"
                            }
                        ]
                    }
                ),

                (
                    "FILL_BLANK",
                    "El sol es ___.",
                    "amarillo",
                    {
                        "acceptable_answers": [
                            "amarillo"
                        ]
                    }
                ),

                (
                    "TYPE_ANSWER",
                    "Translate: Blanco",
                    "White",
                    {}
                )
            ],

            # -------------------------------------------------
            # UNIT 3 - SKILL 2 - LESSON 1
            # -------------------------------------------------

            (3, 2, 1): [

                (
                    "MULTIPLE_CHOICE",
                    "What does 'Uno' mean?",
                    "One",
                    {
                        "options": [
                            "One",
                            "Two",
                            "Three",
                            "Four"
                        ]
                    }
                ),

                (
                    "TRANSLATE",
                    "Translate: Dos",
                    "Two",
                    {
                        "word_bank": [
                            "One",
                            "Two",
                            "Three",
                            "Four"
                        ]
                    }
                ),

                (
                    "MATCH_PAIRS",
                    "Match the numbers with their meanings.",
                    None,
                    {
                        "pairs": [
                            {
                                "left": "Uno",
                                "right": "One"
                            },
                            {
                                "left": "Dos",
                                "right": "Two"
                            },
                            {
                                "left": "Tres",
                                "right": "Three"
                            }
                        ]
                    }
                ),

                (
                    "FILL_BLANK",
                    "Tengo ___ perros.",
                    "dos",
                    {
                        "acceptable_answers": [
                            "dos"
                        ]
                    }
                ),

                (
                    "TYPE_ANSWER",
                    "Translate: Tres",
                    "Three",
                    {}
                )
            ],

            # -------------------------------------------------
            # UNIT 3 - SKILL 2 - LESSON 2
            # -------------------------------------------------

            (3, 2, 2): [

                (
                    "MULTIPLE_CHOICE",
                    "What does 'Cinco' mean?",
                    "Five",
                    {
                        "options": [
                            "Five",
                            "Six",
                            "Seven",
                            "Eight"
                        ]
                    }
                ),

                (
                    "TRANSLATE",
                    "Translate: Cuatro",
                    "Four",
                    {
                        "word_bank": [
                            "Four",
                            "Five",
                            "Six",
                            "Seven"
                        ]
                    }
                ),

                (
                    "MATCH_PAIRS",
                    "Match the numbers with their meanings.",
                    None,
                    {
                        "pairs": [
                            {
                                "left": "Cuatro",
                                "right": "Four"
                            },
                            {
                                "left": "Cinco",
                                "right": "Five"
                            },
                            {
                                "left": "Seis",
                                "right": "Six"
                            }
                        ]
                    }
                ),

                (
                    "FILL_BLANK",
                    "Tengo ___ libros.",
                    "cinco",
                    {
                        "acceptable_answers": [
                            "cinco"
                        ]
                    }
                ),

                (
                    "TYPE_ANSWER",
                    "Translate: Seis",
                    "Six",
                    {}
                )
            ],
        }

        # -------------------------
        # COURSE CONTENT
        # -------------------------

        for unit_number in range(1, 4):

            unit = Unit(
                course_id=course.id,
                title=f"Unit {unit_number}",
                description=f"Spanish basics - Unit {unit_number}",
                position=unit_number
            )

            db.add(unit)
            db.flush()

            for skill_number in range(1, 3):

                skill = Skill(
                    unit_id=unit.id,
                    title=f"Skill {unit_number}.{skill_number}",
                    description="Practice useful Spanish vocabulary",
                    position=skill_number,
                    xp_reward=10
                )

                db.add(skill)
                db.flush()

                # First skill available, everything else locked
                if unit_number == 1 and skill_number == 1:
                    status = "AVAILABLE"
                    progress = 20
                else:
                    status = "LOCKED"
                    progress = 0

                skill_progress = SkillProgress(
                    user_id=user.id,
                    skill_id=skill.id,
                    status=status,
                    completion_percentage=progress,
                    crown_level=0
                )

                db.add(skill_progress)

                for lesson_number in range(1, 3):

                    lesson = Lesson(
                        skill_id=skill.id,
                        title=f"Lesson {unit_number}.{skill_number}.{lesson_number}",
                        position=lesson_number,
                        xp_reward=10
                    )

                    db.add(lesson)
                    db.flush()

                    # Get unique questions for this lesson
                    questions = lesson_questions[
                        (unit_number, skill_number, lesson_number)
                    ]

                    # -------------------------
                    # ADD EXERCISES
                    # -------------------------

                    for position, (
                        exercise_type,
                        prompt,
                        correct_answer,
                        config
                    ) in enumerate(questions, start=1):

                        exercise = Exercise(
                            lesson_id=lesson.id,
                            type=exercise_type,
                            position=position,
                            prompt=prompt,
                            correct_answer=correct_answer,
                            config_json=config
                        )

                        db.add(exercise)

        # -------------------------
        # DAILY ACTIVITY
        # -------------------------

        activity = DailyActivity(
            user_id=user.id,
            activity_date=date.today(),
            xp_earned=120,
            lessons_completed=2
        )

        db.add(activity)

        # -------------------------
        # COMMIT
        # -------------------------

        db.commit()

        print("Database seeded successfully!")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()