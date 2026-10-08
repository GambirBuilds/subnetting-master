import React from 'react';
import { 
  Trophy, 
  CheckCircle2, 
  Lock, 
  Award, 
  Zap, 
  Layers, 
  Router, 
  ShieldCheck, 
  Globe, 
  Terminal, 
  ChevronRight,
  Flame
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CareerStage {
  title: string;
  minLevel: number;
  description: string;
  requiredSkills: string[];
  responsibilities: string[];
}

const CAREER_STAGES: CareerStage[] = [
  {
    title: 'Beginner & IT Enthusiast',
    minLevel: 1,
    description: 'Foundational understanding of bits, bytes, MAC addresses, and basic local area networks.',
    requiredSkills: ['Binary Math', 'IPv4 Basics', 'OSI 7 Layers'],
    responsibilities: ['Configure simple client IP', 'Verify network cable connectivity', 'Run basic ping tests'],
  },
  {
    title: 'Junior Network Technician',
    minLevel: 3,
    description: 'Hands-on desktop and rack cabling, switch port allocation, and workstation troubleshooting.',
    requiredSkills: ['Subnet Calculations', 'VLAN Assignment', 'DHCP Client Configuration'],
    responsibilities: ['Patch panel termination', 'Assign access VLANs', 'Diagnose gateway unreachable errors'],
  },
  {
    title: 'Network Administrator',
    minLevel: 6,
    description: 'Operational maintenance of enterprise campus networks, router gateways, and wireless access points.',
    requiredSkills: ['VLSM Design', 'Router-on-a-Stick', 'Static Routing & Default Routes'],
    responsibilities: ['Maintain core switches', 'Configure DHCP scopes', 'Monitor switch port security'],
  },
  {
    title: 'Network Engineer (CCNA Level)',
    minLevel: 10,
    description: 'End-to-end design, routing protocol convergence, ACL hardening, and multi-subnet optimization.',
    requiredSkills: ['OSPF Single-Area', 'Route Summarization', 'NAT / PAT Translation', 'STP Convergence'],
    responsibilities: ['Enterprise WAN routing', 'Troubleshoot broadcast storms', 'Deploy Access Control Lists'],
  },
  {
    title: 'Senior Network Architect',
    minLevel: 15,
    description: 'Large-scale multi-datacenter infrastructure, dual-stack IPv6 rollout, BGP peering, and SD-WAN.',
    requiredSkills: ['IPv6 Global Unicast', 'BGP Exterior Peering', 'Multi-Area OSPF', 'Zero Trust Architecture'],
    responsibilities: ['High-availability network redundancy', 'Global IP allocation plan', 'Disaster recovery failovers'],
  },
];

interface SkillNode {
  id: string;
  title: string;
  category: 'IPv4' | 'IPv6' | 'Switching' | 'Routing' | 'Services' | 'Security';
  requiredLevel: number;
  description: string;
}

const SKILL_TREE_NODES: SkillNode[] = [
  { id: 's1', title: 'Binary & Hex Math', category: 'IPv4', requiredLevel: 1, description: '8-bit conversion, powers of 2, bitwise ANDing.' },
  { id: 's2', title: 'IPv4 Classful & CIDR', category: 'IPv4', requiredLevel: 1, description: 'Prefix lengths /8 to /32, subnet masks, wildcard masks.' },
  { id: 's3', title: 'VLSM & Block Sizing', category: 'IPv4', requiredLevel: 2, description: 'Efficient variable-length host allocation without address waste.' },
  { id: 's4', title: 'Supernetting & Summary', category: 'IPv4', requiredLevel: 4, description: 'Hierarchical route summarization and route table compression.' },

  { id: 's5', title: 'IPv6 Address Structure', category: 'IPv6', requiredLevel: 3, description: '128-bit hextet syntax, expansion, RFC 5952 compression.' },
  { id: 's6', title: 'IPv6 Subnetting & /64', category: 'IPv6', requiredLevel: 5, description: 'Global Unicast, Link-Local fe80, SLAAC autoconfiguration.' },

  { id: 's7', title: 'VLANs & 802.1Q Trunks', category: 'Switching', requiredLevel: 2, description: 'Broadcast domain isolation and IEEE 802.1Q trunk tagging.' },
  { id: 's8', title: 'Spanning Tree (STP)', category: 'Switching', requiredLevel: 4, description: 'Root bridge election, port roles, loop-free Layer 2 topologies.' },

  { id: 's9', title: 'Inter-VLAN Routing', category: 'Routing', requiredLevel: 3, description: 'Router-on-a-stick subinterfaces and Layer 3 Switch SVIs.' },
  { id: 's10', title: 'OSPF Dynamic Routing', category: 'Routing', requiredLevel: 6, description: 'Link-state advertisements, Dijkstra SPF, neighbor adjacencies.' },

  { id: 's11', title: 'DHCP & DNS Services', category: 'Services', requiredLevel: 2, description: 'DHCP DORA 4-way exchange, DNS A/AAAA record lookups.' },
  { id: 's12', title: 'NAT / PAT Overload', category: 'Services', requiredLevel: 5, description: 'Inside local to inside global translation for internet access.' },

  { id: 's13', title: 'Standard & Extended ACLs', category: 'Security', requiredLevel: 4, description: 'Traffic filtering by source/destination IP, port, and protocol.' },
  { id: 's14', title: 'DHCP Snooping & DAI', category: 'Security', requiredLevel: 7, description: 'Mitigating rogue DHCP servers and ARP poisoning attacks.' },
];

export const CareerPath: React.FC = () => {
  const { stats, levelInfo, rankInfo } = useApp();
  const userLevel = levelInfo.level;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-sky-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Award className="w-4 h-4" />
          <span>Professional Network Career Roadmap</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Career Progression & Interactive Skill Tree
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Track your progress from beginner technician to Senior Network Architect. Skills unlock dynamically based on your XP, completed labs, and exam drills.
        </p>
      </div>

      {/* Current Career Stage Summary Card */}
      <div className="p-6 rounded-2xl border border-sky-200 dark:border-slate-800 bg-gradient-to-r from-sky-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sky-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono text-sky-700 dark:text-cyan-400 uppercase font-bold">
              Current Rank & Title
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {rankInfo.title}
            </h2>
            <p className="text-xs text-slate-500 mt-1">Tier Level {rankInfo.minLevel}–{rankInfo.maxLevel}</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-sky-200 dark:border-slate-800 text-center">
              <span className="text-slate-400 block text-[10px]">CURRENT LEVEL</span>
              <strong className="text-base text-sky-800 dark:text-cyan-400">Lv.{userLevel}</strong>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-sky-200 dark:border-slate-800 text-center">
              <span className="text-slate-400 block text-[10px]">TOTAL XP</span>
              <strong className="text-base text-emerald-600">{stats.xp} XP</strong>
            </div>
          </div>
        </div>

        {/* Progress to next level bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Progress to Level {userLevel + 1}</span>
            <span>{levelInfo.progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-sky-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-sky-600 dark:bg-cyan-400 rounded-full transition-all duration-300"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Career Stages Timeline */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <span>Network Career Milestone Stages</span>
        </h2>

        <div className="space-y-3">
          {CAREER_STAGES.map((stage, idx) => {
            const isUnlocked = userLevel >= stage.minLevel;
            return (
              <div
                key={stage.title}
                className={`p-5 rounded-2xl border transition-all ${
                  isUnlocked
                    ? 'border-sky-300 bg-white dark:bg-slate-900/60 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400 font-bold">Stage {idx + 1}</span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{stage.title}</h3>
                      {isUnlocked ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Unlocked
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          <span>Requires Lv.{stage.minLevel}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{stage.description}</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-sky-100 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-400 text-[11px] font-medium">Core Skills:</span>
                  {stage.requiredSkills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 rounded-md bg-sky-50 dark:bg-slate-800 text-sky-800 dark:text-slate-300 font-mono text-[11px] border border-sky-200/60 dark:border-slate-700"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Skill Tree Matrix */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-sky-600 dark:text-cyan-400" />
          <span>Interactive Skill Tree Matrix</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SKILL_TREE_NODES.map((node) => {
            const isUnlocked = userLevel >= node.requiredLevel;
            return (
              <div
                key={node.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isUnlocked
                    ? 'border-sky-200 bg-white dark:bg-slate-900/60 shadow-2xs hover:border-sky-400'
                    : 'border-slate-200 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/40 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-sky-100 dark:border-slate-800">
                  <span className="text-[10px] font-mono uppercase bg-sky-100 dark:bg-cyan-950 text-sky-800 dark:text-cyan-300 px-2 py-0.5 rounded font-bold">
                    {node.category}
                  </span>
                  {isUnlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                      <Lock className="w-3 h-3" />
                      <span>Lv.{node.requiredLevel}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">{node.title}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {node.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
