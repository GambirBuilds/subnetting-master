import React, { useState } from 'react';
import { 
  Laptop, 
  Server, 
  Router, 
  Globe, 
  Shield, 
  Radio, 
  Plus, 
  Trash2, 
  Play, 
  RefreshCw, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Move,
  Link,
  Zap
} from 'lucide-react';
import { SimDevice, SimDeviceType, SimLink } from '../../types';
import { validateIPv4, ipToLong, cidrToMask, maskToCidr } from '../../network-engine/ipv4';
import { useApp } from '../../context/AppContext';

const INITIAL_DEVICES: SimDevice[] = [
  { id: 'dev-1', name: 'Sales-PC', type: 'pc', x: 80, y: 180, ip: '192.168.1.10', subnetMask: '255.255.255.0', defaultGateway: '192.168.1.1', mac: '00:1A:2B:3C:4D:01', vlan: 10, status: 'up' },
  { id: 'dev-2', name: 'Core-Switch', type: 'switch', x: 260, y: 180, ip: '192.168.1.2', subnetMask: '255.255.255.0', defaultGateway: '192.168.1.1', mac: '00:1A:2B:3C:4D:02', vlan: 1, status: 'up' },
  { id: 'dev-3', name: 'Edge-Router', type: 'router', x: 440, y: 180, ip: '192.168.1.1', subnetMask: '255.255.255.0', defaultGateway: '203.0.113.1', mac: '00:1A:2B:3C:4D:03', status: 'up' },
  { id: 'dev-4', name: 'App-Server', type: 'server', x: 260, y: 320, ip: '192.168.1.50', subnetMask: '255.255.255.0', defaultGateway: '192.168.1.1', mac: '00:1A:2B:3C:4D:04', vlan: 10, status: 'up' },
  { id: 'dev-5', name: 'Internet-Cloud', type: 'cloud', x: 620, y: 180, ip: '203.0.113.50', subnetMask: '255.255.255.0', defaultGateway: '203.0.113.1', mac: '00:1A:2B:3C:4D:05', status: 'up' },
];

const INITIAL_LINKS: SimLink[] = [
  { id: 'link-1', fromId: 'dev-1', toId: 'dev-2', cableType: 'ethernet', status: 'active' },
  { id: 'link-2', fromId: 'dev-4', toId: 'dev-2', cableType: 'ethernet', status: 'active' },
  { id: 'link-3', fromId: 'dev-2', toId: 'dev-3', cableType: 'ethernet', status: 'active' },
  { id: 'link-4', fromId: 'dev-3', toId: 'dev-5', cableType: 'fiber', status: 'active' },
];

