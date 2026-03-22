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
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

//  DATA 

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
    date: "Results: Mar 23  Strike ~Apr 2",
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
    date: "~Day 200  ongoing",
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
    pay_hr: "$80130/hr", pay_wk: "$4,8007,800/wk (est.)",
    type: "STRIKE", specialty: ["ICU", "L&D", "ER"],
    start: "Imminent  Corewell",
    agency: "Fastaff  Aya  USNursing",
    hot: true,
    note: "Pre-position NOW before 10-day notice drops and slots vanish",
  },
  {
    id: 2,
    title: "Strike RN  All Specialties",
    location: "Grand Blanc, MI",
    pay_hr: "$90120/hr", pay_wk: "$5,4007,200/wk",
    type: "STRIKE", specialty: ["Med-Surg", "ICU", "ER"],
    start: "Active now",
    agency: "USNursing  Cross Country",
    hot: false,
    note: "Henry Ford Genesys ~Day 200. Volume tapering  act fast",
  },
  {
    id: 3,
    title: "Crisis RN  Behavioral Health",
    location: "Northern California",
    pay_hr: "$95115/hr", pay_wk: "$5,7006,900/wk",
    type: "CRISIS", specialty: ["Psych", "Behavioral Health"],
    start: "Now",
    agency: "Aya  Vivian  Fastaff",
    hot: false,
    note: "25% surge in psych contracts in 2026. NUHW dispute keeps demand elevated.",
  },
  {
    id: 4,
    title: "Rapid Response RN",
    location: "Brattleboro, VT",
    pay_hr: "$7095/hr", pay_wk: "$4,2005,700/wk (est.)",
    type: "PRE-POSITION", specialty: ["Med-Surg", "ER", "ICU"],
    start: "~Apr 2 if strike authorized",
    agency: "Fastaff  White Glove",
    hot: true,
    note: "Small hospital (160 RNs). Fast fill. Register before Mar 23 vote results.",
  },
  {
    id: 5,
    title: "Strike RN NYC Benchmark (Closed)",
    location: "New York City, NY",
    pay_hr: "Up to $161/hr (peak)", pay_wk: "$10,500$12,800/wk",
    type: "CLOSED", specialty: ["ICU", "L&D", "ER", "OR"],
    start: "Ended Feb 21, 2026",
    agency: "All major agencies",
    hot: false,
    note: "Strike ended after 41 days. Sets 2026 pay floor benchmark.",
  },
];

const TICKER_ITEMS = [
  "COREWELL HEALTH EAST MI  10,000 RNs authorize strike  10-day notice IMMINENT",
  "BRATTLEBORO MEMORIAL VT  Strike vote results due MON MAR 23",
  "KAISER UNAC/UHCP  Contracts RATIFIED Mar 20  31,000 workers return",
  "NYC NYSNA  Strike ended Feb 21 after 41 days  all contracts ratified",
  "HENRY FORD GENESYS MI  Day ~200 of strike  'optimistic' joint statement",
  "NUHW KAISER MENTAL HEALTH CA  Active strike  23K CNA sympathy Mar 18",
  "2026 BENCHMARK: Strike RNs earned up to $161/hr  $12,800/wk NYC window",
  "MICHIGAN = #1 DEPLOYMENT ZONE  Corewell + Genesys dual flashpoint",
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
  { icon: "", title: "Michigan is the #1 Deployment Zone", body: "Corewell Health East (10K RNs, 9 hospitals) has a 90% strike authorization vote and no final offer. Henry Ford Genesys is 200 days in. Pre-position credentials with Fastaff, Aya, and USNursing immediately.", color: "var(--red)" },
  { icon: "", title: "2026 Crisis Pay Benchmarks Reset Upward", body: "NYC strike saw rates up to $161/hr and $12,800/week. Kaiser crisis hit $9K/week. These numbers anchor expectations for every future deployment.", color: "var(--green)" },
  { icon: "", title: "Psych/Behavioral Health: Hidden High-Pay Niche", body: "25% surge in psych contract offers in 2026. The NUHW Kaiser mental health dispute signals sustained demand. If you hold a psych cert, this market is underserved and growing fast.", color: "var(--accent)" },
  { icon: "", title: "AI Clauses Are Now Standard Bargaining Demands", body: "Every major 2026 contract now includes language blocking AI from replacing clinical judgment. This structural conflict will drive more disputes as hospital AI adoption accelerates.", color: "var(--yellow)" },
  { icon: "", title: "First Contracts = Highest Escalation Risk", body: "Corewell and BMC South are first-contract disputes  historically the most contentious type. These escalate faster and resolve slower than renewals.", color: "var(--orange)" },
];

