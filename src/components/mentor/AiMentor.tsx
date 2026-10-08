import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  BookOpen, 
  RefreshCw, 
  ShieldCheck, 
  User,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  topic?: string;
}

const PRESET_QUESTIONS = [
  'Why do point-to-point links use /31 subnets under RFC 3021?',
  'What happens step-by-step when a PC sends a packet to a remote subnet?',
  'How does a switch forward frames without modifying the Layer 3 IP header?',
  'What is the difference between TCP and UDP at Layer 4?',
  'Can you give me a CCNA-level technical interview question on OSPF?',
];

const KNOWLEDGE_RESPONSES: Record<string, string> = {
  '31': `In traditional IPv4 networking, every subnet sacrifices 2 addresses: the Network Address (all host bits 0) and the Broadcast Address (all host bits 1). For a /30 subnet (4 addresses), that wastes 50% of the addresses just for 2 router endpoints!

RFC 3021 solves this for dedicated point-to-point links (like serial or direct router-to-router Ethernet). Because there are strictly two endpoints and no third party on the link:
1. Directed broadcasts are not needed (multicast or all-ones 255.255.255.255 can be used if necessary).
2. A /31 provides 2 addresses (e.g. 172.16.1.0 and 172.16.1.1). Both are assigned directly to the two interface endpoints.
3. This saves massive amounts of IP address space in core telecommunications and ISP backbone architectures.`,

  'remote': `Here is the exact step-by-step sequence when host PC-A (192.168.1.10/24) sends a packet to PC-B (10.0.0.50/24):

1. Subnet Comparison (ANDing): PC-A compares 10.0.0.50 against its own subnet mask 255.255.255.0. It determines 10.0.0.50 is on a REMOTE network.
2. Default Gateway Check: Because the destination is remote, PC-A must forward the frame to its configured Default Gateway (Router, 192.168.1.1).
3. ARP Resolution: If the router's MAC address is not in PC-A's ARP table, PC-A sends an ARP Request broadcast. The router responds with its Layer 2 MAC address.
4. L2 Encapsulation: PC-A encapsulates the packet:
   - Source IP: 192.168.1.10 (Original sender)
   - Destination IP: 10.0.0.50 (Ultimate destination)
   - Source MAC: PC-A's MAC
   - Destination MAC: Router's Gateway MAC
5. Router L3 Processing: Router receives frame, checks CRC, decapsulates Layer 2 header, inspects Destination IP (10.0.0.50) against its Routing Table, decrements TTL by 1, re-encapsulates with the next-hop MAC, and forwards out the egress interface.`,

  'switch': `Layer 2 switches operate exclusively on Ethernet frames at Layer 2 (Data Link).

When a frame arrives on a switchport:
1. Learning: The switch inspects the Source MAC address and maps it to the receiving port in its MAC Address Table (CAM Table).
2. Forwarding: The switch inspects the Destination MAC address:
   - If known: Unicasts the frame out that specific single port.
   - If unknown or broadcast (FF:FF:FF:FF:FF:FF): Floods the frame out all ports in the same VLAN except the receiving port.
3. The Layer 3 IP header, TTL, and Layer 4 payload remain 100% untouched and unchanged throughout this entire Layer 2 switching process!`,

  'interview': `Here is a popular CCNA / Network Engineering technical interview scenario:

Question: "You configure OSPF between two Cisco routers connected back-to-back, but the adjacency remains stuck in the 'INIT' or '2-WAY' state instead of reaching 'FULL'. What are the top 4 root causes you would troubleshoot?"

Key Architectural Answers:
1. Mismatched OSPF Hello or Dead intervals (must match identically on both sides).
2. Mismatched Subnet Masks on the connecting interfaces.
3. Mismatched MTU (Maximum Transmission Unit) sizes causing DBD packet drops (often stuck in EXSTART/EXCHANGE).
4. Passive interface misconfiguration or an Access Control List (ACL) blocking OSPF multicast packets (224.0.0.5 / 224.0.0.6 or IP protocol 89).`,
};

