import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Laptop, 
  Layers, 
  Router, 
  Server, 
  ShieldCheck, 
  HelpCircle,
  Zap,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface JourneyHop {
  hopNumber: number;
  nodeName: string;
  nodeType: 'client' | 'switch' | 'router' | 'server';
  actionTitle: string;
  actionSummary: string;
  l7Payload: string;
  l4Segment: { protocol: string; srcPort: number; dstPort: number; flags?: string };
  l3Packet: { srcIp: string; dstIp: string; ttl: number; protocolNum: string };
  l2Frame: { srcMac: string; dstMac: string; ethType: string; vlan?: string };
  layerFocus: 'Application' | 'Transport' | 'Network' | 'Data Link' | 'Physical';
  educationalNote: string;
}

const JOURNEY_STEPS: JourneyHop[] = [
  {
    hopNumber: 1,
    nodeName: 'PC-Client (192.168.1.10)',
    nodeType: 'client',
    actionTitle: 'Encapsulation at Source Host',
    actionSummary: 'User requests http://server.corp/data. Client application wraps data into TCP segment, then IP packet, then Ethernet frame.',
    l7Payload: 'GET /index.html HTTP/1.1\r\nHost: server.corp',
    l4Segment: { protocol: 'TCP', srcPort: 49152, dstPort: 80, flags: 'SYN / PSH' },
    l3Packet: { srcIp: '192.168.1.10', dstIp: '10.0.0.50', ttl: 64, protocolNum: '6 (TCP)' },
    l2Frame: { srcMac: 'AA:BB:CC:11:22:33', dstMac: 'EE:FF:00:11:22:33 (Gateway MAC via ARP)', ethType: '0x0800 (IPv4)', vlan: '10' },
    layerFocus: 'Application',
    educationalNote: 'Notice that the destination IP is 10.0.0.50 (remote subnet), so the client encapsulates the frame with the MAC address of its Default Gateway (the router), NOT the destination server!',
  },
  {
    hopNumber: 2,
    nodeName: 'Access-Switch-01',
    nodeType: 'switch',
    actionTitle: 'Layer 2 Switching & CAM Table Lookup',
    actionSummary: 'Switch receives frame on Port Fa0/1, inspects Destination MAC, and consults MAC address table.',
    l7Payload: 'GET /index.html HTTP/1.1 (Encapsulated)',
    l4Segment: { protocol: 'TCP', srcPort: 49152, dstPort: 80 },
    l3Packet: { srcIp: '192.168.1.10', dstIp: '10.0.0.50', ttl: 64, protocolNum: '6 (TCP)' },
    l2Frame: { srcMac: 'AA:BB:CC:11:22:33', dstMac: 'EE:FF:00:11:22:33', ethType: '0x0800 (IPv4)', vlan: '10' },
    layerFocus: 'Data Link',
    educationalNote: 'Switches operate at Layer 2. The switch forwards the frame without inspecting or altering the IP header, TTL, or TCP payload.',
  },
  {
    hopNumber: 3,
    nodeName: 'Core-Router (Gateway)',
    nodeType: 'router',
    actionTitle: 'Layer 3 Routing & L2 Frame Rewriting',
    actionSummary: 'Router strips old L2 frame (decapsulation), checks routing table for 10.0.0.50, decrements TTL to 63, and re-encapsulates with new L2 MACs.',
    l7Payload: 'GET /index.html HTTP/1.1',
    l4Segment: { protocol: 'TCP', srcPort: 49152, dstPort: 80 },
    l3Packet: { srcIp: '192.168.1.10', dstIp: '10.0.0.50', ttl: 63, protocolNum: '6 (TCP)' },
    l2Frame: { srcMac: 'EE:FF:00:11:22:34 (Router Egress MAC)', dstMac: '99:88:77:66:55:44 (Server MAC via ARP)', ethType: '0x0800 (IPv4)' },
    layerFocus: 'Network',
    educationalNote: 'CRITICAL NETWORKING CONCEPT: Routers strip the Layer 2 header and rewrite source/destination MAC addresses for the next hop. However, the original Source IP (192.168.1.10) and Destination IP (10.0.0.50) remain unchanged!',
  },
  {
    hopNumber: 4,
    nodeName: 'Web-Server (10.0.0.50)',
    nodeType: 'server',
    actionTitle: 'Decapsulation & Application Delivery',
    actionSummary: 'Server verifies destination MAC matches its interface, processes IP packet, verifies TCP port 80, and delivers HTTP request to Apache/Nginx web server.',
    l7Payload: 'GET /index.html HTTP/1.1 -> Delivered to Web Server Daemon',
    l4Segment: { protocol: 'TCP Port 80 Listener', srcPort: 49152, dstPort: 80, flags: 'ESTABLISHED' },
    l3Packet: { srcIp: '192.168.1.10', dstIp: '10.0.0.50', ttl: 63, protocolNum: '6 (TCP)' },
    l2Frame: { srcMac: 'EE:FF:00:11:22:34', dstMac: '99:88:77:66:55:44', ethType: '0x0800' },
    layerFocus: 'Application',
    educationalNote: 'Server decapsulates the packet up all layers: Ethernet Frame -> IP Packet -> TCP Segment -> HTTP Request, preparing HTTP 200 OK reply.',
  },
];