//  TRAVEL CONTRACTS DATA 

const TRAVEL_CONTRACTS = [
  { id: 1, hospital: "Mayo Clinic", city: "Rochester", state: "MN", specialty: "ICU", shift: "Days/Nights", pay_hr: "$82/hr", pay_wk: "$4,920/wk", start: "Apr 7, 2026", duration: "13 weeks", agency: "Aya Healthcare", hot: true, notes: "Level 1 trauma center. CCRN preferred. Housing stipend included.", url: "https://www.ayahealthcare.com/travel-nursing-jobs/search/?specialtyIds=1&stateIds=23" },
  { id: 2, hospital: "Cedars-Sinai Medical Center", city: "Los Angeles", state: "CA", specialty: "OR / Surgical", shift: "Days", pay_hr: "$95/hr", pay_wk: "$5,700/wk", start: "Apr 14, 2026", duration: "13 weeks", agency: "Fastaff", hot: true, notes: "High-volume surgical center. CNOR preferred. Immediate interviews.", url: "https://www.fastaff.com/travel-nursing-jobs?state=CA&specialty=OR" },
  { id: 3, hospital: "Johns Hopkins Hospital", city: "Baltimore", state: "MD", specialty: "ER / ED", shift: "Nights", pay_hr: "$88/hr", pay_wk: "$5,280/wk", start: "Apr 21, 2026", duration: "13 weeks", agency: "Cross Country Nurses", hot: false, notes: "Trauma I center. Minimum 2 years ER experience required.", url: "https://www.crosscountry.com/travel-nursing/jobs?state=MD&specialty=ER" },
  { id: 4, hospital: "UCSF Medical Center", city: "San Francisco", state: "CA", specialty: "L&D / OB", shift: "Nights", pay_hr: "$91/hr", pay_wk: "$5,460/wk", start: "Apr 7, 2026", duration: "13 weeks", agency: "Vivian Health", hot: true, notes: "High-risk OB unit. Fetal monitoring cert required.", url: "https://www.vivian.com/nurses/jobs/?specialty=ld&state=CA" },
  { id: 5, hospital: "Cleveland Clinic", city: "Cleveland", state: "OH", specialty: "Cath Lab", shift: "Days", pay_hr: "$98/hr", pay_wk: "$5,880/wk", start: "May 5, 2026", duration: "13 weeks", agency: "Aya Healthcare", hot: false, notes: "One of top cardiac centers in the US. RCIS preferred.", url: "https://www.ayahealthcare.com/travel-nursing-jobs/search/?specialtyIds=8&stateIds=36" },
  { id: 6, hospital: "Mass General Hospital", city: "Boston", state: "MA", specialty: "Telemetry", shift: "Nights", pay_hr: "$79/hr", pay_wk: "$4,740/wk", start: "Apr 14, 2026", duration: "13 weeks", agency: "USNursing", hot: false, notes: "Academic medical center. Strong team support and mentorship.", url: "https://www.usnursing.com/travel-nursing-jobs?state=MA&specialty=telemetry" },
  { id: 7, hospital: "Houston Methodist", city: "Houston", state: "TX", specialty: "NICU", shift: "Nights", pay_hr: "$86/hr", pay_wk: "$5,160/wk", start: "Apr 28, 2026", duration: "13 weeks", agency: "White Glove", hot: true, notes: "Level IV NICU. NRP required. 18+ months NICU experience.", url: "https://www.whiteglovecare.net/travel-nursing/jobs?state=TX&specialty=NICU" },
  { id: 8, hospital: "Tampa General Hospital", city: "Tampa", state: "FL", specialty: "Med-Surg", shift: "Days/Nights", pay_hr: "$72/hr", pay_wk: "$4,320/wk", start: "Apr 7, 2026", duration: "13 weeks", agency: "Fastaff", hot: false, notes: "High nurse-to-patient ratio. Great for new travelers.", url: "https://www.fastaff.com/travel-nursing-jobs?state=FL&specialty=med-surg" },
  { id: 9, hospital: "NewYork-Presbyterian", city: "New York", state: "NY", specialty: "Psych / Behavioral Health", shift: "Nights", pay_hr: "$94/hr", pay_wk: "$5,640/wk", start: "May 12, 2026", duration: "13 weeks", agency: "Aya Healthcare", hot: true, notes: "Inpatient psych unit. BLS + de-escalation training required.", url: "https://www.ayahealthcare.com/travel-nursing-jobs/search/?specialtyIds=14&stateIds=33" },
  { id: 10, hospital: "Vanderbilt University Medical Center", city: "Nashville", state: "TN", specialty: "Stepdown / PCU", shift: "Nights", pay_hr: "$76/hr", pay_wk: "$4,560/wk", start: "Apr 21, 2026", duration: "13 weeks", agency: "Cross Country Nurses", hot: false, notes: "Magnet hospital. PCU experience 1+ year preferred.", url: "https://www.crosscountry.com/travel-nursing/jobs?state=TN&specialty=PCU" },
  { id: 11, hospital: "University of Washington Medical Center", city: "Seattle", state: "WA", specialty: "Interventional Radiology", shift: "Days", pay_hr: "$102/hr", pay_wk: "$6,120/wk", start: "May 5, 2026", duration: "13 weeks", agency: "Vivian Health", hot: true, notes: "Top-tier IR department. ARRT preferred. High pay market.", url: "https://www.vivian.com/nurses/jobs/?specialty=ir&state=WA" },
  { id: 12, hospital: "Emory University Hospital", city: "Atlanta", state: "GA", specialty: "GI", shift: "Days", pay_hr: "$78/hr", pay_wk: "$4,680/wk", start: "Apr 14, 2026", duration: "13 weeks", agency: "USNursing", hot: false, notes: "High-volume GI lab. Endoscopy experience required.", url: "https://www.usnursing.com/travel-nursing-jobs?state=GA&specialty=GI" },
  { id: 13, hospital: "Stanford Health Care", city: "Palo Alto", state: "CA", specialty: "Radiology", shift: "Days", pay_hr: "$89/hr", pay_wk: "$5,340/wk", start: "Apr 28, 2026", duration: "13 weeks", agency: "Fastaff", hot: false, notes: "Leading research hospital. ARRT required.", url: "https://www.fastaff.com/travel-nursing-jobs?state=CA&specialty=radiology" },
  { id: 14, hospital: "Northwestern Memorial", city: "Chicago", state: "IL", specialty: "ICU", shift: "Nights", pay_hr: "$85/hr", pay_wk: "$5,100/wk", start: "Apr 7, 2026", duration: "13 weeks", agency: "Aya Healthcare", hot: false, notes: "Magnet designation. CCRN preferred. 2yr ICU min.", url: "https://www.ayahealthcare.com/travel-nursing-jobs/search/?specialtyIds=1&stateIds=14" },
  { id: 15, hospital: "OHSU Hospital", city: "Portland", state: "OR", specialty: "ER / ED", shift: "Days/Nights", pay_hr: "$90/hr", pay_wk: "$5,400/wk", start: "May 5, 2026", duration: "13 weeks", agency: "White Glove", hot: true, notes: "Level 1 trauma center. Active union contract ongoing.", url: "https://www.whiteglovecare.net/travel-nursing/jobs?state=OR&specialty=ER" },
];

