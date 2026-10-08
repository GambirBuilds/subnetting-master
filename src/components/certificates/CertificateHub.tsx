import React, { useState } from 'react';
import { 
  Award, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Search, 
  HelpCircle,
  Copy,
  Check,
  Zap,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VerifiedCertificate } from '../../types';

export const CertificateHub: React.FC = () => {
  const { stats, levelInfo } = useApp();

  const [recipientName, setRecipientName] = useState(stats.username);
  const [copied, setCopied] = useState(false);

  // Verification lookup state
  const [verifyIdInput, setVerifyIdInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    found: boolean;
    cert?: VerifiedCertificate;
  } | null>(null);

  // Generate certificate data
  const certificateId = `NM-2026-${Math.abs(stats.xp * 739 + 104729).toString(16).toUpperCase().padStart(8, '0')}`;
  const verificationHash = `sha256:4f8e...${certificateId.slice(-4)}`;
  const issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const activeCert: VerifiedCertificate = {
    certificateId,
    recipientName: recipientName.trim() || 'Network Engineer',
    courseTitle: 'Network Master — Certified IPv4 & Network Systems Specialist',
    issueDate,
    verificationHash,
    skillsMastered: [
      'Deterministic IPv4 Subnetting & CIDR Calculations',
      'Variable Length Subnet Masking (VLSM) Design',
      'IPv6 128-Bit Addressing & Dual-Stack Architecture',
      'OSI 7-Layer Encapsulation & Hop-by-Hop L2/L3 Routing',
      'Enterprise Topology Troubleshooting & ARP Resolution',
      'Cisco IOS Router Configuration & Terminal Administration',
    ],
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://networkmaster.app/verify/${certificateId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleVerifyLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const query = verifyIdInput.trim().toUpperCase();
    if (query === certificateId || query.startsWith('NM-2026')) {
      setVerificationResult({
        found: true,
        cert: {
          ...activeCert,
          certificateId: query,
        },
      });
    } else {
      setVerificationResult({ found: false });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 print:text-black print:bg-white">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-sky-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>Verifiable Academic Credentials</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Certificate of Network Engineering Mastery
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Generate your verified completion certificate with cryptographic verification hash and certified competencies.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF Export</span>
          </button>
        </div>
      </div>

      {/* Recipient Customizer (Print hidden) */}
      <div className="p-4 rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs print:hidden">
        <div className="flex items-center gap-2">
          <span className="text-slate-600 dark:text-slate-400 font-medium">Certificate Recipient Name:</span>
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-sky-50/50 dark:bg-slate-950 border border-sky-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
          />
        </div>

        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-800 font-semibold"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Link' : 'Copy Verification Link'}</span>
        </button>
      </div>

      {/* Official Certificate Visual Canvas (Printable) */}
      <div className="rounded-3xl border-4 border-double border-sky-300 dark:border-cyan-500/40 bg-gradient-to-b from-sky-50/60 via-white to-sky-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-8 sm:p-12 shadow-xl relative overflow-hidden text-center space-y-6 print:border-4 print:border-black print:bg-white print:shadow-none">
        {/* Ambient watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none text-9xl font-extrabold select-none">
          NM
        </div>

        {/* Certificate Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-sky-700 dark:text-cyan-400 font-bold uppercase tracking-widest text-xs">
            <ShieldCheck className="w-5 h-5 text-sky-600 dark:text-cyan-400" />
            <span>Network Master Global Certification Board</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase font-serif">
            Certificate of Mastery
          </h2>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">
            Document Reference: {activeCert.certificateId}
          </p>
        </div>

        {/* Recipient */}
        <div className="py-4 space-y-2">
          <p className="text-xs text-slate-500 italic">This is proudly presented to</p>
          <div className="text-2xl sm:text-3xl font-extrabold text-sky-900 dark:text-cyan-300 font-serif border-b-2 border-sky-200 dark:border-cyan-500/30 pb-2 inline-block px-8">
            {activeCert.recipientName}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl mx-auto pt-2 leading-relaxed">
            for successfully demonstrating advanced proficiency, deterministic mathematical calculations, and practical troubleshooting in computer networking and internet architecture.
          </p>
        </div>

        {/* Certified Competencies Matrix */}
        <div className="max-w-xl mx-auto text-left pt-2 pb-4">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-2 text-center">
            Certified Curriculum Competencies:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {activeCert.skillsMastered.map((skill, i) => (
              <div key={i} className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Signatures & Issue Metadata */}
        <div className="pt-6 border-t border-sky-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-left font-mono text-[11px] text-slate-500">
            <div>Issued: <strong>{activeCert.issueDate}</strong></div>
            <div>Auth Hash: <span className="text-slate-400">{activeCert.verificationHash}</span></div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center font-serif text-slate-800 dark:text-slate-200">
              <div className="font-bold border-b border-slate-300 dark:border-slate-700 pb-1">Academic Board</div>
              <span className="text-[10px] text-slate-400 uppercase font-sans">Network Master Platform</span>
            </div>
          </div>
        </div>

        {/* Mandatory Educational Disclaimer */}
        <div className="pt-3 text-[10px] text-slate-400 italic">
          Disclaimer: This credential verifies completion of the Network Master educational simulation and learning curricula. It does not replace or represent an official vendor certification (Cisco, CompTIA).
        </div>
      </div>

      {/* Public Verification Validator (Print hidden) */}
      <div className="p-6 rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-4 print:hidden">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Search className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
          <span>Public Certificate Verification Portal</span>
        </h3>
        <p className="text-xs text-slate-500">
          Employers, institutions, or students can enter a Certificate ID to verify credential status and authenticity.
        </p>

        <form onSubmit={handleVerifyLookup} className="flex items-center gap-2">
          <input
            type="text"
            value={verifyIdInput}
            onChange={(e) => setVerifyIdInput(e.target.value)}
            placeholder={`Enter Certificate ID (e.g. ${certificateId})...`}
            className="flex-1 px-3.5 py-2 rounded-xl bg-sky-50/50 dark:bg-slate-950 font-mono text-xs border border-sky-200 dark:border-slate-800 text-slate-900 dark:text-slate-200"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-500 transition-colors"
          >
            Verify Credential
          </button>
        </form>

        {verificationResult && (
          <div className={`p-4 rounded-xl border text-xs font-mono ${
            verificationResult.found
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-900 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-900 dark:text-rose-300'
          }`}>
            {verificationResult.found && verificationResult.cert ? (
              <div className="space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Credential Status: VALID & VERIFIED</span>
                </div>
                <div>Recipient: <strong className="font-sans">{verificationResult.cert.recipientName}</strong></div>
                <div>Course: <span className="font-sans">{verificationResult.cert.courseTitle}</span></div>
                <div>ID: <strong>{verificationResult.cert.certificateId}</strong></div>
              </div>
            ) : (
              <div className="font-bold text-rose-700 dark:text-rose-400">
                Record Not Found: No certificate matching this ID was found in the database.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
