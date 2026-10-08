import React, { useState } from 'react';
import { FileText, Printer, Search, Zap, Key, Shield, HelpCircle } from 'lucide-react';
import { cidrToMask, cidrToWildcard } from '../../utils/subnet';

export const CheatSheet: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // CIDR prefixes from /8 to /32
  const prefixes = Array.from({ length: 25 }, (_, i) => 8 + i);

  const tableData = prefixes.map((cidr) => {
    const mask = cidrToMask(cidr);
    const wildcard = cidrToWildcard(cidr);
    const hostBits = 32 - cidr;
    const total = Math.pow(2, hostBits);
    const usable = cidr === 32 ? 1 : cidr === 31 ? 2 : Math.max(0, total - 2);

    let octet = Math.floor(cidr / 8) + 1;
    if (cidr === 32) octet = 4;
    if (octet > 4) octet = 4;

    const maskOctets = mask.split('.').map(Number);
    const blockSize = 256 - maskOctets[octet - 1];

    return {
      cidr: `/${cidr}`,
      mask,
      wildcard,
      blockSize,
      octet,
      total: total.toLocaleString(),
      usable: usable.toLocaleString(),
    };
  });

  const filteredData = tableData.filter((row) => {
    const query = searchTerm.toLowerCase();
    return (
      row.cidr.toLowerCase().includes(query) ||
      row.mask.toLowerCase().includes(query) ||
      row.blockSize.toString().includes(query) ||
      row.usable.toLowerCase().includes(query)
    );
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 print:text-black print:bg-white">
      {/* Title & Print Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1 print:hidden">
            <FileText className="w-4 h-4" />
            <span>Fast Quick Reference</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white print:text-black tracking-tight">
            Subnetting Cheat Sheet & Reference Matrix
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 print:text-gray-600">
            Comprehensive lookup tables for CIDR notation, subnet masks, block sizes, and powers of two.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-sky-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white text-xs font-bold transition-colors print:hidden shrink-0 border border-sky-200 dark:border-slate-700 shadow-2xs"
        >
          <Printer className="w-4 h-4 text-sky-600 dark:text-slate-400" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Mental Math Shortcuts Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-sky-150 dark:border-slate-800 bg-white dark:bg-slate-900/60 print:bg-gray-50 print:border-gray-300 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2 text-sky-700 dark:text-cyan-400 font-bold text-xs uppercase">
            <Zap className="w-4 h-4 text-sky-600" />
            <span>The Magic Number Rule</span>
          </div>
          <p className="text-xs text-slate-900 dark:text-slate-200 font-mono font-bold">
            Block Size = 256 - [Mask Octet]
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Subtract the subnet mask value in the interesting octet from 256 to find subnet increment multiples instantly.
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-sky-150 dark:border-slate-800 bg-white dark:bg-slate-900/60 print:bg-gray-50 print:border-gray-300 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase">
            <Key className="w-4 h-4 text-amber-600" />
            <span>Usable Hosts Formula</span>
          </div>
          <p className="text-xs text-slate-900 dark:text-slate-200 font-mono font-bold">
            Usable Hosts = 2^h - 2
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Where h = remaining host bits (32 - CIDR). Always subtract 2: one for Network ID and one for Broadcast ID.
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-sky-150 dark:border-slate-800 bg-white dark:bg-slate-900/60 print:bg-gray-50 print:border-gray-300 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Wildcard Inversion</span>
          </div>
          <p className="text-xs text-slate-900 dark:text-slate-200 font-mono font-bold">
            Wildcard = 255.255.255.255 - Mask
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Used in Cisco ACLs and OSPF. In the interesting octet, Wildcard is simply Block Size - 1.
          </p>
        </div>
      </div>

      {/* Search Bar for CIDR Table */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-sky-200 dark:border-slate-800 print:hidden shadow-2xs">
        <Search className="w-4 h-4 text-sky-600 dark:text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by prefix (e.g. /27), mask (e.g. 224), or block size (e.g. 32)..."
          className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* Main Subnetting Matrix Table */}
      <div className="rounded-2xl border border-sky-150 dark:border-slate-800 bg-white dark:bg-slate-900/60 print:border-gray-400 print:bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-sky-150 dark:border-slate-800 bg-sky-50/80 dark:bg-slate-950/60 print:bg-gray-100 text-slate-600 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider font-mono">
                <th className="py-3 px-4">CIDR</th>
                <th className="py-3 px-4">Subnet Mask</th>
                <th className="py-3 px-4">Wildcard</th>
                <th className="py-3 px-3 text-center">Block Size</th>
                <th className="py-3 px-3 text-right">Total IPs</th>
                <th className="py-3 px-4 text-right">Usable Hosts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100/70 dark:divide-slate-800/60 font-mono">
              {filteredData.map((row) => (
                <tr key={row.cidr} className="hover:bg-sky-50/50 dark:hover:bg-slate-950/40 print:hover:bg-transparent transition-colors">
                  <td className="py-2.5 px-4 font-bold text-sky-700 dark:text-cyan-400">
                    {row.cidr}
                  </td>
                  <td className="py-2.5 px-4 text-slate-800 dark:text-slate-200 font-medium">
                    {row.mask}
                  </td>
                  <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">
                    {row.wildcard}
                  </td>
                  <td className="py-2.5 px-3 text-center text-amber-600 dark:text-amber-400 font-bold">
                    {row.blockSize}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-300">
                    {row.total}
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {row.usable}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RFC 1918 Private IP Chart & Powers of 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Private IP Ranges */}
        <div className="p-5 rounded-2xl border border-sky-150 dark:border-slate-800 bg-white dark:bg-slate-900/60 print:bg-gray-50 print:border-gray-300 space-y-3 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">RFC 1918 Private Address Ranges</h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 rounded-xl bg-sky-50/50 print:bg-white border border-sky-150 print:border-gray-200">
              <div className="text-sky-700 dark:text-cyan-400 font-bold">10.0.0.0 — 10.255.255.255 (10.0.0.0/8)</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">1 Class A network · 16,777,214 hosts</div>
            </div>
            <div className="p-3 rounded-xl bg-sky-50/50 print:bg-white border border-sky-150 print:border-gray-200">
              <div className="text-sky-700 dark:text-cyan-400 font-bold">172.16.0.0 — 172.31.255.255 (172.16.0.0/12)</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">16 Class B networks · 1,048,574 hosts</div>
            </div>
            <div className="p-3 rounded-xl bg-sky-50/50 print:bg-white border border-sky-150 print:border-gray-200">
              <div className="text-sky-700 dark:text-cyan-400 font-bold">192.168.0.0 — 192.168.255.255 (192.168.0.0/16)</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">256 Class C networks · 65,534 hosts</div>
            </div>
          </div>
        </div>

        {/* Powers of 2 Reference */}
        <div className="p-5 rounded-2xl border border-sky-150 dark:border-slate-800 bg-white dark:bg-slate-900/60 print:bg-gray-50 print:border-gray-300 space-y-3 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Powers of 2 Lookup Chart</h3>
          <div className="grid grid-cols-4 gap-2 text-xs font-mono text-center">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((power) => (
              <div key={power} className="p-2.5 rounded-xl bg-sky-50/50 dark:bg-slate-950 print:bg-white border border-sky-150 dark:border-slate-800">
                <div className="text-[10px] text-slate-400">2^{power}</div>
                <div className="font-bold text-amber-600 dark:text-amber-400">
                  {Math.pow(2, power).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
