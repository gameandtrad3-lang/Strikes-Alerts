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

// DATA
const STRIKES = [{ id:1, hospital:"Corewell Health East", city:"Southeast Michigan", state:"MI", union:"Teamsters Local 2024", nurses:10000, hospitals:9, status:"AUTHORIZED", risk:"HIGH", date:"10-day notice imminent", issues:["Staffing ratios","Fair wages","Health insurance","Workplace safety"], notes:"rNas AUTHORIZED", updated:"Mar 21, 2026", color:"red"}];
const CONTRACTS = [];
const TICKER_ITEMS = ["TEST"];
const OUTLOOK = [];
const INSIGHTS = [];
const PLANS = [];
const TRAVEL_CONTRACTS = [];
const ALL_SPECIALTIES = ["All Specialties"];
const ALL_STATES = ["All States"];
export default function App() { return <div>TEST</div>; }
