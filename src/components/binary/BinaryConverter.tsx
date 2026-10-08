import React, { useState } from 'react';
import { Binary, RefreshCw, CheckCircle2, XCircle, ArrowRight, Lightbulb, Zap, HelpCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BinaryConverter: React.FC = () => {
  const { addXp, unlockBadge } = useApp();

  // 8 bits (positions 7 to 0, values 128 down to 1)
  const [bits, setBits] = useState<number[]>([1, 1, 0, 0, 0, 0, 0, 0]); // Default 192 (128 + 64)
  const bitWeights = [128, 64, 32, 16, 8, 4, 2, 1];

  // Bitwise AND playground states
  const [andBitsA, setAndBitsA] = useState<number[]>([1, 1, 0, 0, 0, 0, 0, 0]); // 192
  const [andBitsB, setAndBitsB] = useState<number[]>([1, 1, 1, 1, 0, 0, 0, 0]); // 240 (/28 mask octet)

  // Challenge Mode State
  const [challengeTarget, setChallengeTarget] = useState<number>(168);
  const [challengeBits, setChallengeBits] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0]);
  const [challengeFeedback, setChallengeFeedback] = useState<{ status: 'correct' | 'incorrect' | null; message: string }>({
    status: null,
    message: '',
  });

  const decimalValue = bits.reduce((sum, bit, index) => sum + (bit ? bitWeights[index] : 0), 0);
  const hexValue = decimalValue.toString(16).toUpperCase().padStart(2, '0');

  const toggleBit = (index: number) => {
    setBits((prev) => {
      const next = [...prev];
      next[index] = next[index] === 1 ? 0 : 1;
      return next;
    });
  };

  const handleDecimalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val)) val = 0;
    if (val < 0) val = 0;
    if (val > 255) val = 255;

    const newBits = bitWeights.map((w) => {
      if (val >= w) {
        val -= w;
        return 1;
      }
      return 0;
    });
    setBits(newBits);
  };

  // Toggle challenge bit
  const toggleChallengeBit = (index: number) => {
    setChallengeBits((prev) => {
      const next = [...prev];
      next[index] = next[index] === 1 ? 0 : 1;
      return next;
    });
    setChallengeFeedback({ status: null, message: '' });
  };

  const currentChallengeSum = challengeBits.reduce(
    (sum, bit, index) => sum + (bit ? bitWeights[index] : 0),
    0
  );

  const checkChallenge = () => {
    if (currentChallengeSum === challengeTarget) {
      setChallengeFeedback({
        status: 'correct',
        message: `Outstanding! ${challengeTarget} in binary is ${challengeBits.join('')}. (+30 XP)`,
      });
      addXp(30, 'Mastered 8-bit binary challenge');
      unlockBadge('binary-whisperer');
    } else {
      setChallengeFeedback({
        status: 'incorrect',
        message: `Current sum is ${currentChallengeSum}, but target is ${challengeTarget}. Try adjusting your powers of 2!`,
      });
    }
  };

  const generateNewChallenge = () => {
    const randomDec = Math.floor(Math.random() * 254) + 1;
    setChallengeTarget(randomDec);
    setChallengeBits([0, 0, 0, 0, 0, 0, 0, 0]);
    setChallengeFeedback({ status: null, message: '' });
  };

  // Bitwise AND calculation
  const andResultBits = andBitsA.map((bitA, i) => bitA & andBitsB[i]);
  const andDecA = andBitsA.reduce((sum, bit, i) => sum + (bit ? bitWeights[i] : 0), 0);
  const andDecB = andBitsB.reduce((sum, bit, i) => sum + (bit ? bitWeights[i] : 0), 0);
  const andDecRes = andResultBits.reduce((sum, bit, i) => sum + (bit ? bitWeights[i] : 0), 0);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Title & Introduction */}
      <div>
        <div className="flex items-center gap-2 text-sky-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Binary className="w-4 h-4" />
          <span>Interactive Binary System</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          8-Bit Binary Converter & Bitwise Engine
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Click individual bits to watch decimal sums, binary weights, and bitwise AND operations react in real-time.
        </p>
      </div>

      {/* Main 8-Bit Interactive Converter Card */}
      <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sky-100 dark:border-slate-800 pb-5 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Interactive 8-Bit Octet</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Click any bit switch to toggle between 1 (ON) and 0 (OFF)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-sky-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-sky-200/80 dark:border-slate-800">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Decimal:</span>
              <input
                type="number"
                min="0"
                max="255"
                value={decimalValue}
                onChange={handleDecimalChange}
                className="w-16 bg-transparent text-sky-700 dark:text-cyan-400 font-mono font-bold text-right focus:outline-none text-sm"
              />
            </div>
            <div className="bg-sky-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-sky-200/80 dark:border-slate-800 text-xs font-mono">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Hex: </span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">0x{hexValue}</span>
            </div>
          </div>
        </div>

        {/* The 8 Interactive Bits */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 sm:gap-3 mb-6">
          {bitWeights.map((weight, index) => {
            const isSet = bits[index] === 1;
            const power = 7 - index;
            return (
              <button
                key={weight}
                onClick={() => toggleBit(index)}
                className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                  isSet
                    ? 'bg-sky-50 border-sky-300 text-sky-900 shadow-xs dark:bg-cyan-950/60 dark:border-cyan-500/60 dark:text-cyan-300'
                    : 'bg-white border-sky-150 text-slate-500 hover:border-sky-300 dark:bg-slate-950/80 dark:border-slate-800 dark:text-slate-400'
                }`}
              >
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                  2^{power}
                </span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  {weight}
                </span>
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-lg font-bold transition-all ${
                    isSet
                      ? 'bg-sky-600 text-white shadow-xs dark:bg-cyan-500 dark:text-slate-950 ring-2 ring-sky-300 dark:ring-cyan-400/50'
                      : 'bg-slate-100 text-slate-400 border border-slate-200 dark:bg-slate-900 dark:text-slate-500 dark:border-slate-800'
                  }`}
                >
                  {bits[index]}
                </div>
                <span className="text-[10px] mt-1.5 uppercase font-bold text-slate-500 dark:text-slate-400">
                  {isSet ? 'ON' : 'OFF'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Mathematical Formula Breakdown */}
        <div className="p-4 rounded-xl bg-sky-50/60 dark:bg-slate-950/70 border border-sky-150 dark:border-slate-800 font-mono text-xs">
          <div className="text-slate-600 dark:text-slate-400 mb-1.5 font-sans font-semibold flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>Mathematical Sum Breakdown:</span>
          </div>
          <div className="text-slate-800 dark:text-slate-200 flex flex-wrap items-center gap-1 leading-relaxed">
            {bits.map((bit, idx) => {
              if (bit === 1) {
                return (
                  <span key={idx} className="text-sky-700 dark:text-cyan-400 font-bold">
                    {bitWeights[idx]} {idx < bits.lastIndexOf(1) ? '+ ' : ''}
                  </span>
                );
              }
              return null;
            })}
            {decimalValue === 0 && <span className="text-slate-400">0</span>}
            <span className="text-slate-500 dark:text-slate-400 font-bold">=</span>
            <span className="text-slate-900 dark:text-white font-extrabold text-sm bg-sky-100 dark:bg-cyan-950/50 px-2 py-0.5 rounded-md border border-sky-200 dark:border-cyan-500/30">
              {decimalValue}
            </span>
          </div>
        </div>
      </div>

      {/* Bitwise AND Engine: How Routers Determine Subnets */}
      <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>Bitwise AND Engine (Router Subnetting Logic)</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Routers perform a bitwise AND between the IP Address and Subnet Mask to zero out host bits.
            </p>
          </div>
        </div>

        {/* Truth Table Mini Banner */}
        <div className="grid grid-cols-4 gap-2 mb-6 text-center text-xs font-mono p-2.5 rounded-xl bg-sky-50/70 dark:bg-slate-950 border border-sky-150 dark:border-slate-800">
          <div className="text-slate-600 dark:text-slate-400">1 AND 1 = <span className="text-emerald-600 dark:text-emerald-400 font-bold">1</span></div>
          <div className="text-slate-600 dark:text-slate-400">1 AND 0 = <span className="text-slate-400 dark:text-slate-500 font-bold">0</span></div>
          <div className="text-slate-600 dark:text-slate-400">0 AND 1 = <span className="text-slate-400 dark:text-slate-500 font-bold">0</span></div>
          <div className="text-slate-600 dark:text-slate-400">0 AND 0 = <span className="text-slate-400 dark:text-slate-500 font-bold">0</span></div>
        </div>

        {/* Row A: IP Octet */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-sky-50/50 dark:bg-slate-950/80 border border-sky-150 dark:border-slate-800">
            <div className="w-32 text-xs font-medium text-slate-700 dark:text-slate-300">
              IP Octet: <span className="text-sky-700 dark:text-cyan-400 font-mono font-bold">{andDecA}</span>
            </div>
            <div className="flex gap-1.5 sm:gap-2">
              {andBitsA.map((bit, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const next = [...andBitsA];
                    next[idx] = next[idx] === 1 ? 0 : 1;
                    setAndBitsA(next);
                  }}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-mono text-xs font-bold transition-colors ${
                    bit === 1
                      ? 'bg-sky-600 text-white shadow-xs dark:bg-cyan-500 dark:text-slate-950'
                      : 'bg-white text-slate-400 hover:text-slate-600 border border-sky-200 dark:bg-slate-900 dark:text-slate-500 dark:border-slate-800'
                  }`}
                >
                  {bit}
                </button>
              ))}
            </div>
          </div>

          {/* Row B: Mask Octet */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/40 dark:bg-slate-950/80 border border-amber-200/80 dark:border-slate-800">
            <div className="w-32 text-xs font-medium text-slate-700 dark:text-slate-300">
              Mask Octet: <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">{andDecB}</span>
            </div>
            <div className="flex gap-1.5 sm:gap-2">
              {andBitsB.map((bit, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const next = [...andBitsB];
                    next[idx] = next[idx] === 1 ? 0 : 1;
                    setAndBitsB(next);
                  }}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-mono text-xs font-bold transition-colors ${
                    bit === 1
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-white text-slate-400 hover:text-slate-600 border border-amber-200 dark:bg-slate-900 dark:text-slate-500 dark:border-slate-800'
                  }`}
                >
                  {bit}
                </button>
              ))}
            </div>
          </div>

          {/* Result Row */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30">
            <div className="w-32 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              Network Result: <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{andDecRes}</span>
            </div>
            <div className="flex gap-1.5 sm:gap-2">
              {andResultBits.map((bit, idx) => (
                <div
                  key={idx}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-mono text-xs font-bold flex items-center justify-center ${
                    bit === 1
                      ? 'bg-emerald-600 text-white shadow-xs dark:bg-emerald-500 dark:text-slate-950'
                      : 'bg-white text-slate-400 border border-emerald-200 dark:bg-slate-900 dark:text-slate-600 dark:border-slate-800'
                  }`}
                >
                  {bit}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Binary Practice Challenge */}
      <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-100 dark:border-slate-800 pb-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
              <span>Binary Skill Challenge</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Toggle the bits to match the target decimal number.
            </p>
          </div>
          <button
            onClick={generateNewChallenge}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 border border-sky-200/60 dark:border-transparent transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New Target</span>
          </button>
        </div>

        <div className="flex flex-col items-center justify-center p-6 bg-sky-50/70 dark:bg-slate-950 rounded-2xl border border-sky-150 dark:border-slate-800 mb-6 shadow-2xs">
          <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 tracking-wider">
            Target Decimal Number
          </span>
          <span className="text-4xl sm:text-5xl font-extrabold text-sky-700 dark:text-cyan-400 font-mono my-2 tracking-tight">
            {challengeTarget}
          </span>
          <span className="text-xs text-slate-600 dark:text-slate-400">
            Current Bits Sum: <span className="font-mono text-slate-900 dark:text-slate-200 font-bold">{currentChallengeSum}</span>
          </span>
        </div>

        {/* Challenge Bits */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 sm:gap-3 mb-6">
          {bitWeights.map((weight, index) => {
            const isSet = challengeBits[index] === 1;
            return (
              <button
                key={weight}
                onClick={() => toggleChallengeBit(index)}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                  isSet
                    ? 'bg-sky-50 border-sky-300 text-sky-900 dark:bg-cyan-950/60 dark:border-cyan-500/60 dark:text-cyan-300 shadow-2xs'
                    : 'bg-white border-sky-150 text-slate-500 hover:border-sky-300 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-500'
                }`}
              >
                <span className="text-xs font-bold mb-1.5">{weight}</span>
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-base font-bold ${
                    isSet
                      ? 'bg-sky-600 text-white dark:bg-cyan-500 dark:text-slate-950'
                      : 'bg-slate-100 text-slate-400 border border-slate-200 dark:bg-slate-900 dark:text-slate-600 dark:border-slate-800'
                  }`}
                >
                  {challengeBits[index]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Action & Feedback */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={checkChallenge}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors shadow-sm shadow-sky-600/30 flex items-center justify-center gap-2"
          >
            <span>Verify Binary Solution</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {challengeFeedback.status && (
            <div
              className={`flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl border ${
                challengeFeedback.status === 'correct'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-500/30'
                  : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-500/30'
              }`}
            >
              {challengeFeedback.status === 'correct' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              )}
              <span>{challengeFeedback.message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
