import React, { useState } from 'react';
import { 
  RotateCw, 
  CheckCircle2, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft, 
  Flame, 
  Sparkles, 
  Shuffle, 
  BookOpen, 
  ShieldCheck 
} from 'lucide-react';
import { FLASHCARD_DECK } from '../../data/flashcards';
import { useApp } from '../../context/AppContext';

export const FlashcardsHub: React.FC = () => {
  const { addXp, unlockBadge } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  const categories = [
    'all',
    'OSI Model',
    'IPv4 & Subnetting',
    'IPv6',
    'Protocols & Ports',
    'Routing & Switching',
    'Security',
  ];

  const filteredCards = FLASHCARD_DECK.filter((c) => {
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    return true;
  });

  const activeCard = filteredCards[currentIndex] || filteredCards[0];

  const handleNextCard = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    setIsFlipped(false);
    setReviewedCount((prev) => prev + 1);

    if (rating === 'easy' || rating === 'good') {
      addXp(15, 'Reviewed flashcard');
    } else {
      addXp(5);
    }

    if (reviewedCount + 1 >= 5) {
      unlockBadge('first-step');
    }

    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-sky-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Active Recall & Spaced Repetition</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Networking Flashcards
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Reinforce OSI layers, subnetting math, IPv6 prefixes, well-known port numbers, and security protocols with spaced repetition.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors capitalize ${
              selectedCategory === cat
                ? 'bg-sky-600 text-white shadow-2xs'
                : 'bg-white dark:bg-slate-900 border border-sky-150 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {cat === 'all' ? 'All Decks' : cat}
          </button>
        ))}
      </div>

      {/* Main Flashcard Flippable Area */}
      {activeCard && (
        <div className="space-y-6">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[300px] sm:min-h-[340px] rounded-3xl border border-sky-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between select-none relative group"
          >
            {/* Top metadata */}
            <div className="flex items-center justify-between text-xs text-slate-500 pb-4 border-b border-sky-100 dark:border-slate-900">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-cyan-950 dark:text-cyan-300 font-semibold text-[11px]">
                {activeCard.category}
              </span>
              <span className="font-mono text-slate-400">
                Card {currentIndex + 1} of {filteredCards.length}
              </span>
            </div>

            {/* Middle Question / Answer */}
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
              {!isFlipped ? (
                <>
                  <span className="text-xs uppercase font-mono tracking-wider text-sky-600 dark:text-cyan-400 font-bold">
                    Question:
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white max-w-xl leading-snug">
                    {activeCard.question}
                  </h2>
                  <span className="text-xs text-slate-400 flex items-center gap-1 group-hover:text-sky-600 transition-colors pt-2">
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Click card to reveal answer</span>
                  </span>
                </>
              ) : (
                <div className="space-y-3 animate-in fade-in zoom-in-95 duration-150">
                  <span className="text-xs uppercase font-mono tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
                    Correct Answer:
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">
                    {activeCard.answer}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed pt-2 border-t border-sky-100 dark:border-slate-800">
                    {activeCard.explanation}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom prompt */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-4 border-t border-sky-100 dark:border-slate-900">
              <span>Difficulty: <strong className="capitalize text-slate-600 dark:text-slate-300">{activeCard.difficulty}</strong></span>
              <span>Reviewed: {reviewedCount} cards</span>
            </div>
          </div>

          {/* Rating Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => handleNextCard('again')}
              className="py-2.5 px-3 rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold text-xs hover:bg-rose-100 transition-colors"
            >
              Again (Repeat)
            </button>
            <button
              onClick={() => handleNextCard('hard')}
              className="py-2.5 px-3 rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold text-xs hover:bg-amber-100 transition-colors"
            >
              Hard (+5 XP)
            </button>
            <button
              onClick={() => handleNextCard('good')}
              className="py-2.5 px-3 rounded-2xl border border-sky-200 dark:border-sky-900 bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-cyan-300 font-bold text-xs hover:bg-sky-100 transition-colors"
            >
              Good (+15 XP)
            </button>
            <button
              onClick={() => handleNextCard('easy')}
              className="py-2.5 px-3 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-100 transition-colors"
            >
              Easy (+15 XP)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
