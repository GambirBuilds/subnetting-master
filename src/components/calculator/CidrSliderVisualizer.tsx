import React, { useState } from 'react';
import { Sliders, Info, Hash, ArrowUpDown } from 'lucide-react';
import { cidrToMask, cidrToWildcard } from '../../utils/subnet';

export const CidrSliderVisualizer: React.FC = () => {
  const [cidr, setCidr] = useState<number>(26);

  const subnetMask = cidrToMask(cidr);
  const wildcardMask = cidrToWildcard(cidr);
  const hostBits = 32 - cidr;
  const totalAddresses = Math.pow(2, hostBits);
  const usableHosts = cidr === 32 ? 1 : cidr === 31 ? 2 : Math.max(0, totalAddresses - 2);

  // Determine interesting octet
  let interestingOctet = Math.floor(cidr / 8) + 1;
  if (cidr === 32) interestingOctet = 4;
  if (interestingOctet > 4) interestingOctet = 4;

  const maskOctets = subnetMask.split('.').map(Number);
  const interestingMaskValue = maskOctets[interestingOctet - 1];
  const blockSize = 256 - interestingMaskValue;

  const quickPrefixes = [8, 16, 24, 25, 26, 27, 28, 29, 30, 32];

  // Generate 32 bits array
  const bitsArray = Array.from({ length: 32 }, (_, i) => ({
    index: i,
    isNetwork: i < cidr,
    octet: Math.floor(i / 8) + 1,
    bitInOctet: 7 - (i % 8),
  }));

  return (
    <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sky-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
            <span>Interactive CIDR Prefix Slider (/0 to /32)</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Slide to observe how expanding network bits reduces host bits and scales usable IP counts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1 rounded-xl bg-sky-100 dark:bg-cyan-950 border border-sky-300 dark:border-cyan-500/30 text-sky-800 dark:text-cyan-300 font-mono font-bold text-base shadow-2xs">
            /{cidr}
          </div>
        </div>
      </div>

      {/* Slider & Quick Jump Buttons */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span>/0 (Entire Internet)</span>
          <span className="text-sky-700 dark:text-cyan-400 font-bold">Active Prefix: /{cidr}</span>
          <span>/32 (Single Host)</span>
        </div>
        <input
          type="range"
          min="0"
          max="32"
          value={cidr}
          onChange={(e) => setCidr(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-sky-100 dark:bg-slate-950 rounded-lg appearance-none cursor-pointer accent-sky-600 dark:accent-cyan-400"
        />
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mr-1 font-medium">Quick Select:</span>
          {quickPrefixes.map((p) => (
            <button
              key={p}
              onClick={() => setCidr(p)}
              className={`px-2 py-0.5 text-xs font-mono rounded-md transition-colors ${
                cidr === p
                  ? 'bg-sky-600 text-white font-bold shadow-2xs'
                  : 'bg-sky-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-sky-100 dark:hover:bg-slate-700 border border-sky-200/60 dark:border-transparent'
              }`}
            >
              /{p}
            </button>
          ))}
        </div>
      </div>

      {/* 32-Bit Representation Grid */}
      <div className="p-4 rounded-xl bg-sky-50/50 dark:bg-slate-950 border border-sky-150 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-300">32-Bit Mask Structure:</span>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-sky-700 dark:text-cyan-400 font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 inline-block" />
              Network Bits ({cidr})
            </span>
            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-200 dark:bg-slate-800 inline-block border border-slate-300 dark:border-slate-700" />
              Host Bits ({hostBits})
            </span>
          </div>
        </div>

        {/* 4 Octets */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((octetNum) => {
            const octetBits = bitsArray.filter((b) => b.octet === octetNum);
            const isInteresting = octetNum === interestingOctet;
            return (
              <div
                key={octetNum}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isInteresting
                    ? 'border-sky-300 bg-sky-100/40 dark:border-cyan-500/40 dark:bg-cyan-950/20'
                    : 'border-sky-150 bg-white dark:border-slate-800/80 dark:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1.5">
                  <span>Octet {octetNum}</span>
                  <span className={isInteresting ? 'text-sky-700 dark:text-cyan-400 font-bold' : ''}>
                    {maskOctets[octetNum - 1]}
                  </span>
                </div>
                <div className="grid grid-cols-8 gap-1">
                  {octetBits.map((b) => (
                    <div
                      key={b.index}
                      className={`h-7 rounded flex items-center justify-center font-mono text-[11px] font-bold ${
                        b.isNetwork
                          ? 'bg-sky-500 text-white shadow-2xs'
                          : 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {b.isNetwork ? '1' : '0'}
                    </div>
                  ))}
                </div>
                {isInteresting && (
                  <div className="text-[10px] text-sky-700 dark:text-cyan-400 text-center mt-1.5 font-bold">
                    Interesting Octet
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Calculated Stats Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-sky-50/40 dark:bg-slate-950 border border-sky-150 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Subnet Mask</div>
          <div className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-1">{subnetMask}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Dotted decimal format</div>
        </div>

        <div className="p-3.5 rounded-xl bg-sky-50/40 dark:bg-slate-950 border border-sky-150 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Block Size (Magic #)</div>
          <div className="text-sm font-mono font-bold text-sky-600 dark:text-cyan-400 mt-1">{blockSize}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">In Octet #{interestingOctet} (256 - {interestingMaskValue})</div>
        </div>

        <div className="p-3.5 rounded-xl bg-sky-50/40 dark:bg-slate-950 border border-sky-150 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Total Addresses</div>
          <div className="text-sm font-mono font-bold text-amber-600 dark:text-amber-400 mt-1">
            {totalAddresses.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">2^{hostBits} total addresses</div>
        </div>

        <div className="p-3.5 rounded-xl bg-sky-50/40 dark:bg-slate-950 border border-sky-150 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Usable Host IPs</div>
          <div className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {usableHosts.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {cidr <= 30 ? '2^h - 2 (Minus Net & Bcast)' : cidr === 31 ? 'RFC 3021 Point-to-Point' : 'Host Route'}
          </div>
        </div>
      </div>
    </div>
  );
};
