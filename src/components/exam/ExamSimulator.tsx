import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Clock, 
  Flag, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw,
  Trophy,
  BarChart,
  BookOpen
} from 'lucide-react';
import { QUESTION_BANK } from '../../data/questions';
import { Question } from '../../types';
import { useApp } from '../../context/AppContext';

export const ExamSimulator: React.FC = () => {
  const { recordExamResult } = useApp();

  const [examState, setExamState] = useState<'setup' | 'in-progress' | 'review'>('setup');
  const [examLength, setExamLength] = useState<10 | 25 | 50>(25);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(35 * 60);

  // Active exam questions & user selections
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});

  // Countdown timer
  useEffect(() => {
    if (examState !== 'in-progress') return;

    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examState]);

  const startExam = (length: 10 | 25 | 50) => {
    setExamLength(length);
    // Shuffle and pick N questions
    const shuffled = [...QUESTION_BANK].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, length);
    // If bank is smaller than 50, repeat/cycle
    while (selected.length < length) {
      selected.push(QUESTION_BANK[Math.floor(Math.random() * QUESTION_BANK.length)]);
    }

    setExamQuestions(selected);
    setCurrentIdx(0);
    setUserAnswers({});
    setFlaggedQuestions({});
    setTimeRemainingSeconds(length === 10 ? 15 * 60 : length === 25 ? 35 * 60 : 60 * 60);
    setExamState('in-progress');
  };

  const handleSelectOption = (optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentIdx]: optionIndex,
    }));
  };

  const toggleFlag = (idx: number) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleSubmitExam = () => {
    setExamState('review');
    // Calculate final score
    let correct = 0;
    examQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });

    const passed = (correct / examLength) >= 0.75;
    const timeSpent = (examLength === 10 ? 15 * 60 : examLength === 25 ? 35 * 60 : 60 * 60) - timeRemainingSeconds;
    recordExamResult(correct, examLength, passed, timeSpent);
  };

  // Score calculations
  const correctCount = examQuestions.reduce((acc, q, idx) => {
    return userAnswers[idx] === q.correctIndex ? acc + 1 : acc;
  }, 0);
  const scorePercent = Math.round((correctCount / (examLength || 1)) * 100);
  const isPassed = scorePercent >= 75;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const activeQ = examQuestions[currentIdx];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-sky-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <GraduationCap className="w-4 h-4" />
          <span>Realistic Exam Simulator</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Networking & Subnetting Exam Simulator
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Standardized CCNA and university-style testing with timer countdown, question flagging, and comprehensive solution analysis.
        </p>
      </div>

      {/* VIEW 1: EXAM SETUP */}
      {examState === 'setup' && (
        <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Select Exam Configuration</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => startExam(10)}
              className="p-6 rounded-2xl border border-sky-150 dark:border-slate-800 bg-sky-50/40 dark:bg-slate-950 text-left hover:border-sky-400 hover:bg-sky-50 dark:hover:bg-slate-900/60 transition-all group shadow-2xs"
            >
              <span className="text-xs font-mono text-sky-700 dark:text-cyan-400 font-bold uppercase tracking-wider">
                Quick Drill
              </span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">10 Questions</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                15-minute rapid practice quiz covering core subnetting calculations.
              </p>
              <div className="mt-4 flex items-center text-xs text-sky-700 dark:text-cyan-400 font-bold group-hover:translate-x-1 transition-transform">
                <span>Start Drill</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </button>

            <button
              onClick={() => startExam(25)}
              className="p-6 rounded-2xl border border-sky-300 dark:border-cyan-500/30 bg-sky-50 dark:bg-cyan-950/20 text-left hover:border-sky-500 transition-all group shadow-xs"
            >
              <span className="text-xs font-mono text-sky-800 dark:text-cyan-400 font-bold uppercase tracking-wider">
                CCNA Practice Mode
              </span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">25 Questions</div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
                35-minute exam standard with strict timer and multi-class subnet design.
              </p>
              <div className="mt-4 flex items-center text-xs text-sky-700 dark:text-cyan-400 font-bold group-hover:translate-x-1 transition-transform">
                <span>Start CCNA Mode</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </button>

            <button
              onClick={() => startExam(50)}
              className="p-6 rounded-2xl border border-sky-150 dark:border-slate-800 bg-sky-50/40 dark:bg-slate-950 text-left hover:border-indigo-400 hover:bg-sky-50 dark:hover:bg-slate-900/60 transition-all group shadow-2xs"
            >
              <span className="text-xs font-mono text-indigo-700 dark:text-indigo-400 font-bold uppercase tracking-wider">
                University Final Exam
              </span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">50 Questions</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                60-minute rigorous assessment of binary math, VLSM, CIDR, and troubleshooting.
              </p>
              <div className="mt-4 flex items-center text-xs text-indigo-700 dark:text-indigo-400 font-bold group-hover:translate-x-1 transition-transform">
                <span>Start Final Exam</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-sky-50/60 dark:bg-slate-950 border border-sky-150 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <div className="font-bold text-slate-800 dark:text-slate-300">Exam Instructions:</div>
            <p>• Passing grade is 75% or higher.</p>
            <p>• You may jump between questions and flag questions to review before finishing.</p>
            <p>• No hints or immediate answer confirmations are provided during the test.</p>
          </div>
        </div>
      )}

      {/* VIEW 2: EXAM IN PROGRESS */}
      {examState === 'in-progress' && activeQ && (
        <div className="space-y-6">
          {/* Top Status & Timer Bar */}
          <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
                Question <strong className="text-slate-900 dark:text-white">{currentIdx + 1}</strong> of {examLength}
              </span>
              <span className="hidden sm:inline-block text-xs text-slate-300 dark:text-slate-500">|</span>
              <button
                onClick={() => toggleFlag(currentIdx)}
                className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg transition-colors ${
                  flaggedQuestions[currentIdx]
                    ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 bg-slate-100 dark:bg-slate-800'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{flaggedQuestions[currentIdx] ? 'Flagged for Review' : 'Flag Question'}</span>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-sky-700 dark:text-cyan-400 bg-sky-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-sky-200 dark:border-slate-800">
                <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-slate-400" />
                <span>{formatTimer(timeRemainingSeconds)}</span>
              </div>

              <button
                onClick={handleSubmitExam}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-2xs"
              >
                Submit Exam
              </button>
            </div>
          </div>

          {/* Question Grid Navigator */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-sky-100 dark:border-slate-800 flex flex-wrap gap-1.5 shadow-sm">
            {examQuestions.map((_, i) => {
              const isAnswered = userAnswers[i] !== undefined;
              const isFlagged = flaggedQuestions[i];
              const isCurrent = currentIdx === i;

              let btnClass = 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-950 dark:text-slate-500 dark:border-slate-800';
              if (isAnswered) btnClass = 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-cyan-950 dark:text-cyan-300';
              if (isFlagged) btnClass = 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300';
              if (isCurrent) btnClass += ' ring-2 ring-sky-500 dark:ring-cyan-400';

              return (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-bold border transition-all ${btnClass}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          {/* Question Prompt & Options */}
          <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-8 space-y-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
              {activeQ.question}
            </h3>

            <div className="space-y-3">
              {activeQ.options.map((option, idx) => {
                const isSelected = userAnswers[currentIdx] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-xl border text-left text-sm font-mono transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-sky-50 border-sky-400 text-sky-900 dark:bg-cyan-950/70 dark:border-cyan-500 dark:text-cyan-200 font-semibold'
                        : 'bg-white dark:bg-slate-950 border-sky-150 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:border-sky-300'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-md bg-sky-100 dark:bg-slate-800 text-xs flex items-center justify-center font-bold text-sky-800 dark:text-slate-400">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-sky-100 dark:border-slate-800">
              <button
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                disabled={currentIdx === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-40"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                onClick={() => setCurrentIdx((i) => Math.min(examLength - 1, i + 1))}
                disabled={currentIdx === examLength - 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 text-xs font-bold text-white hover:bg-sky-500 disabled:opacity-40 shadow-2xs"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: COMPREHENSIVE SCORE REPORT & SOLUTION REVIEW */}
      {examState === 'review' && (
        <div className="space-y-8">
          {/* Hero Score Card */}
          <div
            className={`p-8 rounded-2xl border text-center space-y-4 shadow-sm ${
              isPassed
                ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-500/40'
                : 'bg-rose-50 border-rose-200 dark:bg-rose-950/30 dark:border-rose-500/40'
            }`}
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-xs ${
                isPassed
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-400'
                  : 'bg-rose-100 text-rose-700 border border-rose-300 dark:bg-rose-900/60 dark:text-rose-400'
              }`}
            >
              {isPassed ? <Trophy className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest font-mono text-slate-500 dark:text-slate-400 font-bold">
                Official Examination Report
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
                {scorePercent}% — {isPassed ? 'PASSED' : 'NOT PASSED'}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                You correctly answered {correctCount} of {examLength} questions (Passing threshold: 75%).
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setExamState('setup')}
                className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors shadow-sm shadow-sky-600/30"
              >
                Take Another Exam
              </button>
            </div>
          </div>

          {/* Full Question Review */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Comprehensive Question Review</h3>
            {examQuestions.map((q, idx) => {
              const userAns = userAnswers[idx];
              const isCorrect = userAns === q.correctIndex;
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border space-y-3 shadow-2xs ${
                    isCorrect
                      ? 'bg-white border-sky-100 dark:bg-slate-900/40 dark:border-slate-800'
                      : 'bg-rose-50/50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-500 dark:text-slate-400">Question {idx + 1}</span>
                    <span
                      className={`flex items-center gap-1 font-bold ${
                        isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Correct</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          <span>Incorrect</span>
                        </>
                      )}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{q.question}</h4>

                  <div className="text-xs font-mono space-y-1">
                    <div className="text-slate-600 dark:text-slate-400">
                      Your answer:{' '}
                      <span className={isCorrect ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-rose-700 dark:text-rose-400 font-bold'}>
                        {userAns !== undefined ? q.options[userAns] : 'Not Answered'}
                      </span>
                    </div>
                    {!isCorrect && (
                      <div className="text-slate-600 dark:text-slate-400">
                        Correct answer:{' '}
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">{q.options[q.correctIndex]}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 pt-1 leading-relaxed bg-sky-50/60 dark:bg-slate-950 p-3 rounded-xl border border-sky-150 dark:border-slate-800/80">
                    <strong className="text-sky-700 dark:text-cyan-400">Explanation: </strong>
                    {q.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
