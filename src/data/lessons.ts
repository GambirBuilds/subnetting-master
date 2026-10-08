export interface LessonSection {
  title: string;
  type: 'concept' | 'visual' | 'example' | 'interactive' | 'quiz';
  content: string;
  interactiveType?: 'binary-converter' | 'cidr-slider' | 'subnet-calculator' | 'vlsm-planner';
  codeSnippet?: string;
  quizQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface LessonModule {
  id: string;
  number: string;
  title: string;
  badge: string;
  estimatedTime: string;
  summary: string;
  sections: LessonSection[];
}

export const LESSON_MODULES: LessonModule[] = [
  {
    id: 'm1-ip-fundamentals',
    number: '01',
    title: 'IP Address Fundamentals',
    badge: 'Core Essentials',
    estimatedTime: '10 min',
    summary: 'Master 32-bit IPv4 structure, octets, network vs host portions, legacy classes (A-E), and special addresses.',
    sections: [
      {
        title: 'What is an IPv4 Address?',
        type: 'concept',
        content: `Every device on a TCP/IP network must have a unique logical identifier called an IP address. 

IPv4 addresses are 32 bits long, divided into 4 segments called octets (8 bits each), separated by dots (dotted-decimal format):
\`192.168.1.100\`

Each 8-bit octet can represent a decimal value from 0 (00000000) to 255 (11111111). Therefore, the theoretical IPv4 address space spans from 0.0.0.0 to 255.255.255.255, providing 2^32 ≈ 4.29 billion possible addresses.`,
      },
      {
        title: 'Network Portion vs Host Portion',
        type: 'visual',
        content: `An IP address does two jobs at once:
1. Network Portion (Left side): Identifies which network or street the device resides on. All devices in the same physical or logical local network share the identical network prefix.
2. Host Portion (Right side): Identifies the specific device or house number on that street.

Analogy: Think of a postal address. The network portion is your ZIP code; the host portion is your specific apartment number. Routers inspect the network portion to forward packets across the internet without needing to know your individual device.`,
      },
      {
        title: 'IPv4 Legacy Classes (A, B, C, D, E)',
        type: 'concept',
        content: `Before CIDR (Classless Inter-Domain Routing) was introduced in 1993, IPv4 was rigidly divided into 5 classes based on the high-order bits of the first octet:

• Class A (1 - 126): Default mask 255.0.0.0 (/8). Designed for massive global networks (16.7M hosts each). 127 is reserved for loopback.
• Class B (128 - 191): Default mask 255.255.0.0 (/16). Designed for medium/large enterprises (65,534 hosts each).
• Class C (192 - 223): Default mask 255.255.255.0 (/24). Designed for small local networks (254 hosts each).
• Class D (224 - 239): Multicast streaming (no host addresses).
• Class E (240 - 255): Experimental / Reserved.`,
      },
      {
        title: 'Special & Private IPv4 Ranges',
        type: 'example',
        content: `Important special purpose ranges defined by IETF standards:
1. RFC 1918 Private Ranges (Non-routable on the public Internet, used inside LANs behind NAT):
   - 10.0.0.0 to 10.255.255.255 (10.0.0.0/8)
   - 172.16.0.0 to 172.31.255.255 (172.16.0.0/12)
   - 192.168.0.0 to 192.168.255.255 (192.168.0.0/16)
2. Loopback (127.0.0.0/8): Used for inter-process communication on localhost (most commonly 127.0.0.1).
3. APIPA (Automatic Private IP Addressing - 169.254.0.0/16): Automatically self-assigned by an OS when DHCP fails.`,
      },
      {
        title: 'Interactive Test: IP Fundamentals',
        type: 'quiz',
        content: 'Check your grasp of fundamental IP concepts.',
        quizQuestion: {
          question: 'If a computer fails to obtain an IP from a DHCP server and assigns itself 169.254.12.88, what type of address is this?',
          options: ['RFC 1918 Private IP', 'APIPA (Automatic Private IP Addressing)', 'Loopback Address', 'Class C Public IP'],
          correctIndex: 1,
          explanation: 'The range 169.254.0.1 to 169.254.255.254 is the link-local APIPA block used when a client cannot contact a DHCP server.',
        },
      },
    ],
  },
  {
    id: 'm2-binary-fundamentals',
    number: '02',
    title: 'Binary Fundamentals & Bitwise Math',
    badge: 'Bitwise Engine',
    estimatedTime: '12 min',
    summary: 'Understand base-2 powers, 8-bit conversions (128..1), binary subnet mask structures, and the bitwise AND logic routers use.',
    sections: [
      {
        title: 'The Powers of 2 in an Octet',
        type: 'concept',
        content: `Computers and network interface cards process addresses strictly in binary (0s and 1s). Each octet contains 8 bits. From left to right (most significant bit to least significant bit), each bit position represents a power of 2:

Bit Position: 7   6   5   4   3   2   1   0
Power of 2:   2^7 2^6 2^5 2^4 2^3 2^2 2^1 2^0
Decimal Value: 128 64  32  16   8   4   2   1

Memorizing this 8-value sequence (128, 64, 32, 16, 8, 4, 2, 1) is the single most valuable secret to calculating subnets in your head in under 5 seconds!`,
      },
      {
        title: 'Decimal to Binary Conversion',
        type: 'example',
        content: `Example: Convert 192 into binary:
- Does 192 >= 128? YES -> subtract 128, bit is 1. Remainder: 64.
- Does 64 >= 64? YES -> subtract 64, bit is 1. Remainder: 0.
- All remaining bits (32, 16, 8, 4, 2, 1) are 0.
Result: 11000000.

Example: Convert 100 into binary:
- 100 < 128 (0)
- 100 >= 64 -> bit is 1. Remainder: 36.
- 36 >= 32  -> bit is 1. Remainder: 4.
- 4 < 16    -> bit is 0.
- 4 < 8     -> bit is 0.
- 4 >= 4    -> bit is 1. Remainder: 0.
- 0 < 2     -> bit is 0.
- 0 < 1     -> bit is 0.
Result: 01100100.`,
      },
      {
        title: 'Interactive 8-Bit Converter Tool',
        type: 'interactive',
        interactiveType: 'binary-converter',
        content: 'Click the bits below to toggle them ON (1) or OFF (0) and watch the decimal sum recalculate in real-time with power-of-two additions.',
      },
      {
        title: 'The Bitwise AND Operation',
        type: 'concept',
        content: `How does a router determine which network an incoming packet belongs to?
It executes a hardware-accelerated bitwise AND between the Destination IP and the Subnet Mask.

Truth Table for AND:
1 AND 1 = 1
1 AND 0 = 0
0 AND 1 = 0
0 AND 0 = 0

Notice: An AND operation with 1 preserves the original bit; an AND operation with 0 always forces the result to 0! Because subnet masks consist of contiguous 1s followed by contiguous 0s, the mask zeros out the host bits, cleanly leaving only the Network Address!`,
      },
      {
        title: 'Interactive Test: Bitwise AND',
        type: 'quiz',
        content: 'Test your understanding of the bitwise AND operation.',
        quizQuestion: {
          question: 'What is the binary result of (11000000) AND (11110000)?',
          options: ['11000000', '11110000', '00000000', '11111111'],
          correctIndex: 0,
          explanation: 'Positions 7 and 6 both have 1 in both operands (1 AND 1 = 1). Position 5 and 4 have 0 in the first operand, so 0 AND 1 = 0. All other bits are 0.',
        },
      },
    ],
  },
  {
    id: 'm3-subnet-masks',
    number: '03',
    title: 'Subnet Masks & CIDR Notation',
    badge: 'Prefix Mastery',
    estimatedTime: '15 min',
    summary: 'Understand prefix notation (/0 to /32), why subnetting is required, and how contiguous mask bits delineate networks.',
    sections: [
      {
        title: 'What is a Subnet Mask?',
        type: 'concept',
        content: `An IP address alone cannot tell you where the network ends and where the host begins. 
A Subnet Mask is a 32-bit filter where:
- All Network bits are strictly 1s.
- All Host bits are strictly 0s.
- The 1s are ALWAYS contiguous! (You can NEVER have a valid subnet mask like 255.0.255.0 or 11010000).

Because mask bits must be consecutive 1s, we can abbreviate the mask with a forward slash followed by the count of 1s. This is known as CIDR (Classless Inter-Domain Routing) or Slash Notation:
255.255.255.0 = /24 (24 ones, 8 zeros).
255.255.255.192 = /26 (26 ones, 6 zeros).`,
      },
      {
        title: 'Interactive CIDR Slider (/0 to /32)',
        type: 'interactive',
        interactiveType: 'cidr-slider',
        content: 'Drag the slider across all 32 prefix lengths to see how network bits grow while host bits shrink, and see the exact formula results for block size and usable hosts.',
      },
      {
        title: 'Common 4th-Octet Subnet Masks',
        type: 'visual',
        content: `When subnetting a /24 class C network, you borrow bits from the 4th octet:

/24 -> 11111111.11111111.11111111.00000000 -> 255.255.255.0   (Block size: 256, 254 usable)
/25 -> 11111111.11111111.11111111.10000000 -> 255.255.255.128 (Block size: 128, 126 usable)
/26 -> 11111111.11111111.11111111.11000000 -> 255.255.255.192 (Block size: 64, 62 usable)
/27 -> 11111111.11111111.11111111.11100000 -> 255.255.255.224 (Block size: 32, 30 usable)
/28 -> 11111111.11111111.11111111.11110000 -> 255.255.255.240 (Block size: 16, 14 usable)
/29 -> 11111111.11111111.11111111.11111000 -> 255.255.255.248 (Block size: 8, 6 usable)
/30 -> 11111111.11111111.11111111.11111100 -> 255.255.255.252 (Block size: 4, 2 usable)
/31 -> Point-to-point links (RFC 3021)
/32 -> Single host route`,
      },
      {
        title: 'Interactive Test: Prefix Notation',
        type: 'quiz',
        content: 'Test your understanding of subnet masks.',
        quizQuestion: {
          question: 'What is the prefix length for the subnet mask 255.255.255.224?',
          options: ['/26', '/27', '/28', '/29'],
          correctIndex: 1,
          explanation: '255.255.255.0 is /24. The 4th octet is 224 (128 + 64 + 32 = three 1s). 24 + 3 = /27.',
        },
      },
    ],
  },
  {
    id: 'm4-subnetting-fundamentals',
    number: '04',
    title: 'Subnetting Fundamentals & Borrowed Bits',
    badge: 'The Core Method',
    estimatedTime: '18 min',
    summary: 'Learn the Magic Number method: how borrowing bits partitions broadcast domains, calculates block sizes, and locates network addresses.',
    sections: [
      {
        title: 'Why Subnet? (Broadcast Domains & Security)',
        type: 'concept',
        content: `Why do network engineers subdivide networks?
1. Contain Broadcast Storms: Broadcast packets (ARP requests, DHCP discovery) flood every device on the same local segment. Subnetting restricts broadcast domains to manageable boundaries.
2. Enhanced Security: Firewalls and access control lists (ACLs) enforce rules between different subnets (e.g., preventing guests from reaching finance servers).
3. Conserve Address Space: Without subnetting, an organization needing 40 hosts would waste an entire Class B (65,534 addresses) or Class C (254 addresses).`,
      },
      {
        title: 'The Borrowed Bits Principle',
        type: 'visual',
        content: `Subnetting is the process of borrowing bits from the HOST portion and assigning them to the NETWORK portion.

Rule 1: Number of Subnets created = 2^n (where n = number of borrowed bits).
Rule 2: Usable hosts per subnet = 2^h - 2 (where h = remaining host bits).
Why subtract 2?
- 1 is reserved for the Network Address (host bits all zeros).
- 1 is reserved for the Broadcast Address (host bits all ones).

Example: Take 192.168.1.0/24. If we borrow 2 bits to make it /26:
- Borrowed bits n = 2. Subnets created = 2^2 = 4 subnets.
- Remaining host bits h = 6. Usable hosts = 2^6 - 2 = 64 - 2 = 62 hosts per subnet.`,
      },
      {
        title: 'The Magic Number (Block Size) Shortcut',
        type: 'example',
        content: `Professional network engineers don't convert every octet to binary when working. They use the Magic Number method:

Formula:
Magic Number = 256 - [Subnet Mask value in the interesting octet]

Worked Example: Find the network and broadcast for 192.168.1.135/27
1. Identify mask: /27 = 255.255.255.224
2. Interesting octet: 4th octet (value is 224).
3. Magic Number = 256 - 224 = 32!
4. List the multiples of 32: 0, 32, 64, 96, 128, 160...
5. Locate 135: 135 falls between 128 and 160.
- Network Address = 192.168.1.128
- Next Subnet = 192.168.1.160
- Broadcast Address = 192.168.1.159 (one less than next network)
- Usable Host Range = 192.168.1.129 to 192.168.1.158.`,
      },
      {
        title: 'Interactive Test: Block Size',
        type: 'quiz',
        content: 'Check your mastery of the Magic Number calculation.',
        quizQuestion: {
          question: 'For an IP address with subnet mask 255.255.255.192, what is the block size?',
          options: ['32', '64', '128', '192'],
          correctIndex: 1,
          explanation: 'Block size = 256 - 192 = 64. The subnets increment in steps of 64 (0, 64, 128, 192).',
        },
      },
    ],
  },
  {
    id: 'm5-subnetting-table',
    number: '05',
    title: 'The Subnetting Reference Table',
    badge: 'Quick Reference',
    estimatedTime: '10 min',
    summary: 'A fast lookup reference chart for all slash notations, block sizes, masks, and usable host counts.',
    sections: [
      {
        title: 'The Comprehensive IPv4 Subnetting Matrix',
        type: 'visual',
        content: `Memorizing or keeping this table handy enables instant subnet calculations:

CIDR | Subnet Mask       | Block Size | Total IPs | Usable Hosts
/24  | 255.255.255.0     | 256        | 256       | 254
/25  | 255.255.255.128   | 128        | 128       | 126
/26  | 255.255.255.192   | 64         | 64        | 62
/27  | 255.255.255.224   | 32         | 32        | 30
/28  | 255.255.255.240   | 16         | 16        | 14
/29  | 255.255.255.248   | 8          | 8         | 6
/30  | 255.255.255.252   | 4          | 4         | 2
/31  | 255.255.255.254   | 2          | 2         | 2 (RFC 3021)
/32  | 255.255.255.255   | 1          | 1         | 1 (Host Route)`,
      },
      {
        title: 'Wildcard Masks for ACLs & OSPF',
        type: 'concept',
        content: `A Wildcard Mask is the mathematical inverse of a Subnet Mask:
Wildcard = 255.255.255.255 - Subnet Mask

Used primarily in Cisco IOS Access Control Lists (ACLs) and OSPF/EIGRP network statements:
- Subnet Mask /24: 255.255.255.0 -> Wildcard: 0.0.0.255
- Subnet Mask /26: 255.255.255.192 -> Wildcard: 0.0.0.63
- Subnet Mask /28: 255.255.255.240 -> Wildcard: 0.0.0.15
- Subnet Mask /30: 255.255.255.252 -> Wildcard: 0.0.0.3

Notice the pattern: The wildcard in the interesting octet is always (Block Size - 1)!`,
      },
      {
        title: 'Interactive Test: Usable Hosts',
        type: 'quiz',
        content: 'Verify your knowledge of the subnet table.',
        quizQuestion: {
          question: 'How many usable host IP addresses are supported in a /28 subnet?',
          options: ['16', '14', '30', '12'],
          correctIndex: 1,
          explanation: 'A /28 has 4 host bits (32 - 28 = 4). 2^4 = 16 total addresses. 16 - 2 = 14 usable hosts.',
        },
      },
    ],
  },
  {
    id: 'm6-cidr-summarization',
    number: '06',
    title: 'CIDR & Route Summarization',
    badge: 'Scalable Routing',
    estimatedTime: '15 min',
    summary: 'Classless Inter-Domain Routing, prefix aggregation, supernetting, and reducing router routing table size.',
    sections: [
      {
        title: 'Why CIDR Saved the Internet',
        type: 'concept',
        content: `In the early 1990s, the global Internet routing table was experiencing exponential explosive growth, and Class B address pools were about to be completely exhausted.

CIDR (RFC 1518 / RFC 1519) introduced two revolutionary improvements:
1. Eliminated rigid class boundaries (A, B, C): Organizations could now be allocated a /21, /23, or /28 instead of only /8, /16, or /24.
2. Route Summarization (Supernetting): Multiple continuous network prefixes can be aggregated into a single route advertisement, drastically reducing memory load on internet backbone routers.`,
      },
      {
        title: 'Route Summarization Example',
        type: 'example',
        content: `Consider a router managing four separate /24 subnets:
- 192.168.0.0/24
- 192.168.1.0/24
- 192.168.2.0/24
- 192.168.3.0/24

Convert the changing 3rd octet to binary:
0 -> 00000000
1 -> 00000001
2 -> 00000010
3 -> 00000011

Notice that the first 6 bits of the 3rd octet (000000) are identical across all four networks!
Therefore: 8 bits (octet 1) + 8 bits (octet 2) + 6 bits (octet 3) = 22 common bits.
The summarized supernet route is:
192.168.0.0/22.

A single routing entry now covers all four networks!`,
      },
      {
        title: 'Interactive Test: Route Aggregation',
        type: 'quiz',
        content: 'Test your understanding of route summarization.',
        quizQuestion: {
          question: 'Which summarized route covers both 10.1.4.0/24 and 10.1.5.0/24?',
          options: ['10.1.4.0/23', '10.1.0.0/22', '10.1.4.0/22', '10.1.0.0/16'],
          correctIndex: 0,
          explanation: '4 in binary is 00000100 and 5 is 00000101. They share the first 7 bits of the 3rd octet. 8 + 8 + 7 = 23. The summary route is 10.1.4.0/23.',
        },
      },
    ],
  },
  {
    id: 'm7-vlsm',
    number: '07',
    title: 'VLSM (Variable Length Subnet Masking)',
    badge: 'Advanced Design',
    estimatedTime: '20 min',
    summary: 'Design real-world networks with different subnet sizes, minimize IP waste, and master the golden Largest-First rule.',
    sections: [
      {
        title: 'FLSM vs VLSM',
        type: 'concept',
        content: `Fixed-Length Subnet Masking (FLSM):
Every subnet in the organization uses the identical subnet mask. If you have one department with 100 hosts and a WAN link with only 2 routers, both receive a /25 (126 hosts). The WAN link wastes 124 IP addresses!

Variable-Length Subnet Masking (VLSM):
Allows network engineers to assign different subnet masks to different subnets based on individual host requirements.
- Large department (100 hosts): assign /25 (126 usable)
- Medium department (50 hosts): assign /26 (62 usable)
- Point-to-point router link (2 hosts): assign /30 (2 usable)
Zero wasted address space!`,
      },
      {
        title: 'The Golden Rule of VLSM: Largest First',
        type: 'visual',
        content: `To prevent subnet overlaps and fragmentation, ALWAYS allocate subnets in descending order of needed hosts:

1. Department A: 120 hosts -> Needs /25 (block size 128)
2. Department B: 50 hosts  -> Needs /26 (block size 64)
3. Department C: 20 hosts  -> Needs /27 (block size 32)
4. WAN Links: 2 hosts      -> Needs /30 (block size 4)

If you attempt to allocate smaller subnets first, larger subnets may not fall on legitimate power-of-2 network boundaries, corrupting the routing table!`,
      },
      {
        title: 'Interactive VLSM Lab Tool',
        type: 'interactive',
        interactiveType: 'vlsm-planner',
        content: 'Use our VLSM Planner to customize host requirements, view the visual address allocation bar, and ensure no subnet collisions.',
      },
      {
        title: 'Interactive Test: VLSM Sizing',
        type: 'quiz',
        content: 'Verify your VLSM planning skills.',
        quizQuestion: {
          question: 'If a branch office needs to support 27 host computers, what is the most efficient subnet mask to assign?',
          options: ['/28 (255.255.255.240)', '/27 (255.255.255.224)', '/26 (255.255.255.192)', '/25 (255.255.255.128)'],
          correctIndex: 1,
          explanation: '/28 provides only 14 usable hosts (not enough). /27 provides 30 usable hosts (2^5 - 2 = 30), which accommodates 27 hosts with minimal waste.',
        },
      },
    ],
  },
  {
    id: 'm8-subnet-calculator-guide',
    number: '08',
    title: 'Professional Subnet Calculation & Troubleshooting',
    badge: 'Field Engineering',
    estimatedTime: '15 min',
    summary: 'Diagnose common network failures: overlapping subnets, incorrect default gateways, and broadcast misconfigurations.',
    sections: [
      {
        title: 'Common Network Troubleshooting Traps',
        type: 'concept',
        content: `In production environments and certification exams, these are the 4 most frequent subnetting errors:
1. Assigning the Network or Broadcast Address to a Host: If a subnet is 192.168.1.0/26, configuring a PC with 192.168.1.63 will trigger an IP conflict or packet loop because .63 is the broadcast address!
2. Default Gateway on a Different Subnet: If a PC is 192.168.1.70/26 (subnet is .64 to .127) and its default gateway is set to 192.168.1.1 (which is in subnet .0 to .63), the PC cannot ARP for its gateway without a proxy router!
3. Overlapping Subnets: Configuring two router interfaces with intersecting address ranges leads to routing ambiguity and dropped packets.
4. Mask Mismatch: Two devices on the same physical switch configured with different subnet masks (/24 vs /26) may experience asymmetric communication failures.`,
      },
      {
        title: 'Interactive Subnet Calculator & Step Solver',
        type: 'interactive',
        interactiveType: 'subnet-calculator',
        content: 'Enter any IPv4 address and CIDR prefix into the solver below to inspect the step-by-step mathematical breakdown and binary analyzer.',
      },
      {
        title: 'Interactive Test: Subnet Troubleshooting',
        type: 'quiz',
        content: 'Test your real-world troubleshooting skills.',
        quizQuestion: {
          question: 'A network administrator attempts to assign 172.16.10.127 /25 to a server, but the operating system rejects it with an error. Why?',
          options: ['172.16.10.127 is the network address for that subnet', '172.16.10.127 is the broadcast address for that subnet', 'Class B addresses cannot use /25', 'The IP is reserved by IANA'],
          correctIndex: 1,
          explanation: 'For 172.16.10.0/25, the block size is 128. The range is .0 to .127. .127 is the broadcast address and cannot be assigned to any individual host interface.',
        },
      },
    ],
  },
];
