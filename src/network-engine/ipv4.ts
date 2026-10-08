export interface IPv4Details {
  ip: string;
  cidr: number;
  subnetMask: string;
  wildcardMask: string;
  networkAddress: string;
  broadcastAddress: string;
  firstUsableHost: string;
  lastUsableHost: string;
  totalAddresses: number;
  usableHosts: number;
  blockSize: number;
  interestingOctet: number; // 1, 2, 3, 4
  networkBits: number;
  hostBits: number;
  ipClass: 'A' | 'B' | 'C' | 'D' | 'E';
  defaultClassMask: string;
  ipType: 
    | 'Private (RFC 1918)'
    | 'CGNAT (RFC 6598)'
    | 'Public'
    | 'Loopback'
    | 'APIPA / Link-Local'
    | 'Multicast'
    | 'Broadcast'
    | 'Documentation'
    | 'Benchmark'
    | 'Reserved';
  binaryIp: string[];
  binaryMask: string[];
  binaryNetwork: string[];
  binaryWildcard: string[];
  steps: {
    title: string;
    description: string;
    formula?: string;
  }[];
}

export function validateIPv4(ip: string): { valid: boolean; error?: string } {
  const trimmed = ip.trim();
  if (!trimmed) {
    return { valid: false, error: 'Please enter an IPv4 address.' };
  }

  const parts = trimmed.split('.');
  if (parts.length !== 4) {
    return {
      valid: false,
      error: `IPv4 requires exactly 4 octets separated by dots (e.g. 192.168.1.1). Found ${parts.length} part(s).`,
    };
  }

  for (let i = 0; i < 4; i++) {
    const part = parts[i];
    if (part === '') {
      return { valid: false, error: `Octet ${i + 1} is empty.` };
    }
    if (!/^\d+$/.test(part)) {
      return { valid: false, error: `Octet ${i + 1} ("${part}") contains non-numeric characters.` };
    }
    const num = parseInt(part, 10);
    if (num < 0 || num > 255) {
      return {
        valid: false,
        error: `Octet ${i + 1} ("${part}") is outside the valid range 0–255.`,
      };
    }
    if (part.length > 1 && part.startsWith('0')) {
      return { valid: false, error: `Octet ${i + 1} ("${part}") contains invalid leading zeros.` };
    }
  }

  return { valid: true };
}

export function ipToLong(ip: string): number {
  return ip
    .split('.')
    .reduce((acc, octet) => ((acc << 8) + parseInt(octet, 10)) >>> 0, 0);
}

export function longToIp(long: number): string {
  return [
    (long >>> 24) & 255,
    (long >>> 16) & 255,
    (long >>> 8) & 255,
    long & 255,
  ].join('.');
}

export function cidrToMask(cidr: number): string {
  if (cidr < 0 || cidr > 32) return '255.255.255.0';
  if (cidr === 0) return '0.0.0.0';
  const mask = ((0xffffffff << (32 - cidr)) >>> 0);
  return longToIp(mask);
}

export function maskToCidr(mask: string): number {
  const validation = validateIPv4(mask);
  if (!validation.valid) return 24;
  const long = ipToLong(mask);
  let count = 0;
  for (let i = 31; i >= 0; i--) {
    if ((long & (1 << i)) !== 0) {
      count++;
    } else {
      break;
    }
  }
  return count;
}

export function isContiguousSubnetMask(mask: string): boolean {
  const validation = validateIPv4(mask);
  if (!validation.valid) return false;
  const long = ipToLong(mask);
  // Check that trailing zeros follow leading ones
  let foundZero = false;
  for (let i = 31; i >= 0; i--) {
    const bit = (long & (1 << i)) !== 0;
    if (foundZero && bit) return false; // a '1' appeared after a '0'
    if (!bit) foundZero = true;
  }
  return true;
}

