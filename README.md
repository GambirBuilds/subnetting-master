# Subnetting Master — Interactive IPv4 Learning & Training Platform

**Subnetting Master** is a modern, interactive web application engineered to teach computer network subnetting from absolute beginner to advanced certification (CCNA / University Exam) level.

---

## 🌟 Key Features

1. **Structured Learning Modules (01–08)**
   - Module 01: IPv4 Structure & Classes (A–E, RFC 1918 Private, APIPA, Loopback)
   - Module 02: Binary Fundamentals & 8-Bit Converter (Powers of 2: 128..1)
   - Module 03: Subnet Masks & Slash Notation (/0 to /32)
   - Module 04: The Magic Number Method & Borrowed Bits
   - Module 05: The Comprehensive Subnetting Table Matrix
   - Module 06: CIDR & Route Summarization (Supernetting)
   - Module 07: Variable Length Subnet Masking (VLSM)
   - Module 08: Real-World Subnet Troubleshooting & Gateway Diagnostics

2. **Interactive Engineering Tools**
   - **8-Bit Clickable Binary Converter**: Toggle individual bits to observe live decimal sums and powers of 2.
   - **Interactive CIDR Slider**: Dynamically adjust prefix length between /0 and /32 to watch network bits grow while host bits shrink.
   - **Step-by-Step Subnet Calculator**: Calculates network address, broadcast address, first and last usable host, total addresses, usable hosts ($2^h - 2$), block size, wildcard mask, and reveals the exact mathematical reasoning.
   - **32-Bit Binary Visualizer**: Inspect individual bit positions, weights, and octet boundaries with hover tooltips.
   - **VLSM Design Lab**: Slices major address blocks by departmental requirements (largest first) and renders a proportional visual memory allocation bar.
   - **Network Repair Lab**: Simulated topology canvas where students troubleshoot configuration faults (wrong gateways, broadcast IP assignment, subnet mask mismatches) and verify connectivity via simulated ICMP ping packets.

3. **Gamified Practice & Testing**
   - **Subnet Wars**: Battle against ByteMaster AI with health bars, combo streaks, and damage multipliers.
   - **Daily Challenge**: Seeded daily IPv4 problem with streak tracking and XP rewards.
   - **Categorized Quiz Engine**: 40+ peer-reviewed questions with instant feedback and comprehensive explanations.
   - **Realistic Exam Simulator**: 10, 25, and 50-question mock exams with countdown timers, question flagging, 75% pass mark, and detailed solution reviews.
   - **Printable Cheat Sheet**: High-contrast, searchable reference matrix of prefixes /8 to /32, powers of 2, and shortcuts.
   - **Adaptive Learning Dashboard**: Identifies student weak topics and recommends targeted lessons and drills.
   - **Global Search (`⌘K`)**: Instant search for any prefix (e.g. `/27`), IP address, or networking topic.

---

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Local Development

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 🚢 Deployment to Vercel

1. Push your repository to GitHub.
2. Log into [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Select your GitHub repository.
4. Framework preset will be auto-detected as **Vite**.
5. Build command: `npm run build` | Output directory: `dist`.
6. Click **Deploy**.

For detailed configuration, refer to [`VERCEL_SETUP.md`](./VERCEL_SETUP.md).

---

## 🛠 Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti, CSS Transitions
- **Deployment**: Vercel SPA Ready (`vercel.json`)
