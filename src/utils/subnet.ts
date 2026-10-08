import { SubnetResult, VlsmAllocatedSubnet, VlsmDepartment } from '../types';

export function validateIPv4(ip: string): { valid: boolean; error?: string } {
  const trimmed = ip.trim();
  if (!trimmed) {
    return { valid: false, error: 'Please enter an IPv4 address.' };
  }

  const parts = trimmed.split('.');
  if (parts.length !== 4) {
    return {
      valid: false,
      error: `An IPv4 address must consist of exactly 4 octets separated by dots (e.g. 192.168.1.1). Found ${parts.length} part(s).`,
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
        error: `Octet ${i + 1} ("${part}") is out of valid range (0 - 255). IPv4 values cannot exceed 255.`,
      };
    }
    // Check leading zeros (like 01 or 001, except single 0)
    if (part.length > 1 && part.startsWith('0')) {
      return { valid: false, error: `Octet ${i + 1} ("${part}") has invalid leading zeros.` };
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
  if (cidr === 0) return '0.0.0.0';
  const mask = ((0xffffffff << (32 - cidr)) >>> 0);
  return longToIp(mask);
}

export function maskToCidr(mask: string): number {
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

export function cidrToWildcard(cidr: number): string {
  if (cidr === 0) return '255.255.255.255';
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
  if (firstOctet >= 1 && firstOctet <= 126) return 'A';
  if (firstOctet >= 128 && firstOctet <= 191) return 'B';
  if (firstOctet >= 192 && firstOctet <= 223) return 'C';
  if (firstOctet >= 224 && firstOctet <= 239) return 'D';
  return 'E';
}

export function getIpType(ip: string): SubnetResult['ipType'] {
  const octets = ip.split('.').map((o) => parseInt(o, 10));
  const [o1, o2] = octets;

  if (o1 === 127) return 'Loopback';
  if (o1 === 169 && o2 === 254) return 'APIPA';
  if (o1 === 10) return 'Private (RFC 1918)';
  if (o1 === 172 && o2 >= 16 && o2 <= 31) return 'Private (RFC 1918)';
  if (o1 === 192 && o2 === 168) return 'Private (RFC 1918)';
  if (o1 >= 224 && o1 <= 239) return 'Multicast';
  if (o1 >= 240) return 'Reserved';

  return 'Public';
}

export function calculateSubnet(ipStr: string, cidr: number): SubnetResult {
  const ipLong = ipToLong(ipStr);
  const maskLong = cidr === 0 ? 0 : ((0xffffffff << (32 - cidr)) >>> 0);
  const wildcardLong = (~maskLong) >>> 0;

  const networkLong = (ipLong & maskLong) >>> 0;
  const broadcastLong = (networkLong | wildcardLong) >>> 0;

  const totalAddresses = Math.pow(2, 32 - cidr);
  let usableHosts = 0;
  let firstUsableLong = networkLong;
  let lastUsableLong = broadcastLong;

  if (cidr === 32) {
    usableHosts = 1;
    firstUsableLong = networkLong;
    lastUsableLong = networkLong;
  } else if (cidr === 31) {
    // RFC 3021: point-to-point links have 2 usable addresses
    usableHosts = 2;
    firstUsableLong = networkLong;
    lastUsableLong = broadcastLong;
  } else if (cidr <= 30) {
    usableHosts = totalAddresses - 2;
    firstUsableLong = (networkLong + 1) >>> 0;
    lastUsableLong = (broadcastLong - 1) >>> 0;
  }

  const maskStr = longToIp(maskLong);
  const wildcardStr = longToIp(wildcardLong);
  const networkStr = longToIp(networkLong);
  const broadcastStr = longToIp(broadcastLong);
  const firstHostStr = longToIp(firstUsableLong);
  const lastHostStr = longToIp(lastUsableLong);

  // Identify interesting octet (1..4)
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
    'Classless / Specialized';

  const ipOctets = ipStr.split('.').map(Number);
  const currentOctetVal = ipOctets[interestingOctet - 1];
  const octetNetworkVal = Math.floor(currentOctetVal / blockSize) * blockSize;
  const octetBroadcastVal = octetNetworkVal + blockSize - 1;

  // Step-by-step breakdown
  const steps = [
    {
      title: 'Step 1: Determine the Subnet Mask',
      description: `A prefix of /${cidr} means ${cidr} consecutive '1' bits followed by ${32 - cidr} '0' bits. This evaluates to ${maskStr}.`,
      formula: `/${cidr} = ${maskStr}`,
    },
    {
      title: 'Step 2: Identify the "Interesting Octet" & Block Size',
      description: `The subnetting occurs in Octet #${interestingOctet} where the mask value is ${interestingMaskValue}. The Magic Number (Block Size) is calculated by subtracting the mask value from 256: 256 - ${interestingMaskValue} = ${blockSize}.`,
      formula: `Block Size = 256 - ${interestingMaskValue} = ${blockSize}`,
    },
    {
      title: 'Step 3: Calculate Subnet Multiples & Locate IP',
      description: `The subnets in Octet #${interestingOctet} count by multiples of ${blockSize}: 0, ${blockSize}, ${blockSize * 2}, ${blockSize * 3}... The target IP octet value is ${currentOctetVal}, which falls between ${octetNetworkVal} and ${octetBroadcastVal}.`,
      formula: `Multiples of ${blockSize} ➔ [${octetNetworkVal} ... ${octetBroadcastVal}]`,
    },
    {
      title: 'Step 4: Establish Network & Broadcast Addresses',
      description: `The Network Address starts at ${networkStr} (host bits all 0). The Broadcast Address is the very last address in the block: ${broadcastStr} (host bits all 1).`,
      formula: `Network = ${networkStr} | Broadcast = ${broadcastStr}`,
    },
    {
      title: 'Step 5: Determine Usable Host Range & Usable Count',
      description: `Usable hosts lie strictly between the Network and Broadcast addresses: ${firstHostStr} through ${lastHostStr}. Total address space is 2^${32 - cidr} = ${totalAddresses}. Subtracting 2 (Network + Broadcast) leaves ${usableHosts} usable host IP addresses.`,
      formula: `Usable Hosts = 2^${32 - cidr} - 2 = ${usableHosts}`,
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
    ipType: getIpType(ipStr),
    binaryIp: ipToBinaryOctets(ipStr),
    binaryMask: ipToBinaryOctets(maskStr),
    binaryNetwork: ipToBinaryOctets(networkStr),
    steps,
  };
}

/**
 * VLSM allocation algorithm
 */
export function calculateVlsm(
  baseNetwork: string,
  baseCidr: number,
  departments: VlsmDepartment[]
): {
  success: boolean;
  allocations: VlsmAllocatedSubnet[];
  error?: string;
  totalNeeded: number;
  totalAllocated: number;
  totalAvailable: number;
} {
  const totalAvailable = Math.pow(2, 32 - baseCidr);
  const baseNetworkLong = ipToLong(baseNetwork);

  // Validate base network is clean network boundary
  const maskLong = baseCidr === 0 ? 0 : ((0xffffffff << (32 - baseCidr)) >>> 0);
  if ((baseNetworkLong & maskLong) >>> 0 !== baseNetworkLong) {
    const properNetwork = longToIp((baseNetworkLong & maskLong) >>> 0);
    return {
      success: false,
      allocations: [],
      error: `Base IP ${baseNetwork} is not a valid network boundary for /${baseCidr}. The correct base network address is ${properNetwork}/${baseCidr}.`,
      totalNeeded: 0,
      totalAllocated: 0,
      totalAvailable,
    };
  }

  // Sort departments by needed hosts descending (Golden rule of VLSM)
  const sorted = [...departments].sort((a, b) => b.neededHosts - a.neededHosts);

  const allocations: VlsmAllocatedSubnet[] = [];
  let currentIpLong = baseNetworkLong;
  let totalNeeded = 0;
  let totalAllocated = 0;

  for (const dept of sorted) {
    totalNeeded += dept.neededHosts;
    // Calculate required host bits h such that 2^h - 2 >= neededHosts
    // For 1 or 2 hosts: if neededHosts == 2, 2^2 - 2 = 2 (/30), etc.
    let hostBits = 2; // minimum 2 bits for 2 hosts (slash 30)
    while (Math.pow(2, hostBits) - 2 < dept.neededHosts && hostBits < 32) {
      hostBits++;
    }

    const cidr = 32 - hostBits;
    const blockSize = Math.pow(2, hostBits);
    totalAllocated += blockSize;

    // Check if we exhausted the available address block
    if (currentIpLong + blockSize - 1 > baseNetworkLong + totalAvailable - 1) {
      return {
        success: false,
        allocations,
        error: `Address space exhausted! "${dept.name}" requires ${dept.neededHosts} hosts (block of ${blockSize}), which exceeds the available capacity of ${baseNetwork}/${baseCidr} (${totalAvailable} addresses).`,
        totalNeeded,
        totalAllocated,
        totalAvailable,
      };
    }

    const netLong = currentIpLong;
    const bcastLong = (netLong + blockSize - 1) >>> 0;
    const firstHostLong = (netLong + 1) >>> 0;
    const lastHostLong = (bcastLong - 1) >>> 0;

    allocations.push({
      id: dept.id,
      name: dept.name,
      neededHosts: dept.neededHosts,
      allocatedHosts: blockSize - 2,
      cidr,
      subnetMask: cidrToMask(cidr),
      networkAddress: longToIp(netLong),
      broadcastAddress: longToIp(bcastLong),
      firstUsableHost: longToIp(firstHostLong),
      lastUsableHost: longToIp(lastHostLong),
      wastedHosts: blockSize - 2 - dept.neededHosts,
    });

    currentIpLong = (bcastLong + 1) >>> 0;
  }

  return {
    success: true,
    allocations,
    totalNeeded,
    totalAllocated,
    totalAvailable,
  };
}

/**
 * Generate a dynamic practice problem
 */
export function generateRandomProblem(): {
  ip: string;
  cidr: number;
  questionType: 'network' | 'broadcast' | 'firstHost' | 'lastHost' | 'usableHosts' | 'mask';
  prompt: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
} {
  const commonPrefixes = [24, 25, 26, 27, 28, 29, 30, 22, 23, 20, 16];
  const cidr = commonPrefixes[Math.floor(Math.random() * commonPrefixes.length)];
  
  // Pick random realistic IP
  const octet1 = [192, 172, 10][Math.floor(Math.random() * 3)];
  const octet2 = octet1 === 192 ? 168 : octet1 === 172 ? Math.floor(Math.random() * 16) + 16 : Math.floor(Math.random() * 254) + 1;
  const octet3 = Math.floor(Math.random() * 254) + 1;
  const octet4 = Math.floor(Math.random() * 254) + 1;
  const ip = `${octet1}.${octet2}.${octet3}.${octet4}`;

  const res = calculateSubnet(ip, cidr);

  const types: ('network' | 'broadcast' | 'firstHost' | 'lastHost' | 'usableHosts' | 'mask')[] = [
    'network',
    'broadcast',
    'firstHost',
    'lastHost',
    'usableHosts',
    'mask',
  ];
  const qType = types[Math.floor(Math.random() * types.length)];

  let prompt = '';
  let correctAnswer = '';
  let distractors: string[] = [];
  let explanation = '';

  switch (qType) {
    case 'network':
      prompt = `Given the IP ${ip}/${cidr}, what is the Network Address?`;
      correctAnswer = res.networkAddress;
      distractors = [
        ip,
        res.firstUsableHost,
        longToIp(ipToLong(res.networkAddress) + res.blockSize),
        res.broadcastAddress,
      ];
      explanation = `With /${cidr}, the block size in octet ${res.interestingOctet} is ${res.blockSize}. The network boundary for ${ip} begins at ${res.networkAddress}.`;
      break;

    case 'broadcast':
      prompt = `Given the IP ${ip}/${cidr}, what is the Broadcast Address?`;
      correctAnswer = res.broadcastAddress;
      distractors = [
        res.lastUsableHost,
        longToIp(ipToLong(res.networkAddress) + res.blockSize),
        res.networkAddress,
        '255.255.255.255',
      ];
      explanation = `The block size is ${res.blockSize}. The broadcast address is the final address of this subnet (${res.broadcastAddress}), with all host bits set to 1.`;
      break;

    case 'firstHost':
      prompt = `What is the First Usable Host address for ${ip}/${cidr}?`;
      correctAnswer = res.firstUsableHost;
      distractors = [
        res.networkAddress,
        longToIp(ipToLong(res.firstUsableHost) + 1),
        res.lastUsableHost,
        ip,
      ];
      explanation = `The first usable host is always Network Address + 1 (${res.networkAddress} + 1 = ${res.firstUsableHost}).`;
      break;

    case 'lastHost':
      prompt = `What is the Last Usable Host address for ${ip}/${cidr}?`;
      correctAnswer = res.lastUsableHost;
      distractors = [
        res.broadcastAddress,
        longToIp(ipToLong(res.lastUsableHost) - 1),
        res.firstUsableHost,
        res.networkAddress,
      ];
      explanation = `The last usable host is always Broadcast Address - 1 (${res.broadcastAddress} - 1 = ${res.lastUsableHost}).`;
      break;

    case 'usableHosts':
      prompt = `How many usable host IP addresses are available in a /${cidr} subnet?`;
      correctAnswer = res.usableHosts.toString();
      distractors = [
        res.totalAddresses.toString(),
        (res.usableHosts + 2).toString(),
        (Math.max(0, res.usableHosts - 2)).toString(),
        (Math.pow(2, 32 - cidr) / 2).toString(),
      ];
      explanation = `Total addresses = 2^${32 - cidr} = ${res.totalAddresses}. Usable hosts = 2^${32 - cidr} - 2 = ${res.usableHosts} (subtracting 1 Network and 1 Broadcast).`;
      break;

    case 'mask':
      prompt = `What is the decimal subnet mask for prefix /${cidr}?`;
      correctAnswer = res.subnetMask;
      distractors = [
        res.wildcardMask,
        cidrToMask(Math.min(32, cidr + 1)),
        cidrToMask(Math.max(1, cidr - 1)),
        '255.255.255.0',
      ];
      explanation = `/${cidr} has ${cidr} contiguous 1 bits in the mask, corresponding to ${res.subnetMask}.`;
      break;
  }

  // Deduplicate options and ensure 4 options
  const uniqueDistractors = Array.from(new Set(distractors.filter((d) => d !== correctAnswer)));
  while (uniqueDistractors.length < 3) {
    uniqueDistractors.push(longToIp(Math.floor(Math.random() * 0xffffffff)));
  }
  const chosenOptions = [correctAnswer, ...uniqueDistractors.slice(0, 3)].sort(
    () => Math.random() - 0.5
  );

  return {
    ip,
    cidr,
    questionType: qType,
    prompt,
    correctAnswer,
    options: chosenOptions,
    explanation,
  };
}