export function cidrToWildcard(cidr: number): string {
  if (cidr <= 0) return '255.255.255.255';
  if (cidr >= 32) return '0.0.0.0';
  const maskLong = ((0xffffffff << (32 - cidr)) >>> 0);
  const wildcardLong = (~maskLong) >>> 0;
  return longToIp(wildcardLong);
}

export function ipToBinaryOctets(ip: string): string[] {
  return ip.split('.').map((octet) => {
    const num = parseInt(octet, 10);
    return num.toString(2).padStart(8, '0');
  });
}

export function getIpClass(ip: string): 'A' | 'B' | 'C' | 'D' | 'E' {
  const firstOctet = parseInt(ip.split('.')[0], 10);
  if (firstOctet >= 0 && firstOctet <= 127) return 'A';
  if (firstOctet >= 128 && firstOctet <= 191) return 'B';
  if (firstOctet >= 192 && firstOctet <= 223) return 'C';
  if (firstOctet >= 224 && firstOctet <= 239) return 'D';
  return 'E';
}

export function getIpClassification(ip: string): IPv4Details['ipType'] {
  const octets = ip.split('.').map((o) => parseInt(o, 10));
  const [o1, o2] = octets;

  if (ip === '255.255.255.255') return 'Broadcast';
  if (o1 === 127) return 'Loopback';
  if (o1 === 169 && o2 === 254) return 'APIPA / Link-Local';
  // RFC 1918 Private Ranges:
  if (o1 === 10) return 'Private (RFC 1918)';
  if (o1 === 172 && o2 >= 16 && o2 <= 31) return 'Private (RFC 1918)';
  if (o1 === 192 && o2 === 168) return 'Private (RFC 1918)';
  // RFC 6598 CGNAT (Carrier-Grade NAT: 100.64.0.0/10)
  if (o1 === 100 && o2 >= 64 && o2 <= 127) return 'CGNAT (RFC 6598)';
  // RFC 5737 Documentation (192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24)
  if (o1 === 192 && o2 === 0 && octets[2] === 2) return 'Documentation';
  if (o1 === 198 && o2 === 51 && octets[2] === 100) return 'Documentation';
  if (o1 === 203 && o2 === 0 && octets[2] === 113) return 'Documentation';
  // RFC 2544 Benchmarking (198.18.0.0/15)
  if (o1 === 198 && (o2 === 18 || o2 === 19)) return 'Benchmark';
  // Class D Multicast
  if (o1 >= 224 && o1 <= 239) return 'Multicast';
  // Class E Reserved
  if (o1 >= 240) return 'Reserved';

  return 'Public';
}

