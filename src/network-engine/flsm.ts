import { ipToLong, longToIp, validateIPv4, cidrToMask } from './ipv4';

export interface FlsmDivisionResult {
  valid: boolean;
  error?: string;
  baseNetwork: string;
  baseCidr: number;
  newCidr: number;
  newMask: string;
  borrowedBits: number;
  totalSubnetsCreated: number;
  hostsPerSubnet: number;
  subnets: {
    index: number;
    network: string;
    cidr: number;
    firstHost: string;
    lastHost: string;
    broadcast: string;
    usableCount: number;
  }[];
}

export function calculateFlsm(
  baseNetwork: string,
  baseCidr: number,
  mode: 'by-subnets' | 'by-hosts',
  targetValue: number
): FlsmDivisionResult {
  const val = validateIPv4(baseNetwork);
  if (!val.valid) {
    return {
      valid: false,
      error: val.error,
      baseNetwork,
      baseCidr,
      newCidr: baseCidr,
      newMask: cidrToMask(baseCidr),
      borrowedBits: 0,
      totalSubnetsCreated: 0,
      hostsPerSubnet: 0,
      subnets: [],
    };
  }

  let borrowedBits = 0;
  let newCidr = baseCidr;

  if (mode === 'by-subnets') {
    // Need at least targetValue subnets: 2^borrowedBits >= targetValue
    while (Math.pow(2, borrowedBits) < targetValue && baseCidr + borrowedBits <= 32) {
      borrowedBits++;
    }
    newCidr = baseCidr + borrowedBits;
  } else {
    // Need at least targetValue hosts per subnet: 2^hostBits - 2 >= targetValue
    let hostBits = 0;
    while (Math.pow(2, hostBits) - 2 < targetValue && hostBits <= (32 - baseCidr)) {
      hostBits++;
    }
    newCidr = 32 - hostBits;
    borrowedBits = Math.max(0, newCidr - baseCidr);
  }

  if (newCidr > 32 || newCidr < baseCidr) {
    return {
      valid: false,
      error: `Cannot divide /${baseCidr} to satisfy the requirement. Exceeds 32 IPv4 bits.`,
      baseNetwork,
      baseCidr,
      newCidr: baseCidr,
      newMask: cidrToMask(baseCidr),
      borrowedBits: 0,
      totalSubnetsCreated: 0,
      hostsPerSubnet: 0,
      subnets: [],
    };
  }

  const totalSubnets = Math.pow(2, borrowedBits);
  const hostBits = 32 - newCidr;
  const blockSize = Math.pow(2, hostBits);
  const usableCount = newCidr === 31 ? 2 : newCidr === 32 ? 1 : Math.max(0, blockSize - 2);

  const baseLong = ipToLong(baseNetwork);
  const baseMask = baseCidr === 0 ? 0 : ((0xffffffff << (32 - baseCidr)) >>> 0);
  const networkStartLong = (baseLong & baseMask) >>> 0;

  // Generate subnets (limit to first 64 to keep render performant if millions requested)
  const displayLimit = Math.min(64, totalSubnets);
  const subnetsList: FlsmDivisionResult['subnets'] = [];

  for (let i = 0; i < displayLimit; i++) {
    const netLong = (networkStartLong + i * blockSize) >>> 0;
    const bcastLong = (netLong + blockSize - 1) >>> 0;
    const firstLong = newCidr >= 31 ? netLong : (netLong + 1) >>> 0;
    const lastLong = newCidr >= 31 ? bcastLong : (bcastLong - 1) >>> 0;

    subnetsList.push({
      index: i + 1,
      network: longToIp(netLong),
      cidr: newCidr,
      firstHost: longToIp(firstLong),
      lastHost: longToIp(lastLong),
      broadcast: longToIp(bcastLong),
      usableCount,
    });
  }

  return {
    valid: true,
    baseNetwork: longToIp(networkStartLong),
    baseCidr,
    newCidr,
    newMask: cidrToMask(newCidr),
    borrowedBits,
    totalSubnetsCreated: totalSubnets,
    hostsPerSubnet: usableCount,
    subnets: subnetsList,
  };
}
