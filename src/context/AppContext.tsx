import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Achievement, TopicId, UserStats } from '../types';
import { ALL_ACHIEVEMENTS, calculateLevel, getRankByLevel } from '../data/achievements';

const STORAGE_KEY = 'subnetting_master_user_data_v1';

export type NavTab =
  | 'dashboard'
  | 'learn'
  | 'tools'
  | 'simulator'
  | 'packet-journey'
  | 'cli'
  | 'network-lab'
  | 'flashcards'
  | 'career'
  | 'certificates'
  | 'protocols'
  | 'calculator'
  | 'binary'
  | 'vlsm'
  | 'subnet-wars'
  | 'daily'
  | 'quiz'
  | 'exam'
  | 'cheatsheet'
  | 'ai-mentor'
  | 'admin';

export type AppTheme = 'light' | 'dark';

export type ColorPalette = 'indigo-cyan' | 'blue-emerald' | 'violet-sky' | 'slate-amber' | 'magenta-cyan';

export interface PalettePreset {
  id: ColorPalette;
  name: string;
  tagline: string;
  color1: string;
  color2: string;
  accentName: string;
  gradientClass: string;
  bgLightClass: string;
  bgDarkClass: string;
  borderClass: string;
  badgeClass: string;
}

export const PALETTE_PRESETS: PalettePreset[] = [
  {
    id: 'indigo-cyan',
    name: 'Sapphire & Cyan',
    tagline: 'Electric Cobalt Indigo + Luminous Cyber Cyan glow',
    color1: '#4f46e5',
    color2: '#06b6d4',
    accentName: 'Indigo & Cyan',
    gradientClass: 'from-indigo-600 via-blue-600 to-cyan-500',
    bgLightClass: 'bg-gradient-to-br from-slate-50 via-indigo-50/40 to-cyan-50/30',
    bgDarkClass: 'dark:from-[#080d1a] dark:via-[#0c1326] dark:to-[#071422]',
    borderClass: 'border-indigo-200/80 dark:border-cyan-500/30',
    badgeClass: 'bg-indigo-50 text-indigo-700 dark:bg-cyan-950/50 dark:text-cyan-300',
  },
  {
    id: 'blue-emerald',
    name: 'Royal Blue & Emerald',
    tagline: 'Enterprise Cisco Blue + Vibrant Emerald Mint',
    color1: '#2563eb',
    color2: '#10b981',
    accentName: 'Blue & Emerald',
    gradientClass: 'from-blue-600 via-teal-600 to-emerald-500',
    bgLightClass: 'bg-gradient-to-br from-slate-50 via-blue-50/40 to-emerald-50/30',
    bgDarkClass: 'dark:from-[#061019] dark:via-[#081a1d] dark:to-[#061715]',
    borderClass: 'border-blue-200/80 dark:border-emerald-500/30',
    badgeClass: 'bg-blue-50 text-blue-700 dark:bg-emerald-950/50 dark:text-emerald-300',
  },
  {
    id: 'violet-sky',
    name: 'Cosmic Violet & Sky',
    tagline: 'Deep Royal Violet + Lucid Azure Sky Blue',
    color1: '#7c3aed',
    color2: '#0284c7',
    accentName: 'Violet & Sky',
    gradientClass: 'from-violet-600 via-indigo-600 to-sky-500',
    bgLightClass: 'bg-gradient-to-br from-slate-50 via-purple-50/40 to-sky-50/30',
    bgDarkClass: 'dark:from-[#0d091a] dark:via-[#130d24] dark:to-[#091322]',
    borderClass: 'border-violet-200/80 dark:border-sky-500/30',
    badgeClass: 'bg-violet-50 text-violet-700 dark:bg-sky-950/50 dark:text-sky-300',
  },
  {
    id: 'slate-amber',
    name: 'Midnight & Amber',
    tagline: 'Ops Command Navy + Radiant Solar Amber Gold',
    color1: '#334155',
    color2: '#f59e0b',
    accentName: 'Navy & Amber',
    gradientClass: 'from-slate-800 via-amber-700 to-amber-500',
    bgLightClass: 'bg-gradient-to-br from-slate-50 via-amber-50/40 to-slate-100/50',
    bgDarkClass: 'dark:from-[#0a0f1d] dark:via-[#19150d] dark:to-[#0c0d12]',
    borderClass: 'border-amber-200/80 dark:border-amber-500/30',
    badgeClass: 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
  },
  {
    id: 'magenta-cyan',
    name: 'Cyber Magenta & Cyan',
    tagline: 'Futuristic Neon Pink + High-Frequency Cyan',
    color1: '#ec4899',
    color2: '#06b6d4',
    accentName: 'Magenta & Cyan',
    gradientClass: 'from-pink-600 via-purple-600 to-cyan-500',
    bgLightClass: 'bg-gradient-to-br from-slate-50 via-pink-50/40 to-cyan-50/30',
    bgDarkClass: 'dark:from-[#170815] dark:via-[#1a0a24] dark:to-[#061520]',
    borderClass: 'border-pink-200/80 dark:border-cyan-500/30',
    badgeClass: 'bg-pink-50 text-pink-700 dark:bg-cyan-950/50 dark:text-cyan-300',
  },
];

