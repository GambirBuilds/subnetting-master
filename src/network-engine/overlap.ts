import { ipToLong, longToIp, validateIPv4 } from './ipv4';

export interface SubnetEntry {
  id: string;
  cidrNotation: string;
  ip: string;
  cidr: number;
  startLong: number;
  endLong: number;
  startIp: string;
  endIp: string;
}

export interface OverlapCollision {
  subnetA: string;
  subnetB: string;
  type: 'Exact Collision' | 'Nested / Subnet of' | 'Partial Overlap';
  details: string;
}

export interface OverlapAnalysisResult {
  hasOverlaps: boolean;
  subnets: SubnetEntry[];
  collisions: OverlapCollision[];
  safeCount: number;
  error?: string;
}

export function detectSubnetOverlaps(cidrList: string[]): OverlapAnalysisResult {
  const cleaned = cidrList.map((s) => s.trim()).filter(Boolean);
  const subnets: SubnetEntry[] = [];
  const collisions: OverlapCollision[] = [];

  for (let i = 0; i < cleaned.length; i++) {
    const item = cleaned[i];
    let ip = item;
    let cidr = 24;
    if (item.includes('/')) {
      const parts = item.split('/');
      ip = parts[0].trim();
      cidr = parseInt(parts[1].trim(), 10) || 24;
    }

    const val = validateIPv4(ip);
    if (!val.valid) {
      return {
        hasOverlaps: false,
        subnets: [],
        collisions: [],
        safeCount: 0,
        error: `Subnet #${i + 1} ("${item}") is invalid: ${val.error}`,
      };
    }

    if (cidr < 0 || cidr > 32) {
      return {
        hasOverlaps: false,
        subnets: [],
        collisions: [],
        safeCount: 0,
        error: `CIDR prefix /${cidr} in "${item}" is outside 0–32.`,
      };
    }

    const ipLong = ipToLong(ip);
    const maskLong = cidr === 0 ? 0 : ((0xffffffff << (32 - cidr)) >>> 0);
    const networkLong = (ipLong & maskLong) >>> 0;
    const wildcardLong = (~maskLong) >>> 0;
    const broadcastLong = (networkLong | wildcardLong) >>> 0;

    subnets.push({
      id: `sub-${i}`,
      cidrNotation: `${longToIp(networkLong)}/${cidr}`,
      ip,
      cidr,
      startLong: networkLong,
      endLong: broadcastLong,
      startIp: longToIp(networkLong),
      endIp: longToIp(broadcastLong),
    });
  }

  // Compare every pair for overlaps
  for (let a = 0; a < subnets.length; a++) {
    for (let b = a + 1; b < subnets.length; b++) {
      const subA = subnets[a];
      const subB = subnets[b];

      // Overlap occurs if A starts before B ends AND A ends after B starts
      if (subA.startLong <= subB.endLong && subA.endLong >= subB.startLong) {
        if (subA.startLong === subB.startLong && subA.endLong === subB.endLong) {
          collisions.push({
            subnetA: subA.cidrNotation,
            subnetB: subB.cidrNotation,
            type: 'Exact Collision',
            details: `Identical IP address range: ${subA.startIp} through ${subA.endIp}.`,
          });
        } else if (subA.cidr < subB.cidr) {
          collisions.push({
            subnetA: subA.cidrNotation,
            subnetB: subB.cidrNotation,
            type: 'Nested / Subnet of',
            details: `${subB.cidrNotation} is completely contained inside the larger block ${subA.cidrNotation}.`,
          });
        } else if (subB.cidr < subA.cidr) {
          collisions.push({
            subnetA: subA.cidrNotation,
            subnetB: subB.cidrNotation,
            type: 'Nested / Subnet of',
            details: `${subA.cidrNotation} is completely contained inside the larger block ${subB.cidrNotation}.`,
          });
        } else {
          collisions.push({
            subnetA: subA.cidrNotation,
            subnetB: subB.cidrNotation,
            type: 'Partial Overlap',
            details: `Ranges overlap between ${longToIp(Math.max(subA.startLong, subB.startLong))} and ${longToIp(Math.min(subA.endLong, subB.endLong))}.`,
          });
        }
      }
    }
  }

  return {
    hasOverlaps: collisions.length > 0,
    subnets,
    collisions,
    safeCount: subnets.length - collisions.length,
  };
}
