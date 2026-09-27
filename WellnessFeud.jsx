import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  Plus,
  Minus,
  Eye,
  Trophy,
  PartyPopper,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
} from "lucide-react";

// ---------------------------------------------------------------------------
// DATA
// ---------------------------------------------------------------------------
// Swap this array out for your own survey questions. Each answer's `points`
// is the "base" survey value; it gets multiplied by the active stage
// (1x / 2x / 3x) when it's revealed and awarded to a team.
const QUESTIONS = [
  {
    id: 1,
    prompt: "Name something people do to unwind after a stressful day.",
    answers: [
      { text: "Take a warm bath or shower", points: 32 },
      { text: "Go for a walk outside", points: 27 },
      { text: "Watch a favorite show", points: 21 },
      { text: "Talk to a friend or family member", points: 12 },
      { text: "Journal or write it out", points: 5 },
      { text: "Practice deep breathing", points: 3 },
    ],
  },
  {
    id: 2,
    prompt: "Name a warning sign that someone might be burning out.",
    answers: [
      { text: "Trouble sleeping", points: 29 },
      { text: "Constant fatigue", points: 24 },
      { text: "Snapping at loved ones", points: 18 },
      { text: "Losing interest in hobbies", points: 15 },
      { text: "Missing deadlines", points: 9 },
      { text: "Skipping meals", points: 5 },
    ],
  },
  {
    id: 3,
    prompt: "Name a healthy habit that's hard to stick with.",
    answers: [
      { text: "Drinking enough water", points: 26 },
      { text: "Getting 8 hours of sleep", points: 25 },
      { text: "Exercising regularly", points: 20 },
      { text: "Meditating daily", points: 14 },
      { text: "Eating balanced meals", points: 10 },
      { text: "Limiting screen time", points: 5 },
    ],
  },
];

const STAGES = [
  { id: 1, label: "1x Preliminaries" },
  { id: 2, label: "2x Semi Finals" },
  { id: 3, label: "3x Finals" },
];

