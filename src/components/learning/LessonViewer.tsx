import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Clock, 
  Award, 
  Lightbulb, 
  Code, 
  ChevronRight,
  Sliders,
  Binary,
  Layers,
  Sparkles
} from 'lucide-react';
import { LESSON_MODULES, LessonModule } from '../../data/lessons';
import { useApp } from '../../context/AppContext';
import { BinaryConverter } from '../binary/BinaryConverter';
import { CidrSliderVisualizer } from '../calculator/CidrSliderVisualizer';
import { SubnetCalculator } from '../calculator/SubnetCalculator';
import { VlsmLab } from '../vlsm/VlsmLab';

export const LessonViewer: React.FC = () => {
  const { stats, markLessonComplete, selectedLessonId, setSelectedLessonId, addXp } = useApp();

  const [activeModuleId, setActiveModuleId] = useState<string>(
    selectedLessonId || LESSON_MODULES[0].id
  );

  const [miniQuizAnswers, setMiniQuizAnswers] = useState<Record<string, number>>({});
  const [miniQuizFeedback, setMiniQuizFeedback] = useState<Record<string, boolean>>({});

  const currentModule =
    LESSON_MODULES.find((m) => m.id === activeModuleId) || LESSON_MODULES[0];

  const isModuleCompleted = stats.completedLessons.includes(currentModule.id);

  const handleSelectModule = (id: string) => {
    setActiveModuleId(id);
    setSelectedLessonId(id);
  };

  const handleQuizAnswer = (sectionIdx: number, optionIdx: number, correctIdx: number) => {
    const key = `${currentModule.id}-${sectionIdx}`;
    setMiniQuizAnswers((prev) => ({ ...prev, [key]: optionIdx }));
    const isCorrect = optionIdx === correctIdx;
    setMiniQuizFeedback((prev) => ({ ...prev, [key]: isCorrect }));

    if (isCorrect) {
      addXp(20, 'Correct mini-quiz answer');
    }
  };

  const handleCompleteCurrentLesson = () => {
    markLessonComplete(currentModule.id);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-sky-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Curated Learning Path</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Subnetting Learning Modules (01 — 08)
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Step-by-step interactive lessons taking you from absolute binary beginner to advanced VLSM architect.
        </p>
      </div>

      {/* Module Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 border-b border-sky-100 dark:border-slate-800 pb-4">
        {LESSON_MODULES.map((m) => {
          const isActive = m.id === currentModule.id;
          const isDone = stats.completedLessons.includes(m.id);

          return (
            <button
              key={m.id}
              onClick={() => handleSelectModule(m.id)}
              className={`p-2.5 rounded-xl border text-left transition-all relative ${
                isActive
                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs dark:bg-cyan-950/60 dark:border-cyan-500 dark:text-white'
                  : isDone
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800 dark:bg-slate-900/60 dark:border-emerald-500/30 dark:text-slate-300'
                  : 'bg-white border-sky-150 text-slate-600 hover:border-sky-300 dark:bg-slate-900/40 dark:border-slate-800 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span>Mod {m.number}</span>
                {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />}
              </div>
              <div className="text-xs font-bold truncate">{m.title}</div>
            </button>
          );
        })}
      </div>

      {/* Active Module Header */}
      <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono text-sky-700 dark:text-cyan-400 font-bold uppercase tracking-wider">
              Module {currentModule.number} · {currentModule.badge}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {currentModule.title}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentModule.estimatedTime}</span>
            </div>
            {isModuleCompleted ? (
              <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Completed (+75 XP)</span>
              </span>
            ) : (
              <button
                onClick={handleCompleteCurrentLesson}
                className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors shadow-2xs"
              >
                Mark as Completed
              </button>
            )}
          </div>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {currentModule.summary}
        </p>
      </div>

      {/* Module Sections */}
      <div className="space-y-6">
        {currentModule.sections.map((section, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center gap-2 border-b border-sky-100 dark:border-slate-800 pb-3">
              <span className="w-5 h-5 rounded-md bg-sky-100 dark:bg-cyan-950 text-sky-700 dark:text-cyan-400 text-xs font-bold flex items-center justify-center font-mono">
                {idx + 1}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {section.title}
              </h3>
            </div>

            {/* Markdown Prose */}
            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-sans space-y-2">
              {section.content}
            </div>

            {/* Embedded Interactive Tools */}
            {section.type === 'interactive' && section.interactiveType === 'binary-converter' && (
              <div className="pt-4 border-t border-sky-100 dark:border-slate-800">
                <BinaryConverter />
              </div>
            )}

            {section.type === 'interactive' && section.interactiveType === 'cidr-slider' && (
              <div className="pt-4 border-t border-sky-100 dark:border-slate-800">
                <CidrSliderVisualizer />
              </div>
            )}

            {section.type === 'interactive' && section.interactiveType === 'subnet-calculator' && (
              <div className="pt-4 border-t border-sky-100 dark:border-slate-800">
                <SubnetCalculator />
              </div>
            )}

            {section.type === 'interactive' && section.interactiveType === 'vlsm-planner' && (
              <div className="pt-4 border-t border-sky-100 dark:border-slate-800">
                <VlsmLab />
              </div>
            )}

            {/* Embedded Mini Quiz */}
            {section.type === 'quiz' && section.quizQuestion && (
              <div className="p-4 rounded-xl bg-sky-50/60 dark:bg-slate-950 border border-sky-150 dark:border-slate-800 space-y-3 mt-4">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-700 dark:text-cyan-400">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>Module Mini-Quiz:</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {section.quizQuestion.question}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {section.quizQuestion.options.map((opt, optIdx) => {
                    const key = `${currentModule.id}-${idx}`;
                    const answered = miniQuizAnswers[key] !== undefined;
                    const isSelected = miniQuizAnswers[key] === optIdx;
                    const isCorrect = optIdx === section.quizQuestion!.correctIndex;

                    let btnClass = 'bg-white dark:bg-slate-900 border-sky-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:border-sky-400';
                    if (answered) {
                      if (isCorrect) {
                        btnClass = 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-400 text-emerald-800 dark:text-emerald-300 font-bold';
                      } else if (isSelected) {
                        btnClass = 'bg-rose-50 dark:bg-rose-950/80 border-rose-400 text-rose-800 dark:text-rose-300 font-bold';
                      } else {
                        btnClass = 'bg-slate-50 dark:bg-slate-950 text-slate-400 opacity-50';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() =>
                          handleQuizAnswer(idx, optIdx, section.quizQuestion!.correctIndex)
                        }
                        disabled={answered}
                        className={`p-3 rounded-xl border text-left text-xs font-mono transition-all flex items-center justify-between ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {answered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                        {answered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
                      </button>
                    );
                  })}
                </div>

                {miniQuizAnswers[`${currentModule.id}-${idx}`] !== undefined && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 leading-relaxed">
                    <strong className="text-sky-700 dark:text-cyan-400">Explanation: </strong>
                    {section.quizQuestion.explanation}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Completion Footer */}
      <div className="p-6 rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Finished this Module?</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Marking complete awards +75 XP and updates your mastery dashboard.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!isModuleCompleted && (
            <button
              onClick={handleCompleteCurrentLesson}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-2xs"
            >
              Complete Module & Earn +75 XP
            </button>
          )}
          {parseInt(currentModule.number, 10) < 8 && (
            <button
              onClick={() => {
                const nextNum = parseInt(currentModule.number, 10) + 1;
                const nextMod = LESSON_MODULES.find(
                  (m) => parseInt(m.number, 10) === nextNum
                );
                if (nextMod) handleSelectModule(nextMod.id);
              }}
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <span>Next Module</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
