import React from 'react';
import { 
  Trophy, 
  Flame, 
  BookOpen, 
  Award, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRight, 
  Calculator, 
  Swords, 
  GraduationCap, 
  Zap, 
  ShieldCheck, 
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Network,
  Activity
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ALL_ACHIEVEMENTS } from '../../data/achievements';
import { TopicId } from '../../types';
import heroNetworkImg from '../../assets/images/hero_subnet_network_1791198456240.jpg';

export const StudentDashboard: React.FC = () => {
  const { stats, levelInfo, rankInfo, setActiveTab, setSelectedLessonId, currentPalette } = useApp();

  // Compute accuracy by topic
  const topics: { id: TopicId; name: string }[] = [
    { id: 'ip-fundamentals', name: 'IP Fundamentals' },
    { id: 'binary-math', name: 'Binary Math' },
    { id: 'subnet-masks', name: 'Subnet Masks' },
    { id: 'subnet-calculations', name: 'Subnet Calculations' },
    { id: 'cidr', name: 'CIDR & Summarization' },
    { id: 'vlsm', name: 'VLSM Design' },
    { id: 'network-troubleshooting', name: 'Network Troubleshooting' },
  ];

  const topicStats = topics.map((t) => {
    const answers = stats.quizAnswers.filter((a) => a.topic === t.id);
    const total = answers.length;
    const correct = answers.filter((a) => a.isCorrect).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 75; // baseline estimate
    let status: 'Strong' | 'Needs Practice' | 'Weak' = 'Strong';
    if (accuracy < 50 || total === 0) status = 'Weak';
    else if (accuracy < 80) status = 'Needs Practice';

    return {
      id: t.id,
      name: t.name,
      total,
      correct,
      accuracy,
      status,
    };
  });

  // Find weakest topic for adaptive recommendation
  const weakestTopic = [...topicStats].sort((a, b) => a.accuracy - b.accuracy)[0];

  // Leaderboard mock data with current user
  const leaderboard = [
    { rank: 1, name: 'PacketNinja', level: 12, xp: 4850, streak: 14, isCurrentUser: false },
    { rank: 2, name: 'CiscoSamurai', level: 9, xp: 3200, streak: 8, isCurrentUser: false },
    { rank: 3, name: stats.username, level: levelInfo.level, xp: stats.xp, streak: stats.streak, isCurrentUser: true },
    { rank: 4, name: 'ByteMaster99', level: 4, xp: 1420, streak: 4, isCurrentUser: false },
    { rank: 5, name: 'RootAdmin', level: 3, xp: 980, streak: 2, isCurrentUser: false },
  ].sort((a, b) => b.xp - a.xp).map((item, idx) => ({ ...item, rank: idx + 1 }));

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl border border-indigo-200/90 dark:border-indigo-500/30 bg-gradient-to-r from-indigo-600/10 via-sky-500/10 to-cyan-500/15 dark:from-indigo-950/40 dark:via-slate-900/60 dark:to-cyan-950/30 overflow-hidden shadow-md shadow-indigo-500/5">
        {/* Background Artwork */}
        <div className="absolute inset-0 opacity-15 dark:opacity-20 pointer-events-none mix-blend-multiply dark:mix-blend-normal">
          <img
            src={heroNetworkImg}
            alt="Network Topology"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 dark:to-transparent" />
        </div>

        <div className="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
              <span>Welcome Back, {rankInfo.title}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Master Networking. One Packet at a Time.
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Your comprehensive platform for computer networking, Cisco CCNA certification, practical topology simulation, and technical interview mastery.
            </p>
          </div>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r ${currentPalette.gradientClass} hover:opacity-90 text-white font-bold text-xs transition-all shadow-md shadow-indigo-500/25`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Network Simulator</span>
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
            >
              <Calculator className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
              <span>Tools Suite</span>
            </button>
            <button
              onClick={() => setActiveTab('packet-journey')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Packet Journey</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Level & XP */}
        <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs space-y-1.5">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Rank & Level</span>
          <div className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span className="text-indigo-700 dark:text-cyan-400 font-mono font-extrabold">Lv.{levelInfo.level}</span>
            <span className="text-xs text-slate-500 dark:text-slate-300 font-normal">({rankInfo.title})</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-950 overflow-hidden">
            <div
              style={{ width: `${levelInfo.progressPercent}%` }}
              className={`h-full bg-gradient-to-r ${currentPalette.gradientClass} rounded-full`}
            />
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            {stats.xp} / {levelInfo.nextLevelXp} XP ({levelInfo.progressPercent}%)
          </div>
        </div>

        {/* Streak */}
        <div className="p-4 rounded-2xl border border-amber-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs space-y-1.5">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Daily Streak</span>
          <div className="text-lg font-bold text-amber-500 dark:text-amber-400 flex items-center gap-1.5">
            <Flame className="w-5 h-5 fill-amber-400" />
            <span>{stats.streak} Days</span>
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            {stats.dailyChallengeCompletedDate === new Date().toISOString().split('T')[0]
              ? '✓ Today completed (+100 XP)'
              : 'Challenge ready for today!'}
          </div>
        </div>

        {/* Completed Lessons */}
        <div className="p-4 rounded-2xl border border-emerald-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs space-y-1.5">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Curriculum Progress</span>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            {stats.completedLessons.length} / 8 <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">Lessons</span>
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            {Math.round((stats.completedLessons.length / 8) * 100)}% of core syllabus completed
          </div>
        </div>

        {/* Battle Record */}
        <div className="p-4 rounded-2xl border border-indigo-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs space-y-1.5">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Arena Combat</span>
          <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">
            <span className="text-emerald-600 dark:text-emerald-400">{stats.battleWins}W</span>
            <span className="text-slate-400 dark:text-slate-500 mx-1">/</span>
            <span className="text-rose-500 dark:text-rose-400">{stats.battleLosses}L</span>
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            Subnet Wars battle win rate
          </div>
        </div>
      </div>

      {/* Adaptive Learning Recommendation Card */}
      <div className="p-5 rounded-2xl border border-indigo-200/90 dark:border-cyan-500/30 bg-gradient-to-r from-indigo-50/70 via-white to-cyan-50/60 dark:from-indigo-950/40 dark:via-slate-900 dark:to-cyan-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-700 dark:text-cyan-400 font-bold">
                Adaptive Recommendation
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 font-medium">
                Needs Practice
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              Reinforce: {weakestTopic.name}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
              Your accuracy in {weakestTopic.name} is currently {weakestTopic.accuracy}%. Reviewing the interactive visualizer will help you solidify network calculations.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (weakestTopic.id === 'vlsm') setActiveTab('vlsm');
            else if (weakestTopic.id === 'binary-math') setActiveTab('binary');
            else setActiveTab('quiz');
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs transition-all shrink-0 flex items-center gap-1.5 shadow-sm shadow-indigo-500/20"
        >
          <span>Practice {weakestTopic.name}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Two-Column Layout: Topic Mastery & Simulated Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Topic Mastery Bars */}
        <div className="lg:col-span-7 rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-sky-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Topic Mastery Breakdown</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">Based on quiz & lab performance</span>
          </div>

          <div className="space-y-3.5">
            {topicStats.map((topic) => (
              <div key={topic.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{topic.name}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        topic.status === 'Strong'
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                          : topic.status === 'Needs Practice'
                          ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                          : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
                      }`}
                    >
                      {topic.status}
                    </span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 font-bold w-9 text-right">
                      {topic.accuracy}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-sky-100 dark:bg-slate-950 overflow-hidden">
                  <div
                    style={{ width: `${topic.accuracy}%` }}
                    className={`h-full rounded-full transition-all ${
                      topic.status === 'Strong'
                        ? 'bg-emerald-500 dark:bg-emerald-400'
                        : topic.status === 'Needs Practice'
                        ? 'bg-amber-500 dark:bg-amber-400'
                        : 'bg-rose-500 dark:bg-rose-400'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Global Leaderboard */}
        <div className="lg:col-span-5 rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-sky-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>Leaderboard Standings</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">Rank by XP</span>
          </div>

          <div className="space-y-2">
            {leaderboard.map((user) => (
              <div
                key={user.rank}
                className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  user.isCurrentUser
                    ? 'bg-sky-50/80 dark:bg-cyan-950/40 border-sky-300 dark:border-cyan-500/40'
                    : 'bg-slate-50/60 dark:bg-slate-950/60 border-slate-100 dark:border-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                      user.rank === 1
                        ? 'bg-amber-400 text-slate-900 shadow-xs'
                        : user.rank === 2
                        ? 'bg-slate-300 text-slate-900'
                        : user.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {user.rank}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{user.name}</span>
                      {user.isCurrentUser && (
                        <span className="text-[10px] text-sky-600 dark:text-cyan-400 font-semibold">(You)</span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      Level {user.level} · {user.streak}d streak
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono text-xs text-sky-600 dark:text-cyan-400 font-bold">
                  {user.xp} XP
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges & Achievements Grid */}
      <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-sky-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
            <span>Badges & Certifications</span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {stats.unlockedBadges.length} of {ALL_ACHIEVEMENTS.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ALL_ACHIEVEMENTS.map((badge) => {
            const isUnlocked = stats.unlockedBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                  isUnlocked
                    ? 'bg-sky-50/70 dark:bg-cyan-950/30 border-sky-200 dark:border-cyan-500/40 text-slate-800 dark:text-slate-200 shadow-2xs'
                    : 'bg-slate-50/40 dark:bg-slate-950/40 border-slate-150 dark:border-slate-800 text-slate-400 dark:text-slate-500 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">
                      {badge.title}
                    </span>
                    {isUnlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-cyan-400 shrink-0" />
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">Locked</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                    {badge.description}
                  </p>
                </div>
                <div className="mt-3 text-[10px] font-mono text-sky-600 dark:text-cyan-400 font-semibold">
                  +{badge.xpReward} XP
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
