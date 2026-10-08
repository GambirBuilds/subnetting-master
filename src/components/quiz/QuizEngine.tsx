import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, RotateCcw, Filter, Sparkles, BookOpen } from 'lucide-react';
import { QUESTION_BANK } from '../../data/questions';
import { Difficulty, TopicId } from '../../types';
import { useApp } from '../../context/AppContext';

export const QuizEngine: React.FC = () => {
  const { recordQuizAnswer } = useApp();

  const [selectedTopic, setSelectedTopic] = useState<TopicId | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  // Filtered questions
  const filteredQuestions = QUESTION_BANK.filter((q) => {
    if (selectedTopic !== 'all' && q.topic !== selectedTopic) return false;
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const activeQuestion = filteredQuestions[currentIndex] || filteredQuestions[0];

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
    setIsAnswerSubmitted(true);
    setTotalAnswered((prev) => prev + 1);

    const isCorrect = index === activeQuestion.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    recordQuizAnswer(activeQuestion.id, activeQuestion.topic, isCorrect);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleResetFilters = () => {
    setSelectedTopic('all');
    setSelectedDifficulty('all');
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
  };

  const topicOptions: { id: TopicId | 'all'; label: string }[] = [
    { id: 'all', label: 'All Topics' },
    { id: 'ip-fundamentals', label: 'IP Fundamentals' },
    { id: 'binary-math', label: 'Binary Math' },
    { id: 'subnet-masks', label: 'Subnet Masks' },
    { id: 'subnet-calculations', label: 'Subnet Calculations' },
    { id: 'cidr', label: 'CIDR Notation' },
    { id: 'vlsm', label: 'VLSM Design' },
    { id: 'network-troubleshooting', label: 'Troubleshooting' },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-sky-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <HelpCircle className="w-4 h-4" />
          <span>Interactive Practice Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Subnetting Question Bank & Quiz
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Reinforce your understanding with instant feedback, explanations, and topic-by-topic analytics.
        </p>
      </div>

      {/* Filter Controls Bar */}
      <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Topic Select */}
          <select
            value={selectedTopic}
            onChange={(e) => {
              setSelectedTopic(e.target.value as TopicId | 'all');
              setCurrentIndex(0);
              setSelectedOption(null);
              setIsAnswerSubmitted(false);
            }}
            className="px-3 py-1.5 rounded-xl bg-sky-50/60 dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-sky-200/80 dark:border-slate-800 focus:outline-none focus:border-sky-500"
          >
            {topicOptions.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>

          {/* Difficulty Select */}
          <select
            value={selectedDifficulty}
            onChange={(e) => {
              setSelectedDifficulty(e.target.value as Difficulty | 'all');
              setCurrentIndex(0);
              setSelectedOption(null);
              setIsAnswerSubmitted(false);
            }}
            className="px-3 py-1.5 rounded-xl bg-sky-50/60 dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-sky-200/80 dark:border-slate-800 focus:outline-none focus:border-sky-500"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        {/* Score Counter */}
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Questions: <strong className="text-slate-900 dark:text-white font-bold">{currentIndex + 1}</strong> / {filteredQuestions.length}
          </span>
          <span className="text-sky-700 dark:text-cyan-400 font-bold font-mono">
            Accuracy: {totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Question Card */}
      {activeQuestion ? (
        <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-sky-100 dark:border-slate-800 pb-3">
            <span className="text-xs uppercase tracking-wider font-bold text-sky-700 dark:text-cyan-400 font-mono">
              {activeQuestion.topic.replace('-', ' ')}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full capitalize bg-sky-50 dark:bg-slate-800 text-sky-800 dark:text-slate-300 border border-sky-200/80 dark:border-transparent font-medium">
              {activeQuestion.difficulty}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
            {activeQuestion.question}
          </h2>

          {activeQuestion.scenario && (
            <p className="text-xs text-slate-600 dark:text-slate-300 italic p-3 rounded-xl bg-sky-50/60 dark:bg-slate-950 border border-sky-150 dark:border-slate-800">
              {activeQuestion.scenario}
            </p>
          )}

          {/* Options */}
          <div className="space-y-3">
            {activeQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === activeQuestion.correctIndex;
              let style = 'bg-white dark:bg-slate-950/80 border-sky-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-sky-400 shadow-2xs';

              if (isAnswerSubmitted) {
                if (isCorrect) {
                  style = 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-400 text-emerald-800 dark:text-emerald-300 font-bold';
                } else if (isSelected) {
                  style = 'bg-rose-50 dark:bg-rose-950/70 border-rose-400 text-rose-800 dark:text-rose-300 font-bold';
                } else {
                  style = 'bg-slate-50 dark:bg-slate-950/30 border-slate-200 dark:border-slate-900 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full p-4 rounded-xl border text-left text-sm font-mono transition-all flex items-center justify-between ${style}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-sky-100 dark:bg-slate-800/80 text-xs flex items-center justify-center font-bold text-sky-800 dark:text-slate-400">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>
                  {isAnswerSubmitted && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {isAnswerSubmitted && (
            <div className="p-4 rounded-xl bg-sky-50/70 dark:bg-slate-950 border border-sky-150 dark:border-slate-800 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-700 dark:text-cyan-400">
                <BookOpen className="w-4 h-4" />
                <span>Concept Explanation:</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-6">
                {activeQuestion.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {isAnswerSubmitted && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors shadow-sm shadow-sky-600/30"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400">No questions match the current filter selection.</p>
          <button
            onClick={handleResetFilters}
            className="mt-3 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