export const AiMentor: React.FC = () => {
  const { addXp, stats } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello ${stats.username}! I am your Network Master Academic Mentor and Technical Coach. I can explain complex RFC protocols, break down packet encapsulation, or drill you on CCNA and network engineering interview questions. What would you like to explore?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputMsg).trim();
    if (!text) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValSafe('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let reply = '';
      const lower = text.toLowerCase();

      if (lower.includes('31') || lower.includes('rfc 3021')) {
        reply = KNOWLEDGE_RESPONSES['31'];
      } else if (lower.includes('remote') || lower.includes('step') || lower.includes('packet')) {
        reply = KNOWLEDGE_RESPONSES['remote'];
      } else if (lower.includes('switch') || lower.includes('cam') || lower.includes('layer 2')) {
        reply = KNOWLEDGE_RESPONSES['switch'];
      } else if (lower.includes('interview') || lower.includes('ospf') || lower.includes('ccna')) {
        reply = KNOWLEDGE_RESPONSES['interview'];
      } else if (lower.includes('tcp') || lower.includes('udp')) {
        reply = `TCP vs UDP Breakdown at Layer 4:

• TCP (Transmission Control Protocol): Connection-oriented (3-way handshake SYN/SYN-ACK/ACK), reliable, guarantees in-order delivery via sequence numbers, flow control (sliding window), and retransmission of lost segments. Used by HTTP/HTTPS, SSH, FTP, SMTP.
• UDP (User Datagram Protocol): Connectionless, lightweight (8-byte header vs 20-byte TCP), no handshake, no acknowledgments, minimal latency. Used by DNS queries, DHCP, VoIP, video streaming, and NTP.`;
      } else {
        reply = `That is an excellent networking question! In computer networking architecture, protocols are designed with strict separation of concerns across the OSI 7-layer hierarchy. 

Key takeaway: Layer 2 deals with physical hops and MAC addresses within the broadcast domain, while Layer 3 IP addressing governs end-to-end routing across internetworks. Feel free to explore our Packet Journey simulator or test this in our Network Builder canvas!`;
      }

      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiReply]);
      addXp(10, 'Asked AI Mentor a question');
    }, 600);
  };

  const setInputValSafe = (val: string) => setInputMsg(val);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-sky-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Bot className="w-4 h-4" />
          <span>Academic AI Tutor & Interview Coach</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Networking Mentor
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Ask questions about RFC specifications, OSI layers, routing mechanics, or prepare for CCNA and university networking exams.
        </p>
      </div>

      {/* Preset Questions Chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-slate-400 mr-1 font-semibold">Suggested Questions:</span>
        {PRESET_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => handleSend(q)}
            className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-sky-150 dark:border-slate-800 text-sky-800 dark:text-slate-200 hover:bg-sky-50 text-[11px] font-medium transition-colors text-left"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Buffer */}
      <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm min-h-[420px] max-h-[580px] overflow-y-auto space-y-4 flex flex-col justify-between">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.sender === 'ai'
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'bg-indigo-600 text-white'
              }`}>
                {msg.sender === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div className={`p-4 rounded-2xl max-w-xl text-xs space-y-1 ${
                msg.sender === 'ai'
                  ? 'bg-sky-50/70 dark:bg-slate-900 border border-sky-150 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                  : 'bg-sky-600 text-white'
              }`}>
                <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                <span className={`text-[10px] block text-right ${msg.sender === 'ai' ? 'text-slate-400' : 'text-sky-200'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-600" />
              <span>AI Mentor is thinking...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 pt-4 border-t border-sky-100 dark:border-slate-900"
        >
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Ask any networking, subnetting, or CCNA question..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-sky-50/50 dark:bg-slate-900 border border-sky-200 dark:border-slate-800 text-xs focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            disabled={!inputMsg.trim()}
            className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white shadow-2xs transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
