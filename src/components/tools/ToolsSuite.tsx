import React, { useState } from 'react';
import { 
  Calculator, 
  Sliders, 
  Grid, 
  Network, 
  Search, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  Zap, 
  Copy, 
  Check, 
  RefreshCw, 
  ShieldCheck, 
  HelpCircle,
  Binary,
  ArrowRight,
  Globe
} from 'lucide-react';
import { calculateIPv4, cidrToMask, validateIPv4 } from '../../network-engine/ipv4';
import { calculateIPv6, validateIPv6, expandIPv6, compressIPv6 } from '../../network-engine/ipv6';
import { summarizeRoutes } from '../../network-engine/supernetting';
import { detectSubnetOverlaps } from '../../network-engine/overlap';
import { calculateFlsm } from '../../network-engine/flsm';
import { COMMON_PORTS, PortInfo } from '../../network-engine/ports';
import { runNetworkEngineTests, TestResult } from '../../network-engine/tests';
import { CidrSliderVisualizer } from '../calculator/CidrSliderVisualizer';
import { BinaryConverter } from '../binary/BinaryConverter';
import { VlsmLab } from '../vlsm/VlsmLab';
import { useApp } from '../../context/AppContext';

type ToolTab = 
  | 'ipv4' 
  | 'ipv6' 
  | 'cidr-slider' 
  | 'vlsm' 
  | 'flsm' 
  | 'supernetting' 
  | 'overlap' 
  | 'ports' 
  | 'binary'
  | 'unit-tests';

