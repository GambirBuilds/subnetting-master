export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type TopicId = 
  | 'ip-fundamentals'
  | 'binary-math'
  | 'subnet-masks'
  | 'subnet-calculations'
  | 'cidr'
  | 'vlsm'
  | 'network-troubleshooting';

export interface TopicInfo {
  id: TopicId;
  title: string;
  shortDesc: string;
  iconName: string;
}

export interface SubnetResult {
  ip: string;
  cidr: number;
  subnetMask: string;
  wildcardMask: string;
  networkAddress: string;
  broadcastAddress: string;
  firstUsableHost: string;
  lastUsableHost: string;
  totalAddresses: number;
  usableHosts: number;
  blockSize: number;
  interestingOctet: number; // 1, 2, 3, 4
  networkBits: number;
  hostBits: number;
  ipClass: 'A' | 'B' | 'C' | 'D' | 'E';
  defaultClassMask: string;
  ipType: 'Private (RFC 1918)' | 'Public' | 'Loopback' | 'APIPA' | 'Multicast' | 'Reserved';
  binaryIp: string[];
  binaryMask: string[];
  binaryNetwork: string[];
  steps: {
    title: string;
    description: string;
    formula?: string;
  }[];
}

export interface Question {
  id: string;
  topic: TopicId;
  difficulty: Difficulty;
  question: string;
  scenario?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  whyWrong?: Record<number, string>;
  hint?: string;
}

export interface VlsmDepartment {
  id: string;
  name: string;
  neededHosts: number;
}

export interface VlsmAllocatedSubnet {
  id: string;
  name: string;
  neededHosts: number;
  allocatedHosts: number;
  cidr: number;
  subnetMask: string;
  networkAddress: string;
  broadcastAddress: string;
  firstUsableHost: string;
  lastUsableHost: string;
  wastedHosts: number;
}

export interface NetworkDevice {
  id: string;
  name: string;
  type: 'router' | 'switch' | 'server' | 'pc';
  ip: string;
  subnetMask: string;
  defaultGateway: string;
  connectedTo: string[];
  role: string;
  expectedSubnet: string;
  isGateway?: boolean;
}

export interface NetworkScenario {
  id: string;
  title: string;
  description: string;
  targetObjective: string;
  devices: NetworkDevice[];
  correctConfigs: Record<string, { ip: string; subnetMask: string; defaultGateway: string }>;
  hint: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'learning' | 'game' | 'quiz' | 'streak';
  icon: string;
  xpReward: number;
  unlockedAt?: string;
}

export interface UserStats {
  username: string;
  level: number;
  xp: number;
  streak: number;
  lastActiveDate: string;
  completedLessons: string[];
  quizAnswers: {
    questionId: string;
    topic: TopicId;
    isCorrect: boolean;
    timestamp: string;
  }[];
  unlockedBadges: string[];
  dailyChallengeCompletedDate?: string;
  battleWins: number;
  battleLosses: number;
  examHistory: {
    id: string;
    date: string;
    totalQuestions: number;
    score: number;
    passed: boolean;
    timeSpentSeconds: number;
  }[];
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  level: number;
  xp: number;
  streak: number;
  solvedCount: number;
  isCurrentUser?: boolean;
}

export type SimDeviceType = 'pc' | 'laptop' | 'server' | 'switch' | 'router' | 'ap' | 'cloud' | 'firewall';

export interface SimDevice {
  id: string;
  name: string;
  type: SimDeviceType;
  x: number;
  y: number;
  ip: string;
  subnetMask: string;
  defaultGateway: string;
  mac: string;
  vlan?: number;
  status: 'up' | 'down';
}

export interface SimLink {
  id: string;
  fromId: string;
  toId: string;
  cableType: 'ethernet' | 'fiber' | 'serial';
  status: 'active' | 'blocked' | 'error';
}

export interface Flashcard {
  id: string;
  category: 'OSI Model' | 'IPv4 & Subnetting' | 'IPv6' | 'Protocols & Ports' | 'Routing & Switching' | 'Security';
  question: string;
  answer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface VerifiedCertificate {
  certificateId: string;
  recipientName: string;
  courseTitle: string;
  issueDate: string;
  verificationHash: string;
  skillsMastered: string[];
}
