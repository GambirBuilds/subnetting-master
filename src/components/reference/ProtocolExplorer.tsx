import React, { useState } from 'react';
import { 
  Network, 
  Search, 
  Layers, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  FileText, 
  Lock,
  ChevronRight
} from 'lucide-react';
import { PROTOCOL_ENCYCLOPEDIA, ProtocolDoc } from '../../network-engine/protocols';
import { useApp } from '../../context/AppContext';

export const ProtocolExplorer: React.FC = () => {
  const { addXp } = useApp();
  const [selectedProtocolId, setSelectedProtocolId] = useState<string>('tcp');
  const [searchFilter, setSearchFilter] = useState('');

  const activeDoc = PROTOCOL_ENCYCLOPEDIA.find((p) => p.id === selectedProtocolId) || PROTOCOL_ENCYCLOPEDIA[0];

  const filteredList = PROTOCOL_ENCYCLOPEDIA.filter((p) => {
    const q = searchFilter.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.acronym.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-sky-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Network className="w-4 h-4" />
          <span>Interactive Protocol Encyclopedia</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Protocol Explorer & Packet Architecture
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Deconstruct TCP 3-way handshakes, DHCP DORA exchanges, ARP resolutions, packet header bit layouts, and vulnerabilities.
        </p>
      </div>

      {/* Grid Layout: Protocol Sidebar & Deep-Dive Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Protocol List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search protocols (TCP, DHCP, ARP)..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-sky-50/50 dark:bg-slate-950 text-xs border border-sky-200 dark:border-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="space-y-1">
              {filteredList.map((proto) => {
                const isActive = proto.id === activeDoc.id;
                return (
                  <button
                    key={proto.id}
                    onClick={() => {
                      setSelectedProtocolId(proto.id);
                      addXp(10, 'Explored protocol details');
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors text-xs ${
                      isActive
                        ? 'bg-sky-600 text-white font-bold shadow-2xs'
                        : 'hover:bg-sky-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        <span>{proto.acronym}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isActive ? 'bg-sky-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                          {proto.defaultPorts.split(' ')[0]}
                        </span>
                      </div>
                      <div className={`text-[11px] truncate max-w-[200px] ${isActive ? 'text-sky-100' : 'text-slate-500'}`}>
                        {proto.name}
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Protocol Details Canvas */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm space-y-6">
            {/* Header metadata */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-sky-700 dark:text-cyan-400 font-bold uppercase tracking-wider">
                  {activeDoc.osiLayer}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {activeDoc.name} ({activeDoc.acronym})
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-sky-100 dark:bg-cyan-950 border border-sky-200 dark:border-cyan-500/30 text-sky-800 dark:text-cyan-300 font-mono text-xs font-bold">
                  Ports: {activeDoc.defaultPorts}
                </span>
              </div>
            </div>

            {/* Purpose */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Protocol Purpose:</span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeDoc.purpose}
              </p>
            </div>

            {/* Step-by-Step Communication Flow */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Communication Flow Sequence:
              </span>
              <div className="space-y-2">
                {activeDoc.flowSteps.map((step) => (
                  <div key={step.step} className="p-3 rounded-xl bg-sky-50/60 dark:bg-slate-950 border border-sky-150 dark:border-slate-800 flex items-start gap-3 text-xs">
                    <span className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center font-mono font-bold shrink-0 text-xs">
                      {step.step}
                    </span>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-slate-900 dark:text-white">{step.title}</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Packet Header Fields Layout */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Key Header Fields & Architecture:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {activeDoc.headerFields.map((field, i) => (
                  <div key={i} className="p-2.5 rounded-xl border border-sky-150 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-0.5">
                    <div className="flex items-center justify-between text-slate-900 dark:text-slate-200 font-bold">
                      <span>{field.field}</span>
                      <span className="text-sky-700 dark:text-cyan-400 text-[11px]">{field.bits}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-sans leading-normal">{field.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Callout */}
            <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/30 text-xs flex items-start gap-3">
              <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-amber-900 dark:text-amber-300">Security & Hardening Considerations:</div>
                <p className="text-amber-950 dark:text-amber-200 text-[11px] mt-0.5 leading-relaxed">
                  {activeDoc.securityNotes}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