export const NetworkBuilder: React.FC = () => {
  const { addXp, unlockBadge } = useApp();

  const [devices, setDevices] = useState<SimDevice[]>(INITIAL_DEVICES);
  const [links, setLinks] = useState<SimLink[]>(INITIAL_LINKS);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>('dev-1');
  const [cableSourceId, setCableSourceId] = useState<string | null>(null);

  // Ping Test States
  const [pingSourceId, setPingSourceId] = useState<string>('dev-1');
  const [pingDestId, setPingDestId] = useState<string>('dev-4');
  const [isPinging, setIsPinging] = useState(false);
  const [pingResults, setPingResults] = useState<{
    success: boolean;
    title: string;
    logs: string[];
    packetHops: string[];
  } | null>(null);

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId);

  const handleUpdateDevice = (updated: Partial<SimDevice>) => {
    if (!selectedDeviceId) return;
    setDevices((prev) =>
      prev.map((d) => (d.id === selectedDeviceId ? { ...d, ...updated } : d))
    );
  };

  const handleAddDevice = (type: SimDeviceType) => {
    const newId = `dev-${Date.now()}`;
    const nameMap: Record<SimDeviceType, string> = {
      pc: `PC-${devices.filter((d) => d.type === 'pc').length + 1}`,
      laptop: `Laptop-${devices.filter((d) => d.type === 'laptop').length + 1}`,
      server: `Server-${devices.filter((d) => d.type === 'server').length + 1}`,
      switch: `Switch-${devices.filter((d) => d.type === 'switch').length + 1}`,
      router: `Router-${devices.filter((d) => d.type === 'router').length + 1}`,
      ap: `AP-${devices.filter((d) => d.type === 'ap').length + 1}`,
      cloud: `Cloud-ISP`,
      firewall: `FW-Main`,
    };

    const newDevice: SimDevice = {
      id: newId,
      name: nameMap[type],
      type,
      x: 100 + (devices.length % 5) * 80,
      y: 100 + Math.floor(devices.length / 5) * 80,
      ip: `192.168.1.${100 + devices.length}`,
      subnetMask: '255.255.255.0',
      defaultGateway: '192.168.1.1',
      mac: `00:1A:2B:3C:4D:${(devices.length + 10).toString(16).padStart(2, '0').toUpperCase()}`,
      status: 'up',
    };

    setDevices((prev) => [...prev, newDevice]);
    setSelectedDeviceId(newId);
    addXp(15, 'Added device to network builder');
  };

  const handleDeleteDevice = (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
    setLinks((prev) => prev.filter((l) => l.fromId !== id && l.toId !== id));
    if (selectedDeviceId === id) {
      setSelectedDeviceId(null);
    }
  };

  const handleStartCable = (id: string) => {
    if (!cableSourceId) {
      setCableSourceId(id);
    } else if (cableSourceId === id) {
      setCableSourceId(null);
    } else {
      // Create cable link
      const existing = links.some(
        (l) => (l.fromId === cableSourceId && l.toId === id) || (l.fromId === id && l.toId === cableSourceId)
      );
      if (!existing) {
        setLinks((prev) => [
          ...prev,
          {
            id: `link-${Date.now()}`,
            fromId: cableSourceId,
            toId: id,
            cableType: 'ethernet',
            status: 'active',
          },
        ]);
        addXp(10, 'Connected network cable');
      }
      setCableSourceId(null);
    }
  };

  const handleRunPing = () => {
    const src = devices.find((d) => d.id === pingSourceId);
    const dst = devices.find((d) => d.id === pingDestId);

    if (!src || !dst) return;
    setIsPinging(true);
    setPingResults(null);

    setTimeout(() => {
      setIsPinging(false);
      const logs: string[] = [];
      let success = true;

      logs.push(`[ARP Request] ${src.name} (${src.ip}) resolving path to ${dst.ip}...`);

      if (src.status === 'down') {
        logs.push(`[ERROR] Source interface on ${src.name} is administratively DOWN.`);
        success = false;
      } else if (dst.status === 'down') {
        logs.push(`[ERROR] Destination interface on ${dst.name} is DOWN. Link unreachable.`);
        success = false;
      } else {
        // Evaluate subnet membership
        const srcCidr = maskToCidr(src.subnetMask);
        const dstCidr = maskToCidr(dst.subnetMask);

        const srcNetLong = (ipToLong(src.ip) & ((0xffffffff << (32 - srcCidr)) >>> 0)) >>> 0;
        const dstNetLongInSrcMask = (ipToLong(dst.ip) & ((0xffffffff << (32 - srcCidr)) >>> 0)) >>> 0;

        const isSameSubnet = srcNetLong === dstNetLongInSrcMask;

        if (isSameSubnet) {
          logs.push(`[L2 Switching] Both hosts share subnet prefix /${srcCidr}. Forwarding frame via local switch fabric.`);
          logs.push(`[ICMP] Echo Request sent to ${dst.ip} (TTL=64, Seq=1).`);
          logs.push(`[ICMP] Echo Reply received from ${dst.ip}: bytes=32 time=1.2ms TTL=64.`);
          logs.push(`[SUCCESS] 4 packets transmitted, 4 received, 0% packet loss.`);
          success = true;
          addXp(25, 'Successful connectivity test');
          unlockBadge('network-rescuer');
        } else {
          // Different subnet: requires Default Gateway
          logs.push(`[L3 Routing] Destination ${dst.ip} is on remote network. Checking Default Gateway on ${src.name}...`);
          if (!src.defaultGateway || src.defaultGateway === '0.0.0.0') {
            logs.push(`[DROPPED] Host has no Default Gateway configured to route traffic outside local subnet.`);
            success = false;
          } else {
            const gw = devices.find((d) => d.ip === src.defaultGateway);
            if (!gw) {
              logs.push(`[ARP FAILED] Cannot reach Default Gateway ${src.defaultGateway}. Destination Host Unreachable.`);
              success = false;
            } else {
              logs.push(`[Gateway Resolved] Next-hop router ${gw.name} reached at MAC ${gw.mac}.`);
              logs.push(`[Routed] Packet forwarded across L3 link to destination ${dst.name}.`);
              logs.push(`[ICMP] Echo Reply received from ${dst.ip}: bytes=32 time=4.8ms TTL=63 (Hop count decremented).`);
              logs.push(`[SUCCESS] End-to-end routed connectivity established.`);
              success = true;
              addXp(35, 'Routed cross-subnet ping test');
            }
          }
        }
      }

      setPingResults({
        success,
        title: success ? 'Ping Succeeded: Host Reachable' : 'Ping Failed: Packet Dropped',
        logs,
        packetHops: [src.name, 'Core Fabric', dst.name],
      });
    }, 700);
  };

  const getDeviceIcon = (type: SimDeviceType) => {
    switch (type) {
      case 'pc': return <Laptop className="w-5 h-5 text-sky-600 dark:text-cyan-400" />;
      case 'laptop': return <Laptop className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'server': return <Server className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'switch': return <Layers className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'router': return <Router className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'ap': return <Radio className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      case 'cloud': return <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'firewall': return <Shield className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4" />
            <span>Interactive Visual Canvas</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Network Simulator & Topology Builder
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Design virtual computer networks, connect cabling, configure IP/VLAN interfaces, and simulate live ICMP packet delivery.
          </p>
        </div>

        {/* Quick Add Toolbar */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-indigo-100 dark:border-slate-800 shadow-2xs">
          {(['pc', 'server', 'switch', 'router', 'cloud', 'firewall'] as SimDeviceType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleAddDevice(type)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-indigo-50/60 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors uppercase text-[11px]"
              title={`Add ${type}`}
            >
              <Plus className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
              <span>{type}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas and Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Topology Interactive Canvas */}
        <div className="lg:col-span-8 rounded-2xl border border-indigo-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm min-h-[480px] relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-3 border-b border-sky-100 dark:border-slate-900">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Topology Canvas</span>
              <span>•</span>
              <span>{devices.length} Devices</span>
              <span>•</span>
              <span>{links.length} Links</span>
            </div>
            <div className="text-[11px] text-sky-700 dark:text-cyan-400">
              {cableSourceId ? `Click another device to connect cable...` : `Select devices or test ping`}
            </div>
          </div>

          {/* Canvas SVG and Nodes */}
          <div className="relative w-full h-[380px] bg-sky-50/20 dark:bg-slate-950/40 rounded-xl my-4 overflow-hidden border border-dashed border-sky-200/60 dark:border-slate-800">
            {/* SVG Connecting Cables */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {links.map((link) => {
                const fromDev = devices.find((d) => d.id === link.fromId);
                const toDev = devices.find((d) => d.id === link.toId);
                if (!fromDev || !toDev) return null;
                return (
                  <line
                    key={link.id}
                    x1={fromDev.x + 36}
                    y1={fromDev.y + 36}
                    x2={toDev.x + 36}
                    y2={toDev.y + 36}
                    stroke={link.cableType === 'fiber' ? '#0ea5e9' : '#94a3b8'}
                    strokeWidth="2.5"
                    strokeDasharray={link.cableType === 'fiber' ? '4 4' : 'none'}
                    className="transition-all"
                  />
                );
              })}
            </svg>

            {/* Devices on Canvas */}
            {devices.map((device) => {
              const isSelected = selectedDeviceId === device.id;
              const isCableSource = cableSourceId === device.id;
              return (
                <div
                  key={device.id}
                  style={{ left: device.x, top: device.y }}
                  onClick={() => setSelectedDeviceId(device.id)}
                  className={`absolute w-20 flex flex-col items-center cursor-pointer select-none transition-all p-2 rounded-2xl ${
                    isSelected
                      ? 'ring-2 ring-sky-500 bg-sky-100/60 dark:bg-cyan-950/60 shadow-md scale-105'
                      : isCableSource
                      ? 'ring-2 ring-amber-500 bg-amber-50 dark:bg-amber-950/60 animate-pulse'
                      : 'hover:bg-sky-50/80 dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-800 flex items-center justify-center shadow-xs">
                    {getDeviceIcon(device.type)}
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-1 truncate max-w-full">
                    {device.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    {device.ip}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bottom Canvas Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-sky-100 dark:border-slate-900 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => selectedDeviceId && handleStartCable(selectedDeviceId)}
                disabled={!selectedDeviceId}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-semibold transition-colors ${
                  cableSourceId
                    ? 'bg-amber-500 text-white border-amber-600'
                    : 'bg-sky-50 dark:bg-slate-900 border-sky-200 text-sky-800 dark:text-slate-200 hover:bg-sky-100'
                }`}
              >
                <Link className="w-3.5 h-3.5" />
                <span>{cableSourceId ? 'Cancel Cable' : 'Attach Cable'}</span>
              </button>

              {selectedDeviceId && (
                <button
                  onClick={() => handleDeleteDevice(selectedDeviceId)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-colors font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              )}
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-slate-400">Presets:</span>
              <button
                onClick={() => {
                  setDevices(INITIAL_DEVICES);
                  setLinks(INITIAL_LINKS);
                }}
                className="px-2 py-1 rounded-lg bg-sky-50 dark:bg-slate-900 text-sky-700 dark:text-slate-300 hover:bg-sky-100 transition-colors"
              >
                Standard LAN
              </button>
              <button
                onClick={() => {
                  setDevices([]);
                  setLinks([]);
                  setSelectedDeviceId(null);
                }}
                className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Device Configuration & Connectivity Inspector */}
        <div className="lg:col-span-4 space-y-6">
          {/* Selected Device Inspector */}
          {selectedDevice ? (
            <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-sky-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  {getDeviceIcon(selectedDevice.type)}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{selectedDevice.name}</h3>
                    <p className="text-[11px] text-slate-500 uppercase font-mono">{selectedDevice.type}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  selectedDevice.status === 'up' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {selectedDevice.status}
                </span>
              </div>

              {/* Form Inputs */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">Host Name:</label>
                  <input
                    type="text"
                    value={selectedDevice.name}
                    onChange={(e) => handleUpdateDevice({ name: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-sky-50/50 dark:bg-slate-950 font-sans text-xs border border-sky-200 dark:border-slate-800 text-slate-900 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">IPv4 Address:</label>
                  <input
                    type="text"
                    value={selectedDevice.ip}
                    onChange={(e) => handleUpdateDevice({ ip: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-sky-50/50 dark:bg-slate-950 font-mono text-xs border border-sky-200 dark:border-slate-800 text-sky-800 dark:text-cyan-300 font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">Subnet Mask:</label>
                  <input
                    type="text"
                    value={selectedDevice.subnetMask}
                    onChange={(e) => handleUpdateDevice({ subnetMask: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-sky-50/50 dark:bg-slate-950 font-mono text-xs border border-sky-200 dark:border-slate-800 text-slate-900 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">Default Gateway:</label>
                  <input
                    type="text"
                    value={selectedDevice.defaultGateway}
                    onChange={(e) => handleUpdateDevice({ defaultGateway: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-sky-50/50 dark:bg-slate-950 font-mono text-xs border border-sky-200 dark:border-slate-800 text-slate-900 dark:text-slate-200"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-600 dark:text-slate-400">Interface State:</span>
                  <button
                    onClick={() => handleUpdateDevice({ status: selectedDevice.status === 'up' ? 'down' : 'up' })}
                    className={`px-3 py-1 rounded-xl font-bold text-xs ${
                      selectedDevice.status === 'up' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {selectedDevice.status === 'up' ? 'Shut Down Interface' : 'Bring Interface Up'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-sky-200 dark:border-slate-800 p-6 text-center text-xs text-slate-400">
              Select any device on the canvas to inspect its configuration.
            </div>
          )}

          {/* Interactive Connectivity / Ping Tool */}
          <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Play className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
              <span>Connectivity & ICMP Ping Test</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-500 block mb-1">Source:</label>
                <select
                  value={pingSourceId}
                  onChange={(e) => setPingSourceId(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-xl bg-sky-50/50 dark:bg-slate-950 border border-sky-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                >
                  {devices.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.ip})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Destination:</label>
                <select
                  value={pingDestId}
                  onChange={(e) => setPingDestId(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-xl bg-sky-50/50 dark:bg-slate-950 border border-sky-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                >
                  {devices.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.ip})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleRunPing}
              disabled={isPinging || pingSourceId === pingDestId}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 transition-all"
            >
              {isPinging ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Transmitting ICMP Packets...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute Ping Test</span>
                </>
              )}
            </button>

            {/* Ping Output Logs */}
            {pingResults && (
              <div className={`p-3.5 rounded-xl border text-xs font-mono space-y-1.5 ${
                pingResults.success
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-500/30 dark:text-emerald-300'
                  : 'bg-rose-50/80 border-rose-200 text-rose-900 dark:bg-rose-950/40 dark:border-rose-500/30 dark:text-rose-300'
              }`}>
                <div className="font-bold flex items-center gap-1.5">
                  {pingResults.success ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  <span>{pingResults.title}</span>
                </div>
                <div className="space-y-1 text-[11px] pt-1 border-t border-current/20">
                  {pingResults.logs.map((log, i) => (
                    <div key={i}>{log}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