const ALL_SPECIALTIES = ["All Specialties", "ICU", "ER / ED", "L&D / OB", "OR / Surgical", "Med-Surg", "Psych / Behavioral Health", "NICU", "Telemetry", "Stepdown / PCU", "Home Health", "Interventional Radiology", "Cath Lab", "GI", "Radiology"];
const ALL_STATES = ["All States", "CA", "FL", "GA", "IL", "MA", "MD", "MN", "NY", "OH", "OR", "TN", "TX", "WA"];

//  PRICING DATA 

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
      "24 week strike outlook",
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

//  COMPONENTS 

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
  const full = [...TICKER_ITEMS, ...TICKER_ITEMS].join("          ");
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
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)", letterSpacing: 1, marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 28, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--text2)", marginTop: 5 }}>{sub}</div>}
    </div>
  );
}

function SectionHeader({ children, accent = "var(--accent)" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <div style={{ width: 3, height: 18, background: accent, borderRadius: 2, flexShrink: 0 }} />
      <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "var(--text2)" }}>{children}</h2>
    </div>
  );
}

function StrikeCard({ s, idx, onClick, selected }) {
  const statusColor = {
    "ACTIVE STRIKE": "var(--green)",
    "AUTHORIZED":    "var(--red)",
    "VOTE PENDING":  "var(--orange)",
    "WATCH":         "var(--yellow)",
  }[s.status] || "var(--border2)";
  return (
    <div onClick={() => onClick(s)} style={{ background: selected ? "var(--panel2)" : "var(--surface)", border: `1px solid ${selected ? statusColor : "var(--border)"}`, borderLeft: `6px solid ${statusColor}`, borderRadius: 8, padding: "16px 18px", cursor: "pointer", animation: `fadeUp 0.45s ease both`, animationDelay: `${idx * 60}ms`, transition: "all 0.15s", boxShadow: selected ? `0 2px 12px ${statusColor}22` : "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
        <div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 17, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{s.hospital}</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text2)" }}>{s.city}, {s.state}  {s.union}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
          <StatusBadge status={s.status} />
          <RiskBadge risk={s.risk} />
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 10 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}><span style={{ color: "var(--muted)" }}>RNs </span><span style={{ color: "var(--accent)", fontWeight: 700 }}>{s.nurses.toLocaleString()}</span></span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}><span style={{ color: "var(--muted)" }}>Sites </span><span style={{ color: "var(--accent)", fontWeight: 700 }}>{s.hospitals}</span></span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: statusColor, fontWeight: 600 }}>{s.date}</span>
      </div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text2)", lineHeight: 1.6 }}>{s.notes}</div>
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
      {c.hot && <div style={{ position: "absolute", top: 0, right: 0, background: "var(--red)", color: "#fff", fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: 1, padding: "3px 10px", borderBottomLeftRadius: 6 }}> ACT NOW</div>}
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
         {c.note}
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
      <SectionHeader accent="var(--accent)"> Plans & Pricing</SectionHeader>

      {/* Value prop */}
      <div style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 8, padding: "20px 24px", marginBottom: 28, textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>
          One deployment pays for <span style={{ color: "var(--green)" }}>3+ years</span> of StrikeIntel
        </div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text2)" }}>
          Strike nurses earn $5,000$12,800/week. At $14.99/mo, your subscription pays for itself in the first 30 minutes on assignment.
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
                    <span style={{ color: "var(--green)", fontFamily: "var(--font-mono)", fontSize: 12, flexShrink: 0, marginTop: 1 }}></span>
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
          { q: "How often is the data updated?", a: "Intel is scanned and refreshed every 612 hours, and on-demand when major notices drop." },
          { q: "Do I need to sign a contract?", a: "No. Monthly plans cancel anytime. Annual plans are billed once per year." },
          { q: "What specialties are covered?", a: "ICU, ER, L&D, OR, Med-Surg, Psych, and all acute care specialties are tracked." },
          { q: "How do I get alerts?", a: "Email alerts are included on all plans. SMS alerts are coming soon." },
        ].map(({ q, a }) => (
          <div key={q} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 5 }}>{q}</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--text2)", lineHeight: 1.6 }}>{a}</div>
          </div>
        ))}
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)" }}>Payments powered by Stripe  SSL secured  Cancel anytime</div>
      </div>
    </div>
  );
}

