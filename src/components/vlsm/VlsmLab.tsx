import React, { useState } from 'react';
import { Grid, Plus, Trash2, CheckCircle2, AlertCircle, RefreshCw, BarChart2, ShieldCheck, Info } from 'lucide-react';
import { VlsmDepartment } from '../../types';
import { calculateVlsm, cidrToMask, validateIPv4 } from '../../utils/subnet';
import { useApp } from '../../context/AppContext';
import vlsmImg from '../../assets/images/vlsm_topology_diagram_1791198481000.jpg';

export const VlsmLab: React.FC = () => {
  const { addXp, unlockBadge } = useApp();

  const [baseNetwork, setBaseNetwork] = useState<string>('192.168.10.0');
  const [baseCidr, setBaseCidr] = useState<number>(24);

  const [departments, setDepartments] = useState<VlsmDepartment[]>([
    { id: 'dept-1', name: 'Engineering & R&D', neededHosts: 100 },
    { id: 'dept-2', name: 'Sales & Marketing', neededHosts: 50 },
    { id: 'dept-3', name: 'Finance & Legal', neededHosts: 25 },
    { id: 'dept-4', name: 'Guest & Operations', neededHosts: 10 },
    { id: 'dept-5', name: 'WAN Link to HQ', neededHosts: 2 },
  ]);

  const [newDeptName, setNewDeptName] = useState<string>('');
  const [newDeptHosts, setNewDeptHosts] = useState<string>('15');

  const baseValidation = validateIPv4(baseNetwork);
  const isValidBase = baseValidation.valid;

  const result = isValidBase
    ? calculateVlsm(baseNetwork, baseCidr, departments)
    : { success: false, allocations: [], totalNeeded: 0, totalAllocated: 0, totalAvailable: 0, error: baseValidation.error };

  const addDepartment = () => {
    const hosts = parseInt(newDeptHosts, 10);
    if (!newDeptName.trim() || isNaN(hosts) || hosts <= 0) return;

    setDepartments((prev) => [
      ...prev,
      {
        id: `dept-${Date.now()}`,
        name: newDeptName.trim(),
        neededHosts: hosts,
      },
    ]);
    setNewDeptName('');
    setNewDeptHosts('15');
    addXp(10);
  };

  const removeDepartment = (id: string) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  };

  const loadScenario = (type: 'corp' | 'branch' | 'wan') => {
    if (type === 'corp') {
      setBaseNetwork('192.168.10.0');
      setBaseCidr(24);
      setDepartments([
        { id: '1', name: 'Engineering', neededHosts: 100 },
        { id: '2', name: 'Sales', neededHosts: 50 },
        { id: '3', name: 'Finance', neededHosts: 25 },
        { id: '4', name: 'Executive', neededHosts: 10 },
        { id: '5', name: 'Router Link', neededHosts: 2 },
      ]);
    } else if (type === 'branch') {
      setBaseNetwork('10.50.0.0');
      setBaseCidr(22);
      setDepartments([
        { id: '1', name: 'Customer Service', neededHosts: 400 },
        { id: '2', name: 'Call Center', neededHosts: 200 },
        { id: '3', name: 'Admin Staff', neededHosts: 50 },
        { id: '4', name: 'Security Cameras', neededHosts: 30 },
      ]);
    } else {
      setBaseNetwork('172.16.0.0');
      setBaseCidr(24);
      setDepartments([
        { id: '1', name: 'WAN Link Alpha', neededHosts: 2 },
        { id: '2', name: 'WAN Link Beta', neededHosts: 2 },
        { id: '3', name: 'WAN Link Gamma', neededHosts: 2 },
        { id: '4', name: 'Management VLAN', neededHosts: 20 },
      ]);
    }
    addXp(15);
  };

  // Color palette for visual allocation segments
  const segmentColors = [
    'bg-sky-500 text-white',
    'bg-indigo-600 text-white',
    'bg-emerald-600 text-white',
    'bg-amber-500 text-slate-950',
    'bg-purple-600 text-white',
    'bg-rose-500 text-white',
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Title & Banner */}
      <div className="relative rounded-2xl border border-sky-200/80 dark:border-slate-800 bg-gradient-to-r from-sky-500/10 via-sky-100/40 to-blue-50/20 dark:from-slate-900/60 dark:via-slate-900/60 dark:to-slate-900/60 overflow-hidden shadow-sm shadow-sky-100 p-6 sm:p-8">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 dark:opacity-25 pointer-events-none hidden md:block">
          <img
            src={vlsmImg}
            alt="VLSM Enterprise Topology"
            className="w-full h-full object-cover object-left"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent dark:from-slate-950 dark:via-slate-950/70 dark:to-transparent" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-sky-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Grid className="w-4 h-4" />
            <span>Advanced Subnet Design Lab</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            VLSM Design Lab & Address Space Planner
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Design real-world networks with Variable Length Subnet Masking. Allocate custom subnets, eliminate address waste, and visualize memory blocks.
          </p>
        </div>
      </div>

      {/* Major Network & Presets */}
      <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-8 space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Major Network Address Block:
            </label>
            <input
              type="text"
              value={baseNetwork}
              onChange={(e) => setBaseNetwork(e.target.value.trim())}
              className="w-full px-3.5 py-2.5 rounded-xl bg-sky-50/50 dark:bg-slate-950 font-mono text-sm text-slate-900 dark:text-cyan-300 border border-sky-200/80 dark:border-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </div>
          <div className="sm:col-span-4 space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Major Prefix (CIDR):
            </label>
            <select
              value={baseCidr}
              onChange={(e) => setBaseCidr(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2.5 rounded-xl bg-sky-50/50 dark:bg-slate-950 font-mono text-sm text-slate-800 dark:text-slate-200 border border-sky-200/80 dark:border-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            >
              {[16, 20, 22, 23, 24, 25, 26].map((c) => (
                <option key={c} value={c}>
                  /{c} ({Math.pow(2, 32 - c).toLocaleString()} total IPs)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-sky-100 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Scenario Presets:</span>
          <button
            onClick={() => loadScenario('corp')}
            className="px-2.5 py-1 text-xs rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-sky-800 dark:text-slate-200 border border-sky-200/60 dark:border-transparent transition-colors font-medium"
          >
            Corporate HQ (5 Subnets /24)
          </button>
          <button
            onClick={() => loadScenario('branch')}
            className="px-2.5 py-1 text-xs rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-sky-800 dark:text-slate-200 border border-sky-200/60 dark:border-transparent transition-colors font-medium"
          >
            Large Branch Office (/22)
          </button>
          <button
            onClick={() => loadScenario('wan')}
            className="px-2.5 py-1 text-xs rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-sky-800 dark:text-slate-200 border border-sky-200/60 dark:border-transparent transition-colors font-medium"
          >
            Point-to-Point WAN Links (/30s)
          </button>
        </div>
      </div>

      {/* Visual Address Space Allocation Bar */}
      {result.success && result.totalAvailable > 0 && (
        <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
              <span>Address Space Allocation Bar ({baseNetwork}/{baseCidr})</span>
            </div>
            <div className="text-slate-600 dark:text-slate-400 font-mono">
              Allocated: <span className="text-sky-700 dark:text-cyan-400 font-bold">{result.totalAllocated}</span> / {result.totalAvailable} IPs ({Math.round((result.totalAllocated / result.totalAvailable) * 100)}%)
            </div>
          </div>

          {/* Allocation Bar */}
          <div className="w-full h-8 rounded-xl bg-sky-100/60 dark:bg-slate-950 border border-sky-200/80 dark:border-slate-800 flex overflow-hidden p-0.5 shadow-inner">
            {result.allocations.map((alloc, idx) => {
              const blockSize = alloc.allocatedHosts + 2;
              const percent = (blockSize / result.totalAvailable) * 100;
              const colorClass = segmentColors[idx % segmentColors.length];
              return (
                <div
                  key={alloc.id}
                  style={{ width: `${percent}%` }}
                  className={`h-full ${colorClass} text-[10px] font-bold font-mono flex items-center justify-center px-1 truncate transition-all border-r border-white/20`}
                  title={`${alloc.name}: /${alloc.cidr} (${blockSize} addresses, ${alloc.neededHosts} needed)`}
                >
                  {percent > 6 ? alloc.name.split(' ')[0] : ''}
                </div>
              );
            })}
            {result.totalAllocated < result.totalAvailable && (
              <div
                style={{
                  width: `${((result.totalAvailable - result.totalAllocated) / result.totalAvailable) * 100}%`,
                }}
                className="h-full bg-slate-100 dark:bg-slate-800/40 text-slate-500 text-[10px] font-mono flex items-center justify-center italic"
                title={`${result.totalAvailable - result.totalAllocated} unused addresses remaining`}
              >
                Free Space ({result.totalAvailable - result.totalAllocated})
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-600 dark:text-slate-400">
            {result.allocations.map((alloc, idx) => (
              <div key={alloc.id} className="flex items-center gap-1.5 font-medium">
                <span className={`w-2.5 h-2.5 rounded-sm ${segmentColors[idx % segmentColors.length].split(' ')[0]}`} />
                <span>{alloc.name} (/{alloc.cidr})</span>
              </div>
            ))}
            {result.totalAllocated < result.totalAvailable && (
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-300 dark:bg-slate-800" />
                <span>Free Capacity</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Notice */}
      {!result.success && result.error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/40 flex items-start gap-3 text-rose-800 dark:text-rose-300 text-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-slate-900 dark:text-white">VLSM Allocation Error:</div>
            <p className="mt-0.5 leading-relaxed">{result.error}</p>
          </div>
        </div>
      )}

      {/* Departments Table & Subnet Allocation Plan */}
      <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sky-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Department Requirements</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              VLSM rule: System automatically sorts departments by largest host requirement first.
            </p>
          </div>

          {/* Quick Add Form */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Department Name"
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-sky-50/50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-200 border border-sky-200/80 dark:border-slate-800 focus:outline-none focus:border-sky-500 w-36"
            />
            <input
              type="number"
              placeholder="Hosts"
              min="1"
              value={newDeptHosts}
              onChange={(e) => setNewDeptHosts(e.target.value)}
              className="px-2 py-1.5 rounded-xl bg-sky-50/50 dark:bg-slate-950 text-xs font-mono text-sky-800 dark:text-cyan-300 border border-sky-200/80 dark:border-slate-800 focus:outline-none focus:border-sky-500 w-20 text-center font-bold"
            />
            <button
              onClick={addDepartment}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Results Allocation Table */}
        {result.success && result.allocations.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-sky-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px] tracking-wider bg-sky-50/40 dark:bg-transparent">
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-2 text-right">Needed</th>
                  <th className="py-2.5 px-2 text-center">Allocated Mask</th>
                  <th className="py-2.5 px-3 font-mono">Network IP</th>
                  <th className="py-2.5 px-3 font-mono">Usable Range</th>
                  <th className="py-2.5 px-3 font-mono">Broadcast</th>
                  <th className="py-2.5 px-2 text-right">Wasted</th>
                  <th className="py-2.5 px-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100/70 dark:divide-slate-800/60 font-mono">
                {result.allocations.map((alloc) => (
                  <tr key={alloc.id} className="hover:bg-sky-50/40 dark:hover:bg-slate-950/40 transition-colors">
                    <td className="py-3 px-3 font-sans font-semibold text-slate-900 dark:text-slate-200">
                      {alloc.name}
                    </td>
                    <td className="py-3 px-2 text-right text-slate-700 dark:text-slate-300">
                      {alloc.neededHosts}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 border border-sky-200 font-bold dark:bg-cyan-950/80 dark:text-cyan-300 dark:border-cyan-500/20">
                        /{alloc.cidr}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-sky-700 dark:text-cyan-400 font-bold">
                      {alloc.networkAddress}
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300 text-[11px]">
                      {alloc.firstUsableHost} - {alloc.lastUsableHost}
                    </td>
                    <td className="py-3 px-3 text-amber-600 dark:text-amber-400 font-bold">
                      {alloc.broadcastAddress}
                    </td>
                    <td className="py-3 px-2 text-right text-slate-500 dark:text-slate-400">
                      {alloc.wastedHosts}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <button
                        onClick={() => removeDepartment(alloc.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Delete department"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