// ---------------------------------------------------------------------------
// SCORE CARD
// ---------------------------------------------------------------------------
function ScoreCard({ name, score, onAdjust, accent }) {
  const isEmerald = accent === "emerald";
  const ring = isEmerald ? "border-emerald-100" : "border-sky-100";
  const chip = isEmerald
    ? "bg-emerald-50 text-emerald-700"
    : "bg-sky-50 text-sky-700";
  const btn = isEmerald
    ? "hover:bg-emerald-50 active:bg-emerald-100 text-emerald-700"
    : "hover:bg-sky-50 active:bg-sky-100 text-sky-700";

  return (
    <div
      className={`flex items-center gap-4 bg-white rounded-2xl shadow-md border ${ring} px-5 py-3`}
    >
      <div className="flex flex-col">
        <span
          className={`text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full w-fit mb-1 ${chip}`}
        >
          {name}
        </span>
        <span className="text-3xl font-extrabold text-emerald-600 font-mono leading-none">
          {score}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <button
          onClick={() => onAdjust(10)}
          aria-label={`Add points to ${name}`}
          className={`rounded-lg p-1.5 border border-slate-200 transition-colors ${btn}`}
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
        <button
          onClick={() => onAdjust(-10)}
          aria-label={`Subtract points from ${name}`}
          className={`rounded-lg p-1.5 border border-slate-200 transition-colors ${btn}`}
        >
          <Minus size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HEADER
// ---------------------------------------------------------------------------
function Header({
  teamAName,
  teamBName,
  teamAScore,
  teamBScore,
  adjustA,
  adjustB,
  multiplier,
  setMultiplier,
}) {
  return (
    <header className="flex items-center justify-between px-8 py-4 w-full bg-white/70 backdrop-blur-sm border-b border-emerald-100">
      {/* Left: title */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="p-2 rounded-xl bg-emerald-50">
          <Leaf size={22} className="text-emerald-600" strokeWidth={2.5} />
        </div>
        <span className="text-2xl font-bold text-slate-900">
          The Wellness Feud
        </span>
      </div>

      {/* Center: scoreboard */}
      <div className="flex gap-6">
        <ScoreCard
          name={teamAName}
          score={teamAScore}
          onAdjust={adjustA}
          accent="emerald"
        />
        <ScoreCard
          name={teamBName}
          score={teamBScore}
          onAdjust={adjustB}
          accent="sky"
        />
      </div>

      {/* Right: stage multipliers */}
      <div className="flex items-center gap-2 p-1.5 bg-white/80 rounded-full border border-slate-200 shrink-0">
        {STAGES.map((s) => (
          <button
            key={s.id}
            onClick={() => setMultiplier(s.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              multiplier === s.id
                ? "bg-emerald-500 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// ANSWER TILE
// ---------------------------------------------------------------------------
function AnswerTile({ index, answer, revealed, multiplier, onReveal, onAward }) {
  const awarded = answer.points * multiplier;

  return (
    <div className="relative [perspective:1200px] h-20">
      <motion.div
        className="relative w-full h-full [transform-style:preserve-3d]"
        animate={{ rotateX: revealed ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Front (unrevealed) */}
        <button
          onClick={() => !revealed && onReveal(index)}
          className="absolute inset-0 w-full h-full flex items-center justify-between px-5 bg-white rounded-2xl shadow-md border border-emerald-100 [backface-visibility:hidden] hover:border-emerald-300 transition-colors"
          disabled={revealed}
        >
          <span className="text-lg font-bold text-slate-400 font-mono">
            {index + 1}
          </span>
          <span className="flex items-center gap-2 text-sm font-medium text-slate-500">
            Reveal <Eye size={16} />
          </span>
        </button>

        {/* Back (revealed) */}
        <div
          className="absolute inset-0 w-full h-full flex items-center justify-between px-5 bg-white rounded-2xl shadow-md border border-emerald-200 [backface-visibility:hidden] [transform:rotateX(180deg)]"
        >
          <span className="text-slate-800 font-semibold truncate pr-3">
            {answer.text}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-lg text-sm">
              {awarded}
            </span>
            <button
              onClick={() => onAward("A")}
              className="text-xs font-semibold px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
            >
              → A
            </button>
            <button
              onClick={() => onAward("B")}
              className="text-xs font-semibold px-2 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors"
            >
              → B
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// QUESTION SLIDE
// ---------------------------------------------------------------------------
function QuestionSlide({ question, revealedMap, multiplier, onReveal, onAward }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-10">
      <h1 className="text-xl md:text-2xl font-semibold text-slate-800 text-center mb-6 max-w-3xl">
        {question.prompt}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full mx-auto">
        {question.answers.map((answer, i) => (
          <AnswerTile
            key={i}
            index={i}
            answer={answer}
            revealed={!!revealedMap[i]}
            multiplier={multiplier}
            onReveal={onReveal}
            onAward={(team) => onAward(team, answer.points * multiplier)}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// RESULTS SLIDE
// ---------------------------------------------------------------------------
function ResultsSlide({ teamAName, teamBName, teamAScore, teamBScore }) {
  const isTie = teamAScore === teamBScore;
  const aWins = teamAScore > teamBScore;
  const winnerName = aWins ? teamAName : teamBName;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={isTie ? "tie" : winnerName}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center"
        >
          {isTie ? (
            <>
              <Sparkles size={40} className="text-sky-500 mb-3" />
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-8">
                It's a tie between {teamAName} and {teamBName}!
              </h1>
            </>
          ) : (
            <>
              <Trophy size={44} className="text-emerald-500 mb-3" />
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-8">
                {winnerName} wins!
              </h1>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-6 flex-wrap justify-center">
        <ResultStatCard
          name={teamAName}
          score={teamAScore}
          isWinner={!isTie && aWins}
          accent="emerald"
        />
        <ResultStatCard
          name={teamBName}
          score={teamBScore}
          isWinner={!isTie && !aWins}
          accent="sky"
        />
      </div>
    </div>
  );
}

function ResultStatCard({ name, score, isWinner, accent }) {
  const isEmerald = accent === "emerald";
  const ring = isWinner
    ? isEmerald
      ? "border-emerald-300 ring-2 ring-emerald-200"
      : "border-sky-300 ring-2 ring-sky-200"
    : "border-emerald-100";
  const label = isEmerald ? "text-emerald-700" : "text-sky-700";

  return (
    <div
      className={`relative flex flex-col items-center gap-2 bg-white rounded-2xl shadow-md border ${ring} px-10 py-8 min-w-[220px]`}
    >
      {isWinner && (
        <PartyPopper
          size={22}
          className={isEmerald ? "text-emerald-500" : "text-sky-500"}
        />
      )}
      <span className={`text-sm font-semibold uppercase tracking-wide ${label}`}>
        {name}
      </span>
      <span className="text-4xl font-extrabold text-slate-900 font-mono">
        {score}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MAIN APP
// ---------------------------------------------------------------------------
export default function WellnessFeudApp() {
  const [teamAName] = useState("Group 1");
  const [teamBName] = useState("Group 2");
  const [teamAScore, setTeamAScore] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [view, setView] = useState("game"); // "game" | "results"
  const [questionIndex, setQuestionIndex] = useState(0);
  const [revealedByQuestion, setRevealedByQuestion] = useState(
    QUESTIONS.map(() => ({}))
  );

  const question = QUESTIONS[questionIndex];
  const revealedMap = revealedByQuestion[questionIndex];

  const adjustA = (delta) =>
    setTeamAScore((prev) => Math.max(0, prev + delta));
  const adjustB = (delta) =>
    setTeamBScore((prev) => Math.max(0, prev + delta));

  const awardTeam = (team, amount) => {
    if (team === "A") adjustA(amount);
    else adjustB(amount);
  };

  const revealAnswer = (index) => {
    setRevealedByQuestion((prev) => {
      const next = [...prev];
      next[questionIndex] = { ...next[questionIndex], [index]: true };
      return next;
    });
  };

  const resetGame = () => {
    setTeamAScore(0);
    setTeamBScore(0);
    setMultiplier(1);
    setQuestionIndex(0);
    setView("game");
    setRevealedByQuestion(QUESTIONS.map(() => ({})));
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-emerald-50/40 to-sky-50/40">
      <Header
        teamAName={teamAName}
        teamBName={teamBName}
        teamAScore={teamAScore}
        teamBScore={teamBScore}
        adjustA={adjustA}
        adjustB={adjustB}
        multiplier={multiplier}
        setMultiplier={setMultiplier}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={view === "game" ? `q-${questionIndex}` : "results"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1 flex flex-col"
        >
          {view === "game" ? (
            <QuestionSlide
              question={question}
              revealedMap={revealedMap}
              multiplier={multiplier}
              onReveal={revealAnswer}
              onAward={awardTeam}
            />
          ) : (
            <ResultsSlide
              teamAName={teamAName}
              teamBName={teamBName}
              teamAScore={teamAScore}
              teamBScore={teamBScore}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom nav */}
      <footer className="flex items-center justify-center gap-3 px-8 py-5">
        {view === "game" && (
          <>
            <button
              onClick={() => setQuestionIndex((i) => Math.max(0, i - 1))}
              disabled={questionIndex === 0}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <span className="text-sm text-slate-500 font-medium px-2">
              Question {questionIndex + 1} of {QUESTIONS.length}
            </span>
            {questionIndex < QUESTIONS.length - 1 ? (
              <button
                onClick={() => setQuestionIndex((i) => i + 1)}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition-colors"
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => setView("results")}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-500 text-white font-semibold text-sm shadow-sm hover:bg-emerald-600 transition-colors"
              >
                View Results <Trophy size={16} />
              </button>
            )}
          </>
        )}
        {view === "results" && (
          <button
            onClick={resetGame}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition-colors"
          >
            <RotateCcw size={16} /> Restart game
          </button>
        )}
      </footer>
    </div>
  );
}