//  TRAVEL CONTRACTS PAGE 

function TravelContractsPage() {
  const [specialty, setSpecialty] = useState("All Specialties");
  const [state, setState] = useState("All States");

  const filtered = TRAVEL_CONTRACTS.filter(c => {
    const matchSpec  = specialty === "All Specialties" || c.specialty === specialty;
    const matchState = state    === "All States"       || c.state    === state;
    return matchSpec && matchState;
  });

  const D = {
    bg:      "#f4f7fb",
    surface: "#ffffff",
    panel:   "#f8fafc",
    border:  "#e2e8f0",
    accent:  "#0077aa",
    green:   "#22a855",
    red:     "#e53e5a",
    yellow:  "#d97706",
    text:    "#0d1829",
    text2:   "#4a6080",
    muted:   "#94aabf",
  };

  const selStyle = {
    background: D.panel, color: D.text,
    border: `1px solid ${D.border}`, borderRadius: 8,
    padding: "9px 14px", fontFamily: "var(--font-sans)",
    fontSize: 14, fontWeight: 500, cursor: "pointer",
    outline: "none", minWidth: 180,
  };

  return (
    <div style={{ minHeight: "100vh", background: D.bg, color: D.text, fontFamily: "var(--font-sans)", animation: "slideIn 0.3s ease" }}>

      {/* Dark header */}
      <div style={{ background: D.surface, borderBottom: `1px solid ${D.border}`, padding: "16px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: D.muted, letterSpacing: 2, marginBottom: 6 }}>TRAVEL CONTRACTS</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: D.text, marginBottom: 4 }}>
             Travel Nurse Contract Assignments
          </div>
          <div style={{ fontSize: 13, color: D.text2 }}>
            Latest travel nurse openings by state, specialty & hospital  updated daily
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: D.surface, borderBottom: `1px solid ${D.border}`, padding: "14px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: D.muted, fontWeight: 500 }}>Filter by:</span>
          <select value={specialty} onChange={e => setSpecialty(e.target.value)} style={selStyle}>
            {ALL_SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={state} onChange={e => setState(e.target.value)} style={selStyle}>
            {ALL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {(specialty !== "All Specialties" || state !== "All States") && (
            <button onClick={() => { setSpecialty("All Specialties"); setState("All States"); }}
              style={{ background: "transparent", border: `1px solid ${D.border}`, color: D.text2, borderRadius: 8, padding: "9px 14px", fontFamily: "var(--font-sans)", fontSize: 13, cursor: "pointer" }}>
              Clear filters
            </button>
          )}
          <span style={{ marginLeft: "auto", fontSize: 13, color: D.muted }}>
            {filtered.length} contract{filtered.length !== 1 ? "s" : ""} found
          </span>
        </div>
      </div>

      {/* Contract cards */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
          {filtered.map((c, i) => (
            <div key={c.id} style={{ background: D.surface, border: `1px solid ${c.hot ? D.accent : D.border}`, borderTop: `3px solid ${c.hot ? D.accent : D.border}`, borderRadius: 10, padding: "18px 20px", animation: `fadeUp 0.4s ease both`, animationDelay: `${i * 50}ms`, position: "relative", overflow: "hidden" }}>
              {c.hot && (
                <div style={{ position: "absolute", top: 0, right: 0, background: D.accent, color: "#000", fontSize: 9, fontWeight: 800, letterSpacing: 1, padding: "3px 10px", borderBottomLeftRadius: 8 }}>
                   HOT
                </div>
              )}
              {/* Hospital */}
              <div style={{ fontSize: 16, fontWeight: 700, color: D.text, marginBottom: 3 }}>{c.hospital}</div>
              <div style={{ fontSize: 12, color: D.text2, marginBottom: 12 }}>{c.city}, {c.state}</div>

              {/* Specialty & shift */}
              <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{ background: "rgba(0,229,255,0.1)", color: D.accent, border: `1px solid rgba(0,229,255,0.2)`, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{c.specialty}</span>
                <span style={{ background: D.panel, color: D.text2, border: `1px solid ${D.border}`, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 500 }}>{c.shift}</span>
                <span style={{ background: D.panel, color: D.text2, border: `1px solid ${D.border}`, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 500 }}>{c.duration}</span>
              </div>

              {/* Pay */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                <div style={{ background: D.panel, borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 9, color: D.muted, letterSpacing: 1, marginBottom: 4 }}>HOURLY</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: D.green }}>{c.pay_hr}</div>
                </div>
                <div style={{ background: D.panel, borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 9, color: D.muted, letterSpacing: 1, marginBottom: 4 }}>WEEKLY EST.</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: D.green }}>{c.pay_wk}</div>
                </div>
              </div>

              {/* Start date & agency */}
              <div style={{ fontSize: 12, color: D.text2, marginBottom: 8, lineHeight: 1.7 }}>
                <span style={{ color: D.muted }}>Start: </span><span style={{ color: D.yellow, fontWeight: 600 }}>{c.start}</span>
                <br/>
                <span style={{ color: D.muted }}>Agency: </span>{c.agency}
              </div>

              {/* Notes */}
              <div style={{ fontSize: 12, color: D.text2, lineHeight: 1.6, marginBottom: 14, padding: "8px 10px", background: D.panel, borderRadius: 6 }}>{c.notes}</div>

              {/* Apply button */}
              <button style={{ width: "100%", padding: "10px", background: c.hot ? D.accent : "transparent", border: `1px solid ${c.hot ? D.accent : D.border}`, color: c.hot ? "#000" : D.text, borderRadius: 8, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                {c.hot ? " Apply Now" : "View & Apply"}
              </button>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: D.muted }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}></div>
            <div style={{ fontSize: 18, fontWeight: 600, color: D.text2, marginBottom: 6 }}>No contracts found</div>
            <div style={{ fontSize: 14 }}>Try adjusting your filters</div>
          </div>
        )}
      </div>
    </div>
  );
}

//  MAIN APP 

export default function App() {
  const [mode, setMode] = useState("strikes"); // "strikes" | "contracts"
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
    { id: "outlook",   label: "24 Wk Outlook",   count: null },
    { id: "insights",  label: " News",             count: null },
    { id: "pricing",   label: " Pricing",        count: null },
  ];

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        {/* TOP MODE TAB BAR */}
        <div style={{ background: "#ffffff", borderBottom: "2px solid var(--border)", display: "flex" }}>
          <button onClick={() => setMode("strikes")} style={{ flex: 1, padding: "16px 24px", fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 700, cursor: "pointer", border: "none", borderBottom: mode === "strikes" ? "3px solid #e53e5a" : "3px solid transparent", background: mode === "strikes" ? "#fff5f7" : "#ffffff", color: mode === "strikes" ? "#e53e5a" : "#94aabf", marginBottom: -2, transition: "all 0.15s" }}>
            Travel Strikes
          </button>
          <div style={{ width: 1, background: "var(--border)", margin: "8px 0" }} />
          <button onClick={() => setMode("contracts")} style={{ flex: 1, padding: "16px 24px", fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 700, cursor: "pointer", border: "none", borderBottom: mode === "contracts" ? "3px solid #0077aa" : "3px solid transparent", background: mode === "contracts" ? "#f0f8ff" : "#ffffff", color: mode === "contracts" ? "#0077aa" : "#94aabf", marginBottom: -2, transition: "all 0.15s" }}>
            Travel Contracts
          </button>
        </div>

                {/* TRAVEL CONTRACTS MODE */}
        {mode === "contracts" && <TravelContractsPage />}

        {/* STRIKES MODE */}
        {mode === "strikes" && (<>

        {/* HEADER */}
        <header style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src="/logo.png" alt="Strike Alerts" style={{ height: 52, width: "auto", objectFit: "contain", flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 20, fontWeight: 800, color: "var(--text)", lineHeight: 1.1, letterSpacing: "-0.3px" }}>Strike Alerts</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 500, color: "var(--muted)", letterSpacing: 2 }}>HEALTHCARE LABOR INTELLIGENCE</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--green)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block", animation: "pulse 1.8s infinite" }} />
              LIVE
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)" }}>
              {now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}  {now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
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
          <StatCard label="AUTHORIZED" value="2" sub="Corewell  BMC South" color="var(--red)" delay={60} />
          <StatCard label="VOTES PENDING" value="1" sub="Brattleboro  Mar 23" color="var(--orange)" delay={120} />
          <StatCard label="RNs AT RISK" value="12.7K+" sub="Corewell = 10,000 RNs" color="var(--yellow)" delay={180} />
          <StatCard label="TOP WEEKLY PAY" value="$12,800" sub="2026 NYC benchmark" color="var(--accent)" delay={240} />
        </div>

        {/* TABS */}
        <div style={{ display: "flex", padding: "12px 24px", gap: 8, background: "var(--surface)", borderBottom: "1px solid var(--border)", overflowX: "auto" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab === t.id ? "var(--accent)" : "#ffffff", border: `1.5px solid ${tab === t.id ? "var(--accent)" : "#d1d5db"}`, borderRadius: 8, cursor: "pointer", padding: "9px 18px", display: "flex", alignItems: "center", gap: 7, fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: tab === t.id ? 700 : 500, color: tab === t.id ? "#ffffff" : "#374151", transition: "all 0.15s", whiteSpace: "nowrap", boxShadow: tab === t.id ? "0 2px 8px rgba(0,119,170,0.2)" : "none" }}>
              {t.label}
              {t.count !== null && <span style={{ background: tab === t.id ? "rgba(255,255,255,0.25)" : "#f3f4f6", color: tab === t.id ? "#ffffff" : "#6b7280", borderRadius: 20, padding: "1px 8px", fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700 }}>{t.count}</span>}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <main style={{ flex: 1, padding: "24px", maxWidth: 1100, width: "100%", margin: "0 auto" }}>

          {tab === "strikes" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                <SectionHeader accent="var(--red)"> Active Labor Disputes & Strike Notices</SectionHeader>
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
                 Tap any card to expand  Sources: NNU, NYSNA, Teamsters, CNA, Nurse.org, local news
              </div>
            </div>
          )}

          {tab === "contracts" && (
            <div>
              <SectionHeader accent="var(--green)"> High-Pay Strike & Crisis RN Contracts</SectionHeader>
              <div style={{ background: "var(--red-dim)", border: "1px solid rgba(255,77,109,0.3)", borderRadius: 6, padding: "10px 14px", marginBottom: 18, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--red)", lineHeight: 1.6 }}>
                 ALERT: Corewell Health East (10K RNs, SE Michigan)  pre-position NOW before 10-day notice drops.
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
              <SectionHeader accent="var(--yellow)"> 24 Week Strike Probability Outlook</SectionHeader>
              <div style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1.4fr 100px 1.5fr 100px", gap: 12, padding: "10px 16px", background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
                  {["LOCATION", "RISK LEVEL", "ESTIMATED TIMELINE", "PROBABILITY"].map(h => <div key={h} style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted)", letterSpacing: 1 }}>{h}</div>)}
                </div>
                {OUTLOOK.map((o, i) => <OutlookRow key={o.location} o={o} idx={i} />)}
              </div>
              <div style={{ marginTop: 14, padding: "12px 16px", background: "var(--yellow-dim)", border: "1px solid rgba(255,214,10,0.25)", borderRadius: 6, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--yellow)", lineHeight: 1.8 }}>
                 NEXT TRIGGERS: Brattleboro vote results Mon Mar 23  Corewell 10-day notice (watch daily)  Henry Ford Genesys resolution TBD
              </div>
            </div>
          )}

          {tab === "insights" && (
            <div>
              <SectionHeader accent="var(--accent)"> Latest Strike News</SectionHeader>
              <div style={{ background: "var(--accent-dim)", border: "1px solid rgba(0,119,170,0.2)", borderRadius: 8, padding: "12px 16px", marginBottom: 18, fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--accent)" }}>
                 News is updated daily at 6 AM ET  sourced from union announcements, local news, and healthcare publications.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {INSIGHTS.map((item, i) => (
                  <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderLeft: `4px solid ${item.color}`, borderRadius: 8, padding: "16px 18px", display: "flex", gap: 14, alignItems: "flex-start", animation: `fadeUp 0.45s ease both`, animationDelay: `${i * 70}ms`, cursor: "pointer", transition: "box-shadow 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)"}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                    <div style={{ fontSize: 24, flexShrink: 0, lineHeight: 1.2 }}>{item.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>{item.title}</div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--text2)", lineHeight: 1.7, marginBottom: 10 }}>{item.body}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ background: "var(--panel2)", color: item.color, border: `1px solid ${item.color}33`, borderRadius: 20, padding: "2px 10px", fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600 }}>Strike News</span>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--muted)" }}>Updated daily</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "pricing" && <PricingPage />}

        </main>

        <footer style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", padding: "10px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)" }}>StrikeIntel  Healthcare Labor Intelligence  Not legal or financial advice</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)" }}>Scan cycle: 612hr  Powered by Claude AI</div>
        </footer>
      </> )}
      </div>
    </>
  );
}
