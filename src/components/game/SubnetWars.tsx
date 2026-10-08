import React, { useState, useEffect } from 'react';
import { 
  Swords, 
  Shield, 
  Flame, 
  Zap, 
  Clock, 
  Heart, 
  Trophy, 
  AlertCircle, 
  RotateCcw, 
  ChevronRight,
  CheckCircle2,
  XCircle,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateRandomProblem } from '../../utils/subnet';
import battleArenaImg from '../../assets/images/battle_cyber_matrix_1791198468581.jpg';

export const SubnetWars: React.FC = () => {
  const { addXp, recordBattleResult, unlockBadge } = useApp();

  const [gameMode, setGameMode] = useState<'battle' | 'levels'>('battle');

  // Battle Mode States
  const [playerHp, setPlayerHp] = useState(100);
  const [aiHp, setAiHp] = useState(100);
  const [combo, setCombo] = useState(0);
  const [turnTimer, setTurnTimer] = useState(25);
  const [battleState, setBattleState] = useState<'active' | 'victory' | 'defeat'>('active');
  const [battleLog, setBattleLog] = useState<string[]>(['Battle initiated against ByteMaster AI!']);

  // Current Battle Question
  const [currentProblem, setCurrentProblem] = useState(() => generateRandomProblem());
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  // Turn timer interval
  useEffect(() => {
    if (gameMode !== 'battle' || battleState !== 'active') return;

    const interval = setInterval(() => {
      setTurnTimer((prev) => {
        if (prev <= 1) {
          handleTimeOut();
          return 25;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameMode, battleState, currentProblem]);

  const handleTimeOut = () => {
    setCombo(0);
    setPlayerHp((hp) => {
      const nextHp = Math.max(0, hp - 20);
      if (nextHp === 0) {
        setBattleState('defeat');
        recordBattleResult(false);
      }
      return nextHp;
    });
    setBattleLog((prev) => [
      `⏰ Time expired! ByteMaster AI exploited the latency and dealt 20 damage!`,
      ...prev.slice(0, 5),
    ]);
    loadNextBattleQuestion();
  };

  const handleAnswerSubmit = (option: string) => {
    if (isAnswerChecked || battleState !== 'active') return;

    setSelectedAnswer(option);
    setIsAnswerChecked(true);

    const isCorrect = option === currentProblem.correctAnswer;

    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      const multiplier = newCombo >= 5 ? 3 : newCombo >= 3 ? 2 : 1;
      const damage = 25 * multiplier;

      setAiHp((hp) => {
        const nextHp = Math.max(0, hp - damage);
        if (nextHp === 0) {
          setBattleState('victory');
          addXp(200, 'Defeated ByteMaster AI in Subnet Wars!');
          recordBattleResult(true);
          unlockBadge('battle-victor');
        }
        return nextHp;
      });

      addXp(40 * multiplier);
      setBattleLog((prev) => [
        `💥 Correct! Packet injected successfully! Dealt ${damage} damage (${multiplier}x Combo)!`,
        ...prev.slice(0, 5),
      ]);
    } else {
      setCombo(0);
      setPlayerHp((hp) => {
        const nextHp = Math.max(0, hp - 20);
        if (nextHp === 0) {
          setBattleState('defeat');
          recordBattleResult(false);
        }
        return nextHp;
      });
      setBattleLog((prev) => [
        `❌ Incorrect routing! ByteMaster AI deflected and counter-attacked for 20 damage.`,
        ...prev.slice(0, 5),
      ]);
    }

    // Delay before next question
    setTimeout(() => {
      if (battleState === 'active') {
        loadNextBattleQuestion();
      }
    }, 1800);
  };

  const loadNextBattleQuestion = () => {
    setCurrentProblem(generateRandomProblem());
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setTurnTimer(25);
  };

  const resetBattle = () => {
    setPlayerHp(100);
    setAiHp(100);
    setCombo(0);
    setTurnTimer(25);
    setBattleState('active');
    setBattleLog(['Re-engaging ByteMaster AI!']);
    loadNextBattleQuestion();
  };

  // Campaign Levels Data
  const campaignLevels = [
    {
      level: 1,
      title: 'Level 1: IP Rookie',
      tasks: 'Identify IP classes, convert 8-bit octets to binary, and determine network vs host bits.',
      reward: '+100 XP',
      unlocked: true,
    },
    {
      level: 2,
      title: 'Level 2: Subnet Scout',
      tasks: 'Determine subnet masks, calculate block sizes using 256 - magic number, find subnet boundaries.',
      reward: '+150 XP',
      unlocked: true,
    },
    {
      level: 3,
      title: 'Level 3: Network Defender',
      tasks: 'Calculate broadcast addresses and usable host ranges under strict time constraints.',
      reward: '+200 XP',
      unlocked: true,
    },
    {
      level: 4,
      title: 'Level 4: VLSM Engineer',
      tasks: 'Size multi-department networks without wasting address space using powers of 2.',
      reward: '+250 XP',
      unlocked: true,
    },
    {
      level: 5,
      title: 'Level 5: Subnet Master',
      tasks: 'Complex CCNA-style multi-tiered questions with combo streaks and speed multipliers.',
      reward: '+350 XP',
      unlocked: true,
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-sky-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Swords className="w-4 h-4" />
          <span>Gamified Arena</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Subnet Wars — The Competitive Networking Arena
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Battle against ByteMaster AI, maintain streak combos, and master rapid subnet calculations under fire.
        </p>
      </div>

      {/* Mode Selector */}
      <div className="flex items-center gap-2 border-b border-sky-100 dark:border-slate-800 pb-3">
        <button
          onClick={() => setGameMode('battle')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            gameMode === 'battle'
              ? 'bg-sky-600 text-white shadow-2xs dark:bg-cyan-950 dark:border dark:border-cyan-500/40 dark:text-cyan-300'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Swords className="w-4 h-4" />
          <span>AI Battle Arena</span>
        </button>
        <button
          onClick={() => setGameMode('levels')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            gameMode === 'levels'
              ? 'bg-sky-600 text-white shadow-2xs dark:bg-cyan-950 dark:border dark:border-cyan-500/40 dark:text-cyan-300'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Campaign Missions (Levels 1-5)</span>
        </button>
      </div>

      {/* MODE 1: BATTLE ARENA */}
      {gameMode === 'battle' && (
        <div className="space-y-6">
          {/* Battle Arena Card with Generated Artwork Backdrop */}
          <div className="relative rounded-2xl border border-sky-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-lg">
            {/* Ambient Background Graphic */}
            <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none">
              <img
                src={battleArenaImg}
                alt="Cyber Matrix Backdrop"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 dark:to-transparent" />
            </div>

            <div className="relative p-6 sm:p-8 space-y-6">
              {/* Combatants HUD */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4 border-b border-sky-100 dark:border-slate-800/80">
                {/* Player Health Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
                      Junior Network Engineer (You)
                    </span>
                    <span className="font-mono text-sky-700 dark:text-cyan-400 font-bold">{playerHp} / 100 HP</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-sky-100 dark:bg-slate-900 border border-sky-200 dark:border-slate-800 overflow-hidden p-0.5">
                    <div
                      style={{ width: `${playerHp}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-300"
                    />
                  </div>
                  {combo > 1 && (
                    <div className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                      <Flame className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{combo}x STREAK COMBO! ({combo >= 5 ? '3x' : '2x'} Damage Multiplier)</span>
                    </div>
                  )}
                </div>

                {/* AI Boss Health Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-rose-500" />
                      ByteMaster AI (Rogue Core)
                    </span>
                    <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">{aiHp} / 100 HP</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-rose-50 dark:bg-slate-900 border border-rose-200 dark:border-slate-800 overflow-hidden p-0.5">
                    <div
                      style={{ width: `${aiHp}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-300"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
                    <span>Turn Timer: <strong className="text-slate-900 dark:text-white">{turnTimer}s</strong></span>
                  </div>
                </div>
              </div>

              {/* Game Active Arena */}
              {battleState === 'active' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-sky-50/80 dark:bg-slate-900/80 border border-sky-150 dark:border-slate-800 shadow-2xs">
                    <span className="text-[11px] uppercase tracking-wider text-sky-700 dark:text-cyan-400 font-bold">
                      Incoming Cyber Query
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {currentProblem.prompt}
                    </h2>
                  </div>

                  {/* Multiple Choice Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentProblem.options.map((option, idx) => {
                      const isSelected = selectedAnswer === option;
                      const isCorrect = option === currentProblem.correctAnswer;
                      let btnStyle = 'bg-white dark:bg-slate-900/90 border-sky-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-sky-400 dark:hover:border-slate-700 shadow-2xs';

                      if (isAnswerChecked) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-400 text-emerald-800 dark:text-emerald-300 font-bold';
                        } else if (isSelected) {
                          btnStyle = 'bg-rose-50 dark:bg-rose-950/80 border-rose-400 text-rose-800 dark:text-rose-300 font-bold';
                        } else {
                          btnStyle = 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-900 text-slate-400 dark:text-slate-600 opacity-50';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswerSubmit(option)}
                          disabled={isAnswerChecked}
                          className={`p-4 rounded-xl border text-left font-mono text-sm transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{option}</span>
                          {isAnswerChecked && isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          )}
                          {isAnswerChecked && isSelected && !isCorrect && (
                            <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Immediate Explanation on Answer */}
                  {isAnswerChecked && (
                    <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-slate-900 border border-sky-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-bold text-sky-700 dark:text-cyan-400">Explanation: </span>
                      {currentProblem.explanation}
                    </div>
                  )}
                </div>
              )}

              {/* Victory Banner */}
              {battleState === 'victory' && (
                <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/40 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-500 flex items-center justify-center mx-auto text-emerald-700 dark:text-emerald-300 shadow-sm">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    VICTORY! ByteMaster AI Neutralized
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                    Outstanding subnetting precision! You dismantled the rogue firewall and claimed 200 XP and the ByteMaster Slayer achievement.
                  </p>
                  <button
                    onClick={resetBattle}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md"
                  >
                    Battle Again
                  </button>
                </div>
              )}

              {/* Defeat Banner */}
              {battleState === 'defeat' && (
                <div className="p-8 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-500/40 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-900/60 border border-rose-300 dark:border-rose-500 flex items-center justify-center mx-auto text-rose-700 dark:text-rose-300 shadow-sm">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    DEFEAT: Network Packets Dropped
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                    ByteMaster AI overwhelmed the network buffer. Review subnet masks and block size formulas, then retaliate!
                  </p>
                  <button
                    onClick={resetBattle}
                    className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-md"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Battle Terminal Log */}
              <div className="p-3.5 rounded-xl bg-sky-50/50 dark:bg-slate-950 border border-sky-150 dark:border-slate-900 font-mono text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-sans font-semibold">
                  Arena Combat Log:
                </div>
                {battleLog.map((log, i) => (
                  <div key={i} className="truncate">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: CAMPAIGN MISSIONS (LEVELS 1-5) */}
      {gameMode === 'levels' && (
        <div className="space-y-4">
          {campaignLevels.map((lvl) => (
            <div
              key={lvl.level}
              className="p-5 rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-sky-300 dark:hover:border-slate-700 transition-colors shadow-sm"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-sky-700 dark:text-cyan-400 font-mono">
                    {lvl.title}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 font-semibold">
                    {lvl.reward}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {lvl.tasks}
                </p>
              </div>
              <button
                onClick={() => setGameMode('battle')}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors shrink-0 flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>Launch Mission</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