interface AppContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  selectedLessonId: string | null;
  setSelectedLessonId: (id: string | null) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  theme: AppTheme;
  toggleTheme: () => void;
  palette: ColorPalette;
  setPalette: (palette: ColorPalette) => void;
  currentPalette: PalettePreset;
  stats: UserStats;
  levelInfo: ReturnType<typeof calculateLevel>;
  rankInfo: ReturnType<typeof getRankByLevel>;
  addXp: (amount: number, message?: string) => void;
  markLessonComplete: (lessonId: string) => void;
  recordQuizAnswer: (questionId: string, topic: TopicId, isCorrect: boolean) => void;
  recordBattleResult: (won: boolean) => void;
  recordExamResult: (score: number, totalQuestions: number, passed: boolean, timeSpent: number) => void;
  recordDailyChallengeCompleted: () => void;
  unlockBadge: (badgeId: string) => void;
  resetAllProgress: () => void;
  notification: { title: string; desc: string } | null;
  clearNotification: () => void;
}

const defaultStats: UserStats = {
  username: 'Network Engineer',
  level: 1,
  xp: 150,
  streak: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedLessons: ['m1-ip-fundamentals'],
  quizAnswers: [
    { questionId: 'q-ip-1', topic: 'ip-fundamentals', isCorrect: true, timestamp: new Date().toISOString() },
    { questionId: 'q-bin-1', topic: 'binary-math', isCorrect: true, timestamp: new Date().toISOString() },
  ],
  unlockedBadges: ['first-step'],
  battleWins: 2,
  battleLosses: 0,
  examHistory: [],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notification, setNotification] = useState<{ title: string; desc: string } | null>(null);
  const [theme, setTheme] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem('subnetting_master_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // default
    }
    return 'light'; // default to light blue as requested
  });

  const [palette, setPalette] = useState<ColorPalette>(() => {
    try {
      const saved = localStorage.getItem('subnetting_master_palette') as ColorPalette;
      if (PALETTE_PRESETS.some((p) => p.id === saved)) return saved;
    } catch {
      // default
    }
    return 'indigo-cyan';
  });

  const currentPalette = PALETTE_PRESETS.find((p) => p.id === palette) || PALETTE_PRESETS[0];

  useEffect(() => {
    try {
      localStorage.setItem('subnetting_master_palette', palette);
      document.documentElement.setAttribute('data-palette', palette);
    } catch {
      // ignore
    }
  }, [palette]);

  useEffect(() => {
    try {
      localStorage.setItem('subnetting_master_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultStats, ...JSON.parse(saved) };
      }
    } catch {
      // fallback to default
    }
    return defaultStats;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // storage unavailable
    }
  }, [stats]);

  // Global keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const levelInfo = calculateLevel(stats.xp);
  const rankInfo = getRankByLevel(levelInfo.level);

  const triggerLevelUpConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  const addXp = (amount: number, message?: string) => {
    setStats((prev) => {
      const prevLevel = calculateLevel(prev.xp).level;
      const newXp = prev.xp + amount;
      const newLevel = calculateLevel(newXp).level;

      if (newLevel > prevLevel) {
        triggerLevelUpConfetti();
        setNotification({
          title: `Level Up! Level ${newLevel}`,
          desc: `Congratulations! You unlocked the rank of ${getRankByLevel(newLevel).title}!`,
        });
      } else if (message) {
        setNotification({
          title: `+${amount} XP Earned`,
          desc: message,
        });
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
      };
    });
  };

  const unlockBadge = (badgeId: string) => {
    setStats((prev) => {
      if (prev.unlockedBadges.includes(badgeId)) return prev;
      const badge = ALL_ACHIEVEMENTS.find((b) => b.id === badgeId);
      if (badge) {
        triggerLevelUpConfetti();
        setNotification({
          title: `Badge Unlocked: ${badge.title}`,
          desc: `${badge.description} (+${badge.xpReward} XP)`,
        });
      }
      return {
        ...prev,
        xp: prev.xp + (badge ? badge.xpReward : 50),
        unlockedBadges: [...prev.unlockedBadges, badgeId],
      };
    });
  };

  const markLessonComplete = (lessonId: string) => {
    setStats((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      const newCompleted = [...prev.completedLessons, lessonId];
      if (newCompleted.length >= 3) {
        unlockBadge('first-step');
      }
      return {
        ...prev,
        completedLessons: newCompleted,
        xp: prev.xp + 75,
      };
    });
    setNotification({
      title: 'Lesson Completed!',
      desc: '+75 XP awarded for expanding your networking knowledge.',
    });
  };

  const recordQuizAnswer = (questionId: string, topic: TopicId, isCorrect: boolean) => {
    setStats((prev) => {
      const updatedAnswers = [
        ...prev.quizAnswers,
        { questionId, topic, isCorrect, timestamp: new Date().toISOString() },
      ];
      const correctCount = updatedAnswers.filter((a) => a.isCorrect).length;
      if (correctCount >= 5) {
        unlockBadge('mask-master');
      }
      return {
        ...prev,
        xp: prev.xp + (isCorrect ? 30 : 5),
        quizAnswers: updatedAnswers,
      };
    });
  };

  const recordBattleResult = (won: boolean) => {
    setStats((prev) => ({
      ...prev,
      battleWins: won ? prev.battleWins + 1 : prev.battleWins,
      battleLosses: won ? prev.battleLosses : prev.battleLosses + 1,
      xp: prev.xp + (won ? 150 : 25),
    }));
    if (won) {
      unlockBadge('battle-victor');
    }
  };

  const recordExamResult = (score: number, totalQuestions: number, passed: boolean, timeSpent: number) => {
    setStats((prev) => {
      const newExam = {
        id: `exam-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        totalQuestions,
        score,
        passed,
        timeSpentSeconds: timeSpent,
      };
      const percentage = (score / totalQuestions) * 100;
      if (percentage >= 85) {
        unlockBadge('exam-honors');
      }
      return {
        ...prev,
        xp: prev.xp + (passed ? 200 : 50),
        examHistory: [newExam, ...prev.examHistory],
      };
    });
  };

  const recordDailyChallengeCompleted = () => {
    const today = new Date().toISOString().split('T')[0];
    setStats((prev) => {
      if (prev.dailyChallengeCompletedDate === today) return prev;
      const newStreak = prev.streak + 1;
      if (newStreak >= 3) {
        unlockBadge('streak-champion');
      }
      return {
        ...prev,
        streak: newStreak,
        dailyChallengeCompletedDate: today,
        xp: prev.xp + 100,
      };
    });
    setNotification({
      title: 'Daily Protocol Complete!',
      desc: '+100 XP & Streak +1 secured for today!',
    });
  };

  const resetAllProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStats(defaultStats);
    setNotification({
      title: 'Progress Reset',
      desc: 'All learning stats, XP, and badges have been reset to default.',
    });
  };

  const clearNotification = () => setNotification(null);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedLessonId,
        setSelectedLessonId,
        isSearchOpen,
        setIsSearchOpen,
        theme,
        toggleTheme,
        palette,
        setPalette,
        currentPalette,
        stats,
        levelInfo,
        rankInfo,
        addXp,
        markLessonComplete,
        recordQuizAnswer,
        recordBattleResult,
        recordExamResult,
        recordDailyChallengeCompleted,
        unlockBadge,
        resetAllProgress,
        notification,
        clearNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
