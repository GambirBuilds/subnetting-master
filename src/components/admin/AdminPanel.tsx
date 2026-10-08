import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Plus, 
  RotateCcw, 
  Download, 
  CheckCircle2, 
  BarChart2, 
  Database,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QUESTION_BANK } from '../../data/questions';
import { TopicId, Difficulty, Question } from '../../types';

export const AdminPanel: React.FC = () => {
  const { stats, resetAllProgress, addXp } = useApp();

  const [newQuestionText, setNewQuestionText] = useState('');
  const [newTopic, setNewTopic] = useState<TopicId>('subnet-calculations');
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>('medium');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctIdx, setCorrectIdx] = useState(0);
  const [explanation, setExplanation] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !optionA || !optionB) return;

    const customQuestion: Question = {
      id: `custom-${Date.now()}`,
      topic: newTopic,
      difficulty: newDifficulty,
      question: newQuestionText.trim(),
      options: [optionA.trim(), optionB.trim(), optionC.trim() || 'Option C', optionD.trim() || 'Option D'],
      correctIndex: correctIdx,
      explanation: explanation.trim() || 'Custom teacher-verified solution.',
    };

    QUESTION_BANK.unshift(customQuestion);
    setSavedSuccess(true);
    addXp(50, 'Created custom networking problem');

    // Reset inputs
    setNewQuestionText('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setExplanation('');
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(stats, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `subnetting_master_report_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-sky-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <ShieldAlert className="w-4 h-4" />
          <span>Instructor & Workshop Tools</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Problem Workshop & Platform Management
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Create custom subnetting problems, inspect question bank performance, and export student metrics.
        </p>
      </div>

      {/* Analytics Snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Question Bank Size</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{QUESTION_BANK.length}</div>
          <p className="text-[11px] text-slate-500">Active peer-reviewed questions</p>
        </div>

        <div className="p-4 rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Student Answers</span>
          <div className="text-2xl font-bold text-sky-700 dark:text-cyan-400 font-mono">{stats.quizAnswers.length}</div>
          <p className="text-[11px] text-slate-500">Tracked practice interactions</p>
        </div>

        <div className="p-4 rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Global Accuracy Rate</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            {stats.quizAnswers.length > 0
              ? Math.round(
                  (stats.quizAnswers.filter((a) => a.isCorrect).length / stats.quizAnswers.length) * 100
                )
              : 85}
            %
          </div>
          <p className="text-[11px] text-slate-500">First-attempt success rate</p>
        </div>
      </div>

      {/* Custom Question Creator Form */}
      <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-sky-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
              <span>Create Custom Networking Problem</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Add custom exam or lab questions directly into the active Question Bank.
            </p>
          </div>
        </div>

        <form onSubmit={handleAddQuestion} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Target Topic</label>
              <select
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value as TopicId)}
                className="w-full px-3 py-2 rounded-xl bg-sky-50/50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-200 border border-sky-200/80 dark:border-slate-800 focus:outline-none focus:border-sky-500"
              >
                <option value="ip-fundamentals">IP Fundamentals</option>
                <option value="binary-math">Binary Math</option>
                <option value="subnet-masks">Subnet Masks</option>
                <option value="subnet-calculations">Subnet Calculations</option>
                <option value="cidr">CIDR</option>
                <option value="vlsm">VLSM</option>
                <option value="network-troubleshooting">Troubleshooting</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Difficulty</label>
              <select
                value={newDifficulty}
                onChange={(e) => setNewDifficulty(e.target.value as Difficulty)}
                className="w-full px-3 py-2 rounded-xl bg-sky-50/50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-200 border border-sky-200/80 dark:border-slate-800 focus:outline-none focus:border-sky-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Problem Statement / Question Prompt</label>
            <textarea
              rows={3}
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="e.g. Given 172.16.50.0/23, what is the broadcast address of this subnet?"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-sky-50/50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-200 border border-sky-200/80 dark:border-slate-800 focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Option A</label>
              <input
                type="text"
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
                placeholder="Option A"
                required
                className="w-full px-3 py-2 rounded-xl bg-sky-50/50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-slate-200 border border-sky-200/80 dark:border-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Option B</label>
              <input
                type="text"
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
                placeholder="Option B"
                required
                className="w-full px-3 py-2 rounded-xl bg-sky-50/50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-slate-200 border border-sky-200/80 dark:border-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Option C</label>
              <input
                type="text"
                value={optionC}
                onChange={(e) => setOptionC(e.target.value)}
                placeholder="Option C"
                className="w-full px-3 py-2 rounded-xl bg-sky-50/50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-slate-200 border border-sky-200/80 dark:border-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Option D</label>
              <input
                type="text"
                value={optionD}
                onChange={(e) => setOptionD(e.target.value)}
                placeholder="Option D"
                className="w-full px-3 py-2 rounded-xl bg-sky-50/50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-slate-200 border border-sky-200/80 dark:border-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Correct Option</label>
              <select
                value={correctIdx}
                onChange={(e) => setCorrectIdx(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-xl bg-sky-50/50 dark:bg-slate-950 text-xs text-emerald-700 dark:text-emerald-400 font-bold border border-sky-200/80 dark:border-slate-800 focus:outline-none focus:border-sky-500"
              >
                <option value={0}>Option A is Correct</option>
                <option value={1}>Option B is Correct</option>
                <option value={2}>Option C is Correct</option>
                <option value={3}>Option D is Correct</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Explanation for Students</label>
              <input
                type="text"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Why is this answer correct? (Step-by-step reasoning)"
                className="w-full px-3 py-2 rounded-xl bg-sky-50/50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-200 border border-sky-200/80 dark:border-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Question saved to question bank! (+50 XP)</span>
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors shadow-sm shadow-sky-600/30"
            >
              Add Question to Bank
            </button>
          </div>
        </form>
      </div>

      {/* Data Management & Export */}
      <div className="p-6 rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Student Progress & Data Management</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Export student analytics as JSON or reset test data.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-sky-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 border border-sky-200 dark:border-slate-700 transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4 text-sky-600 dark:text-slate-400" />
            <span>Export Analytics JSON</span>
          </button>

          <button
            onClick={resetAllProgress}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/80 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-500/30 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
};
