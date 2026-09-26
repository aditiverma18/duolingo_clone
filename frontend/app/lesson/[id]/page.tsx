"use client";

import Confetti from "@/components/Confetti";
import {
  BoltIcon,
  CheckIcon,
  CloseIcon,
  FlameIcon,
  HeartIcon,
  SpeakerIcon,
  TargetIcon,
  TrophyIcon,
  XMarkIcon,
} from "@/components/Icons";
import Mascot from "@/components/Mascot";
import { sfx } from "@/lib/sfx";
import { useParams, useRouter } from "next/navigation";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

const API = "https://duolingo-clone-jsi8.onrender.com/api";
/* =========================================================
   TYPES (mirror the backend response schemas)
   ========================================================= */

type Pair = { left: string; right: string };

type Exercise = {
  id: number;
  type: string;
  position: number;
  prompt: string;
  correct_answer: string | null;
  config_json: {
    options?: string[];
    word_bank?: string[];
    pairs?: Pair[];
    acceptable_answers?: string[];
  } | null;
};

type Lesson = {
  id: number;
  title: string;
  xp_reward: number;
  exercises: Exercise[];
};

type AnswerResult = {
  is_correct: boolean;
  correct_answer: string | null;
  hearts_remaining: number;
  xp_earned: number;
};

type CompleteResult = {
  xp_earned: number;
  total_xp: number;
  hearts: number;
  current_streak: number;
  skill_progress: number;
};

type MascotState =
  | "idle"
  | "happy"
  | "celebrating"
  | "wrong"
  | "thinking"
  | "encouraging"
  | "streak";

const PRAISE = [
  "Nicely done!",
  "Great job!",
  "Correct!",
  "Amazing!",
  "You got it!",
  "Excellent!",
];

/* Stable shuffle so the correct answer isn't always first. */
function seededShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let s = ((seed * 2654435761) % 4294967296) || 1;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) % 4294967296;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

/* =========================================================
   PAGE
   ========================================================= */

