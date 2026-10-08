import React from 'react';
import { 
  Network, 
  ArrowRight, 
  Calculator, 
  Binary, 
  Sliders, 
  Grid, 
  Swords, 
  GraduationCap, 
  FileText, 
  CheckCircle2, 
  Zap, 
  HelpCircle, 
  ShieldCheck, 
  Flame,
  Award,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LandingPage: React.FC = () => {
  const { setActiveTab } = useApp();

  const features = [
    {
      title: 'Visual Binary & 8-Bit Converter',
      desc: 'Never struggle with base-2 conversions again. Click bits and watch powers of 2 (128 down to 1) add up dynamically.',
      icon: <Binary className="w-5 h-5 text-sky-600 dark:text-cyan-400" />,
      tab: 'binary' as const,
    },
    {
      title: 'CIDR Prefix Slider (/0 to /32)',
      desc: 'Drag across all 32 prefix lengths to see how network bits expand while host bits shrink in a live 32-bit layout.',
      icon: <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      tab: 'calculator' as const,
    },
    {
      title: 'Step-by-Step Subnet Solver',
      desc: 'Enter any IPv4 and CIDR to get the exact mathematical breakdown: block size, multiples, network ID, and usable ranges.',
      icon: <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      tab: 'calculator' as const,
    },
    {
      title: 'VLSM Department Design Lab',
      desc: 'Allocate variable-length subnets without address collision. Visual proportional memory bars show exact space utilization.',
      icon: <Grid className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      tab: 'vlsm' as const,
    },
    {
      title: 'Subnet Wars Combat Arena',
      desc: 'Gamified turn-based battle against ByteMaster AI. Answer rapid-fire subnetting queries to trigger combo multipliers.',
      icon: <Swords className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
      tab: 'subnet-wars' as const,
    },
    {
      title: 'CCNA & University Exam Simulator',
      desc: 'Timed 10, 25, and 50-question mock exams with question flagging, 75% pass mark, and detailed score breakdown.',
      icon: <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      tab: 'exam' as const,
    },
  ];

  const testimonials = [
    {
      quote: 'Subnetting went from my biggest nightmare in CCNA prep to the section I score 100% on in under 15 seconds per question.',
      author: 'David Chen',
      role: 'Junior Network Engineer · Passed CCNA 2026',
    },
    {
      quote: 'The visual binary converter and the Magic Number breakdown made the math click instantly. My university students love this platform.',
      author: 'Dr. Sarah Jenkins',
      role: 'Associate Professor of Computer Networks',
    },
  ];

  const faqs = [
    {
      q: 'Why does Subnetting Master focus on visual explanations rather than rote memorization?',
      a: 'Memorizing tables fails during high-pressure exams when unusual prefixes like /21 or /29 appear. When you understand the Magic Number (256 - mask octet) and bit borrowing visually, you can calculate any subnet in seconds without cheat sheets.',
    },
    {
      q: 'How does the platform handle usable hosts calculations?',
      a: 'In IPv4, the formula is 2^h - 2, where h is the remaining host bits. We explain why 2 is subtracted: one for the Network Address (all host bits 0) and one for the Directed Broadcast Address (all host bits 1). For /31, we support RFC 3021 point-to-point links.',
    },
    {
      q: 'Is this suitable for both beginners and CCNA candidates?',
      a: 'Yes! Modules 01 and 02 start from scratch with IPv4 fundamentals and 8-bit conversions. Advanced modules cover VLSM, CIDR summarization, route aggregation, and complex exam scenarios.',
    },
  ];

  return (
    <div className="space-y-16 max-w-6xl mx-auto pb-16">
      {/* Hero Section */}
      <section className="relative rounded-3xl border border-sky-200/80 dark:border-slate-800 bg-gradient-to-r from-sky-50 via-white to-blue-50/50 dark:from-slate-900/60 dark:via-slate-900/60 dark:to-slate-900/60 overflow-hidden shadow-sm">
        <div className="absolute inset-0 opacity-15 dark:opacity-25 pointer-events-none mix-blend-multiply dark:mix-blend-normal">
          <img
            src="/src/assets/images/hero_subnet_network_1791198456240.jpg"
            alt="Futuristic Network Topology"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/70 dark:to-transparent" />
        </div>

        <div className="relative px-6 py-16 sm:px-12 sm:py-24 text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 border border-sky-300 dark:bg-cyan-950/80 dark:border-cyan-500/30 text-sky-800 dark:text-cyan-400 text-xs font-mono font-bold">
            <Zap className="w-3.5 h-3.5 text-sky-600" />
            <span>Interactive IPv4 Learning Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Master Subnetting. One Network at a Time.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Learn IPv4 subnetting through interactive lessons, visual binary analyzers, real-world network repair labs, and competitive gamified challenges.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('learn')}
              className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm transition-all shadow-sm shadow-sky-600/30 flex items-center gap-2"
            >
              <span>Start Learning Curriculum</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className="px-6 py-3 rounded-xl bg-white hover:bg-sky-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 hover:text-sky-900 font-semibold text-sm border border-sky-200 dark:border-slate-700 transition-all flex items-center gap-2 shadow-2xs"
            >
              <Calculator className="w-4 h-4 text-sky-600" />
              <span>Try Subnet Calculator</span>
            </button>
            <button
              onClick={() => setActiveTab('subnet-wars')}
              className="px-5 py-3 rounded-xl bg-sky-50/80 hover:bg-sky-100 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold border border-sky-200/80 dark:border-slate-800 transition-all flex items-center gap-2 shadow-2xs"
            >
              <Swords className="w-4 h-4 text-rose-500" />
              <span>Subnet Wars Game</span>
            </button>
          </div>
        </div>
      </section>

      {/* Feature Highlights Bento Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-sky-700 dark:text-cyan-400 font-bold">
            Why Subnetting Master?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Everything You Need to Master Networking Math
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Designed specifically for computer science students, university exam takers, and network engineering candidates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(feat.tab)}
              className="p-6 rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-sky-300 hover:bg-sky-50/30 dark:hover:bg-slate-900 text-left transition-all space-y-3 group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-slate-950 border border-sky-200 dark:border-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
                {feat.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-cyan-400 transition-colors">
                {feat.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {feat.desc}
              </p>
              <div className="flex items-center text-xs font-bold text-sky-600 dark:text-cyan-400 pt-1 group-hover:translate-x-1 transition-transform">
                <span>Explore Feature</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="p-8 rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-6 shadow-sm">
        <div className="text-center">
          <span className="text-xs font-mono uppercase tracking-wider text-sky-700 dark:text-cyan-400 font-bold">
            Student Proof
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">Trusted by Engineering Students</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t, i) => (
            <div key={i} className="p-5 rounded-2xl bg-sky-50/60 dark:bg-slate-950 border border-sky-150 dark:border-slate-800 space-y-3">
              <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                "{t.quote}"
              </p>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">{t.author}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-6">
        <div className="text-center">
          <span className="text-xs font-mono uppercase tracking-wider text-sky-700 dark:text-cyan-400 font-bold">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Subnetting Concepts Explained</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="p-5 rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-sky-600 dark:text-cyan-400 shrink-0" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 pl-6 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-8 border-t border-sky-100 dark:border-slate-800 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
          <Network className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
          <span className="font-bold text-slate-800 dark:text-white">Subnetting Master</span>
          <span>·</span>
          <span>Computer Networks Learning Platform</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Built for students preparing for CCNA, Network+, university exams, and network architecture interviews.
        </p>
      </footer>
    </div>
  );
};
