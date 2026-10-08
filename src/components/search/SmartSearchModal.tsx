import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, Calculator, FileText, ArrowRight, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LESSON_MODULES } from '../../data/lessons';
import { calculateSubnet, validateIPv4, cidrToMask } from '../../utils/subnet';

export const SmartSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, setActiveTab, setSelectedLessonId } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isSearchOpen) {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const cleanQuery = query.trim().toLowerCase();

  // 1. Check if user typed a CIDR prefix like /27 or 27
  let cidrMatch: number | null = null;
  const slashMatch = cleanQuery.match(/^\/?([0-9]|[1-2][0-9]|3[0-2])$/);
  if (slashMatch) {
    cidrMatch = parseInt(slashMatch[1], 10);
  }

  // 2. Check if user typed an IP or IP/CIDR like 192.168.1.100 or 192.168.1.100/26
  let ipCidrMatch: { ip: string; cidr: number } | null = null;
  if (cleanQuery.includes('.')) {
    const parts = cleanQuery.split('/');
    const ipPart = parts[0];
    const prefixPart = parts[1] ? parseInt(parts[1], 10) : 24;
    if (validateIPv4(ipPart).valid && prefixPart >= 0 && prefixPart <= 32) {
      ipCidrMatch = { ip: ipPart, cidr: prefixPart };
    }
  }

  // 3. Search Lesson Modules
  const matchedLessons = LESSON_MODULES.filter(
    (m) =>
      m.title.toLowerCase().includes(cleanQuery) ||
      m.summary.toLowerCase().includes(cleanQuery) ||
      m.sections.some(
        (s) =>
          s.title.toLowerCase().includes(cleanQuery) ||
          s.content.toLowerCase().includes(cleanQuery)
      )
  );

  // Quick concept tags
  const conceptShortcuts = [
    { label: 'Network Simulator (Builder)', tab: 'simulator' as const },
    { label: 'Packet Journey (OSI Stack)', tab: 'packet-journey' as const },
    { label: 'Terminal CLI (Cisco/Win/Linux)', tab: 'cli' as const },
    { label: 'Networking Tools Suite', tab: 'tools' as const },
    { label: 'IPv6 & Prefix Calculator', tab: 'tools' as const },
    { label: 'Flashcards & Spaced Repetition', tab: 'flashcards' as const },
    { label: 'Career Roadmap & Skill Tree', tab: 'career' as const },
    { label: 'Protocol Explorer & RFCs', tab: 'protocols' as const },
    { label: 'AI Networking Mentor', tab: 'ai-mentor' as const },
    { label: 'Verified Certificates', tab: 'certificates' as const },
    { label: 'Subnet Overlap Detector', tab: 'tools' as const },
    { label: 'Route Summarizer (Supernet)', tab: 'tools' as const },
  ].filter((c) => !cleanQuery || c.label.toLowerCase().includes(cleanQuery));

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-sky-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="relative border-b border-sky-100 dark:border-slate-800 p-4 flex items-center gap-3">
          <Search className="w-5 h-5 text-sky-600 dark:text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search /27, 192.168.1.100/26, VLSM, Magic Number, Binary..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-sky-50 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* CIDR Direct Calculation Result */}
          {cidrMatch !== null && (
            <div className="p-4 rounded-xl bg-sky-50/80 dark:bg-cyan-950/30 border border-sky-200 dark:border-cyan-500/40 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-sky-800 dark:text-cyan-400 font-bold">CIDR Quick Calculation: /{cidrMatch}</span>
                <button
                  onClick={() => {
                    setActiveTab('calculator');
                    setIsSearchOpen(false);
                  }}
                  className="text-sky-600 dark:text-cyan-300 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Open in Calculator</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-sky-100 dark:border-transparent">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Mask:</div>
                  <div className="font-bold text-slate-900 dark:text-white">{cidrToMask(cidrMatch)}</div>
                </div>
                <div className="bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-sky-100 dark:border-transparent">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Total IPs:</div>
                  <div className="font-bold text-amber-600 dark:text-amber-400">
                    {Math.pow(2, 32 - cidrMatch).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-sky-100 dark:border-transparent">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Usable Hosts:</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">
                    {cidrMatch === 32 ? 1 : cidrMatch === 31 ? 2 : Math.max(0, Math.pow(2, 32 - cidrMatch) - 2).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* IP / CIDR Direct Solver Result */}
          {ipCidrMatch && (
            <div className="p-4 rounded-xl bg-sky-50/80 dark:bg-cyan-950/30 border border-sky-200 dark:border-cyan-500/40 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-sky-800 dark:text-cyan-400 font-bold">Direct IP Solver: {ipCidrMatch.ip}/{ipCidrMatch.cidr}</span>
                <button
                  onClick={() => {
                    setActiveTab('calculator');
                    setIsSearchOpen(false);
                  }}
                  className="text-sky-600 dark:text-cyan-300 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Open in Calculator</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              {(() => {
                const sub = calculateSubnet(ipCidrMatch.ip, ipCidrMatch.cidr);
                return (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    <div className="bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-sky-100 dark:border-transparent">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Network:</div>
                      <div className="font-bold text-slate-900 dark:text-white">{sub.networkAddress}</div>
                    </div>
                    <div className="bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-sky-100 dark:border-transparent">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Broadcast:</div>
                      <div className="font-bold text-amber-600 dark:text-amber-400">{sub.broadcastAddress}</div>
                    </div>
                    <div className="bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-sky-100 dark:border-transparent">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Block Size:</div>
                      <div className="font-bold text-sky-700 dark:text-cyan-400">{sub.blockSize}</div>
                    </div>
                    <div className="bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-sky-100 dark:border-transparent">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Usable Hosts:</div>
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">{sub.usableHosts.toLocaleString()}</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Matched Lessons */}
          {matchedLessons.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                Lesson Modules
              </div>
              {matchedLessons.slice(0, 4).map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => {
                    setSelectedLessonId(lesson.id);
                    setActiveTab('learn');
                    setIsSearchOpen(false);
                  }}
                  className="w-full p-3 rounded-xl bg-sky-50/40 dark:bg-slate-950/60 border border-sky-100 dark:border-slate-800 hover:border-sky-300 dark:hover:border-cyan-500/40 text-left transition-colors flex items-center justify-between group shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-cyan-950/80 border border-sky-300 dark:border-cyan-500/30 flex items-center justify-center text-sky-700 dark:text-cyan-400 shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-cyan-400 transition-colors">
                        Module {lesson.number}: {lesson.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {lesson.summary}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 dark:group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          )}

          {/* Fast Concept Shortcuts */}
          {conceptShortcuts.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                Quick Tool Shortcuts
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {conceptShortcuts.map((c) => (
                  <button
                    key={c.label}
                    onClick={() => {
                      setActiveTab(c.tab);
                      setIsSearchOpen(false);
                    }}
                    className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-sky-100 dark:border-slate-800 hover:border-sky-300 dark:hover:border-slate-700 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-2 shadow-2xs"
                  >
                    <Zap className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
