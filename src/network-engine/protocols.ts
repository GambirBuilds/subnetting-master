export interface ProtocolDoc {
  id: string;
  name: string;
  acronym: string;
  osiLayer: 'Layer 7 — Application' | 'Layer 4 — Transport' | 'Layer 3 — Network' | 'Layer 2 — Data Link';
  tcpIpLayer: 'Application' | 'Transport' | 'Internet' | 'Network Access';
  defaultPorts: string;
  purpose: string;
  flowSteps: {
    step: number;
    title: string;
    description: string;
  }[];
  headerFields: {
    field: string;
    bits: string;
    description: string;
  }[];
  securityNotes: string;
}

export const PROTOCOL_ENCYCLOPEDIA: ProtocolDoc[] = [
  {
    id: 'tcp',
    name: 'Transmission Control Protocol',
    acronym: 'TCP',
    osiLayer: 'Layer 4 — Transport',
    tcpIpLayer: 'Transport',
    defaultPorts: 'Dynamic (Various)',
    purpose: 'Connection-oriented, reliable, sequenced, and flow-controlled data transport protocol.',
    flowSteps: [
      { step: 1, title: 'SYN (Synchronize)', description: 'Client sends SYN packet with an initial sequence number (ISN_c).' },
      { step: 2, title: 'SYN-ACK', description: 'Server acknowledges client ISN (ACK = ISN_c + 1) and sends its own ISN (ISN_s).' },
      { step: 3, title: 'ACK (Established)', description: 'Client acknowledges server ISN (ACK = ISN_s + 1). Connection is established.' },
      { step: 4, title: 'Data Transfer & Windowing', description: 'Sliding window buffer regulates rate of transmission based on receiver buffer capacity.' },
      { step: 5, title: 'FIN / ACK Teardown', description: 'Graceful 4-way handshake closure (FIN -> ACK -> FIN -> ACK).' },
    ],
    headerFields: [
      { field: 'Source Port', bits: '16 bits', description: 'Originating application port number.' },
      { field: 'Destination Port', bits: '16 bits', description: 'Target service port number.' },
      { field: 'Sequence Number', bits: '32 bits', description: 'Tracks byte order of outgoing stream.' },
      { field: 'Acknowledgment Number', bits: '32 bits', description: 'Next expected byte from peer.' },
      { field: 'Flags (SYN, ACK, FIN, RST, PSH, URG)', bits: '9 bits', description: 'Control bits governing session state.' },
      { field: 'Window Size', bits: '16 bits', description: 'Flow control receive buffer window.' },
    ],
    securityNotes: 'Vulnerable to SYN Flood attacks (mitigated by SYN cookies) and TCP reset hijacking.',
  },
  {
    id: 'dhcp',
    name: 'Dynamic Host Configuration Protocol',
    acronym: 'DHCP',
    osiLayer: 'Layer 7 — Application',
    tcpIpLayer: 'Application',
    defaultPorts: 'UDP 67 (Server), UDP 68 (Client)',
    purpose: 'Automatically assigns IP addresses, subnet masks, default gateways, and DNS servers to hosts.',
    flowSteps: [
      { step: 1, title: 'Discover (D)', description: 'Client broadcasts DHCPDISCOVER to 255.255.255.255 to locate DHCP servers.' },
      { step: 2, title: 'Offer (O)', description: 'DHCP server reserves an IP from pool and unicasts/broadcasts DHCPOFFER with config details.' },
      { step: 3, title: 'Request (R)', description: 'Client broadcasts DHCPREQUEST accepting the specific server offer.' },
      { step: 4, title: 'Acknowledge (A)', description: 'Server finalizes binding and sends DHCPACK confirming lease expiration time.' },
    ],
    headerFields: [
      { field: 'OpCode', bits: '8 bits', description: '1 for BootRequest, 2 for BootReply.' },
      { field: 'Transaction ID (xid)', bits: '32 bits', description: 'Random matching ID for transaction.' },
      { field: 'Client IP (ciaddr)', bits: '32 bits', description: 'Client IP if already bound.' },
      { field: 'Your IP (yiaddr)', bits: '32 bits', description: 'IP address assigned by server.' },
      { field: 'Client Hardware Address (chaddr)', bits: '16 bytes', description: 'Client Ethernet MAC address.' },
      { field: 'DHCP Options', bits: 'Variable', description: 'Subnet mask (Option 1), Gateway (Option 3), DNS (Option 6).' },
    ],
    securityNotes: 'Deploy DHCP Snooping on access switches to prevent Rogue DHCP servers and DHCP starvation attacks.',
  },
  {
    id: 'arp',
    name: 'Address Resolution Protocol',
    acronym: 'ARP',
    osiLayer: 'Layer 2 — Data Link',
    tcpIpLayer: 'Network Access',
    defaultPorts: 'N/A (L2 EtherType 0x0806)',
    purpose: 'Maps known Layer 3 IPv4 addresses to unknown Layer 2 physical MAC addresses on local broadcast domains.',
    flowSteps: [
      { step: 1, title: 'ARP Cache Check', description: 'Host checks local ARP table for target IP MAC mapping.' },
      { step: 2, title: 'ARP Request (Broadcast)', description: 'Host broadcasts "Who has 192.168.1.1? Tell 192.168.1.50" to FF:FF:FF:FF:FF:FF.' },
      { step: 3, title: 'ARP Reply (Unicast)', description: 'Owner of target IP unicasts reply with its physical MAC address.' },
      { step: 4, title: 'Cache Update', description: 'Host saves mapping into ARP cache for ~300 seconds.' },
    ],
    headerFields: [
      { field: 'Hardware Type', bits: '16 bits', description: '1 for Ethernet.' },
      { field: 'Protocol Type', bits: '16 bits', description: '0x0800 for IPv4.' },
      { field: 'Opcode', bits: '16 bits', description: '1 for Request, 2 for Reply.' },
      { field: 'Sender Hardware / IP', bits: '6B MAC, 4B IP', description: 'Originator MAC and IPv4.' },
      { field: 'Target Hardware / IP', bits: '6B MAC, 4B IP', description: 'Destination MAC (zeros in request) and IPv4.' },
    ],
    securityNotes: 'Vulnerable to ARP Poisoning / Man-In-The-Middle attacks. Mitigate using Dynamic ARP Inspection (DAI).',
  },
  {
    id: 'dns',
    name: 'Domain Name System',
    acronym: 'DNS',
    osiLayer: 'Layer 7 — Application',
    tcpIpLayer: 'Application',
    defaultPorts: 'UDP 53 (Queries), TCP 53 (Zone Transfers)',
    purpose: 'Hierarchical distributed database translating human hostnames (e.g. google.com) into numerical IP addresses.',
    flowSteps: [
      { step: 1, title: 'Local Cache / Hosts File', description: 'OS checks browser cache, OS resolver cache, and /etc/hosts.' },
      { step: 2, title: 'Recursive Resolver', description: 'Sends query to configured resolver (e.g. 8.8.8.8 or 1.1.1.1).' },
      { step: 3, title: 'Root Nameserver (.)', description: 'Resolver queries Root servers for top-level domain (TLD) authority.' },
      { step: 4, title: 'TLD Nameserver (.com)', description: 'TLD nameserver returns authoritative nameserver for domain.' },
      { step: 5, title: 'Authoritative Nameserver', description: 'Returns requested resource record (A, AAAA, CNAME, MX).' },
    ],
    headerFields: [
      { field: 'Transaction ID', bits: '16 bits', description: 'Matches queries and responses.' },
      { field: 'Flags (QR, Opcode, AA, TC, RD, RA, RCODE)', bits: '16 bits', description: 'Query/Response status and error codes.' },
      { field: 'Questions / Answer RRs', bits: '16 bits each', description: 'Counts of queries and answers returned.' },
    ],
    securityNotes: 'DNSSEC provides cryptographic digital signatures to verify authenticity of DNS responses.',
  },
];
