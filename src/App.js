import { useState, useEffect } from "react";

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f4f7fb;
    --surface: #ffffff;
    --panel: #f8fafc;
    --panel2: #eef2f8;
    --border: #e2e8f0;
    --border2: #cbd5e1;
    --accent: #0077aa;
    --accent-dim: rgba(0,119,170,0.10);
    --red: #e53e5a;
    --red-dim: rgba(229,62,90,0.09);
    --yellow: #d97706;
    --yellow-dim: rgba(217,119,6,0.09);
    --green: #22a855;
    --green-dim: rgba(34,168,85,0.09);
    --orange: #ea6c00;
    --orange-dim: rgba(234,108,0,0.09);
    --text: #0d1829;
    --text2: #4a6080;
    --muted: #94aabf;
    --font-mono: 'Outfit', sans-serif;
    --font-sans: 'Outfit', sans-serif;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-sans);
    min-height: 100vh;
    overflow-x: hidden;
    letter-spacing: 0.2px;
    -webkit-font-smoothing: antialiased;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
  }
  @keyframes ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
`;

// ── DATA ──────────────────────────────────────────────────────────────────────

const STRIKES = [
  {
    id: 1,
    hospital: "Corewell Health East",
    city: "Southeast Michigan", state: "MI",
    union: "Teamsters Local 2024",
    nurses: 10000, hospitals: 9,
    status: "AUTHORIZED", risk: "HIGH",
    date: "10-day notice imminent",
    issues: ["Staffing ratios", "Fair wages", "Health insurance", "Workplace safety"],
    notes: "First contract since Jun 2025. 90% strike vote. No final offer made. Clock is ticking.",
    updated: "Mar 21, 2026", color: "red",
  },
  {
    id: 2,
    hospital: "Brattleboro Memorial Hospital",
    city: "Brattleboro", state: "VT",
    union: "Brattleboro Federation of Nurses",
    nurses: 160, hospitals: 1,
    status: "VOTE PENDING", risk: "MEDIUM-HIGH",
    date: "Results: Mar 23 → Strike ~Apr 2",
    issues: ["3-year wage freeze proposed", "Benefit cuts", "$14.5M deficit"],
    notes: "80%+ signed strike cards. Vote reveal Monday. If YES, 10-day notice drops next week.",
    updated: "Mar 21, 2026", color: "orange",
  },
  {
    id: 3,
    hospital: "Henry Ford Genesys Hospital",
    city: "Grand Blanc", state: "MI",
    union: "Teamsters Local 332",
    nurses: 400, hospitals: 1,
    status: "ACTIVE STRIKE", risk: "ACTIVE",
    date: "~Day 200 — ongoing",
    issues: ["Wages", "Staffing ratios"],
    notes: "Joint statement signals 'optimism' but no TA yet. Crisis slots tapering.",
    updated: "Mar 21, 2026", color: "yellow",
  },
  {
    id: 4,
    hospital: "NUHW Kaiser Mental Health",
    city: "Northern California", state: "CA",
    union: "NUHW + CNA (sympathy)",
    nurses: 25400, hospitals: 12,
    status: "ACTIVE STRIKE", risk: "ACTIVE",
    date: "CNA sympathy: Mar 18 (24-hr)",
    issues: ["AI in clinical practice", "Safe staffing", "Wages"],
    notes: "2,400 NUHW therapists on strike. 23,000 CNA nurses joined sympathy strike Mar 18.",
    updated: "Mar 21, 2026", color: "yellow",
  },
  {
    id: 5,
    hospital: "BMC South (Brockton)",
    city: "Brockton", state: "MA",
    union: "Massachusetts Nurses Association",
    nurses: 480, hospitals: 1,
    status: "AUTHORIZED", risk: "MEDIUM",
    date: "No date set",
    issues: ["Staffing", "Retirement cuts", "Health insurance", "PTO"],
    notes: "First contract. Strike authorized, no walkout scheduled. Could escalate anytime.",
    updated: "Mar 21, 2026", color: "orange",
  },
  {
    id: 6,
    hospital: "Oregon Health & Science Univ.",
    city: "Portland", state: "OR",
    union: "ONA + AFSCME",
    nurses: 1700, hospitals: 1,
    status: "WATCH", risk: "MEDIUM",
    date: "AFSCME vote pending",
    issues: ["Contract dispute", "Research workers organizing"],
    notes: "ONA open-ended dispute ongoing. 1,700 AFSCME research workers preparing strike vote.",
    updated: "Mar 21, 2026", color: "yellow",
  },
];

const CONTRACTS = [
  {
    id: 1,
    title: "Crisis ICU / L&D RN",
    location: "Southeast Michigan",
    pay_hr: "$80–130/hr", pay_wk: "$4,800–7,800/wk (est.)",
    type: "STRIKE", specialty: ["ICU", "L&D", "ER"],
    start: "Imminent — Corewell",
    agency: "Fastaff · Aya · USNursing",
    hot: true,
    note: "Pre-position NOW before 10-day notice drops and slots vanish",
  },
  {
    id: 2,
    title: "Strike RN — All Specialties",
    location: "Grand Blanc, MI",
    pay_hr: "$90–120/hr", pay_wk: "$5,400–7,200/wk",
    type: "STRIKE", specialty: ["Med-Surg", "ICU", "ER"],
    start: "Active now",
    agency: "USNursing · Cross Country",
    hot: false,
    note: "Henry Ford Genesys ~Day 200. Volume tapering — act fast",
  },
  {
    id: 3,
    title: "Crisis RN — Behavioral Health",
    location: "Northern California",
    pay_hr: "$95–115/hr", pay_wk: "$5,700–6,900/wk",
    type: "CRISIS", specialty: ["Psych", "Behavioral Health"],
    start: "Now",
    agency: "Aya · Vivian · Fastaff",
    hot: false,
    note: "25% surge in psych contracts in 2026. NUHW dispute keeps demand elevated.",
  },
  {
    id: 4,
    title: "Rapid Response RN",
    location: "Brattleboro, VT",
    pay_hr: "$70–95/hr", pay_wk: "$4,200–5,700/wk (est.)",
    type: "PRE-POSITION", specialty: ["Med-Surg", "ER", "ICU"],
    start: "~Apr 2 if strike authorized",
    agency: "Fastaff · White Glove",
    hot: true,
    note: "Small hospital (160 RNs). Fast fill. Register before Mar 23 vote results.",
  },
  {
    id: 5,
    title: "Strike RN — NYC Benchmark (Closed)",
    location: "New York City, NY",
    pay_hr: "Up to $161/hr (peak)", pay_wk: "$10,500–$12,800/wk",
    type: "CLOSED", specialty: ["ICU", "L&D", "ER", "OR"],
    start: "Ended Feb 21, 2026",
    agency: "All major agencies",
    hot: false,
    note: "Strike ended after 41 days. Sets 2026 pay floor benchmark.",
  },
];

const TICKER_ITEMS = [
  "🔴 COREWELL HEALTH EAST MI — 10,000 RNs authorize strike — 10-day notice IMMINENT",
  "🟠 BRATTLEBORO MEMORIAL VT — Strike vote results due MON MAR 23",
  "✅ KAISER UNAC/UHCP — Contracts RATIFIED Mar 20 — 31,000 workers return",
  "✅ NYC NYSNA — Strike ended Feb 21 after 41 days — all contracts ratified",
  "🟡 HENRY FORD GENESYS MI — Day ~200 of strike — 'optimistic' joint statement",
  "🔵 NUHW KAISER MENTAL HEALTH CA — Active strike — 23K CNA sympathy Mar 18",
  "📊 2026 BENCHMARK: Strike RNs earned up to $161/hr · $12,800/wk NYC window",
  "⚡ MICHIGAN = #1 DEPLOYMENT ZONE — Corewell + Genesys dual flashpoint",
];

const OUTLOOK = [
  { location: "Corewell Health East, MI",   risk: "HIGH",        timeline: "10-day notice any day; strike ~early Apr", prob: 92 },
  { location: "Brattleboro Memorial, VT",   risk: "MEDIUM-HIGH", timeline: "Vote Mar 23; strike ~Apr 2 if YES",        prob: 70 },
  { location: "Henry Ford Genesys, MI",     risk: "ACTIVE",      timeline: "Ongoing ~Day 200; no TA yet",             prob: 100 },
  { location: "NUHW Kaiser Mental, CA",     risk: "ACTIVE",      timeline: "Ongoing; further sympathy possible",      prob: 100 },
  { location: "BMC South, Brockton MA",     risk: "MEDIUM",      timeline: "No date; could escalate anytime",         prob: 45 },
  { location: "OHSU Portland, OR",          risk: "MEDIUM",      timeline: "AFSCME vote pending early Apr",            prob: 40 },
];

const INSIGHTS = [
  { icon: "⚡", title: "Michigan is the #1 Deployment Zone", body: "Corewell Health East (10K RNs, 9 hospitals) has a 90% strike authorization vote and no final offer. Henry Ford Genesys is 200 days in. Pre-position credentials with Fastaff, Aya, and USNursing immediately.", color: "var(--red)" },
  { icon: "💰", title: "2026 Crisis Pay Benchmarks Reset Upward", body: "NYC strike saw rates up to $161/hr and $12,800/week. Kaiser crisis hit $9K/week. These numbers anchor expectations for every future deployment.", color: "var(--green)" },
  { icon: "🧠", title: "Psych/Behavioral Health: Hidden High-Pay Niche", body: "25% surge in psych contract offers in 2026. The NUHW Kaiser mental health dispute signals sustained demand. If you hold a psych cert, this market is underserved and growing fast.", color: "var(--accent)" },
  { icon: "🤖", title: "AI Clauses Are Now Standard Bargaining Demands", body: "Every major 2026 contract now includes language blocking AI from replacing clinical judgment. This structural conflict will drive more disputes as hospital AI adoption accelerates.", color: "var(--yellow)" },
  { icon: "📋", title: "First Contracts = Highest Escalation Risk", body: "Corewell and BMC South are first-contract disputes — historically the most contentious type. These escalate faster and resolve slower than renewals.", color: "var(--orange)" },
];

// ── PRICING DATA ──────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: "nurse",
    name: "Nurse",
    price: "$14.99",
    period: "/mo",
    description: "For individual travel & strike nurses",
    features: [
      "Real-time strike notice alerts",
      "High-pay contract listings",
      "2–4 week strike outlook",
      "Market intelligence reports",
      "Email alerts for new notices",
      "Mobile-friendly access",
    ],
    cta: "Start Free Trial",
    highlight: true,
    badge: "MOST POPULAR",
  },
  {
    id: "agency",
    name: "Agency",
    price: "$99",
    period: "/mo",
    description: "For staffing agencies & recruiters",
    features: [
      "Everything in Nurse plan",
      "Up to 5 team seats",
      "CSV data export",
      "Priority alert delivery",
      "Agency placement insights",
      "Dedicated support",
    ],
    cta: "Contact Us",
    highlight: false,
    badge: null,
  },
];

// ── COMPONENTS ────────────────────────────────────────────────────────────────

function RiskBadge({ risk }) {
  const s = {
    "HIGH":        { bg: "var(--red-dim)",    color: "var(--red)",    label: "HIGH" },
    "MEDIUM-HIGH": { bg: "var(--orange-dim)", color: "var(--orange)", label: "MED-HIGH" },
    "MEDIUM":      { bg: "var(--yellow-dim)", color: "var(--yellow)", label: "MEDIUM" },
    "ACTIVE":      { bg: "var(--green-dim)",  color: "var(--green)",  label: "ACTIVE" },
  }[risk] || { bg: "var(--accent-dim)", color: "var(--accent)", label: risk };

  return (
    <span style={{
      background: s.bg, color: s.color, border: `1px solid ${s.color}55`,
      borderRadius: 3, padding: "2px 8px",
      fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: 1,
    }}>{s.label}</span>
  );
}

function StatusBadge({ status }) {
  const s = {
    "ACTIVE STRIKE": { color: "var(--green)",  bg: "var(--green-dim)" },
    "AUTHORIZED":    { color: "var(--red)",    bg: "var(--red-dim)" },
    "VOTE PENDING":  { color: "var(--orange)", bg: "var(--orange-dim)" },
    "WATCH":         { color: "var(--yellow)", bg: "var(--yellow-dim)" },
  }[status] || { color: "var(--accent)", bg: "var(--accent-dim)" };

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.color, border: `1px solid ${s.color}33`,
      borderRadius: 3, padding: "3px 9px",
      fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700,
    }}>
      {status === "ACTIVE STRIKE" && (
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, display: "inline-block", animation: "pulse 1.4s infinite" }} />
      )}
      {status}
    </span>
  );
}

function Ticker() {
  const full = [...TICKER_ITEMS, ...TICKER_ITEMS].join("     ·     ");
  return (
    <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", height: 36, display: "flex", alignItems: "center", overflow: "hidden" }}>
      <div style={{ background: "var(--red)", color: "#fff", padding: "0 14px", height: "100%", display: "flex", alignItems: "center", fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, flexShrink: 0 }}>LIVE</div>
      <div style={{ overflow: "hidden", flex: 1 }}>
        <div style={{ display: "inline-block", whiteSpace: "nowrap", animation: "ticker 80s linear infinite", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text2)", paddingLeft: 20 }}>{full}</div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color = "var(--accent)", delay = 0 }) {
  return (
    <div style={{ background: "var(--panel)", border: "1px solid var(--border)", borderTop: `2px solid ${color}`, borderRadius: 6, padding: "16px 20px", flex: 1, minWidth: 150, animation: `fadeUp 0.5s ease both`, animationDelay: `${delay}ms` }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", letterSpacing: 1, marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 24, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--text2)", marginTop: 5 }}>{sub}</div>}
    </div>
  );
}

function SectionHeader({ children, accent = "var(--accent)" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <div style={{ width: 3, height: 18, background: accent, borderRadius: 2, flexShrink: 0 }} />
      <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "var(--text2)" }}>{children}</h2>
    </div>
  );
}

function StrikeCard({ s, idx, onClick, selected }) {
  const borderColor = { red: "var(--red)", orange: "var(--orange)", yellow: "var(--yellow)" }[s.color] || "var(--border2)";
  return (
    <div onClick={() => onClick(s)} style={{ background: selected ? "var(--panel2)" : "var(--panel)", border: `1px solid ${selected ? borderColor : "var(--border)"}`, borderLeft: `3px solid ${borderColor}`, borderRadius: 6, padding: "16px 18px", cursor: "pointer", animation: `fadeUp 0.45s ease both`, animationDelay: `${idx * 60}ms`, transition: "background 0.15s", boxShadow: selected ? `0 0 24px ${borderColor}22` : "none" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
        <div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{s.hospital}</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text2)" }}>{s.city}, {s.state} · {s.union}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
          <StatusBadge status={s.status} />
          <RiskBadge risk={s.risk} />
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 10 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}><span style={{ color: "var(--muted)" }}>RNs </span><span style={{ color: "var(--accent)", fontWeight: 700 }}>{s.nurses.toLocaleString()}</span></span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}><span style={{ color: "var(--muted)" }}>Sites </span><span style={{ color: "var(--accent)", fontWeight: 700 }}>{s.hospitals}</span></span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: borderColor }}>{s.date}</span>
      </div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--text2)", lineHeight: 1.6 }}>{s.notes}</div>
      {selected && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", letterSpacing: 1, marginBottom: 8 }}>KEY ISSUES</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
            {s.issues.map(i => <span key={i} style={{ background: "var(--bg)", border: "1px solid var(--border2)", borderRadius: 3, padding: "3px 9px", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text2)" }}>{i}</span>)}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)" }}>UPDATED {s.updated}</div>
        </div>
      )}
    </div>
  );
}

function ContractCard({ c, idx }) {
  const typeColors = { "STRIKE": { color: "var(--red)", bg: "var(--red-dim)" }, "CRISIS": { color: "var(--orange)", bg: "var(--orange-dim)" }, "PRE-POSITION": { color: "var(--accent)", bg: "var(--accent-dim)" }, "CLOSED": { color: "var(--muted)", bg: "rgba(61,81,102,0.15)" } };
  const tc = typeColors[c.type] || typeColors["CLOSED"];
  return (
    <div style={{ background: "var(--panel)", border: `1px solid ${c.hot ? "var(--red)" : "var(--border)"}`, borderRadius: 6, padding: "16px 18px", animation: `fadeUp 0.45s ease both`, animationDelay: `${idx * 70}ms`, position: "relative", overflow: "hidden", opacity: c.type === "CLOSED" ? 0.55 : 1 }}>
      {c.hot && <div style={{ position: "absolute", top: 0, right: 0, background: "var(--red)", color: "#fff", fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: 1, padding: "3px 10px", borderBottomLeftRadius: 6 }}>⚡ ACT NOW</div>}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 3 }}>{c.title}</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text2)" }}>{c.location}</div>
        </div>
        <span style={{ background: tc.bg, color: tc.color, border: `1px solid ${tc.color}44`, borderRadius: 3, padding: "3px 8px", fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{c.type}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        <div style={{ background: "var(--bg)", borderRadius: 4, padding: "10px 12px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted)", letterSpacing: 1, marginBottom: 4 }}>HOURLY</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 700, color: "var(--green)" }}>{c.pay_hr}</div>
        </div>
        <div style={{ background: "var(--bg)", borderRadius: 4, padding: "10px 12px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted)", letterSpacing: 1, marginBottom: 4 }}>WEEKLY EST.</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700, color: "var(--green)" }}>{c.pay_wk}</div>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
        {c.specialty.map(sp => <span key={sp} style={{ background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid var(--accent)33", borderRadius: 3, padding: "2px 7px", fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700 }}>{sp}</span>)}
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text2)", lineHeight: 1.7, marginBottom: 8 }}>
        <span style={{ color: "var(--muted)" }}>START: </span>{c.start}<br />
        <span style={{ color: "var(--muted)" }}>AGENCIES: </span>{c.agency}
      </div>
      <div style={{ background: c.hot ? "var(--red-dim)" : "rgba(255,255,255,0.03)", border: `1px solid ${c.hot ? "var(--red)44" : "var(--border)"}`, borderRadius: 4, padding: "7px 10px", fontFamily: "var(--font-mono)", fontSize: 10, color: c.hot ? "var(--red)" : "var(--text2)" }}>
        ⚑ {c.note}
      </div>
    </div>
  );
}

function OutlookRow({ o, idx }) {
  const riskColor = { "HIGH": "var(--red)", "MEDIUM-HIGH": "var(--orange)", "ACTIVE": "var(--green)", "MEDIUM": "var(--yellow)" }[o.risk] || "var(--yellow)";
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 100px 1.5fr 100px", gap: 12, alignItems: "center", padding: "12px 16px", borderBottom: "1px solid var(--border)", background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)", animation: `fadeUp 0.4s ease both`, animationDelay: `${idx * 50}ms` }}>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--text)" }}>{o.location}</div>
      <div><RiskBadge risk={o.risk} /></div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text2)", lineHeight: 1.5 }}>{o.timeline}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, height: 4, background: "var(--border)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${o.prob}%`, background: riskColor, borderRadius: 2 }} />
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: riskColor, minWidth: 28 }}>{o.prob}%</span>
      </div>
    </div>
  );
}

