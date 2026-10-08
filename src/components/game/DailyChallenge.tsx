import React, { useState } from 'react';
import { Calendar, CheckCircle2, XCircle, Flame, Trophy, Award, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateSubnet } from '../../utils/subnet';

export const DailyChallenge: React.FC = () => {
  const { stats, recordDailyChallengeCompleted } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const isCompletedToday = stats.dailyChallengeCompletedDate === todayStr;

  // Seeded daily problem (deterministic based on day of month)
  const dayOfMonth = new Date().getDate();
  const sampleChallenges = [
    { ip: '10.20.30.145', cidr: 28 },
    { ip: '192.168.100.85', cidr: 26 },
    { ip: '172.16.50.210', cidr: 27 },
    { ip: '192.168.1.190', cidr: 25 },
    { ip: '10.0.55.13', cidr: 29 },
    { ip: '172.20.10.60', cidr: 30 },
  ];
  const todayProblem = sampleChallenges[dayOfMonth % sampleChallenges.length];
  const solution = calculateSubnet(todayProblem.ip, todayProblem.cidr);

  // Form states
  const [inputNetwork, setInputNetwork] = useState('');
  const [inputBroadcast, setInputBroadcast] = useState('');
  const [inputFirstHost, setInputFirstHost] = useState('');
  const [inputLastHost, setInputLastHost] = useState('');
  const [inputUsableCount, setInputUsableCount] = useState('');

  const [feedback, setFeedback] = useState<{
    submitted: boolean;
    allCorrect: boolean;
    errors: string[];
  }>({
    submitted: false,
    allCorrect: false,
    errors: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: string[] = [];

    if (inputNetwork.trim() !== solution.networkAddress) {
      errors.push(`Network Address is incorrect (Expected ${solution.networkAddress}).`);
    }
    if (inputBroadcast.trim() !== solution.broadcastAddress) {
      errors.push(`Broadcast Address is incorrect (Expected ${solution.broadcastAddress}).`);
    }
    if (inputFirstHost.trim() !== solution.firstUsableHost) {
      errors.push(`First Usable Host is incorrect (Expected ${solution.firstUsableHost}).`);
    }
    if (inputLastHost.trim() !== solution.lastUsableHost) {
      errors.push(`Last Usable Host is incorrect (Expected ${solution.lastUsableHost}).`);
    }
    if (inputUsableCount.trim() !== solution.usableHosts.toString()) {
      errors.push(`Usable Host Count is incorrect (Expected ${solution.usableHosts}).`);
    }

    const correct = errors.length === 0;

    setFeedback({
      submitted: true,
      allCorrect: correct,
      errors,
    });

    if (correct) {
      recordDailyChallengeCompleted();
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-sky-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Calendar className="w-4 h-4" />
          <span>Daily Protocol</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Today's Subnetting Challenge
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Solve the daily network problem to extend your streak and earn +100 bonus XP.
        </p>
      </div>

      {/* Streak Banner */}
      <div className="p-5 rounded-2xl border border-amber-200/90 dark:border-amber-500/30 bg-gradient-to-r from-amber-50/80 via-white to-sky-50/50 dark:from-amber-950/30 dark:to-slate-900 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/40 flex items-center justify-center text-amber-500 dark:text-amber-400 shadow-2xs">
            <Flame className="w-7 h-7 fill-amber-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{stats.streak} Day Learning Streak</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Keep solving daily challenges to unlock the 7-day and 30-day streak achievements!
            </p>
          </div>
        </div>
        <div className="hidden sm:block text-right">
          <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold">+100 XP Reward</span>
        </div>
      </div>

      {/* Today's Target IP Box */}
      <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sky-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-[11px] font-mono text-sky-700 dark:text-cyan-400 uppercase tracking-wider font-bold">
              Today's Network Target
            </span>
            <div className="text-3xl font-mono font-extrabold text-slate-900 dark:text-white mt-1">
              {todayProblem.ip}/{todayProblem.cidr}
            </div>
          </div>
          {isCompletedToday ? (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Completed for Today!</span>
            </div>
          ) : (
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Mask: {solution.subnetMask}
            </span>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                1. Network Address:
              </label>
              <input
                type="text"
                value={inputNetwork}
                onChange={(e) => setInputNetwork(e.target.value)}
                placeholder="e.g. 10.20.30.128"
                disabled={isCompletedToday}
                className="w-full px-3 py-2 rounded-xl bg-sky-50/50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-cyan-300 border border-sky-200/80 dark:border-slate-800 focus:outline-none focus:border-sky-500 disabled:opacity-60"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                2. Broadcast Address:
              </label>
              <input
                type="text"
                value={inputBroadcast}
                onChange={(e) => setInputBroadcast(e.target.value)}
                placeholder="e.g. 10.20.30.143"
                disabled={isCompletedToday}
                className="w-full px-3 py-2 rounded-xl bg-sky-50/50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-cyan-300 border border-sky-200/80 dark:border-slate-800 focus:outline-none focus:border-sky-500 disabled:opacity-60"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                3. First Usable Host:
              </label>
              <input
                type="text"
                value={inputFirstHost}
                onChange={(e) => setInputFirstHost(e.target.value)}
                placeholder="e.g. 10.20.30.129"
                disabled={isCompletedToday}
                className="w-full px-3 py-2 rounded-xl bg-sky-50/50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-cyan-300 border border-sky-200/80 dark:border-slate-800 focus:outline-none focus:border-sky-500 disabled:opacity-60"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                4. Last Usable Host:
              </label>
              <input
                type="text"
                value={inputLastHost}
                onChange={(e) => setInputLastHost(e.target.value)}
                placeholder="e.g. 10.20.30.142"
                disabled={isCompletedToday}
                className="w-full px-3 py-2 rounded-xl bg-sky-50/50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-cyan-300 border border-sky-200/80 dark:border-slate-800 focus:outline-none focus:border-sky-500 disabled:opacity-60"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                5. Total Usable Hosts Count:
              </label>
              <input
                type="number"
                value={inputUsableCount}
                onChange={(e) => setInputUsableCount(e.target.value)}
                placeholder="e.g. 14"
                disabled={isCompletedToday}
                className="w-full px-3 py-2 rounded-xl bg-sky-50/50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-cyan-300 border border-sky-200/80 dark:border-slate-800 focus:outline-none focus:border-sky-500 disabled:opacity-60"
              />
            </div>
          </div>

          {!isCompletedToday && (
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors shadow-sm shadow-sky-600/30 mt-2 flex items-center justify-center gap-2"
            >
              <span>Submit Daily Answers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Feedback Messages */}
        {feedback.submitted && (
          <div
            className={`p-4 rounded-xl border text-xs space-y-2 ${
              feedback.allCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-500/40 dark:text-emerald-300'
                : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/30 dark:border-rose-500/40 dark:text-rose-300'
            }`}
          >
            <div className="font-bold flex items-center gap-2">
              {feedback.allCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Flawless! All calculations are 100% accurate. (+100 XP)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Review Required:</span>
                </>
              )}
            </div>

            {feedback.errors.length > 0 && (
              <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                {feedback.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
