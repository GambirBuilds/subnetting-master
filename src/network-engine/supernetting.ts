import { ipToLong, longToIp, validateIPv4, cidrToMask } from './ipv4';

export interface RouteSummarizationResult {
  valid: boolean;
  error?: string;
  routesProvided: string[];
  summaryCidr: number;
  summaryNetwork: string;
  summaryMask: string;
  summaryRoute: string;
  binaryComparison: {
    route: string;
    binary: string;
  }[];
  commonBits: string;
  savedRouteCount: number;
  coversAllGiven: boolean;
}

export function summarizeRoutes(routes: string[]): RouteSummarizationResult {
  const cleaned = routes.map((r) => r.trim()).filter(Boolean);
  if (cleaned.length === 0) {
    return {
      valid: false,
      error: 'Please provide at least one route to summarize.',
      routesProvided: [],
      summaryCidr: 0,
      summaryNetwork: '0.0.0.0',
      summaryMask: '0.0.0.0',
      summaryRoute: '0.0.0.0/0',
      binaryComparison: [],
      commonBits: '',
      savedRouteCount: 0,
      coversAllGiven: false,
    };
  }

  // Parse each route (IP or IP/CIDR)
  const parsed: { ip: string; cidr: number; long: number; binary: string }[] = [];
  for (const item of cleaned) {
    let ip = item;
    let cidr = 24;
    if (item.includes('/')) {
      const [ipPart, cidrPart] = item.split('/');
      ip = ipPart.trim();
      cidr = parseInt(cidrPart.trim(), 10) || 24;
    }
    const val = validateIPv4(ip);
    if (!val.valid) {
      return {
        valid: false,
        error: `Invalid IP route: "${item}" - ${val.error}`,
        routesProvided: cleaned,
        summaryCidr: 0,
        summaryNetwork: '0.0.0.0',
        summaryMask: '0.0.0.0',
        summaryRoute: '0.0.0.0/0',
        binaryComparison: [],
        commonBits: '',
        savedRouteCount: 0,
        coversAllGiven: false,
      };
    }
    const long = ipToLong(ip);
    const binary = (long >>> 0).toString(2).padStart(32, '0');
    parsed.push({ ip, cidr, long, binary });
  }

  // Find common matching leading bits among all routes
  let commonLen = 0;
  for (let bitIdx = 0; bitIdx < 32; bitIdx++) {
    const bit = parsed[0].binary[bitIdx];
    const allMatch = parsed.every((p) => p.binary[bitIdx] === bit);
    if (allMatch) {
      commonLen++;
    } else {
      break;
    }
  }

  // Limit common length by the lowest individual route CIDR
  const minCidr = Math.min(...parsed.map((p) => p.cidr));
  const finalSummaryCidr = Math.min(commonLen, minCidr);

  // Compute summary network
  const mask = finalSummaryCidr === 0 ? 0 : ((0xffffffff << (32 - finalSummaryCidr)) >>> 0);
  const summaryLong = (parsed[0].long & mask) >>> 0;
  const summaryNetwork = longToIp(summaryLong);
  const summaryMask = cidrToMask(finalSummaryCidr);
  const summaryRoute = `${summaryNetwork}/${finalSummaryCidr}`;

  const binaryComparison = parsed.map((p) => ({
    route: `${p.ip}/${p.cidr}`,
    binary: p.binary,
  }));

  return {
    valid: true,
    routesProvided: cleaned,
    summaryCidr: finalSummaryCidr,
    summaryNetwork,
    summaryMask,
    summaryRoute,
    binaryComparison,
    commonBits: parsed[0].binary.slice(0, finalSummaryCidr),
    savedRouteCount: Math.max(0, cleaned.length - 1),
    coversAllGiven: true,
  };
}
