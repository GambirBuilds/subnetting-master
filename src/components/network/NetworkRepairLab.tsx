import React, { useState } from 'react';
import { 
  Wrench, 
  Router, 
  Server, 
  Laptop, 
  Play, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw, 
  ShieldCheck,
  Send,
  HelpCircle
} from 'lucide-react';
import { NETWORK_SCENARIOS } from '../../data/networkScenarios';
import { NetworkDevice } from '../../types';
import { useApp } from '../../context/AppContext';
import { calculateSubnet, validateIPv4, maskToCidr } from '../../utils/subnet';

export const NetworkRepairLab: React.FC = () => {
  const { addXp, unlockBadge } = useApp();

  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const activeScenario = NETWORK_SCENARIOS[currentScenarioIndex];

  // Current working devices state for active scenario
  const [devices, setDevices] = useState<NetworkDevice[]>(activeScenario.devices);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  // Edit config modal/drawer state
  const [editIp, setEditIp] = useState('');
  const [editMask, setEditMask] = useState('');
  const [editGateway, setEditGateway] = useState('');

  // Simulation test ping state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLog, setSimulationLog] = useState<{
    success: boolean;
    title: string;
    details: string[];
  } | null>(null);

  // Reset or switch scenario
  const switchScenario = (index: number) => {
    setCurrentScenarioIndex(index);
    setDevices(NETWORK_SCENARIOS[index].devices);
    setSelectedDeviceId(null);
    setSimulationLog(null);
  };

  const handleSelectDevice = (device: NetworkDevice) => {
    setSelectedDeviceId(device.id);
    setEditIp(device.ip);
    setEditMask(device.subnetMask);
    setEditGateway(device.defaultGateway);
  };

  const handleSaveConfig = () => {
    if (!selectedDeviceId) return;
    setDevices((prev) =>
      prev.map((d) =>
        d.id === selectedDeviceId
          ? {
              ...d,
              ip: editIp.trim(),
              subnetMask: editMask.trim(),
              defaultGateway: editGateway.trim(),
            }
          : d
      )
    );
    setSimulationLog(null);
  };

  // Run ICMP Ping Simulation
  const runPingSimulation = () => {
    setIsSimulating(true);
    setSimulationLog(null);

    setTimeout(() => {
      setIsSimulating(false);

      const logs: string[] = [];
      let passed = true;

      if (activeScenario.id === 'scenario-1') {
        const pc1 = devices.find((d) => d.id === 'pc1');
        const router = devices.find((d) => d.id === 'r1');

        logs.push(`[1] PC-Finance-01 (IP: ${pc1?.ip}) initiates ping to Database-Server (10.0.0.50).`);
        logs.push(`[2] Evaluating destination: 10.0.0.50 is on a remote network outside local 192.168.1.0/24.`);
        logs.push(`[3] Checking local Default Gateway setting on PC-Finance-01: ${pc1?.defaultGateway}`);

        if (pc1?.defaultGateway === router?.ip) {
          logs.push(`[4] ARP Request for Default Gateway 192.168.1.1 successful! Gateway MAC resolved.`);
          logs.push(`[5] Core-Router receives packet on VLAN 10 and routes across backbone to 10.0.0.50.`);
          logs.push(`[6] Echo Reply received from 10.0.0.50: bytes=32 time=4ms TTL=58.`);
          logs.push(`[7] SUCCESS: 4 packets transmitted, 4 received, 0% packet loss.`);
          passed = true;
          addXp(100, 'Resolved default gateway misconfiguration');
          unlockBadge('network-rescuer');
        } else {
          logs.push(`[4] ARP FAILED: PC-Finance-01 cannot resolve Gateway ${pc1?.defaultGateway}. Gateway IP is not in PC-01's 192.168.1.0/24 subnet!`);
          logs.push(`[5] Packet dropped: Destination Host Unreachable.`);
          passed = false;
        }
      } else if (activeScenario.id === 'scenario-2') {
        const srv = devices.find((d) => d.id === 'srv1');

        logs.push(`[1] Testing network interface on HR-File-Server (IP: ${srv?.ip}, Mask: ${srv?.subnetMask}).`);

        if (srv?.ip === '192.168.10.63') {
          logs.push(`[2] CRITICAL ERROR: In subnet 192.168.10.0/26 (block size 64, range .0 to .63), .63 has all host bits set to 1.`);
          logs.push(`[3] 192.168.10.63 is the Directed Broadcast Address! It cannot be bound as a unicast host address.`);
          logs.push(`[4] Network stack rejects interface binding. Link is DOWN.`);
          passed = false;
        } else {
          const cidr = maskToCidr(srv?.subnetMask || '255.255.255.192');
          const sub = calculateSubnet(srv?.ip || '', cidr);
          if (sub.networkAddress === '192.168.10.0' && srv?.ip !== sub.networkAddress && srv?.ip !== sub.broadcastAddress) {
            logs.push(`[2] Interface bound to valid unicast host ${srv?.ip}.`);
            logs.push(`[3] Sending ARP announcement to HR-Switch... OK.`);
            logs.push(`[4] HR-Lead-PC pings HR-File-Server: 4 packets sent, 4 replies received.`);
            passed = true;
            addXp(100, 'Fixed broadcast IP conflict');
            unlockBadge('network-rescuer');
          } else {
            logs.push(`[2] IP ${srv?.ip} is not within the valid host range of HR subnet 192.168.10.0/26.`);
            passed = false;
          }
        }
      } else if (activeScenario.id === 'scenario-3') {
        const devSrv = devices.find((d) => d.id === 'srv1');
        logs.push(`[1] Verifying Dev-Server-01 subnet configuration: ${devSrv?.ip} / ${devSrv?.subnetMask}`);

        if (devSrv?.subnetMask === '255.255.255.224') {
          logs.push(`[2] Mask matches /27 (255.255.255.224).`);
          logs.push(`[3] Both Dev-Server-01 and Lead-Dev-Mac now calculate identical local subnet boundaries (172.16.5.0 to 172.16.5.31).`);
          logs.push(`[4] Local ARP queries resolve successfully without gateway routing.`);
          logs.push(`[5] Bidirectional ping communication restored! 0% packet loss.`);
          passed = true;
          addXp(100, 'Corrected subnet mask mismatch');
          unlockBadge('network-rescuer');
        } else {
          logs.push(`[2] MASK MISMATCH: Dev-Server-01 is configured with ${devSrv?.subnetMask} (/24), while the LAN is /27.`);
          logs.push(`[3] Asymmetric routing defect: Dev-Server-01 assumes remote IP addresses are local and fails to route return packets through gateway.`);
          passed = false;
        }
      }

      setSimulationLog({
        success: passed,
        title: passed ? 'Diagnostic Verification: PASSED' : 'Diagnostic Verification: FAILED',
        details: logs,
      });
    }, 700);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-sky-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Wrench className="w-4 h-4" />
          <span>Interactive Simulation Environment</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Network Repair Lab & Packet Simulator
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Inspect routers, switches, and workstations. Identify configuration errors and test packet delivery with live ICMP ping traces.
        </p>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-sky-100 dark:border-slate-800 pb-3">
        {NETWORK_SCENARIOS.map((scenario, index) => (
          <button
            key={scenario.id}
            onClick={() => switchScenario(index)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              currentScenarioIndex === index
                ? 'bg-sky-600 text-white shadow-2xs dark:bg-cyan-950 dark:border dark:border-cyan-500/40 dark:text-cyan-300'
                : 'bg-white dark:bg-slate-900 border border-sky-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {scenario.title.split(':')[0]}
          </button>
        ))}
      </div>

      {/* Active Scenario Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-sky-100 dark:border-slate-800 shadow-sm space-y-2">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          {activeScenario.title}
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {activeScenario.description}
        </p>
        <div className="flex items-center gap-2 pt-1 text-xs text-sky-700 dark:text-cyan-400 font-semibold">
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span>Objective: {activeScenario.targetObjective}</span>
        </div>
      </div>

      {/* Visual Network Topology Canvas */}
      <div className="rounded-2xl border border-sky-200/90 dark:border-slate-800 bg-sky-50/40 dark:bg-slate-950 p-6 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-sky-150 dark:border-slate-900 pb-3 mb-6">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 font-semibold">
            Interactive Network Topology
          </div>
          <span className="text-[11px] text-slate-500">
            Click any device node to inspect or modify its IP configuration
          </span>
        </div>

        {/* Device Node Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {devices.map((device) => {
            const isSelected = selectedDeviceId === device.id;
            return (
              <button
                key={device.id}
                onClick={() => handleSelectDevice(device)}
                className={`p-4 rounded-2xl border flex flex-col items-center text-center transition-all shadow-xs ${
                  isSelected
                    ? 'bg-sky-100/80 border-sky-500 ring-2 ring-sky-400/30 dark:bg-cyan-950/40 dark:border-cyan-400'
                    : 'bg-white dark:bg-slate-900/80 border-sky-150 dark:border-slate-800 hover:border-sky-300 dark:hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 transition-colors shadow-2xs ${
                    device.type === 'router'
                      ? 'bg-indigo-50 text-indigo-600 border border-indigo-200 dark:bg-indigo-950/80 dark:text-indigo-400 dark:border-indigo-500/30'
                      : device.type === 'server'
                      ? 'bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/80 dark:text-amber-400 dark:border-amber-500/30'
                      : device.type === 'switch'
                      ? 'bg-sky-50 text-sky-600 border border-sky-200 dark:bg-cyan-950/80 dark:text-cyan-400 dark:border-cyan-500/30'
                      : 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-400 dark:border-emerald-500/30'
                  }`}
                >
                  {device.type === 'router' && <Router className="w-6 h-6" />}
                  {device.type === 'server' && <Server className="w-6 h-6" />}
                  {device.type === 'switch' && <Wrench className="w-6 h-6" />}
                  {device.type === 'pc' && <Laptop className="w-6 h-6" />}
                </div>

                <div className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">
                  {device.name}
                </div>
                <div className="text-[11px] font-mono text-sky-600 dark:text-cyan-400 font-bold mt-0.5">
                  {device.ip}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                  {device.role}
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Button: Run Test Ping */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-sky-150 dark:border-slate-900">
          <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            {activeScenario.hint}
          </div>
          <button
            onClick={runPingSimulation}
            disabled={isSimulating}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors shadow-sm shadow-sky-600/30 disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Transmitting ICMP Packets...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Run Diagnostic Test Ping</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Selected Device Configuration Drawer / Editor */}
      {selectedDeviceId && (
        <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-sky-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Device Configuration: {devices.find((d) => d.id === selectedDeviceId)?.name}
            </h3>
            <span className="text-xs text-sky-700 dark:text-slate-400 font-mono font-medium">
              Expected: {devices.find((d) => d.id === selectedDeviceId)?.expectedSubnet}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">IP Address</label>
              <input
                type="text"
                value={editIp}
                onChange={(e) => setEditIp(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-sky-50/50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-cyan-300 border border-sky-200/80 dark:border-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Subnet Mask</label>
              <input
                type="text"
                value={editMask}
                onChange={(e) => setEditMask(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-sky-50/50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-slate-200 border border-sky-200/80 dark:border-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Default Gateway</label>
              <input
                type="text"
                value={editGateway}
                onChange={(e) => setEditGateway(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-sky-50/50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-slate-200 border border-sky-200/80 dark:border-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setSelectedDeviceId(null)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveConfig}
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors shadow-2xs"
            >
              Apply Interface Settings
            </button>
          </div>
        </div>
      )}

      {/* Simulation Diagnostic Output Log */}
      {simulationLog && (
        <div
          className={`rounded-2xl border p-6 space-y-3 font-mono text-xs shadow-sm ${
            simulationLog.success
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-500/40 dark:text-emerald-200'
              : 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/30 dark:border-rose-500/40 dark:text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2 font-sans font-bold text-sm">
            {simulationLog.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span>{simulationLog.title}</span>
          </div>

          <div className="space-y-1 pl-7 text-[11px] leading-relaxed">
            {simulationLog.details.map((line, idx) => (
              <div key={idx} className="font-mono">
                {line}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