export const PacketJourney: React.FC = () => {
  const { addXp, unlockBadge } = useApp();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const activeHop = JOURNEY_STEPS[currentStepIdx];

  const handleNext = () => {
    if (currentStepIdx < JOURNEY_STEPS.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      addXp(30, 'Completed Packet Journey walkthrough');
      unlockBadge('first-step');
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-sky-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Zap className="w-4 h-4" />
          <span>Hop-by-Hop Visual Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Packet Journey & OSI Encapsulation Simulator
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Trace an individual IP packet from origin host to destination server. Watch MAC address rewriting, TTL decrementing, and full OSI decapsulation in action.
        </p>
      </div>

      {/* Visual Path Flow */}
      <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
          {JOURNEY_STEPS.map((hop, idx) => {
            const isActive = idx === currentStepIdx;
            const isPassed = idx < currentStepIdx;

            return (
              <button
                key={hop.hopNumber}
                onClick={() => setCurrentStepIdx(idx)}
                className={`flex flex-col items-center p-3 rounded-2xl border transition-all text-center relative ${
                  isActive
                    ? 'border-indigo-500 bg-gradient-to-b from-indigo-50/90 to-cyan-50/60 dark:from-indigo-950/70 dark:to-cyan-950/70 shadow-md ring-2 ring-indigo-300 dark:ring-cyan-500/40'
                    : isPassed
                    ? 'border-emerald-300 bg-emerald-50/50 dark:bg-slate-900 dark:border-emerald-500/30'
                    : 'border-slate-200/80 bg-white dark:bg-slate-950 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                  isActive
                    ? 'bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-sm'
                    : isPassed
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {hop.nodeType === 'client' && <Laptop className="w-5 h-5" />}
                  {hop.nodeType === 'switch' && <Layers className="w-5 h-5" />}
                  {hop.nodeType === 'router' && <Router className="w-5 h-5" />}
                  {hop.nodeType === 'server' && <Server className="w-5 h-5" />}
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Hop #{hop.hopNumber}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-full">
                  {hop.nodeName.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Step Action Header */}
        <div className="p-4 rounded-xl bg-sky-50/60 dark:bg-slate-950 border border-sky-150 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-sky-700 dark:text-cyan-400 uppercase">
              Current Location: {activeHop.nodeName}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-200/80 dark:bg-cyan-950 border border-sky-300 dark:border-cyan-500/40 text-sky-900 dark:text-cyan-300 text-[11px] font-bold">
              Focus: {activeHop.layerFocus} Layer
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {activeHop.actionTitle}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {activeHop.actionSummary}
          </p>
        </div>

        {/* 5-Layer Stack Inspector Cards */}
        <div className="space-y-3 font-mono text-xs">
          {/* Layer 7 Application */}
          <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-500/30 bg-purple-50/50 dark:bg-purple-950/20">
            <div className="flex items-center justify-between font-sans text-xs font-bold text-purple-900 dark:text-purple-300 mb-1">
              <span>Layer 7: Application Layer</span>
              <span className="text-[10px] bg-purple-200 dark:bg-purple-900/60 px-2 py-0.5 rounded">HTTP Data</span>
            </div>
            <div className="text-purple-950 dark:text-purple-200 text-[11px] bg-white dark:bg-slate-950 p-2 rounded-lg border border-purple-150 dark:border-purple-900/40">
              {activeHop.l7Payload}
            </div>
          </div>

          {/* Layer 4 Transport */}
          <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20">
            <div className="flex items-center justify-between font-sans text-xs font-bold text-indigo-900 dark:text-indigo-300 mb-1">
              <span>Layer 4: Transport Layer (Segment)</span>
              <span className="text-[10px] bg-indigo-200 dark:bg-indigo-900/60 px-2 py-0.5 rounded">{activeHop.l4Segment.protocol}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div>Src Port: <strong className="text-indigo-800 dark:text-indigo-300">{activeHop.l4Segment.srcPort}</strong></div>
              <div>Dst Port: <strong className="text-indigo-800 dark:text-indigo-300">{activeHop.l4Segment.dstPort}</strong></div>
              <div className="col-span-2">Flags: <strong className="text-indigo-800 dark:text-indigo-300">{activeHop.l4Segment.flags || 'ACK'}</strong></div>
            </div>
          </div>

          {/* Layer 3 Network */}
          <div className="p-3.5 rounded-xl border border-sky-300 dark:border-cyan-500/40 bg-sky-50/70 dark:bg-cyan-950/30">
            <div className="flex items-center justify-between font-sans text-xs font-bold text-sky-900 dark:text-cyan-300 mb-1">
              <span>Layer 3: Network Layer (Packet)</span>
              <span className="text-[10px] bg-sky-200 dark:bg-cyan-900/60 px-2 py-0.5 rounded">IPv4 Header</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div>Source IP: <strong className="text-sky-800 dark:text-cyan-300">{activeHop.l3Packet.srcIp}</strong></div>
              <div>Destination IP: <strong className="text-sky-800 dark:text-cyan-300">{activeHop.l3Packet.dstIp}</strong></div>
              <div>TTL: <strong className="text-amber-700 dark:text-amber-400">{activeHop.l3Packet.ttl}</strong></div>
              <div>Protocol: <strong className="text-slate-700 dark:text-slate-300">{activeHop.l3Packet.protocolNum}</strong></div>
            </div>
          </div>

          {/* Layer 2 Data Link */}
          <div className="p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20">
            <div className="flex items-center justify-between font-sans text-xs font-bold text-emerald-900 dark:text-emerald-300 mb-1">
              <span>Layer 2: Data Link Layer (Ethernet Frame)</span>
              <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900/60 px-2 py-0.5 rounded">802.3 MAC Frame</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div>Source MAC: <strong className="text-emerald-800 dark:text-emerald-300">{activeHop.l2Frame.srcMac}</strong></div>
              <div>Destination MAC: <strong className="text-emerald-800 dark:text-emerald-300">{activeHop.l2Frame.dstMac}</strong></div>
            </div>
          </div>
        </div>

        {/* Educational Deep Dive Callout */}
        <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/30 text-xs flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-amber-900 dark:text-amber-300 mb-0.5">Key Networking Concept:</div>
            <p className="text-amber-950 dark:text-amber-200 leading-relaxed font-sans">
              {activeHop.educationalNote}
            </p>
          </div>
        </div>

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-sky-100 dark:border-slate-800">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Journey</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStepIdx === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-sky-200 dark:border-slate-800 disabled:opacity-40 text-xs font-semibold hover:bg-sky-50 dark:hover:bg-slate-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Hop</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentStepIdx === JOURNEY_STEPS.length - 1}
              className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-bold transition-colors shadow-2xs"
            >
              <span>Next Hop</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
