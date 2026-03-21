import { useState, useEffect } from "react";

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #06090d;
    --surface: #0b0f14;
    --panel: #0f1520;
    --panel2: #131c27;
    --border: #1a2535;
    --border2: #243044;
    --accent: #00e5ff;
    --accent-dim: rgba(0,229,255,0.12);
    --red: #ff4d6d;
    --red-dim: rgba(255,77,109,0.12);
    --yellow: #ffd60a;
    --yellow-dim: rgba(255,214,10,0.12);
    --green: #39d353;
    --green-dim: rgba(57,211,83,0.12);
    --orange: #ff8c42;
    --orange-dim: rgba(255,140,66,0.12);
    --text: #c9d8e8;
    --text2: #7a9bb5;
    --muted: #3d5166;
    --font-mono: 'Space Mono', monospace;
    --font-sans: 'Syne', sans-serif;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-sans);
    min-height: 100vh;
    overflow-x: hidden;
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

export default function App() {
  return <div style={{body:"var(--bg)", color:"var(--text)", fontFamily:"var(--font-sans)", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24}}>Loading StrikeIntel…</div>;
}
