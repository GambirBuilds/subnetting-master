import {
  calculateIPv4,
  cidrToMask,
  cidrToWildcard,
  isContiguousSubnetMask,
  validateIPv4,
} from './ipv4';
import { calculateIPv6, compressIPv6, expandIPv6, validateIPv6 } from './ipv6';
import { summarizeRoutes } from './supernetting';
import { detectSubnetOverlaps } from './overlap';

export interface TestResult {
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
  details?: string;
}

export function runNetworkEngineTests(): {
  total: number;
  passedCount: number;
  failedCount: number;
  results: TestResult[];
} {
  const results: TestResult[] = [];

  const assert = (name: string, actual: any, expected: any, details?: string) => {
    const passed = JSON.stringify(actual) === JSON.stringify(expected);
    results.push({
      name,
      passed,
      expected: String(expected),
      actual: String(actual),
      details,
    });
  };

  // 1. IPv4 /24 standard calculation
  const sub24 = calculateIPv4('192.168.1.50', 24);
  assert('IPv4 /24 Network Address', sub24.networkAddress, '192.168.1.0');
  assert('IPv4 /24 Broadcast Address', sub24.broadcastAddress, '192.168.1.255');
  assert('IPv4 /24 Usable Hosts Count', sub24.usableHosts, 254);
  assert('IPv4 /24 First Host', sub24.firstUsableHost, '192.168.1.1');
  assert('IPv4 /24 Last Host', sub24.lastUsableHost, '192.168.1.254');
  assert('IPv4 /24 Subnet Mask', sub24.subnetMask, '255.255.255.0');
  assert('IPv4 /24 Wildcard Mask', sub24.wildcardMask, '0.0.0.255');
  assert('IPv4 /24 IP Classification', sub24.ipType, 'Private (RFC 1918)');

  // 2. IPv4 /30 point-to-point calculation
  const sub30 = calculateIPv4('10.0.0.5', 30);
  assert('IPv4 /30 Network Address', sub30.networkAddress, '10.0.0.4');
  assert('IPv4 /30 Broadcast Address', sub30.broadcastAddress, '10.0.0.7');
  assert('IPv4 /30 Usable Hosts', sub30.usableHosts, 2);
  assert('IPv4 /30 First Usable', sub30.firstUsableHost, '10.0.0.5');
  assert('IPv4 /30 Last Usable', sub30.lastUsableHost, '10.0.0.6');

  // 3. IPv4 /31 RFC 3021 Point-to-Point
  const sub31 = calculateIPv4('172.16.1.0', 31);
  assert('IPv4 /31 Usable Hosts (RFC 3021)', sub31.usableHosts, 2);
  assert('IPv4 /31 First Host', sub31.firstUsableHost, '172.16.1.0');
  assert('IPv4 /31 Last Host', sub31.lastUsableHost, '172.16.1.1');

  // 4. IPv4 /32 Single Host Route
  const sub32 = calculateIPv4('127.0.0.1', 32);
  assert('IPv4 /32 Usable Hosts', sub32.usableHosts, 1);
  assert('IPv4 /32 Loopback Classification', sub32.ipType, 'Loopback');

  // 5. IPv4 /0 Default Route
  const sub0 = calculateIPv4('0.0.0.0', 0);
  assert('IPv4 /0 Subnet Mask', sub0.subnetMask, '0.0.0.0');
  assert('IPv4 /0 Total Addresses', sub0.totalAddresses, 4294967296);

  // 6. IPv4 Subnet Mask Contiguity
  assert('Contiguous Mask 255.255.255.0', isContiguousSubnetMask('255.255.255.0'), true);
  assert('Contiguous Mask 255.255.240.0', isContiguousSubnetMask('255.255.240.0'), true);
  assert('Non-Contiguous Mask 255.255.0.255', isContiguousSubnetMask('255.255.0.255'), false);

  // 7. IPv6 Expansion & Compression
  const exp1 = expandIPv6('2001:db8::1');
  assert('IPv6 Expand 2001:db8::1', exp1, '2001:0db8:0000:0000:0000:0000:0000:0001');
  const comp1 = compressIPv6('2001:0db8:0000:0000:0000:0000:0000:0001');
  assert('IPv6 Compress Canonical RFC 5952', comp1, '2001:db8::1');

  // 8. IPv6 Classification
  const v6Gua = calculateIPv6('2607:f8b0:4005:808::200e');
  assert('IPv6 GUA Classification', v6Gua.type, 'Global Unicast (2000::/3)');
  const v6Link = calculateIPv6('fe80::1');
  assert('IPv6 Link-Local Classification', v6Link.type, 'Link-Local (fe80::/10)');
  const v6Loop = calculateIPv6('::1');
  assert('IPv6 Loopback Classification', v6Loop.type, 'Loopback (::1/128)');

  // 9. Route Summarization / Supernetting
  const summary = summarizeRoutes([
    '192.168.0.0/24',
    '192.168.1.0/24',
    '192.168.2.0/24',
    '192.168.3.0/24',
  ]);
  assert('Route Summarization CIDR', summary.summaryCidr, 22);
  assert('Route Summarization Summary Route', summary.summaryRoute, '192.168.0.0/22');

  // 10. Subnet Overlap Detection
  const overlaps = detectSubnetOverlaps([
    '10.0.0.0/24',
    '10.0.0.128/25',
    '192.168.1.0/24',
  ]);
  assert('Overlap Detection Flag', overlaps.hasOverlaps, true);
  assert('Overlap Collision Count', overlaps.collisions.length, 1);

  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.length - passedCount;

  return {
    total: results.length,
    passedCount,
    failedCount,
    results,
  };
}