export const ToolsSuite: React.FC = () => {
  const { addXp } = useApp();
  const [activeTool, setActiveTool] = useState<ToolTab>('ipv4');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  // 1. IPv4 Calculator State
  const [ipv4Input, setIpv4Input] = useState('192.168.1.100');
  const [ipv4Cidr, setIpv4Cidr] = useState(26);
  const ipv4Val = validateIPv4(ipv4Input);
  const ipv4Result = ipv4Val.valid ? calculateIPv4(ipv4Input, ipv4Cidr) : null;

  // 2. IPv6 Calculator State
  const [ipv6Input, setIpv6Input] = useState('2001:db8:85a3::8a2e:370:7334');
  const [ipv6Prefix, setIpv6Prefix] = useState(64);
  const ipv6Val = validateIPv6(ipv6Input);
  const ipv6Result = ipv6Val.valid ? calculateIPv6(ipv6Input, ipv6Prefix) : null;

  // 3. Supernetting State
  const [supernetInput, setSupernetInput] = useState('192.168.0.0/24\n192.168.1.0/24\n192.168.2.0/24\n192.168.3.0/24');
  const supernetResult = summarizeRoutes(supernetInput.split('\n'));

  // 4. Overlap Detector State
  const [overlapInput, setOverlapInput] = useState('10.0.0.0/24\n10.0.0.128/25\n192.168.1.0/24\n192.168.2.0/23');
  const overlapResult = detectSubnetOverlaps(overlapInput.split('\n'));

  // 5. FLSM Calculator State
  const [flsmBase, setFlsmBase] = useState('192.168.10.0');
  const [flsmBaseCidr, setFlsmBaseCidr] = useState(24);
  const [flsmMode, setFlsmMode] = useState<'by-subnets' | 'by-hosts'>('by-subnets');
  const [flsmTarget, setFlsmTarget] = useState(4);
  const flsmResult = calculateFlsm(flsmBase, flsmBaseCidr, flsmMode, flsmTarget);

  // 6. Port Explorer Search
  const [portSearch, setPortSearch] = useState('');
  const filteredPorts = COMMON_PORTS.filter((p) => {
    const q = portSearch.toLowerCase();
    return (
      p.port.toString().includes(q) ||
      p.service.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  // 7. Unit Tests Runner State
  const [testSuiteResults, setTestSuiteResults] = useState<ReturnType<typeof runNetworkEngineTests> | null>(() => runNetworkEngineTests());

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-indigo-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Calculator className="w-4 h-4" />
          <span>Professional Network Suite</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Networking Calculators & Engineering Tools
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Deterministic mathematical tools for IPv4, IPv6, Supernetting, FLSM, Subnet Overlap Detection, Port Reference, and Automated Unit Tests.
        </p>
      </div>

      {/* Tool Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-indigo-100/80 dark:border-slate-800 pb-3">
        {[
          { id: 'ipv4', label: 'IPv4 Subnet Calculator', icon: <Calculator className="w-4 h-4" /> },
          { id: 'ipv6', label: 'IPv6 & Prefix Calculator', icon: <Globe className="w-4 h-4" /> },
          { id: 'cidr-slider', label: 'CIDR Prefix Slider', icon: <Sliders className="w-4 h-4" /> },
          { id: 'vlsm', label: 'VLSM Designer', icon: <Grid className="w-4 h-4" /> },
          { id: 'flsm', label: 'FLSM Division Tool', icon: <Layers className="w-4 h-4" /> },
          { id: 'supernetting', label: 'Route Summarizer', icon: <Network className="w-4 h-4" /> },
          { id: 'overlap', label: 'Subnet Overlap Detector', icon: <ShieldCheck className="w-4 h-4" /> },
          { id: 'ports', label: 'Port Reference Matrix', icon: <FileText className="w-4 h-4" /> },
          { id: 'binary', label: '8-Bit Binary Switchboard', icon: <Binary className="w-4 h-4" /> },
          { id: 'unit-tests', label: 'Math Engine Unit Tests', icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTool(tab.id as ToolTab);
              addXp(5);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTool === tab.id
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-indigo-900 dark:hover:text-white border border-indigo-100/80 dark:border-slate-800 hover:bg-indigo-50/50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TOOL 1: IPv4 CALCULATOR */}
      {activeTool === 'ipv4' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-8 space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">IPv4 Address:</label>
                <input
                  type="text"
                  value={ipv4Input}
                  onChange={(e) => setIpv4Input(e.target.value.trim())}
                  className="w-full px-3.5 py-2 rounded-xl bg-sky-50/50 dark:bg-slate-950 font-mono text-sm border border-sky-200 dark:border-slate-800 focus:outline-none focus:border-sky-500"
                />
                {!ipv4Val.valid && <p className="text-xs text-rose-500 mt-1">{ipv4Val.error}</p>}
              </div>

              <div className="sm:col-span-4 space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Prefix (/0 - /32):</label>
                <select
                  value={ipv4Cidr}
                  onChange={(e) => setIpv4Cidr(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 rounded-xl bg-sky-50/50 dark:bg-slate-950 font-mono text-sm border border-sky-200 dark:border-slate-800 focus:outline-none focus:border-sky-500"
                >
                  {Array.from({ length: 33 }, (_, i) => 32 - i).map((p) => (
                    <option key={p} value={p}>
                      /{p} — {cidrToMask(p)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-sky-100 dark:border-slate-800/80 text-xs">
              <span className="text-slate-400">Presets:</span>
              {[
                { label: 'LAN (/24)', ip: '192.168.1.100', cidr: 24 },
                { label: 'Subnet (/26)', ip: '192.168.1.100', cidr: 26 },
                { label: 'WAN Link (/30)', ip: '10.0.0.5', cidr: 30 },
                { label: 'Point-to-Point (/31 RFC 3021)', ip: '172.16.1.0', cidr: 31 },
                { label: 'Single Host (/32)', ip: '127.0.0.1', cidr: 32 },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => {
                    setIpv4Input(p.ip);
                    setIpv4Cidr(p.cidr);
                  }}
                  className="px-2.5 py-0.5 rounded-lg bg-sky-50 dark:bg-slate-800 text-sky-800 dark:text-slate-200 border border-sky-200/60 dark:border-slate-700 text-[11px]"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Grid */}
          {ipv4Result && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl border border-sky-150 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-1">
                <span className="text-[11px] text-slate-500 uppercase font-semibold">Network Address</span>
                <div className="text-base font-mono font-bold text-sky-700 dark:text-cyan-400 flex items-center justify-between">
                  <span>{ipv4Result.networkAddress}</span>
                  <button onClick={() => handleCopy(ipv4Result.networkAddress, 'net')} className="p-1 text-slate-400 hover:text-slate-700">
                    {copiedKey === 'net' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <span className="text-[11px] text-slate-400 block font-mono">/{ipv4Result.cidr} Prefix</span>
              </div>

              <div className="p-4 rounded-2xl border border-sky-150 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-1">
                <span className="text-[11px] text-slate-500 uppercase font-semibold">Subnet Mask</span>
                <div className="text-base font-mono font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>{ipv4Result.subnetMask}</span>
                  <button onClick={() => handleCopy(ipv4Result.subnetMask, 'mask')} className="p-1 text-slate-400 hover:text-slate-700">
                    {copiedKey === 'mask' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <span className="text-[11px] text-slate-400 block font-mono">Wildcard: {ipv4Result.wildcardMask}</span>
              </div>

              <div className="p-4 rounded-2xl border border-sky-150 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-1">
                <span className="text-[11px] text-slate-500 uppercase font-semibold">Usable Host Range</span>
                <div className="text-xs font-mono font-bold text-slate-900 dark:text-white truncate">
                  {ipv4Result.firstUsableHost} - {ipv4Result.lastUsableHost}
                </div>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block">
                  {ipv4Result.usableHosts.toLocaleString()} Usable Hosts
                </span>
              </div>

              <div className="p-4 rounded-2xl border border-sky-150 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-1">
                <span className="text-[11px] text-slate-500 uppercase font-semibold">Broadcast & Scope</span>
                <div className="text-base font-mono font-bold text-amber-600 dark:text-amber-400">
                  {ipv4Result.broadcastAddress}
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-cyan-950 dark:text-cyan-300 font-semibold inline-block">
                  {ipv4Result.ipType}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 2: IPv6 CALCULATOR */}
      {activeTool === 'ipv6' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-8 space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">IPv6 Address:</label>
                <input
                  type="text"
                  value={ipv6Input}
                  onChange={(e) => setIpv6Input(e.target.value.trim())}
                  placeholder="e.g. 2001:db8::1"
                  className="w-full px-3.5 py-2 rounded-xl bg-sky-50/50 dark:bg-slate-950 font-mono text-sm border border-sky-200 dark:border-slate-800 focus:outline-none focus:border-sky-500"
                />
                {!ipv6Val.valid && <p className="text-xs text-rose-500 mt-1">{ipv6Val.error}</p>}
              </div>

              <div className="sm:col-span-4 space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Prefix (/1 to /128):</label>
                <input
                  type="number"
                  min="1"
                  max="128"
                  value={ipv6Prefix}
                  onChange={(e) => setIpv6Prefix(parseInt(e.target.value, 10) || 64)}
                  className="w-full px-3 py-2 rounded-xl bg-sky-50/50 dark:bg-slate-950 font-mono text-sm border border-sky-200 dark:border-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-sky-100 dark:border-slate-800/80 text-xs">
              <span className="text-slate-400">Presets:</span>
              {[
                { label: 'Documentation (2001:db8::1)', ip: '2001:db8::1', prefix: 64 },
                { label: 'Google DNS (2001:4860:4860::8888)', ip: '2001:4860:4860::8888', prefix: 64 },
                { label: 'Link-Local (fe80::1)', ip: 'fe80::1', prefix: 64 },
                { label: 'Unique Local (fc00::1)', ip: 'fc00::1', prefix: 64 },
                { label: 'Loopback (::1)', ip: '::1', prefix: 128 },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => {
                    setIpv6Input(p.ip);
                    setIpv6Prefix(p.prefix);
                  }}
                  className="px-2.5 py-0.5 rounded-lg bg-sky-50 dark:bg-slate-800 text-sky-800 dark:text-slate-200 border border-sky-200/60 dark:border-slate-700 text-[11px]"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* IPv6 Details */}
          {ipv6Result && (
            <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-sky-50/60 dark:bg-slate-950 border border-sky-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px]">RFC 5952 Canonical Compressed:</span>
                  <div className="text-sm font-bold text-sky-800 dark:text-cyan-400">{ipv6Result.compressed}</div>
                </div>

                <div className="p-3 rounded-xl bg-sky-50/60 dark:bg-slate-950 border border-sky-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px]">Address Classification:</span>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{ipv6Result.type}</div>
                  <span className="text-[11px] text-slate-400 font-sans">Scope: {ipv6Result.scope}</span>
                </div>

                <div className="sm:col-span-2 p-3 rounded-xl bg-sky-50/60 dark:bg-slate-950 border border-sky-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px]">Fully Expanded Format (8 hextets):</span>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-200 break-all">{ipv6Result.expanded}</div>
                </div>

                <div className="sm:col-span-2 p-3 rounded-xl bg-sky-50/60 dark:bg-slate-950 border border-sky-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px]">Reverse DNS PTR (ip6.arpa):</span>
                  <div className="text-[11px] text-purple-700 dark:text-purple-300 break-all">{ipv6Result.reverseDnsArpa}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 3: CIDR SLIDER */}
      {activeTool === 'cidr-slider' && <CidrSliderVisualizer />}

      {/* TOOL 4: VLSM DESIGNER */}
      {activeTool === 'vlsm' && <VlsmLab />}

      {/* TOOL 5: FLSM DIVISION TOOL */}
      {activeTool === 'flsm' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">Major Network IP:</label>
                <input
                  type="text"
                  value={flsmBase}
                  onChange={(e) => setFlsmBase(e.target.value.trim())}
                  className="w-full px-3 py-2 rounded-xl bg-sky-50/50 dark:bg-slate-950 font-mono text-xs border border-sky-200 dark:border-slate-800"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">Major Network CIDR:</label>
                <select
                  value={flsmBaseCidr}
                  onChange={(e) => setFlsmBaseCidr(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 rounded-xl bg-sky-50/50 dark:bg-slate-950 font-mono text-xs border border-sky-200 dark:border-slate-800"
                >
                  {[8, 16, 20, 22, 24, 25, 26, 27, 28].map((c) => (
                    <option key={c} value={c}>/{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">Divide Mode:</label>
                <select
                  value={flsmMode}
                  onChange={(e) => setFlsmMode(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-sky-50/50 dark:bg-slate-950 text-xs border border-sky-200 dark:border-slate-800"
                >
                  <option value="by-subnets">By Number of Subnets Needed</option>
                  <option value="by-hosts">By Hosts Per Subnet Needed</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">
                  {flsmMode === 'by-subnets' ? 'Target Subnets Count:' : 'Target Hosts Count:'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={flsmTarget}
                  onChange={(e) => setFlsmTarget(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 rounded-xl bg-sky-50/50 dark:bg-slate-950 font-mono text-xs border border-sky-200 dark:border-slate-800 font-bold"
                />
              </div>
            </div>
          </div>

          {/* FLSM Results Table */}
          {flsmResult.valid && (
            <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-sky-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Created Subnets: </span>
                  <span className="font-mono text-sky-700 dark:text-cyan-400 font-bold">{flsmResult.totalSubnetsCreated} subnets</span>
                  <span className="text-slate-400 ml-2">(/{flsmResult.newCidr} — {flsmResult.newMask})</span>
                </div>
                <div className="text-slate-500">
                  Borrowed Bits: <strong className="text-slate-800 dark:text-slate-200 font-mono">{flsmResult.borrowedBits}</strong> | Usable Hosts/Subnet: <strong className="text-emerald-600 font-mono">{flsmResult.hostsPerSubnet}</strong>
                </div>
              </div>

              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-sky-100 dark:border-slate-800 text-slate-500 font-mono text-[11px] uppercase">
                      <th className="py-2 px-3">#</th>
                      <th className="py-2 px-3">Network IP</th>
                      <th className="py-2 px-3">Usable Host Range</th>
                      <th className="py-2 px-3">Broadcast</th>
                      <th className="py-2 px-3 text-right">Hosts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-100/60 dark:divide-slate-800/60 font-mono text-[11px]">
                    {flsmResult.subnets.map((sub) => (
                      <tr key={sub.index} className="hover:bg-sky-50/40 dark:hover:bg-slate-950/40">
                        <td className="py-2.5 px-3 text-slate-400">{sub.index}</td>
                        <td className="py-2.5 px-3 font-bold text-sky-800 dark:text-cyan-400">{sub.network}/{sub.cidr}</td>
                        <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{sub.firstHost} - {sub.lastHost}</td>
                        <td className="py-2.5 px-3 text-amber-600 dark:text-amber-400">{sub.broadcast}</td>
                        <td className="py-2.5 px-3 text-right text-emerald-600 font-bold">{sub.usableCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 6: SUPERNETTING & ROUTE SUMMARIZATION */}
      {activeTool === 'supernetting' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Enter Routes to Summarize (One IP or CIDR per line):
              </label>
              <textarea
                rows={5}
                value={supernetInput}
                onChange={(e) => setSupernetInput(e.target.value)}
                className="w-full p-3 rounded-xl bg-sky-50/50 dark:bg-slate-950 font-mono text-xs border border-sky-200 dark:border-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {supernetResult.valid && (
            <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-sky-100 dark:border-slate-800">
                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold">Summary Route:</span>
                  <div className="text-xl font-mono font-bold text-sky-700 dark:text-cyan-400">
                    {supernetResult.summaryRoute}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 uppercase font-semibold">Summary Subnet Mask:</span>
                  <div className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200">
                    {supernetResult.summaryMask}
                  </div>
                </div>
              </div>

              {/* Bit matching visualization */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Binary Bit Matching:</span>
                <div className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs space-y-1 overflow-x-auto">
                  {supernetResult.binaryComparison.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="w-36 text-slate-400 truncate">{item.route}</span>
                      <span>
                        <strong className="text-emerald-400">{item.binary.slice(0, supernetResult.summaryCidr)}</strong>
                        <span className="text-slate-600">{item.binary.slice(supernetResult.summaryCidr)}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 7: SUBNET OVERLAP DETECTOR */}
      {activeTool === 'overlap' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Enter Subnet Blocks to Analyze (One CIDR per line):
              </label>
              <textarea
                rows={5}
                value={overlapInput}
                onChange={(e) => setOverlapInput(e.target.value)}
                className="w-full p-3 rounded-xl bg-sky-50/50 dark:bg-slate-950 font-mono text-xs border border-sky-200 dark:border-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sky-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                {overlapResult.hasOverlaps ? (
                  <span className="flex items-center gap-1.5 text-rose-600 font-bold">
                    <XCircle className="w-4 h-4" />
                    <span>Collisions Detected! ({overlapResult.collisions.length} overlaps found)</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>No Overlaps. All {overlapResult.subnets.length} subnets are completely isolated.</span>
                  </span>
                )}
              </div>
            </div>

            {overlapResult.collisions.map((c, i) => (
              <div key={i} className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-xs space-y-1">
                <div className="font-bold text-rose-900 dark:text-rose-300">
                  Collision #{i + 1}: {c.subnetA} ⚔️ {c.subnetB} ({c.type})
                </div>
                <p className="text-rose-700 dark:text-rose-400 font-mono text-[11px]">{c.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOOL 8: PORT REFERENCE MATRIX */}
      {activeTool === 'ports' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={portSearch}
                onChange={(e) => setPortSearch(e.target.value)}
                placeholder="Search ports by number (e.g. 443, 53, 22), protocol, or service..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-sky-50/50 dark:bg-slate-950 text-xs border border-sky-200 dark:border-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPorts.map((port) => (
              <div key={port.port} className="p-4 rounded-2xl border border-sky-150 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-800 dark:bg-cyan-950 dark:text-cyan-300 font-mono font-bold text-sm">
                    Port {port.port}
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 font-semibold">
                    {port.protocol}
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">{port.service}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{port.description}</p>
                </div>
                {port.securityNote && (
                  <div className="text-[10px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-lg border border-amber-200/60">
                    Security: {port.securityNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOOL 9: 8-BIT BINARY CONVERTER */}
      {activeTool === 'binary' && <BinaryConverter />}

      {/* TOOL 10: AUTOMATED TEST SUITE */}
      {activeTool === 'unit-tests' && testSuiteResults && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>Deterministic Math Engine Verification</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated test runner testing IPv4 boundaries, /31, /32, /0, IPv6 expansion/compression, route summarization, and overlaps.
                </p>
              </div>
              <button
                onClick={() => setTestSuiteResults(runNetworkEngineTests())}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-500 transition-colors shadow-2xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-run Tests</span>
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono font-bold">
              <span className="text-emerald-600">Passed: {testSuiteResults.passedCount} / {testSuiteResults.total}</span>
              <span className="text-slate-400">Failed: {testSuiteResults.failedCount}</span>
            </div>

            <div className="divide-y divide-sky-100 dark:divide-slate-800 text-xs font-mono">
              {testSuiteResults.results.map((res, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {res.passed ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-500" />}
                    <span className="text-slate-800 dark:text-slate-200">{res.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Expected: <strong className="text-slate-700 dark:text-slate-300">{res.expected}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
