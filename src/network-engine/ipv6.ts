export interface IPv6Details {
  ip: string;
  expanded: string;
  compressed: string;
  prefixLength: number;
  type: 
    | 'Global Unicast (2000::/3)'
    | 'Unique Local (fc00::/7)'
    | 'Link-Local (fe80::/10)'
    | 'Multicast (ff00::/8)'
    | 'Loopback (::1/128)'
    | 'Unspecified (::/128)'
    | 'Documentation (2001:db8::/32)'
    | 'IPv4-Mapped (::ffff:0:0/96)'
    | 'Special / Reserved';
  scope: 'Global' | 'Link' | 'Node' | 'Organization' | 'Unique Local' | 'Special';
  networkPrefix: string;
  totalAddressesNotation: string;
  isSubnet64: boolean;
  reverseDnsArpa: string;
}

export function validateIPv6(ip: string): { valid: boolean; error?: string } {
  const trimmed = ip.trim().toLowerCase();
  if (!trimmed) {
    return { valid: false, error: 'Please enter an IPv6 address.' };
  }

  // Check for invalid characters
  if (!/^[0-9a-f:]+$/.test(trimmed)) {
    return { valid: false, error: 'IPv6 address contains invalid non-hexadecimal characters.' };
  }

  // Cannot contain more than one "::"
  const doubleColonCount = (trimmed.match(/::/g) || []).length;
  if (doubleColonCount > 1) {
    return { valid: false, error: 'IPv6 address cannot contain multiple double colons ("::").' };
  }

  // Cannot start or end with single colon
  if (trimmed.startsWith(':') && !trimmed.startsWith('::')) {
    return { valid: false, error: 'IPv6 address cannot start with a single colon.' };
  }
  if (trimmed.endsWith(':') && !trimmed.endsWith('::')) {
    return { valid: false, error: 'IPv6 address cannot end with a single colon.' };
  }

  const parts = trimmed.split(':');
  if (doubleColonCount === 0 && parts.length !== 8) {
    return { valid: false, error: `Full IPv6 address must have 8 hextets. Found ${parts.length}.` };
  }
  if (doubleColonCount === 1 && parts.length > 8) {
    return { valid: false, error: 'Too many hextets in compressed IPv6 address.' };
  }

  for (const part of parts) {
    if (part.length > 4) {
      return { valid: false, error: `Hextet "${part}" exceeds maximum 4 hexadecimal digits.` };
    }
  }

  return { valid: true };
}

export function expandIPv6(ip: string): string {
  const trimmed = ip.trim().toLowerCase();
  if (trimmed === '::') {
    return '0000:0000:0000:0000:0000:0000:0000:0000';
  }

  let hextets: string[];
  if (trimmed.includes('::')) {
    const [leftPart, rightPart] = trimmed.split('::');
    const leftHextets = leftPart ? leftPart.split(':') : [];
    const rightHextets = rightPart ? rightPart.split(':') : [];
    const missingCount = 8 - (leftHextets.length + rightHextets.length);
    const zeroHextets = Array(missingCount).fill('0000');
    hextets = [...leftHextets, ...zeroHextets, ...rightHextets];
  } else {
    hextets = trimmed.split(':');
  }

  return hextets.map((h) => h.padStart(4, '0')).join(':');
}

export function compressIPv6(ip: string): string {
  const expanded = expandIPv6(ip);
  const hextets = expanded.split(':').map((h) => h.replace(/^0+(?!$)/, ''));

  // Find longest contiguous run of zeros (RFC 5952 standard)
  let bestStart = -1;
  let bestLength = 0;
  let currentStart = -1;
  let currentLength = 0;

  for (let i = 0; i < hextets.length; i++) {
    if (hextets[i] === '0') {
      if (currentStart === -1) {
        currentStart = i;
        currentLength = 1;
      } else {
        currentLength++;
      }
    } else {
      if (currentLength > 1 && currentLength > bestLength) {
        bestStart = currentStart;
        bestLength = currentLength;
      }
      currentStart = -1;
      currentLength = 0;
    }
  }

  if (currentLength > 1 && currentLength > bestLength) {
    bestStart = currentStart;
    bestLength = currentLength;
  }

  if (bestLength > 1) {
    const left = hextets.slice(0, bestStart).join(':');
    const right = hextets.slice(bestStart + bestLength).join(':');
    return `${left}::${right}`;
  }

  return hextets.join(':');
}

export function classifyIPv6(expanded: string): {
  type: IPv6Details['type'];
  scope: IPv6Details['scope'];
} {
  const firstHextet = expanded.split(':')[0].toLowerCase();
  const num = parseInt(firstHextet, 16);

  if (expanded === '0000:0000:0000:0000:0000:0000:0000:0001') {
    return { type: 'Loopback (::1/128)', scope: 'Node' };
  }
  if (expanded === '0000:0000:0000:0000:0000:0000:0000:0000') {
    return { type: 'Unspecified (::/128)', scope: 'Special' };
  }
  // IPv4 mapped
  if (expanded.startsWith('0000:0000:0000:0000:0000:ffff:')) {
    return { type: 'IPv4-Mapped (::ffff:0:0/96)', scope: 'Global' };
  }
  // Documentation 2001:0db8::/32
  if (firstHextet === '2001' && expanded.split(':')[1].toLowerCase() === '0db8') {
    return { type: 'Documentation (2001:db8::/32)', scope: 'Special' };
  }
  // Multicast ff00::/8
  if (firstHextet.startsWith('ff')) {
    return { type: 'Multicast (ff00::/8)', scope: 'Global' };
  }
  // Link-Local fe80::/10 (fe80 to febf)
  if (num >= 0xfe80 && num <= 0xfebf) {
    return { type: 'Link-Local (fe80::/10)', scope: 'Link' };
  }
  // Unique Local fc00::/7 (fc00 to fdff)
  if (num >= 0xfc00 && num <= 0xfdff) {
    return { type: 'Unique Local (fc00::/7)', scope: 'Unique Local' };
  }
  // Global Unicast 2000::/3 (2000 to 3fff)
  if (num >= 0x2000 && num <= 0x3fff) {
    return { type: 'Global Unicast (2000::/3)', scope: 'Global' };
  }

  return { type: 'Special / Reserved', scope: 'Special' };
}

export function calculateIPv6(ip: string, prefix = 64): IPv6Details {
  const expanded = expandIPv6(ip);
  const compressed = compressIPv6(expanded);
  const { type, scope } = classifyIPv6(expanded);

  // Compute reverse DNS nibble format
  const rawHex = expanded.replace(/:/g, '');
  const reverseDnsArpa = rawHex.split('').reverse().join('.') + '.ip6.arpa';

  // Network prefix hextets
  const bitGroups = Math.floor(prefix / 16);
  const hextets = expanded.split(':');
  const prefixHextets = hextets.slice(0, bitGroups);

  const totalBitsForHosts = 128 - prefix;
  let totalAddressesNotation = `2^${totalBitsForHosts}`;
  if (totalBitsForHosts === 64) {
    totalAddressesNotation = '18,446,744,073,709,551,616 (~18.4 Quintillion)';
  } else if (totalBitsForHosts === 0) {
    totalAddressesNotation = '1 (Single Host)';
  }

  return {
    ip,
    expanded,
    compressed,
    prefixLength: prefix,
    type,
    scope,
    networkPrefix: compressIPv6(prefixHextets.join(':') + '::'),
    totalAddressesNotation,
    isSubnet64: prefix === 64,
    reverseDnsArpa,
  };
}