export default function LessonPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const lessonId = params.id;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  /* Answer state for the current exercise */
  const [answer, setAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [tiles, setTiles] = useState<number[]>([]);
  const [useKeyboard, setUseKeyboard] = useState(false);
  const [selectedPair, setSelectedPair] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [pairFlash, setPairFlash] = useState<{
    keys: string[];
    kind: "correct" | "wrong";
  } | null>(null);

  /* Result / flow state */
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [praise, setPraise] = useState(PRAISE[0]);
  const [checking, setChecking] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [hearts, setHearts] = useState(5);
  const [heartHits, setHeartHits] = useState(0);
  const [combo, setCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [quitOpen, setQuitOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState<CompleteResult | null>(null);
  const [mascotState, setMascotState] = useState<MascotState>("idle");

  const tileZoneRef = useRef<HTMLDivElement>(null);
  const pendingFly = useRef<{ id: number; from: DOMRect } | null>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    async function loadLesson() {
      try {
        const response = await fetch(`${API}/lessons/${lessonId}`);
        if (response.ok) {
          setLesson(await response.json());
        }

        const progressResponse = await fetch(`${API}/me`);

if (progressResponse && progressResponse.ok) {
  const progressData = await progressResponse.json();
  setHearts(progressData.hearts ?? 5);
}
      } catch (error) {
        console.error("Failed to load lesson:", error);
      } finally {
        setLoading(false);
      }
    }

    loadLesson();
  }, [lessonId]);

  /* ---------- derived data for the current exercise ---------- */

  const exercise = lesson?.exercises[index];
  const total = lesson?.exercises.length ?? 0;
  const isLast = index === total - 1;

  const options = useMemo(
    () =>
      exercise ? seededShuffle(exercise.config_json?.options ?? [], exercise.id) : [],
    [exercise]
  );

  const bank = useMemo(
    () =>
      exercise
        ? seededShuffle(exercise.config_json?.word_bank ?? [], exercise.id + 7)
        : [],
    [exercise]
  );

  const pairs = useMemo(() => exercise?.config_json?.pairs ?? [], [exercise]);

  const rightOrder = useMemo(() => {
    const order = seededShuffle(
      pairs.map((_, i) => i),
      (exercise?.id ?? 0) + 13
    );
    const unchanged = order.length > 1 && order.every((v, i) => v === i);
    return unchanged ? [...order.slice(1), order[0]] : order;
  }, [pairs, exercise]);

  const wordBankMode =
    exercise?.type === "TRANSLATE" && bank.length > 0 && !useKeyboard;

  function currentAnswer(): string {
    if (!exercise) return "";
    switch (exercise.type) {
      case "MULTIPLE_CHOICE":
        return selectedOption ?? "";
      case "MATCH_PAIRS":
        return JSON.stringify(exercise.config_json?.pairs ?? []);
      case "TRANSLATE":
        return wordBankMode ? tiles.map((i) => bank[i]).join(" ") : answer;
      default:
        return answer;
    }
  }

  const canCheck =
    !!exercise &&
    (exercise.type === "MATCH_PAIRS"
      ? matchedPairs.length === pairs.length * 2
      : currentAnswer().trim().length > 0);

  /* ---------- actions ---------- */

  async function submitAnswer(force = false) {
    if (!exercise || feedback || busyRef.current) return;
    if (!force && !canCheck) return;

    busyRef.current = true;
    setChecking(true);
    setRequestError(null);

    try {
      const response = await fetch(`${API}/lessons/${lessonId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exercise_id: exercise.id,
          answer: currentAnswer(),
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data: AnswerResult = await response.json();

      if (data.is_correct) {
        sfx.correct();
        setPraise(PRAISE[Math.floor(Math.random() * PRAISE.length)]);
        setCombo(combo + 1);
        setCorrectCount((c) => c + 1);
        setMascotState(combo + 1 >= 3 ? "streak" : "happy");
      } else {
        sfx.wrong();
        setCombo(0);
        setMascotState("wrong");
      }

      if (data.hearts_remaining < hearts) {
        setHeartHits((h) => h + 1);
      }
      setHearts(data.hearts_remaining);
      setFeedback(data.is_correct ? "correct" : "wrong");
    } catch (error) {
      console.error("Failed to submit answer:", error);
      setRequestError("Couldn't check your answer. Make sure the backend is running.");
    } finally {
      busyRef.current = false;
      setChecking(false);
    }
  }

  function nextExercise() {
    if (!lesson || !feedback || busyRef.current) return;

    if (isLast) {
      void finishLesson();
      return;
    }

    busyRef.current = true;
    setLeaving(true);

    window.setTimeout(() => {
      setIndex((i) => i + 1);
      setAnswer("");
      setSelectedOption(null);
      setTiles([]);
      setUseKeyboard(false);
      setSelectedPair(null);
      setMatchedPairs([]);
      setPairFlash(null);
      setFeedback(null);
      setRequestError(null);
      setMascotState("thinking");
      setLeaving(false);
      busyRef.current = false;
    }, 220);
  }

  async function finishLesson() {
    if (busyRef.current) return;
    busyRef.current = true;
    setChecking(true);

    try {
      const response = await fetch(`${API}/lessons/${lessonId}/complete`, {
        method: "POST",
      });
      const data = await response.json();
      setResult(response.ok ? data : null);
    } catch (error) {
      console.error("Failed to complete lesson:", error);
    } finally {
      sfx.complete();
      setCompleted(true);
      setChecking(false);
      busyRef.current = false;
    }
  }

  function toggleTile(i: number, el: HTMLElement) {
    if (feedback) return;
    pendingFly.current = { id: i, from: el.getBoundingClientRect() };
    setTiles((t) => (t.includes(i) ? t.filter((x) => x !== i) : [...t, i]));
  }

  function pickPair(key: string) {
    if (feedback || pairFlash || matchedPairs.includes(key)) return;

    if (!selectedPair || selectedPair === key) {
      setSelectedPair(selectedPair === key ? null : key);
      return;
    }

    const [firstSide, firstIndex] = selectedPair.split("-");
    const [secondSide, secondIndex] = key.split("-");

    /* Tapping another item in the same column just moves the selection */
    if (firstSide === secondSide) {
      setSelectedPair(key);
      return;
    }

    const first = selectedPair;
    setSelectedPair(null);

    if (firstIndex === secondIndex) {
      sfx.matchCorrect();
      setPairFlash({ keys: [first, key], kind: "correct" });

      const willFinish = matchedPairs.length + 2 === pairs.length * 2;

      window.setTimeout(() => {
        setMatchedPairs((m) => [...m, first, key]);
        setPairFlash(null);
        if (willFinish) {
          window.setTimeout(() => void submitAnswer(true), 250);
        }
      }, 380);
    } else {
      sfx.matchWrong();
      setPairFlash({ keys: [first, key], kind: "wrong" });
      window.setTimeout(() => setPairFlash(null), 480);
    }
  }

  /* ---------- effects ---------- */

  /* Word-bank tiles fly between the bank and the answer line (FLIP). */
  useLayoutEffect(() => {
    const fly = pendingFly.current;
    if (!fly || !tileZoneRef.current) return;
    pendingFly.current = null;

    const zone = tiles.includes(fly.id) ? "answer" : "bank";
    const el = tileZoneRef.current.querySelector<HTMLElement>(
      `[data-tile="${fly.id}"][data-zone="${zone}"]`
    );
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const to = el.getBoundingClientRect();
    const dx = fly.from.left - to.left;
    const dy = fly.from.top - to.top;
    if (!dx && !dy) return;

    el.animate(
      [
        { transform: `translate(${dx}px, ${dy}px)`, zIndex: 5 },
        { transform: "translate(0, 0)", zIndex: 5 },
      ],
      { duration: 280, easing: "cubic-bezier(.2, .9, .3, 1.12)" }
    );
  }, [tiles]);

  /* Keyboard: Enter = check / continue, 1-9 = pick an option, Esc = quit. */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.repeat) return;
      sfx.unlock();

      const target = e.target as HTMLElement | null;

      if (e.key === "Enter" && target?.closest("[data-primary]")) return;

      if (completed) {
        if (e.key === "Enter") {
          e.preventDefault();
          router.push("/");
        }
        return;
      }

      if (quitOpen) {
        if (e.key === "Escape") setQuitOpen(false);
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        if (feedback) nextExercise();
        else void submitAnswer();
        return;
      }

      if (e.key === "Escape") {
        setQuitOpen(true);
        return;
      }

      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || feedback || !exercise) return;

      const n = Number(e.key);
      if (!Number.isInteger(n) || n < 1) return;

      if (exercise.type === "MULTIPLE_CHOICE" && options[n - 1]) {
        setSelectedOption(options[n - 1]);
      }

      if (exercise.type === "MATCH_PAIRS") {
        const keys = [
          ...pairs.map((_, i) => `left-${i}`),
          ...rightOrder.map((i) => `right-${i}`),
        ];
        if (keys[n - 1]) pickPair(keys[n - 1]);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  /* ---------- render ---------- */

  if (loading) {
    return (
      <main className="duo-loading">
        <Mascot state="happy" size={100} />
        <p>Loading lesson...</p>
      </main>
    );
  }

  if (!lesson || !exercise) {
    return (
      <main className="duo-loading">
        <Mascot state="happy" size={100} />
        <p>Lesson not found.</p>
        <button className="btn btn-green" onClick={() => router.push("/")}>
          Back to home
        </button>
      </main>
    );
  }

  if (completed) {
    return (
      <CompleteScreen
        title={lesson.title}
        xp={result?.xp_earned ?? lesson.xp_reward}
        accuracy={total ? Math.round((correctCount / total) * 100) : 100}
        streak={result?.current_streak ?? 0}
        onContinue={() => router.push("/")}
      />
    );
  }

  const progress = ((index + (feedback ? 1 : 0)) / total) * 100;
  const phrase = exercise.prompt.match(/^\s*translate\s*:\s*(.+)$/i)?.[1];
  const answerState =
    feedback === "wrong" ? "is-wrong" : feedback === "correct" ? "is-correct" : "";

  function renderPair(key: string, label: string, n: number) {
    const isMatched = matchedPairs.includes(key);
    const flash = pairFlash?.keys.includes(key) ? pairFlash.kind : null;

    const cls = isMatched
      ? "is-matched"
      : flash === "correct"
      ? "is-correct"
      : flash === "wrong"
      ? "is-wrong"
      : selectedPair === key
      ? "is-selected"
      : "";

    return (
      <button
        key={key}
        type="button"
        className={`choice pair ${cls}`}
        disabled={isMatched || !!feedback}
        onClick={() => pickPair(key)}
      >
        <span className="choice-key">{n}</span>
        <span className="pair-label">{label}</span>
      </button>
    );
  }

  let heading = exercise.prompt;
  if (exercise.type === "FILL_BLANK") heading = "Fill in the blank";
  if ((exercise.type === "TRANSLATE" || exercise.type === "TYPE_ANSWER") && phrase) {
    heading = "Translate this phrase";
  }

  const blankParts = exercise.prompt.split(/_{2,}/);

  return (
    <main className="lesson-page" onPointerDown={() => sfx.unlock()}>
      {/* =====================================================
          TOP BAR
          ===================================================== */}

      <header className="lesson-header">
        <div className="lesson-header-inner">
          <button
            onClick={() => setQuitOpen(true)}
            className="lesson-close"
            aria-label="Quit lesson"
          >
            <CloseIcon />
          </button>

          <div className="lesson-progress">
            {combo >= 2 && feedback === "correct" && (
              <span key={combo} className="combo-label">
                {combo} in a row!
              </span>
            )}

            <div
              className="lesson-progress-track"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
            >
              <div
                className={`lesson-progress-fill ${combo >= 2 ? "is-hot" : ""}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div
            className={`lesson-hearts ${hearts === 0 ? "is-empty" : ""}`}
            aria-label={`${hearts} hearts left`}
          >
            <span key={heartHits} className={heartHits ? "heart-hit" : ""}>
              <HeartIcon size={30} />
            </span>
            <strong>{hearts}</strong>
          </div>
        </div>
      </header>

      {/* =====================================================
          QUESTION
          ===================================================== */}

      <section className="lesson-main">
        <div key={index} className={`lesson-stage ${leaving ? "is-leaving" : ""}`}>
          <div className="lesson-mascot">
           <Mascot state="happy" size={110} />
          </div>

          <h1 className="q-title">{heading}</h1>

          {/* ---------- MULTIPLE CHOICE ---------- */}

          {exercise.type === "MULTIPLE_CHOICE" && (
            <div className="choices" role="radiogroup" aria-label="Answer options">
              {options.map((option, i) => {
                const isSelected = selectedOption === option;
                const cls = isSelected
                  ? feedback
                    ? feedback === "correct"
                      ? "is-correct"
                      : "is-wrong"
                    : "is-selected"
                  : "";

                return (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={!!feedback}
                    className={`choice ${cls}`}
                    onClick={() => setSelectedOption(option)}
                  >
                    <span className="choice-key">{i + 1}</span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ---------- TRANSLATE / TYPE ANSWER ---------- */}

          {(exercise.type === "TRANSLATE" || exercise.type === "TYPE_ANSWER") && (
            <>
              {phrase && (
                <div className="prompt-row">
                  <button
                    type="button"
                    className="speak-btn"
                    aria-label="Listen"
                    onClick={() => speak(phrase)}
                  >
                    <SpeakerIcon />
                  </button>
                  <p className="prompt-phrase">{phrase}</p>
                </div>
              )}

              {wordBankMode ? (
                <div ref={tileZoneRef} className="word-bank">
                  <div className={`wb-answer ${answerState}`}>
                    {tiles.map((i) => (
                      <button
                        key={i}
                        type="button"
                        data-tile={i}
                        data-zone="answer"
                        className="tile"
                        disabled={!!feedback}
                        onClick={(e) => toggleTile(i, e.currentTarget)}
                      >
                        {bank[i]}
                      </button>
                    ))}
                  </div>

                  <div className="wb-bank">
                    {bank.map((word, i) =>
                      tiles.includes(i) ? (
                        <span key={i} className="tile tile-slot" aria-hidden="true">
                          {word}
                        </span>
                      ) : (
                        <button
                          key={i}
                          type="button"
                          data-tile={i}
                          data-zone="bank"
                          className="tile"
                          disabled={!!feedback}
                          onClick={(e) => toggleTile(i, e.currentTarget)}
                        >
                          {word}
                        </button>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={!!feedback}
                  autoFocus
                  placeholder="Type your answer"
                  aria-label="Your answer"
                  spellCheck={false}
                  className={`answer-box ${answerState}`}
                />
              )}

              {exercise.type === "TRANSLATE" && bank.length > 0 && !feedback && (
                <button
                  type="button"
                  className="mode-toggle"
                  onClick={() => setUseKeyboard(!useKeyboard)}
                >
                  {useKeyboard ? "Use word bank" : "Use keyboard"}
                </button>
              )}
            </>
          )}

          {/* ---------- FILL IN THE BLANK ---------- */}

          {exercise.type === "FILL_BLANK" && (
            <p className="fill-sentence">
              {blankParts[0]}
              <input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={!!feedback}
                autoFocus
                aria-label="Missing word"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                className={`fill-input ${answerState}`}
                style={{
                  width: `${Math.max(5, (exercise.correct_answer?.length ?? 4) + 2)}ch`,
                }}
              />
              {blankParts.slice(1).join("___")}
            </p>
          )}

          {/* ---------- MATCH PAIRS ---------- */}

          {exercise.type === "MATCH_PAIRS" && (
            <div className="match-grid">
              <div className="match-col">
                {pairs.map((pair, i) => renderPair(`left-${i}`, pair.left, i + 1))}
              </div>
              <div className="match-col">
                {rightOrder.map((pi, j) =>
                  renderPair(`right-${pi}`, pairs[pi].right, pairs.length + j + 1)
                )}
              </div>
            </div>
          )}

          {/* ---------- ANY OTHER TYPE ---------- */}

          {!["MULTIPLE_CHOICE", "TRANSLATE", "TYPE_ANSWER", "FILL_BLANK", "MATCH_PAIRS"].includes(
            exercise.type
          ) && (
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={!!feedback}
              autoFocus
              placeholder="Type your answer"
              aria-label="Your answer"
              className={`answer-box ${answerState}`}
            />
          )}
        </div>
      </section>

      {/* =====================================================
          FOOTER / FEEDBACK SHEET
          ===================================================== */}

      <footer className={`lesson-footer ${feedback ? `is-${feedback}` : ""}`}>
        <div className="lesson-footer-inner">
          {feedback ? (
            <div className="feedback" role="status" aria-live="polite">
              <div className="feedback-badge">
                {feedback === "correct" ? <CheckIcon size={40} /> : <XMarkIcon size={40} />}
              </div>
              <div className="feedback-text">
                <h2>
                  {feedback === "correct"
                    ? praise
                    : exercise.correct_answer
                    ? "Correct solution:"
                    : "Not quite"}
                </h2>
                {feedback === "wrong" && exercise.correct_answer && (
                  <p>{exercise.correct_answer}</p>
                )}
              </div>
            </div>
          ) : requestError ? (
            <p className="footer-error" role="alert">
              {requestError}
            </p>
          ) : (
            <span className="footer-spacer" />
          )}

          <button
            type="button"
            data-primary
            className={`btn footer-btn ${feedback === "wrong" ? "btn-red" : ""}`}
            disabled={!feedback && (!canCheck || checking)}
            onClick={feedback ? nextExercise : () => void submitAnswer()}
          >
            {feedback ? (isLast ? "Finish" : "Continue") : checking ? "Checking" : "Check"}
          </button>
        </div>
      </footer>

      {/* =====================================================
          QUIT CONFIRMATION
          ===================================================== */}

      {quitOpen && (
        <div className="quit-overlay" onClick={() => setQuitOpen(false)}>
          <div
            className="quit-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quit-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="quit-title">Leave this lesson?</h2>
            <p>Your progress in this lesson won&apos;t be saved.</p>
            <button
              type="button"
              className="btn btn-blue btn-block"
              autoFocus
              onClick={() => setQuitOpen(false)}
            >
              Keep learning
            </button>
            <button type="button" className="btn-text" onClick={() => router.push("/")}>
              Quit lesson
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

/* =========================================================
   LESSON COMPLETE SCREEN
   ========================================================= */

function useCountUp(target: number, delay: number, duration = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    let start = 0;

    const timer = window.setTimeout(() => {
      const step = (t: number) => {
        if (!start) start = t;
        const p = Math.min((t - start) / duration, 1);
        setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    }, delay);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [target, delay, duration]);

  return value;
}

function StatCard({
  label,
  value,
  suffix = "",
  color,
  icon,
  delay,
}: {
  label: string;
  value: number;
  suffix?: string;
  color: string;
  icon: ReactNode;
  delay: number;
}) {
  const shown = useCountUp(value, delay + 250);

  return (
    <div className="stat-card" style={{ "--c": color, "--d": `${delay}ms` } as CSSProperties}>
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-body">
        {icon}
        <strong>
          {shown}
          {suffix}
        </strong>
      </div>
    </div>
  );
}

function CompleteScreen({
  title,
  xp,
  accuracy,
  streak,
  onContinue,
}: {
  title: string;
  xp: number;
  accuracy: number;
  streak: number;
  onContinue: () => void;
}) {
  return (
    <main className="complete-page">
      <Confetti />

      <div className="complete-hero">
        <div className="complete-rays" aria-hidden="true" />
        <TrophyIcon size={128} className="complete-trophy" />
      </div>

      <h1 className="complete-title">Lesson complete!</h1>
      <p className="complete-sub">You finished {title}.</p>

      <div className="complete-stats">
        <StatCard label="Total XP" value={xp} color="#ffc800" icon={<BoltIcon size={26} />} delay={500} />
        <StatCard
          label={accuracy === 100 ? "Perfect" : "Accuracy"}
          value={accuracy}
          suffix="%"
          color="#58cc02"
          icon={<TargetIcon size={24} />}
          delay={650}
        />
        <StatCard label="Streak" value={streak} color="#ff9600" icon={<FlameIcon size={26} />} delay={800} />
      </div>

      <footer className="lesson-footer complete-footer">
        <div className="lesson-footer-inner">
          <span className="footer-spacer" />
          <button type="button" data-primary autoFocus className="btn footer-btn" onClick={onContinue}>
            Continue
          </button>
        </div>
      </footer>
    </main>
  );
}
