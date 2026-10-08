import { Achievement } from '../types';

export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-step',
    title: 'First Ping',
    description: 'Complete your first interactive subnetting lesson or calculate a subnet.',
    category: 'learning',
    icon: 'Radio',
    xpReward: 50,
  },
  {
    id: 'binary-whisperer',
    title: 'Binary Prodigy',
    description: 'Master 8-bit conversions with 100% precision in the Binary converter.',
    category: 'learning',
    icon: 'Binary',
    xpReward: 100,
  },
  {
    id: 'mask-master',
    title: 'Subnet Scout',
    description: 'Correctly identify 5 subnet masks and their block sizes in quizzes.',
    category: 'quiz',
    icon: 'Shield',
    xpReward: 150,
  },
  {
    id: 'vlsm-architect',
    title: 'VLSM Architect',
    description: 'Successfully allocate a multi-department VLSM network without waste.',
    category: 'learning',
    icon: 'Network',
    xpReward: 200,
  },
  {
    id: 'network-rescuer',
    title: 'Network Defender',
    description: 'Diagnose and repair all broken network topologies in the simulation lab.',
    category: 'game',
    icon: 'Cpu',
    xpReward: 250,
  },
  {
    id: 'battle-victor',
    title: 'ByteMaster Slayer',
    description: 'Defeat ByteMaster AI in Subnet Wars Battle Mode.',
    category: 'game',
    icon: 'Zap',
    xpReward: 300,
  },
  {
    id: 'streak-champion',
    title: 'Daily Protocol',
    description: 'Complete the Daily Subnetting Challenge 3 days in a row.',
    category: 'streak',
    icon: 'Flame',
    xpReward: 250,
  },
  {
    id: 'exam-honors',
    title: 'CCNA Ready',
    description: 'Score over 85% on the comprehensive Exam Simulator.',
    category: 'quiz',
    icon: 'Award',
    xpReward: 500,
  },
];

export function getRankByLevel(level: number): { title: string; minLevel: number; maxLevel: number } {
  if (level <= 1) return { title: 'IP Rookie', minLevel: 1, maxLevel: 1 };
  if (level <= 2) return { title: 'Subnet Scout', minLevel: 2, maxLevel: 2 };
  if (level <= 4) return { title: 'Network Defender', minLevel: 3, maxLevel: 4 };
  if (level <= 7) return { title: 'VLSM Engineer', minLevel: 5, maxLevel: 7 };
  return { title: 'Subnet Master', minLevel: 8, maxLevel: 99 };
}

export function calculateLevel(xp: number): { level: number; currentXp: number; nextLevelXp: number; progressPercent: number } {
  // 0 - 200 XP: Level 1
  // 200 - 500 XP: Level 2
  // 500 - 1000 XP: Level 3
  // 1000 - 1700 XP: Level 4
  // 1700 - 2600 XP: Level 5
  // Each level adds 100 * level more XP
  let currentLevel = 1;
  let threshold = 200;
  let prevThreshold = 0;

  while (xp >= threshold) {
    prevThreshold = threshold;
    currentLevel++;
    threshold += 200 + (currentLevel * 150);
  }

  const levelSpan = threshold - prevThreshold;
  const xpInCurrentLevel = xp - prevThreshold;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / levelSpan) * 100)));

  return {
    level: currentLevel,
    currentXp: xp,
    nextLevelXp: threshold,
    progressPercent,
  };
}
