import React, { useState } from 'react';
import { 
  Calculator, 
  HelpCircle, 
  Copy, 
  Check, 
  ArrowRight, 
  Layers, 
  Activity, 
  Sliders, 
  Sparkles,
  Info
} from 'lucide-react';
import { calculateSubnet, validateIPv4, cidrToMask } from '../../utils/subnet';
import { useApp } from '../../context/AppContext';

export const SubnetCalculator: React.FC = () => {
  const { addXp } = useApp();

  const [ipInput, setIpInput] = useState<string>('192.168.1.100');
  const [cidrInput, setCidrInput] = useState<number>(26);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeStepTab, setActiveStepTab] = useState<'overview' | 'steps' | 'binary'>('overview');

  const validation = validateIPv4(ipInput);
  const isValid = validation.valid;
  const result = isValid ? calculateSubnet(ipInput, cidrInput) : null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const presets = [
    { label: 'Home LAN (/24)', ip: '192.168.1.45', cidr: 24 },
    { label: 'Subnetted Dept (/26)', ip: '192.168.1.100', cidr: 26 },
    { label: 'Small Team (/28)', ip: '10.20.30.145', cidr: 28 },
    { label: 'WAN Link (/30)', ip: '172.16.10.5', cidr: 30 },
    { label: 'Enterprise Core (/20)', ip: '172.16.45.100', cidr: 20 },
    { label: 'Loopback Host (/32)', ip: '127.0.0.1', cidr: 32 },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sky-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Calculator className="w-4 h-4" />
          <span>Professional Network Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Subnet Calculator & Step-by-Step Solver
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Calculate network boundaries, broadcast addresses, usable host ranges, and understand every calculation step-by-step.
        </p>
      </div>

      {/* Input Section */}
      <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          {/* IP Input */}
          <div className="sm:col-span-8 space-y-1.5">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              IPv4 Address:
            </label>
            <div className="relative">
              <input
                type="text"
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value.trim())}
                placeholder="e.g. 192.168.1.100"
                className={`w-full px-4 py-2.5 rounded-xl bg-sky-50/50 dark:bg-slate-950 font-mono text-sm border focus:outline-none focus:ring-2 transition-all ${
                  isValid
                    ? 'border-sky-200/80 dark:border-slate-800 text-slate-900 dark:text-cyan-300 focus:border-sky-500 focus:ring-sky-500/20'
                    : 'border-rose-400 text-rose-700 dark:text-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                }`}
              />
            </div>
            {!isValid && validation.error && (
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{validation.error}</p>
            )}
          </div>

          {/* Prefix Length Dropdown */}
          <div className="sm:col-span-4 space-y-1.5">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Prefix Length (CIDR):
            </label>
            <select
              value={cidrInput}
              onChange={(e) => {
                setCidrInput(parseInt(e.target.value, 10));
                addXp(5);
              }}
              className="w-full px-3 py-2.5 rounded-xl bg-sky-50/50 dark:bg-slate-950 font-mono text-sm text-slate-800 dark:text-slate-200 border border-sky-200/80 dark:border-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            >
              {Array.from({ length: 33 }, (_, i) => 32 - i).map((prefix) => (
                <option key={prefix} value={prefix}>
                  /{prefix} — {cidrToMask(prefix)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-sky-100 dark:border-slate-800/80">
          <span className="text-xs text-slate-500 dark:text-slate-400 mr-1 font-medium">Quick Presets:</span>
          {presets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                setIpInput(preset.ip);
                setCidrInput(preset.cidr);
              }}
              className="px-2.5 py-1 text-xs rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-sky-800 dark:text-slate-300 hover:text-sky-900 dark:hover:text-white border border-sky-200/60 dark:border-slate-700/60 transition-colors font-mono shadow-2xs"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs: Overview, Step-by-Step Solver, Binary Analyzer */}
      {result && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-sky-150 dark:border-slate-800 pb-2">
            <button
              onClick={() => setActiveStepTab('overview')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeStepTab === 'overview'
                  ? 'bg-sky-600 text-white shadow-xs dark:bg-cyan-950 dark:border dark:border-cyan-500/30 dark:text-cyan-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Results Overview
            </button>
            <button
              onClick={() => setActiveStepTab('steps')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeStepTab === 'steps'
                  ? 'bg-sky-600 text-white shadow-xs dark:bg-cyan-950 dark:border dark:border-cyan-500/30 dark:text-cyan-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Step-by-Step Math (Solve It For Me)
            </button>
            <button
              onClick={() => setActiveStepTab('binary')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeStepTab === 'binary'
                  ? 'bg-sky-600 text-white shadow-xs dark:bg-cyan-950 dark:border dark:border-cyan-500/30 dark:text-cyan-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              32-Bit Binary Analyzer
            </button>
          </div>

          {/* TAB 1: Overview Cards Grid */}
          {activeStepTab === 'overview' && (
            <div className="space-y-6">
              {/* Primary Network Boundaries Hero Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Network Address */}
                <div className="p-5 rounded-2xl border border-sky-200/90 dark:border-cyan-500/30 bg-sky-50/70 dark:bg-cyan-950/20 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-sky-700 dark:text-cyan-400 font-bold mb-1">
                    <span>NETWORK ADDRESS</span>
                    <button
                      onClick={() => handleCopy(result.networkAddress, 'net')}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
                      title="Copy network address"
                    >
                      {copiedKey === 'net' ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="text-xl font-mono font-bold text-slate-900 dark:text-white tracking-tight">
                    {result.networkAddress}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Host bits all 0 · Identifies the subnet boundary
                  </p>
                </div>

                {/* Usable Host Range */}
                <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-950/20 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 font-bold mb-1">
                    <span>USABLE HOST RANGE</span>
                    <button
                      onClick={() => handleCopy(`${result.firstUsableHost} - ${result.lastUsableHost}`, 'range')}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
                      title="Copy host range"
                    >
                      {copiedKey === 'range' ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="text-sm sm:text-base font-mono font-bold text-slate-900 dark:text-white tracking-tight">
                    {result.firstUsableHost}
                    <span className="text-slate-400 mx-1.5 font-normal">➔</span>
                    {result.lastUsableHost}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {result.usableHosts.toLocaleString()} usable IP addresses for devices
                  </p>
                </div>

                {/* Broadcast Address */}
                <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-500/30 bg-amber-50/70 dark:bg-amber-950/20 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-amber-700 dark:text-amber-400 font-bold mb-1">
                    <span>BROADCAST ADDRESS</span>
                    <button
                      onClick={() => handleCopy(result.broadcastAddress, 'bcast')}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
                      title="Copy broadcast address"
                    >
                      {copiedKey === 'bcast' ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="text-xl font-mono font-bold text-slate-900 dark:text-white tracking-tight">
                    {result.broadcastAddress}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Host bits all 1 · Reaches all devices on subnet
                  </p>
                </div>
              </div>

              {/* Comprehensive Secondary Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 shadow-2xs">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Subnet Mask</span>
                  <div className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {result.subnetMask}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 shadow-2xs">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Wildcard Mask</span>
                  <div className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {result.wildcardMask}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 shadow-2xs">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Block Size (Magic #)</span>
                  <div className="text-sm font-mono font-bold text-sky-600 dark:text-cyan-400 mt-1">
                    {result.blockSize} <span className="text-xs font-normal text-slate-500">(Octet #{result.interestingOctet})</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 shadow-2xs">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Address Scope</span>
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                    {result.ipType}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 shadow-2xs">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Legacy Class</span>
                  <div className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100 mt-1">
                    Class {result.ipClass}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 shadow-2xs">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Default Class Mask</span>
                  <div className="text-xs font-mono text-slate-700 dark:text-slate-300 mt-1">
                    {result.defaultClassMask}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 shadow-2xs">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Network / Host Bits</span>
                  <div className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100 mt-1">
                    <span className="text-sky-600 dark:text-cyan-400">{result.networkBits}N</span>
                    <span className="text-slate-400 mx-1">/</span>
                    <span className="text-amber-600 dark:text-amber-400">{result.hostBits}H</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 shadow-2xs">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Total IP Count</span>
                  <div className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {result.totalAddresses.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Step-by-Step Solver ("Solve It For Me") */}
          {activeStepTab === 'steps' && (
            <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-sky-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
                  <span>Step-by-Step Mathematical Solution for {result.ip}/{result.cidr}</span>
                </h3>
              </div>

              <div className="space-y-4">
                {result.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-sky-50/50 dark:bg-slate-950 border border-sky-150 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-sky-100 dark:bg-cyan-950 border border-sky-300 dark:border-cyan-500/40 text-sky-700 dark:text-cyan-300 font-mono text-xs flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200">
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-7">
                      {step.description}
                    </p>
                    {step.formula && (
                      <div className="ml-7 p-2 rounded-lg bg-white dark:bg-slate-900 border border-sky-200/80 dark:border-slate-800 text-xs font-mono text-sky-700 dark:text-cyan-400 font-semibold shadow-2xs">
                        {step.formula}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: 32-Bit Binary Analyzer */}
          {activeStepTab === 'binary' && (
            <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-6 shadow-sm">
              <div className="border-b border-sky-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  32-Bit Binary Octet Alignment
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  See how the subnet mask cleanly splits the 32 bits into the Network portion and Host portion.
                </p>
              </div>

              {/* Rows: IP, Mask, Network */}
              <div className="space-y-4">
                {/* IP Address Binary */}
                <div className="p-3.5 rounded-xl bg-sky-50/50 dark:bg-slate-950 border border-sky-150 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-2">
                    <span>IP Address: <strong className="text-slate-900 dark:text-white font-mono">{result.ip}</strong></span>
                    <span className="text-[11px] font-mono">Dotted Decimal</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 font-mono text-xs">
                    {result.binaryIp.map((octetBin, octIdx) => (
                      <div key={octIdx} className="flex gap-0.5 justify-center bg-white dark:bg-slate-900 p-2 rounded-lg border border-sky-100 dark:border-transparent shadow-2xs">
                        {octetBin.split('').map((bit, bitIdx) => {
                          const globalBitIndex = octIdx * 8 + bitIdx;
                          const isNet = globalBitIndex < result.cidr;
                          return (
                            <span
                              key={bitIdx}
                              className={`w-4 h-6 flex items-center justify-center font-bold text-xs rounded-sm ${
                                isNet
                                  ? 'text-sky-700 bg-sky-100 dark:text-cyan-400 dark:bg-cyan-950/60'
                                  : 'text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-950/40'
                              }`}
                              title={`Bit ${globalBitIndex}: ${isNet ? 'Network Bit' : 'Host Bit'}`}
                            >
                              {bit}
                            </span>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subnet Mask Binary */}
                <div className="p-3.5 rounded-xl bg-sky-50/50 dark:bg-slate-950 border border-sky-150 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-2">
                    <span>Subnet Mask: <strong className="text-slate-900 dark:text-white font-mono">{result.subnetMask} (/{result.cidr})</strong></span>
                    <span className="text-[11px] font-mono">{result.networkBits} ones · {result.hostBits} zeros</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 font-mono text-xs">
                    {result.binaryMask.map((octetBin, octIdx) => (
                      <div key={octIdx} className="flex gap-0.5 justify-center bg-white dark:bg-slate-900 p-2 rounded-lg border border-sky-100 dark:border-transparent shadow-2xs">
                        {octetBin.split('').map((bit, bitIdx) => {
                          const isOne = bit === '1';
                          return (
                            <span
                              key={bitIdx}
                              className={`w-4 h-6 flex items-center justify-center font-bold text-xs rounded-sm ${
                                isOne
                                  ? 'text-sky-700 bg-sky-100 font-bold dark:text-cyan-400 dark:bg-cyan-950/80'
                                  : 'text-slate-400 bg-slate-100 dark:text-slate-600 dark:bg-slate-950'
                              }`}
                            >
                              {bit}
                            </span>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Network Address Binary */}
                <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30">
                  <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-400 mb-2">
                    <span>Resulting Network (IP AND Mask): <strong className="text-slate-900 dark:text-white font-mono">{result.networkAddress}</strong></span>
                    <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-300">Host Bits Cleared to 0</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 font-mono text-xs">
                    {result.binaryNetwork.map((octetBin, octIdx) => (
                      <div key={octIdx} className="flex gap-0.5 justify-center bg-white dark:bg-slate-900 p-2 rounded-lg border border-emerald-150 dark:border-transparent shadow-2xs">
                        {octetBin.split('').map((bit, bitIdx) => {
                          const globalBitIndex = octIdx * 8 + bitIdx;
                          const isNet = globalBitIndex < result.cidr;
                          return (
                            <span
                              key={bitIdx}
                              className={`w-4 h-6 flex items-center justify-center font-bold text-xs rounded-sm ${
                                isNet
                                  ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/60'
                                  : 'text-slate-400 bg-slate-100 dark:text-slate-600 dark:bg-slate-950'
                              }`}
                            >
                              {bit}
                            </span>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
