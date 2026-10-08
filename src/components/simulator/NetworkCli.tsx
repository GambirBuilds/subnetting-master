import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, 
  RotateCcw, 
  HelpCircle, 
  Copy, 
  Check, 
  Zap, 
  Laptop, 
  Server, 
  Router,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

type CliEnvironment = 'windows' | 'linux' | 'cisco';

interface TerminalLine {
  id: string;
  type: 'prompt' | 'output' | 'error' | 'success';
  text: string;
}

export const NetworkCli: React.FC = () => {
  const { addXp, unlockBadge } = useApp();

  const [env, setEnv] = useState<CliEnvironment>('cisco');
  const [ciscoMode, setCiscoMode] = useState<'user' | 'priv' | 'config' | 'config-if'>('user');
  const [ciscoInterface, setCiscoInterface] = useState<string>('GigabitEthernet0/0');
  const [ciscoIpConfig, setCiscoIpConfig] = useState<{ ip: string; mask: string; status: 'up' | 'down' }>({
    ip: '192.168.1.1',
    mask: '255.255.255.0',
    status: 'up',
  });

  const [inputVal, setInputVal] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const [lines, setLines] = useState<TerminalLine[]>([
    { id: '1', type: 'output', text: 'Cisco IOS Software, C2900 Software (C2900-UNIVERSALK9-M), Version 15.5(3)M4b' },
    { id: '2', type: 'output', text: 'Technical Support: http://www.cisco.com/techsupport' },
    { id: '3', type: 'output', text: 'Type "enable" to enter Privileged EXEC mode, or "help" for a list of commands.' },
    { id: '4', type: 'output', text: ' ' },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const switchEnv = (newEnv: CliEnvironment) => {
    setEnv(newEnv);
    setInputVal('');
    if (newEnv === 'windows') {
      setLines([
        { id: 'w1', type: 'output', text: 'Microsoft Windows [Version 10.0.19045.3803]' },
        { id: 'w2', type: 'output', text: '(c) Microsoft Corporation. All rights reserved.' },
        { id: 'w3', type: 'output', text: ' ' },
        { id: 'w4', type: 'output', text: 'Type "ipconfig", "ping 8.8.8.8", "tracert google.com", or "help" to begin.' },
      ]);
    } else if (newEnv === 'linux') {
      setLines([
        { id: 'l1', type: 'output', text: 'Linux netmaster-node 6.5.0-generic #1 SMP x86_64 GNU/Linux' },
        { id: 'l2', type: 'output', text: 'Type "ip addr", "ip route", "ping -c 4 1.1.1.1", or "help".' },
      ]);
    } else {
      setCiscoMode('user');
      setLines([
        { id: 'c1', type: 'output', text: 'Cisco IOS Software, C2900 Software, RELEASE SOFTWARE (fc2)' },
        { id: 'c2', type: 'output', text: 'Type "enable" to enter Privileged mode, or "?" for options.' },
      ]);
    }
  };

  const getPromptString = () => {
    if (env === 'windows') return 'C:\\Users\\Admin>';
    if (env === 'linux') return 'admin@netmaster:~$';
    if (ciscoMode === 'user') return 'Router>';
    if (ciscoMode === 'priv') return 'Router#';
    if (ciscoMode === 'config') return 'Router(config)#';
    if (ciscoMode === 'config-if') return `Router(config-if)#`;
    return 'Router>';
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    // Record prompt
    const promptLine: TerminalLine = {
      id: `p-${Date.now()}`,
      type: 'prompt',
      text: `${getPromptString()} ${cmd}`,
    };

    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setInputVal('');

    const outputLines: TerminalLine[] = [];
    const lowerCmd = cmd.toLowerCase();

    if (lowerCmd === 'clear' || lowerCmd === 'cls') {
      setLines([]);
      return;
    }

    if (env === 'windows') {
      if (lowerCmd === 'help') {
        outputLines.push({ id: `o-${Date.now()}-1`, type: 'output', text: 'Supported simulated Windows commands:' });
        outputLines.push({ id: `o-${Date.now()}-2`, type: 'output', text: '  ipconfig           - Display IP address, subnet mask, default gateway' });
        outputLines.push({ id: `o-${Date.now()}-3`, type: 'output', text: '  ipconfig /all      - Detailed adapter info with MAC and DNS servers' });
        outputLines.push({ id: `o-${Date.now()}-4`, type: 'output', text: '  ping <ip/domain>   - Send ICMP echo requests' });
        outputLines.push({ id: `o-${Date.now()}-5`, type: 'output', text: '  tracert <ip>       - Trace route path hops to destination' });
        outputLines.push({ id: `o-${Date.now()}-6`, type: 'output', text: '  nslookup <domain>  - Query DNS resolver for domain records' });
        outputLines.push({ id: `o-${Date.now()}-7`, type: 'output', text: '  arp -a             - Display local ARP resolution table' });
        outputLines.push({ id: `o-${Date.now()}-8`, type: 'output', text: '  cls                - Clear command screen' });
      } else if (lowerCmd.startsWith('ipconfig')) {
        outputLines.push({ id: `o-${Date.now()}-1`, type: 'output', text: 'Windows IP Configuration\n' });
        outputLines.push({ id: `o-${Date.now()}-2`, type: 'output', text: 'Ethernet adapter Local Area Connection:' });
        outputLines.push({ id: `o-${Date.now()}-3`, type: 'output', text: '   Connection-specific DNS Suffix  . : corp.net' });
        outputLines.push({ id: `o-${Date.now()}-4`, type: 'output', text: '   IPv4 Address. . . . . . . . . . . : 192.168.1.10' });
        outputLines.push({ id: `o-${Date.now()}-5`, type: 'output', text: '   Subnet Mask . . . . . . . . . . . : 255.255.255.0' });
        outputLines.push({ id: `o-${Date.now()}-6`, type: 'output', text: '   Default Gateway . . . . . . . . . : 192.168.1.1' });
        if (lowerCmd.includes('/all')) {
          outputLines.push({ id: `o-${Date.now()}-7`, type: 'output', text: '   Physical Address. . . . . . . . . : AA-BB-CC-11-22-33' });
          outputLines.push({ id: `o-${Date.now()}-8`, type: 'output', text: '   DHCP Enabled. . . . . . . . . . . : Yes' });
          outputLines.push({ id: `o-${Date.now()}-9`, type: 'output', text: '   DNS Servers . . . . . . . . . . . : 8.8.8.8, 1.1.1.1' });
        }
        addXp(15, 'Executed Windows ipconfig');
      } else if (lowerCmd.startsWith('ping')) {
        const target = cmd.split(' ')[1] || '192.168.1.1';
        outputLines.push({ id: `o-${Date.now()}-1`, type: 'output', text: `Pinging ${target} with 32 bytes of data:` });
        outputLines.push({ id: `o-${Date.now()}-2`, type: 'output', text: `Reply from ${target}: bytes=32 time=2ms TTL=64` });
        outputLines.push({ id: `o-${Date.now()}-3`, type: 'output', text: `Reply from ${target}: bytes=32 time=1ms TTL=64` });
        outputLines.push({ id: `o-${Date.now()}-4`, type: 'output', text: `Reply from ${target}: bytes=32 time=2ms TTL=64` });
        outputLines.push({ id: `o-${Date.now()}-5`, type: 'output', text: `Reply from ${target}: bytes=32 time=1ms TTL=64\n` });
        outputLines.push({ id: `o-${Date.now()}-6`, type: 'output', text: `Ping statistics for ${target}: Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)` });
        addXp(15, 'Executed ping command');
      } else if (lowerCmd.startsWith('nslookup')) {
        const domain = cmd.split(' ')[1] || 'google.com';
        outputLines.push({ id: `o-${Date.now()}-1`, type: 'output', text: 'Server:  dns.google\nAddress: 8.8.8.8\n' });
        outputLines.push({ id: `o-${Date.now()}-2`, type: 'output', text: `Non-authoritative answer:\nName:    ${domain}\nAddress: 142.250.190.46` });
        addXp(15, 'Executed nslookup query');
      } else if (lowerCmd === 'arp -a') {
        outputLines.push({ id: `o-${Date.now()}-1`, type: 'output', text: 'Interface: 192.168.1.10 --- 0xb' });
        outputLines.push({ id: `o-${Date.now()}-2`, type: 'output', text: '  Internet Address      Physical Address      Type' });
        outputLines.push({ id: `o-${Date.now()}-3`, type: 'output', text: '  192.168.1.1           ee-ff-00-11-22-33     dynamic' });
        outputLines.push({ id: `o-${Date.now()}-4`, type: 'output', text: '  192.168.1.50          99-88-77-66-55-44     dynamic' });
        outputLines.push({ id: `o-${Date.now()}-5`, type: 'output', text: '  192.168.1.255         ff-ff-ff-ff-ff-ff     static' });
        addXp(15, 'Checked ARP cache');
      } else {
        outputLines.push({ id: `err-${Date.now()}`, type: 'error', text: `'${cmd}' is not recognized as an internal or external command. Type 'help'.` });
      }
    } else if (env === 'linux') {
      if (lowerCmd === 'help') {
        outputLines.push({ id: `o-${Date.now()}-1`, type: 'output', text: 'Supported simulated Linux commands:' });
        outputLines.push({ id: `o-${Date.now()}-2`, type: 'output', text: '  ip addr / ip a      - Display network interfaces and IP addresses' });
        outputLines.push({ id: `o-${Date.now()}-3`, type: 'output', text: '  ip route            - Show routing table' });
        outputLines.push({ id: `o-${Date.now()}-4`, type: 'output', text: '  ping -c 4 <host>    - Ping host with count limit' });
        outputLines.push({ id: `o-${Date.now()}-5`, type: 'output', text: '  traceroute <host>   - Trace packet path' });
        outputLines.push({ id: `o-${Date.now()}-6`, type: 'output', text: '  dig <domain>        - DNS query tool' });
        outputLines.push({ id: `o-${Date.now()}-7`, type: 'output', text: '  arp -n              - Show kernel ARP cache' });
      } else if (lowerCmd.startsWith('ip a') || lowerCmd.startsWith('ip addr')) {
        outputLines.push({ id: `o-${Date.now()}-1`, type: 'output', text: '1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN' });
        outputLines.push({ id: `o-${Date.now()}-2`, type: 'output', text: '    inet 127.0.0.1/8 scope host lo' });
        outputLines.push({ id: `o-${Date.now()}-3`, type: 'output', text: '    inet6 ::1/128 scope host' });
        outputLines.push({ id: `o-${Date.now()}-4`, type: 'output', text: '2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP' });
        outputLines.push({ id: `o-${Date.now()}-5`, type: 'output', text: '    inet 192.168.1.10/24 brd 192.168.1.255 scope global dynamic eth0' });
        outputLines.push({ id: `o-${Date.now()}-6`, type: 'output', text: '    inet6 fe80::a00:27ff:fe4e:66a1/64 scope link' });
        addXp(15, 'Executed Linux ip addr');
      } else if (lowerCmd.startsWith('ip route') || lowerCmd === 'ip r') {
        outputLines.push({ id: `o-${Date.now()}-1`, type: 'output', text: 'default via 192.168.1.1 dev eth0 proto dhcp metric 100' });
        outputLines.push({ id: `o-${Date.now()}-2`, type: 'output', text: '192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.10 metric 100' });
        addXp(15, 'Executed Linux ip route');
      } else if (lowerCmd.startsWith('ping')) {
        outputLines.push({ id: `o-${Date.now()}-1`, type: 'output', text: 'PING 1.1.1.1 (1.1.1.1) 56(84) bytes of data.' });
        outputLines.push({ id: `o-${Date.now()}-2`, type: 'output', text: '64 bytes from 1.1.1.1: icmp_seq=1 ttl=59 time=1.84 ms' });
        outputLines.push({ id: `o-${Date.now()}-3`, type: 'output', text: '64 bytes from 1.1.1.1: icmp_seq=2 ttl=59 time=1.92 ms' });
        outputLines.push({ id: `o-${Date.now()}-4`, type: 'output', text: '--- 1.1.1.1 ping statistics --- 2 packets transmitted, 2 received, 0% packet loss' });
        addXp(15, 'Executed Linux ping');
      } else {
        outputLines.push({ id: `err-${Date.now()}`, type: 'error', text: `bash: ${cmd}: command not found. Type 'help'.` });
      }
    } else {
      // CISCO IOS ENVIRONMENT
      if (lowerCmd === 'enable' || lowerCmd === 'en') {
        setCiscoMode('priv');
        outputLines.push({ id: `o-${Date.now()}-1`, type: 'success', text: 'Entering Privileged EXEC mode (Router#)' });
        addXp(10, 'Entered Cisco enable mode');
      } else if (lowerCmd === 'disable') {
        setCiscoMode('user');
        outputLines.push({ id: `o-${Date.now()}-1`, type: 'output', text: 'Returned to User EXEC mode (Router>)' });
      } else if (lowerCmd === 'configure terminal' || lowerCmd === 'conf t') {
        if (ciscoMode === 'user') {
          outputLines.push({ id: `err-${Date.now()}`, type: 'error', text: '% Command not allowed in User mode. Type "enable" first.' });
        } else {
          setCiscoMode('config');
          outputLines.push({ id: `o-${Date.now()}-1`, type: 'output', text: 'Enter configuration commands, one per line. End with CNTL/Z.' });
          addXp(15, 'Entered Cisco Global Configuration mode');
        }
      } else if (lowerCmd.startsWith('interface ') || lowerCmd.startsWith('int ')) {
        if (ciscoMode === 'config' || ciscoMode === 'config-if') {
          const iface = cmd.split(' ')[1] || 'GigabitEthernet0/0';
          setCiscoInterface(iface);
          setCiscoMode('config-if');
          outputLines.push({ id: `o-${Date.now()}-1`, type: 'output', text: `Configuring interface ${iface}` });
          addXp(15, 'Entered Cisco interface configuration');
        } else {
          outputLines.push({ id: `err-${Date.now()}`, type: 'error', text: '% Must be in Global Configuration mode (conf t).' });
        }
      } else if (lowerCmd.startsWith('ip address ') || lowerCmd.startsWith('ip addr ')) {
        if (ciscoMode === 'config-if') {
          const parts = cmd.split(' ');
          const newIp = parts[2] || '192.168.1.1';
          const newMask = parts[3] || '255.255.255.0';
          setCiscoIpConfig((prev) => ({ ...prev, ip: newIp, mask: newMask }));
          outputLines.push({ id: `o-${Date.now()}-1`, type: 'success', text: `Interface ${ciscoInterface} configured with ${newIp} ${newMask}.` });
          addXp(25, 'Configured Cisco IP address');
          unlockBadge('subnet-tactician');
        } else {
          outputLines.push({ id: `err-${Date.now()}`, type: 'error', text: '% Must be in interface configuration mode.' });
        }
      } else if (lowerCmd === 'no shutdown' || lowerCmd === 'no shut') {
        if (ciscoMode === 'config-if') {
          setCiscoIpConfig((prev) => ({ ...prev, status: 'up' }));
          outputLines.push({ id: `o-${Date.now()}-1`, type: 'success', text: `%LINK-3-UPDOWN: Interface ${ciscoInterface}, changed state to up` });
          outputLines.push({ id: `o-${Date.now()}-2`, type: 'success', text: `%LINEPROTO-5-UPDOWN: Line protocol on Interface ${ciscoInterface}, changed state to up` });
          addXp(20, 'Brought Cisco interface UP');
        }
      } else if (lowerCmd === 'exit') {
        if (ciscoMode === 'config-if') setCiscoMode('config');
        else if (ciscoMode === 'config') setCiscoMode('priv');
        else if (ciscoMode === 'priv') setCiscoMode('user');
      } else if (lowerCmd === 'end') {
        setCiscoMode('priv');
      } else if (lowerCmd === 'show ip interface brief' || lowerCmd === 'sh ip int br' || lowerCmd === 'do sh ip int br') {
        outputLines.push({ id: `o-${Date.now()}-1`, type: 'output', text: 'Interface                  IP-Address      OK? Method Status                Protocol' });
        outputLines.push({ id: `o-${Date.now()}-2`, type: 'output', text: `${ciscoInterface.padEnd(26)} ${ciscoIpConfig.ip.padEnd(15)} YES manual ${ciscoIpConfig.status === 'up' ? 'up'.padEnd(21) : 'administratively down'} up` });
        outputLines.push({ id: `o-${Date.now()}-3`, type: 'output', text: 'GigabitEthernet0/1         unassigned      YES unset  administratively down down' });
        addXp(15, 'Checked show ip interface brief');
      } else if (lowerCmd === 'show ip route' || lowerCmd === 'sh ip route' || lowerCmd === 'do sh ip route') {
        outputLines.push({ id: `o-${Date.now()}-1`, type: 'output', text: 'Codes: L - local, C - connected, S - static, R - RIP, O - OSPF\n' });
        outputLines.push({ id: `o-${Date.now()}-2`, type: 'output', text: `Gateway of last resort is not set\n` });
        outputLines.push({ id: `o-${Date.now()}-3`, type: 'output', text: `      192.168.1.0/24 is variably subnetted, 2 subnets, 2 masks` });
        outputLines.push({ id: `o-${Date.now()}-4`, type: 'output', text: `C        192.168.1.0/24 is directly connected, ${ciscoInterface}` });
        outputLines.push({ id: `o-${Date.now()}-5`, type: 'output', text: `L        ${ciscoIpConfig.ip}/32 is directly connected, ${ciscoInterface}` });
        addXp(15, 'Inspected Cisco routing table');
      } else if (lowerCmd === 'show vlan brief' || lowerCmd === 'sh vlan br') {
        outputLines.push({ id: `o-${Date.now()}-1`, type: 'output', text: 'VLAN Name                             Status    Ports' });
        outputLines.push({ id: `o-${Date.now()}-2`, type: 'output', text: '---- -------------------------------- --------- -------------------------------' });
        outputLines.push({ id: `o-${Date.now()}-3`, type: 'output', text: '1    default                          active    Gi0/1, Gi0/2, Gi0/3' });
        outputLines.push({ id: `o-${Date.now()}-4`, type: 'output', text: '10   FINANCE                          active    Fa0/1, Fa0/2' });
        outputLines.push({ id: `o-${Date.now()}-5`, type: 'output', text: '20   ENGINEERING                      active    Fa0/3, Fa0/4' });
      } else if (lowerCmd === 'write memory' || lowerCmd === 'wr' || lowerCmd === 'copy run start') {
        outputLines.push({ id: `o-${Date.now()}-1`, type: 'success', text: 'Building configuration...\n[OK]' });
        addXp(20, 'Saved Cisco running-config to startup-config');
      } else {
        outputLines.push({ id: `err-${Date.now()}`, type: 'error', text: `% Invalid input detected at '^' marker. Type 'show ip int brief', 'enable', 'conf t', etc.` });
      }
    }

    setLines((prev) => [...prev, promptLine, ...outputLines]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(commandHistory[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      if (historyIndex < commandHistory.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex]);
      } else {
        setHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Terminal className="w-4 h-4" />
            <span>Interactive Multi-OS Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Simulated Command Line (CLI) Terminal
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Practice real Cisco IOS router configuration, Windows network troubleshooting, and Linux command administration in a safe browser simulator.
          </p>
        </div>

        {/* Multi-OS Environment Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-sky-100 dark:border-slate-800 shadow-2xs">
          <button
            onClick={() => switchEnv('cisco')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              env === 'cisco'
                ? 'bg-sky-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Router className="w-3.5 h-3.5" />
            <span>Cisco IOS</span>
          </button>
          <button
            onClick={() => switchEnv('windows')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              env === 'windows'
                ? 'bg-sky-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Windows CMD</span>
          </button>
          <button
            onClick={() => switchEnv('linux')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              env === 'linux'
                ? 'bg-sky-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Linux Bash</span>
          </button>
        </div>
      </div>

      {/* Terminal Display */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 shadow-xl overflow-hidden font-mono text-xs">
        {/* Terminal Titlebar */}
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-slate-400 text-[11px] ml-2 font-sans font-semibold">
              {env === 'cisco' ? 'Cisco IOS Router Console (tty0)' : env === 'windows' ? 'Administrator: Command Prompt' : 'admin@netmaster: ~'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLines([])}
              className="text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded hover:bg-slate-800 transition-colors"
            >
              Clear Screen
            </button>
          </div>
        </div>

        {/* Scrollable Output Buffer */}
        <div 
          onClick={() => inputRef.current?.focus()}
          className="p-5 min-h-[360px] max-h-[520px] overflow-y-auto space-y-1 text-slate-200 cursor-text selection:bg-sky-500/40"
        >
          {lines.map((line) => (
            <div
              key={line.id}
              className={`whitespace-pre-wrap leading-relaxed ${
                line.type === 'prompt'
                  ? 'text-sky-400 font-bold'
                  : line.type === 'error'
                  ? 'text-rose-400 font-semibold'
                  : line.type === 'success'
                  ? 'text-emerald-400 font-semibold'
                  : 'text-slate-300'
              }`}
            >
              {line.text}
            </div>
          ))}

          {/* Active Input Line */}
          <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 pt-1">
            <span className="text-sky-400 font-bold shrink-0">{getPromptString()}</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-full bg-transparent text-white focus:outline-none caret-sky-400"
            />
          </form>

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Quick Suggested Commands Helper */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 text-xs space-y-2 shadow-2xs">
        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
          <Sparkles className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
          <span>Quick Command Shortcuts (Click to enter):</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {env === 'cisco' ? (
            <>
              {['enable', 'show ip interface brief', 'show ip route', 'configure terminal', 'interface GigabitEthernet0/0', 'ip address 192.168.1.1 255.255.255.0', 'no shutdown', 'write memory'].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => {
                    setInputVal(cmd);
                    inputRef.current?.focus();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-slate-800 hover:bg-sky-100 font-mono text-[11px] text-sky-800 dark:text-cyan-300 border border-sky-200/60 dark:border-slate-700 transition-colors"
                >
                  {cmd}
                </button>
              ))}
            </>
          ) : env === 'windows' ? (
            <>
              {['ipconfig', 'ipconfig /all', 'ping 192.168.1.1', 'tracert google.com', 'nslookup cisco.com', 'arp -a', 'cls'].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => {
                    setInputVal(cmd);
                    inputRef.current?.focus();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-slate-800 hover:bg-sky-100 font-mono text-[11px] text-sky-800 dark:text-cyan-300 border border-sky-200/60 dark:border-slate-700 transition-colors"
                >
                  {cmd}
                </button>
              ))}
            </>
          ) : (
            <>
              {['ip addr', 'ip route', 'ping -c 4 1.1.1.1', 'traceroute 8.8.8.8', 'dig google.com', 'arp -n', 'clear'].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => {
                    setInputVal(cmd);
                    inputRef.current?.focus();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-slate-800 hover:bg-sky-100 font-mono text-[11px] text-sky-800 dark:text-cyan-300 border border-sky-200/60 dark:border-slate-700 transition-colors"
                >
                  {cmd}
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
