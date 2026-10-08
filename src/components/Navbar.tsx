import React, { useState } from 'react';
import { 
  Network, 
  Search, 
  BookOpen, 
  Calculator, 
  Binary, 
  Grid, 
  Swords, 
  GraduationCap, 
  FileText, 
  User, 
  Flame, 
  Menu, 
  X, 
  ChevronDown, 
  Wrench, 
  Calendar, 
  HelpCircle, 
  ShieldAlert, 
  Sun, 
  Moon,
  Terminal,
  Activity,
  Award,
  Globe,
  Bot,
  Zap,
  Layers,
  Sparkles,
  Palette,
  Check
} from 'lucide-react';
import { useApp, NavTab, PALETTE_PRESETS } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setIsSearchOpen, 
    theme, 
    toggleTheme, 
    palette, 
    setPalette, 
    currentPalette, 
    stats, 
    levelInfo, 
    rankInfo 
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [paletteDropdownOpen, setPaletteDropdownOpen] = useState(false);

  const mainNavLinks: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <User className="w-4 h-4" /> },
    { id: 'learn', label: 'Learn', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'tools', label: 'Tools Suite', icon: <Calculator className="w-4 h-4" /> },
    { id: 'simulator', label: 'Simulator', icon: <Network className="w-4 h-4" /> },
    { id: 'packet-journey', label: 'Packet Journey', icon: <Activity className="w-4 h-4" /> },
    { id: 'cli', label: 'CLI Terminal', icon: <Terminal className="w-4 h-4" /> },
    { id: 'network-lab', label: 'Troubleshoot', icon: <Wrench className="w-4 h-4" /> },
    { id: 'flashcards', label: 'Flashcards', icon: <Sparkles className="w-4 h-4" /> },
  ];

  const secondaryNavLinks: { id: NavTab; label: string; desc: string; icon: React.ReactNode }[] = [
    { id: 'career', label: 'Career & Skill Tree', desc: 'Progression matrix & unlocked skills', icon: <Award className="w-4 h-4 text-amber-500" /> },
    { id: 'certificates', label: 'Verified Certificates', desc: 'Credential verification portal', icon: <ShieldAlert className="w-4 h-4 text-emerald-500" /> },
    { id: 'protocols', label: 'Protocol Explorer', desc: 'OSI layers, TCP handshake, RFCs', icon: <Globe className="w-4 h-4 text-purple-500" /> },
    { id: 'ai-mentor', label: 'AI Mentor & Coach', desc: 'Academic tutor & interview prep', icon: <Bot className="w-4 h-4 text-sky-500" /> },
    { id: 'exam', label: 'Exam Mode', desc: 'CCNA & University final simulation', icon: <GraduationCap className="w-4 h-4 text-indigo-500" /> },
    { id: 'subnet-wars', label: 'Subnet Wars', desc: 'Gamified battle arena vs AI', icon: <Swords className="w-4 h-4 text-rose-500" /> },
    { id: 'cheatsheet', label: 'Cheat Sheet', desc: 'Printable reference matrices', icon: <FileText className="w-4 h-4 text-teal-500" /> },
    { id: 'daily', label: 'Daily Challenge', desc: 'Daily seeded networking challenge', icon: <Calendar className="w-4 h-4 text-amber-500" /> },
    { id: 'quiz', label: 'Quiz Engine', desc: 'Categorized practice questions', icon: <HelpCircle className="w-4 h-4 text-blue-500" /> },
    { id: 'admin', label: 'Problem Workshop', desc: 'Custom question & lab builder', icon: <Layers className="w-4 h-4 text-slate-500" /> },
  ];

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-indigo-100/80 dark:border-slate-800/80 bg-white/85 dark:bg-[#090e1a]/85 backdrop-blur-md transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleNavClick('dashboard')}
          className="flex items-center gap-2.5 text-left focus:outline-none group shrink-0"
        >
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${currentPalette.gradientClass} shadow-md shadow-indigo-500/25 flex items-center justify-center text-white group-hover:scale-105 transition-transform`}>
            <Network className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-800 to-cyan-700 dark:from-white dark:via-cyan-200 dark:to-indigo-300 bg-clip-text text-transparent flex items-center gap-1.5 font-sans">
              Network Master
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-sm font-medium">
          {mainNavLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-colors whitespace-nowrap text-xs xl:text-sm font-semibold ${
                  isActive
                    ? 'text-indigo-800 bg-gradient-to-r from-indigo-50 via-sky-50/70 to-cyan-50/50 border border-indigo-200/90 shadow-2xs dark:text-cyan-300 dark:bg-gradient-to-r dark:from-indigo-950/70 dark:to-cyan-950/60 dark:border-cyan-500/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-900 dark:hover:text-white hover:bg-indigo-50/50 dark:hover:bg-slate-900/60'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            );
          })}

          {/* More dropdown */}
          <div className="relative">
            <button
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-colors whitespace-nowrap ${
                secondaryNavLinks.some((l) => l.id === activeTab)
                  ? 'text-indigo-800 bg-gradient-to-r from-indigo-50 via-sky-50/70 to-cyan-50/50 border border-indigo-200/90 dark:text-cyan-300 dark:bg-gradient-to-r dark:from-indigo-950/70 dark:to-cyan-950/60 dark:border-cyan-500/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-900 dark:hover:text-white hover:bg-indigo-50/50 dark:hover:bg-slate-900/60'
              }`}
            >
              <span>More</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {moreDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onMouseLeave={() => setMoreDropdownOpen(false)}
              >
                {secondaryNavLinks.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => handleNavClick(sub.id)}
                    className="w-full flex items-start gap-2.5 px-3 py-2 rounded-xl hover:bg-indigo-50/60 dark:hover:bg-slate-800 text-left transition-colors"
                  >
                    <div className="mt-0.5">{sub.icon}</div>
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{sub.label}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{sub.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: Actions (Search, Stats, Theme Toggle & Mobile Toggle) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-50/90 dark:bg-slate-900 hover:bg-indigo-50/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs border border-slate-200/80 dark:border-slate-800 transition-colors shadow-2xs"
            title="Search topics, CIDR prefixes, IP addresses, protocols (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
            <span className="hidden sm:inline font-medium">Search</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700">
              ⌘K
            </kbd>
          </button>

          {/* Color Palette Selector (Dual-Color Combination Switcher) */}
          <div className="relative">
            <button
              onClick={() => {
                setPaletteDropdownOpen(!paletteDropdownOpen);
                setMoreDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-slate-50/90 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 transition-colors shadow-2xs group"
              title={`Color Palette: ${currentPalette.name}`}
              aria-label="Change color theme palette"
            >
              <div className="flex items-center -space-x-1 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full border border-white dark:border-slate-900 shadow-2xs" style={{ backgroundColor: currentPalette.color1 }} />
                <span className="w-2.5 h-2.5 rounded-full border border-white dark:border-slate-900 shadow-2xs" style={{ backgroundColor: currentPalette.color2 }} />
              </div>
              <Palette className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-cyan-400" />
            </button>

            {paletteDropdownOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setPaletteDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-2xl p-2 z-40 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/80 mb-1">
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span>Color Combinations</span>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">2-Color Duos</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Harmonized dual-accent palettes for UI & labs</p>
                  </div>

                  <div className="space-y-1">
                    {PALETTE_PRESETS.map((p) => {
                      const isSelected = p.id === palette;
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            setPalette(p.id);
                            setPaletteDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all text-xs ${
                            isSelected
                              ? 'bg-gradient-to-r from-slate-100 via-slate-50 to-white dark:from-slate-800 dark:to-slate-800/60 font-semibold text-slate-900 dark:text-white ring-1 ring-slate-300 dark:ring-slate-700'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="flex items-center -space-x-1 shrink-0 p-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs">
                              <span className="w-3.5 h-3.5 rounded-full shadow-2xs" style={{ backgroundColor: p.color1 }} />
                              <span className="w-3.5 h-3.5 rounded-full shadow-2xs" style={{ backgroundColor: p.color2 }} />
                            </div>
                            <div>
                              <div className="text-xs font-bold flex items-center gap-1.5">
                                <span>{p.name}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[170px]">{p.tagline}</div>
                            </div>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-xl bg-slate-50/90 dark:bg-slate-900 hover:bg-indigo-50/60 dark:hover:bg-slate-800 text-indigo-600 dark:text-cyan-400 border border-slate-200/80 dark:border-slate-800 transition-colors"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle visual theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* User Level & XP Indicator */}
          <button
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-gradient-to-r from-white via-indigo-50/20 to-cyan-50/20 dark:from-slate-900 dark:to-slate-900 border border-indigo-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-cyan-500 transition-colors text-left shadow-2xs"
          >
            <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{stats.streak}d</span>
            </div>
            <div className="h-3 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="text-xs font-mono text-indigo-700 dark:text-cyan-300 font-extrabold">
              Lv.{levelInfo.level}
            </div>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-sky-50 dark:hover:bg-slate-900 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2 pb-4 space-y-2 max-h-[80vh] overflow-y-auto">
          {/* Mobile Color Palette Chips */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                Color Theme ({currentPalette.accentName})
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {PALETTE_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPalette(p.id)}
                  className={`flex items-center gap-2 p-1.5 rounded-lg text-[11px] font-medium border text-left transition-colors ${
                    p.id === palette
                      ? 'bg-white dark:bg-slate-800 border-indigo-300 dark:border-cyan-500 text-slate-900 dark:text-white shadow-2xs font-bold'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center -space-x-1 shrink-0">
                    <span className="w-3 h-3 rounded-full shadow-2xs" style={{ backgroundColor: p.color1 }} />
                    <span className="w-3 h-3 rounded-full shadow-2xs" style={{ backgroundColor: p.color2 }} />
                  </div>
                  <span className="truncate">{p.name.split(' & ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs uppercase font-semibold text-slate-400 dark:text-slate-500 px-3 py-1 tracking-wider">
            Core Learning & Simulators
          </div>
          {mainNavLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                activeTab === link.id
                  ? 'text-sky-700 bg-sky-100/70 border border-sky-200 dark:text-cyan-400 dark:bg-cyan-950/40 dark:border-cyan-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-sky-50 dark:hover:bg-slate-900'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </button>
          ))}

          <div className="text-xs uppercase font-semibold text-slate-400 dark:text-slate-500 px-3 pt-3 pb-1 tracking-wider">
            Practice, Tools & Credentials
          </div>
          {secondaryNavLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                activeTab === link.id
                  ? 'text-sky-700 bg-sky-100/70 border border-sky-200 dark:text-cyan-400 dark:bg-cyan-950/40 dark:border-cyan-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-sky-50 dark:hover:bg-slate-900'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