function PricingPage() {
  const [billing, setBilling] = useState("monthly");
  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <SectionHeader accent="var(--accent)">💳 Plans & Pricing</SectionHeader>

      {/* Value prop */}
      <div style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 8, padding: "20px 24px", marginBottom: 28, textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>
          One deployment pays for <span style={{ color: "var(--green)" }}>3+ years</span> of StrikeIntel
        </div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text2)" }}>
          Strike nurses earn $5,000–$12,800/week. At $14.99/mo, your subscription pays for itself in the first 30 minutes on assignment.
        </div>
      </div>

      {/* Billing toggle */}
      <div style={{ display: "flex", justifyContent: "center", gap: 0, marginBottom: 28 }}>
        {["monthly", "annual"].map(b => (
          <button key={b} onClick={() => setBilling(b)} style={{ background: billing === b ? "var(--accent)" : "var(--panel)", color: billing === b ? "#000" : "var(--muted)", border: "1px solid var(--border)", padding: "8px 20px", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, letterSpacing: 1, borderRadius: b === "monthly" ? "4px 0 0 4px" : "0 4px 4px 0", transition: "all 0.15s" }}>
            {b === "monthly" ? "MONTHLY" : "ANNUAL (SAVE 20%)"}
          </button>
        ))}
      </div>

      {/* Plan cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 28 }}>
        {PLANS.map((plan, i) => {
          const price = billing === "annual"
            ? plan.id === "nurse" ? "$11.99" : "$79"
            : plan.price;
          return (
            <div key={plan.id} style={{ background: plan.highlight ? "var(--panel2)" : "var(--panel)", border: `2px solid ${plan.highlight ? "var(--accent)" : "var(--border)"}`, borderRadius: 10, padding: "24px", position: "relative", animation: `fadeUp 0.5s ease both`, animationDelay: `${i * 80}ms`, boxShadow: plan.highlight ? "0 4px 20px rgba(0,119,170,0.12)" : "none" }}>
              {plan.badge && (
                <div style={{ position: "absolute", top: -1, right: 20, background: "var(--accent)", color: "#000", fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: 1, padding: "3px 10px", borderRadius: "0 0 6px 6px" }}>{plan.badge}</div>
              )}
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>{plan.name}</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--text2)", marginBottom: 20 }}>{plan.description}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 36, fontWeight: 700, color: plan.highlight ? "var(--accent)" : "var(--text)" }}>{price}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--muted)" }}>{plan.period}</span>
                {billing === "annual" && <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--green)", marginLeft: 4 }}>SAVE 20%</span>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <span style={{ color: "var(--green)", fontFamily: "var(--font-mono)", fontSize: 12, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--text2)" }}>{f}</span>
                  </div>
                ))}
              </div>
              <button style={{ width: "100%", padding: "12px", background: plan.highlight ? "var(--accent)" : "transparent", border: `1px solid ${plan.highlight ? "var(--accent)" : "var(--border2)"}`, color: plan.highlight ? "#000" : "var(--text)", borderRadius: 6, fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}>
                {plan.cta}
              </button>
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 8, padding: "20px 24px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", letterSpacing: 1, marginBottom: 16 }}>FREQUENTLY ASKED</div>
        {[
          { q: "How often is the data updated?", a: "Intel is scanned and refreshed every 6–12 hours, and on-demand when major notices drop." },
          { q: "Do I need to sign a contract?", a: "No. Monthly plans cancel anytime. Annual plans are billed once per year." },
          { q: "What specialties are covered?", a: "ICU, ER, L&D, OR, Med-Surg, Psych, and all acute care specialties are tracked." },
          { q: "How do I get alerts?", a: "Email alerts are included on all plans. SMS alerts are coming soon." },
        ].map(({ q, a }) => (
          <div key={q} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 5 }}>{q}</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--text2)", lineHeight: 1.6 }}>{a}</div>
          </div>
        ))}
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)" }}>Payments powered by Stripe · SSL secured · Cancel anytime</div>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("strikes");
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const handleClick = (s) => setSelected(prev => prev?.id === s.id ? null : s);
  const filtered = filter === "ALL" ? STRIKES : STRIKES.filter(s => s.risk === filter || s.status === filter);

  const TABS = [
    { id: "strikes",   label: "Strike Notices",    count: STRIKES.length },
    { id: "contracts", label: "High-Pay Contracts", count: CONTRACTS.filter(c => c.type !== "CLOSED").length },
    { id: "outlook",   label: "2–4 Wk Outlook",   count: null },
    { id: "insights",  label: "Market Intel",      count: null },
    { id: "pricing",   label: "💳 Pricing",        count: null },
  ];

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        {/* HEADER */}
        <header style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 6, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>⚕</div>
            <div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 800, color: "var(--text)", letterSpacing: 0.5, lineHeight: 1 }}>Strikes<span style={{ color: "var(--accent)" }}>Alerts</span></div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted)", letterSpacing: 1.5 }}>HEALTHCARE LABOR INTELLIGENCE</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--green)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block", animation: "pulse 1.8s infinite" }} />
              LIVE
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)" }}>
              {now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </div>
            <button onClick={() => setTab("pricing")} style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: 5, padding: "7px 14px", fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              Subscribe
            </button>
          </div>
        </header>

        <Ticker />

        {/* STATS */}
        <div style={{ display: "flex", gap: 10, padding: "14px 24px", background: "var(--surface)", borderBottom: "1px solid var(--border)", overflowX: "auto" }}>
          <StatCard label="ACTIVE STRIKES" value="2" sub="Henry Ford + NUHW Kaiser" color="var(--green)" delay={0} />
          <StatCard label="AUTHORIZED" value="3" sub="Corewell · BMC South · OHSU" color="var(--red)" delay={60} />
          <StatCard label="VOTES PENDING" value="1" sub="Brattleboro — Mar 23" color="var(--orange)" delay={120} />
          <StatCard label="RNs AT RISK" value="12.7K+" sub="Corewell = 10,000 RNs" color="var(--yellow)" delay={180} />
          <StatCard label="TOP WEEKLY PAY" value="$12,800" sub="2026 NYC benchmark" color="var(--accent)" delay={240} />
        </div>

        {/* TABS */}
        <div style={{ display: "flex", padding: "0 24px", background: "var(--surface)", borderBottom: "1px solid var(--border)", overflowX: "auto" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: "14px 16px", display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: tab === t.id ? "#fff" : "var(--muted)", borderBottom: `2px solid ${tab === t.id ? "var(--accent)" : "transparent"}`, transition: "color 0.15s", whiteSpace: "nowrap" }}>
              {t.label}
              {t.count !== null && <span style={{ background: tab === t.id ? "var(--accent-dim)" : "rgba(255,255,255,0.05)", color: tab === t.id ? "var(--accent)" : "var(--muted)", borderRadius: 10, padding: "1px 7px", fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700 }}>{t.count}</span>}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <main style={{ flex: 1, padding: "24px", maxWidth: 1100, width: "100%", margin: "0 auto" }}>

          {tab === "strikes" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                <SectionHeader accent="var(--red)">🚨 Active Labor Disputes & Strike Notices</SectionHeader>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["ALL", "ACTIVE STRIKE", "AUTHORIZED", "MEDIUM-HIGH", "MEDIUM"].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? "var(--accent)" : "#ffffff", border: `1px solid ${filter === f ? "var(--accent)" : "#d1d5db"}`, color: filter === f ? "#ffffff" : "#111827", borderRadius: 5, padding: "5px 11px", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: filter === f ? 600 : 500, transition: "all 0.12s" }}>{f}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filtered.map((s, i) => <StrikeCard key={s.id} s={s} idx={i} onClick={handleClick} selected={selected?.id === s.id} />)}
              </div>
              <div style={{ marginTop: 14, padding: "10px 14px", background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 6, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)" }}>
                ▸ Tap any card to expand · Sources: NNU, NYSNA, Teamsters, CNA, Nurse.org, local news
              </div>
            </div>
          )}

          {tab === "contracts" && (
            <div>
              <SectionHeader accent="var(--green)">💰 High-Pay Strike & Crisis RN Contracts</SectionHeader>
              <div style={{ background: "var(--red-dim)", border: "1px solid rgba(255,77,109,0.3)", borderRadius: 6, padding: "10px 14px", marginBottom: 18, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--red)", lineHeight: 1.6 }}>
                ⚡ ALERT: Corewell Health East (10K RNs, SE Michigan) — pre-position NOW before 10-day notice drops.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))", gap: 12 }}>
                {CONTRACTS.map((c, i) => <ContractCard key={c.id} c={c} idx={i} />)}
              </div>
              <div style={{ marginTop: 16, padding: "14px 16px", background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 6 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", marginBottom: 8, letterSpacing: 1 }}>KEY AGENCY CONTACTS</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["Fastaff", "Aya Healthcare", "USNursing.com", "Cross Country Nurses", "Vivian Health", "White Glove", "HealthSource Global"].map(a => (
                    <span key={a} style={{ background: "var(--bg)", border: "1px solid var(--border2)", borderRadius: 4, padding: "4px 10px", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text2)" }}>{a}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "outlook" && (
            <div>
              <SectionHeader accent="var(--yellow)">📊 2–4 Week Strike Probability Outlook</SectionHeader>
              <div style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1.4fr 100px 1.5fr 100px", gap: 12, padding: "10px 16px", background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
                  {["LOCATION", "RISK LEVEL", "ESTIMATED TIMELINE", "PROBABILITY"].map(h => <div key={h} style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted)", letterSpacing: 1 }}>{h}</div>)}
                </div>
                {OUTLOOK.map((o, i) => <OutlookRow key={o.location} o={o} idx={i} />)}
              </div>
              <div style={{ marginTop: 14, padding: "12px 16px", background: "var(--yellow-dim)", border: "1px solid rgba(255,214,10,0.25)", borderRadius: 6, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--yellow)", lineHeight: 1.8 }}>
                ⚠ NEXT TRIGGERS: Brattleboro vote results Mon Mar 23 · Corewell 10-day notice (watch daily) · Henry Ford Genesys resolution TBD
              </div>
            </div>
          )}

          {tab === "insights" && (
            <div>
              <SectionHeader accent="var(--accent)">⚡ Market Intelligence & Trend Analysis</SectionHeader>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {INSIGHTS.map((item, i) => (
                  <div key={i} style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 6, padding: "16px 18px", display: "flex", gap: 14, alignItems: "flex-start", animation: `fadeUp 0.45s ease both`, animationDelay: `${i * 70}ms` }}>
                    <div style={{ fontSize: 22, flexShrink: 0, lineHeight: 1.2 }}>{item.icon}</div>
                    <div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: item.color, marginBottom: 6 }}>{item.title}</div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--text2)", lineHeight: 1.7 }}>{item.body}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 6, padding: "16px 18px" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", letterSpacing: 1, marginBottom: 12 }}>📡 DATA SOURCES MONITORED</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>
                  {["National Nurses United (NNU)", "NY State Nurses Assoc. (NYSNA)", "SEIU Healthcare", "UNAC/UHCP", "Teamsters Healthcare", "California Nurses Association", "AFT Healthcare", "Becker's Hospital Review", "Modern Healthcare", "Healthcare Dive", "Nurse.org Strike Tracker", "USNursing.com", "Fastaff / Aya / Cross Country", "Local news feeds"].map(src => (
                    <div key={src} style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text2)", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: "var(--accent)", flexShrink: 0 }}>›</span> {src}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "pricing" && <PricingPage />}

        </main>

        <footer style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", padding: "10px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)" }}>StrikeIntel · Healthcare Labor Intelligence · Not legal or financial advice</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)" }}>Scan cycle: 6–12hr · Powered by Claude AI</div>
        </footer>
      </div>
    </>
  );
}