export function calculateIPv4(ipStr: string, cidr: number): IPv4Details {
  const ipLong = ipToLong(ipStr);
  const maskLong = cidr === 0 ? 0 : ((0xffffffff << (32 - cidr)) >>> 0);
  const wildcardLong = (~maskLong) >>> 0;

  const networkLong = (ipLong & maskLong) >>> 0;
  const broadcastLong = (networkLong | wildcardLong) >>> 0;

  const totalAddresses = cidr === 0 ? 4294967296 : Math.pow(2, 32 - cidr);
  let usableHosts = 0;
  let firstUsableLong = networkLong;
  let lastUsableLong = broadcastLong;

  if (cidr === 32) {
    usableHosts = 1;
    firstUsableLong = networkLong;
    lastUsableLong = networkLong;
  } else if (cidr === 31) {
    // RFC 3021 Point-to-Point links
    usableHosts = 2;
    firstUsableLong = networkLong;
    lastUsableLong = broadcastLong;
  } else if (cidr === 0) {
    usableHosts = 4294967294;
    firstUsableLong = 1;
    lastUsableLong = 4294967294;
  } else {
    usableHosts = Math.max(0, totalAddresses - 2);
    firstUsableLong = (networkLong + 1) >>> 0;
    lastUsableLong = (broadcastLong - 1) >>> 0;
  }

  const maskStr = longToIp(maskLong);
  const wildcardStr = longToIp(wildcardLong);
  const networkStr = longToIp(networkLong);
  const broadcastStr = longToIp(broadcastLong);
  const firstHostStr = longToIp(firstUsableLong);
  const lastHostStr = longToIp(lastUsableLong);

  let interestingOctet = Math.floor(cidr / 8) + 1;
  if (cidr === 32) interestingOctet = 4;
  if (interestingOctet > 4) interestingOctet = 4;

  const maskOctets = maskStr.split('.').map(Number);
  const interestingMaskValue = maskOctets[interestingOctet - 1];
  const blockSize = 256 - interestingMaskValue;

  const ipClass = getIpClass(ipStr);
  const defaultClassMask =
    ipClass === 'A' ? '255.0.0.0 (/8)' :
    ipClass === 'B' ? '255.255.0.0 (/16)' :
    ipClass === 'C' ? '255.255.255.0 (/24)' :
    'Classless';

  const ipOctets = ipStr.split('.').map(Number);
  const currentOctetVal = ipOctets[interestingOctet - 1];
  const octetNetworkVal = Math.floor(currentOctetVal / blockSize) * blockSize;
  const octetBroadcastVal = octetNetworkVal + blockSize - 1;

  const steps = [
    {
      title: 'Step 1: Prefix Length & Subnet Mask',
      description: `Prefix /${cidr} converts to ${cidr} network '1' bits followed by ${32 - cidr} host '0' bits, producing the subnet mask ${maskStr}.`,
      formula: `/${cidr} = ${maskStr}`,
    },
    {
      title: 'Step 2: Interesting Octet & Magic Number (Block Size)',
      description: `Subnet boundary lands in Octet #${interestingOctet} where the mask is ${interestingMaskValue}. The block size is 256 - ${interestingMaskValue} = ${blockSize}.`,
      formula: `Block Size = 256 - ${interestingMaskValue} = ${blockSize}`,
    },
    {
      title: 'Step 3: Finding the Network Interval',
      description: `Subnets in Octet #${interestingOctet} increment in multiples of ${blockSize}: [${octetNetworkVal} ... ${octetBroadcastVal}]. The target octet value ${currentOctetVal} falls inside this block.`,
      formula: `Multiples of ${blockSize} ➔ ${octetNetworkVal} to ${octetBroadcastVal}`,
    },
    {
      title: 'Step 4: Network and Directed Broadcast Addresses',
      description: `Network Address is ${networkStr} (host bits all 0). Broadcast Address is ${broadcastStr} (host bits all 1).`,
      formula: `Network = ${networkStr} | Broadcast = ${broadcastStr}`,
    },
    {
      title: 'Step 5: Usable Host IP Range',
      description: cidr === 31 
        ? `Per RFC 3021 (Point-to-Point Links), both ${networkStr} and ${broadcastStr} are usable host addresses.`
        : cidr === 32
        ? `A /32 represents a single host route (${networkStr}).`
        : `Usable host IP addresses span from ${firstHostStr} through ${lastHostStr} (${usableHosts.toLocaleString()} usable hosts).`,
      formula: cidr >= 31 ? `Special CIDR /${cidr}` : `Usable = 2^${32 - cidr} - 2 = ${usableHosts.toLocaleString()}`,
    },
  ];

  return {
    ip: ipStr,
    cidr,
    subnetMask: maskStr,
    wildcardMask: wildcardStr,
    networkAddress: networkStr,
    broadcastAddress: broadcastStr,
    firstUsableHost: firstHostStr,
    lastUsableHost: lastHostStr,
    totalAddresses,
    usableHosts,
    blockSize,
    interestingOctet,
    networkBits: cidr,
    hostBits: 32 - cidr,
    ipClass,
    defaultClassMask,
    ipType: getIpClassification(ipStr),
    binaryIp: ipToBinaryOctets(ipStr),
    binaryMask: ipToBinaryOctets(maskStr),
    binaryNetwork: ipToBinaryOctets(networkStr),
    binaryWildcard: ipToBinaryOctets(wildcardStr),
    steps,
  };
}
