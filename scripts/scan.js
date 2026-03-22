// scripts/scan.js - Daily healthcare labor intelligence + travel contracts scan
const fs = require('fs');
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) { console.error('ANTHROPIC_API_KEY not set'); process.exit(1); }

async function callClaude(prompt) {
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 4000, messages: [{ role: 'user', content: prompt }] })
  });
  if (!resp.ok) { throw new Error('API error: ' + resp.status + ' ' + await resp.text()); }
  const data = await resp.json();
  const text = data.content.filter(b => b.type === 'text').map(b => b.text).join('');
  return text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
}

async function runScan() {
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  console.log('Starting daily scan - ' + new Date().toISOString());

  // ── SCAN 1: Strike Intelligence ──────────────────────────────────
  console.log('Scanning strikes...');
  const strikePrompt = 'You are a healthcare labor intelligence analyst. Today is ' + today + '. Based on current knowledge of US healthcare labor disputes, provide the latest information. Return ONLY valid JSON (no markdown): {"lastUpdated":"' + new Date().toISOString() + '","strikes":[{"id":1,"hospital":"Hospital","city":"City","state":"ST","union":"Union","nurses":1000,"sites":1,"status":"ACTIVE STRIKE","risk":"HIGH","date":"timeline","issues":["wages"],"notes":"summary","updated":"' + new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) + '","color":"rd"}],"contracts":[{"id":1,"title":"title","loc":"location","hr":"$80-130/hr","wk":"$4800-7800/wk","type":"STRIKE","specs":["ICU"],"start":"ASAP","agency":"Agency","hot":true,"note":"note"}],"ticker":["emoji HEADLINE - text"],"outlook":[{"loc":"location","risk":"HIGH","tl":"timeline","p":90}],"insights":[{"icon":"emoji","title":"title","body":"insight body","color":"#ff4d6d"}]}. Include 4-6 strikes, 4-5 contracts, 6-8 ticker items, 4-6 outlook, 4-5 insights. Colors: rd=#e53e5a, or=#ea6c00, yw=#d97706, gn=#22a855.';
  const strikeData = JSON.parse(await callClaude(strikePrompt));
  console.log('Strikes: ' + strikeData.strikes.length + ' found');

  // ── SCAN 2: Travel Nurse Contracts ───────────────────────────────
  console.log('Scanning travel contracts...');
  const contractPrompt = 'You are a travel nurse staffing expert. Today is ' + today + '. Generate a list of realistic current travel nurse contract openings across the US. Return ONLY valid JSON (no markdown): [{"id":1,"hospital":"Hospital Name","city":"City","state":"ST","specialty":"ICU","shift":"Days/Nights","pay_hr":"$85/hr","pay_wk":"$5100/wk","start":"Apr 7, 2026","duration":"13 weeks","agency":"Aya Healthcare","hot":true,"notes":"Brief requirement notes"}]. Include 15 contracts across these specialties: ICU, ER/ED, L&D/OB, OR/Surgical, Med-Surg, Psych/Behavioral Health, NICU, Telemetry, Stepdown/PCU, Interventional Radiology, Cath Lab, GI, Radiology. Spread across states: CA, TX, FL, NY, WA, OR, MA, IL, MN, OH, MD, GA, TN, NV, AZ. Mark 4-5 as hot:true. Pay rates should be realistic for 2026 market ($70-110/hr). Start dates should be 2-6 weeks from today.';
  const travelContracts = JSON.parse(await callClaude(contractPrompt));
  console.log('Travel contracts: ' + travelContracts.length + ' found');

  // ── Write data.js ────────────────────────────────────────────────
  const output =
    '// Auto-generated daily at 6 AM ET — DO NOT EDIT MANUALLY\n' +
    '// Last updated: ' + new Date().toISOString() + '\n\n' +
    'export const INTEL_DATA = ' + JSON.stringify(strikeData, null, 2) + ';\n\n' +
    'export const { lastUpdated, strikes: STRIKES, contracts: CONTRACTS, ticker: TICKER, outlook: OUTLOOK, insights: INSIGHTS } = INTEL_DATA;\n\n' +
    'export const TRAVEL_CONTRACTS = ' + JSON.stringify(travelContracts, null, 2) + ';\n\n' +
    'export const ALL_SPECIALTIES = ["All Specialties", ...new Set(TRAVEL_CONTRACTS.map(c => c.specialty))];\n' +
    'export const ALL_STATES = ["All States", ...new Set(TRAVEL_CONTRACTS.map(c => c.state)).keys()].sort();\n';

  fs.writeFileSync('src/data.js', output);
  console.log('src/data.js updated successfully!');
  console.log('Summary: ' + strikeData.strikes.length + ' strikes, ' + travelContracts.length + ' travel contracts');
}

runScan().catch(e => { console.error('Scan failed:', e.message); process.exit(1); });
