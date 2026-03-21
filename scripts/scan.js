// scripts/scan.js - Daily intelligence scan using Claude AI + web search
const fs = require('fs');
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) { console.error('ANTHROPIC_API_KEY not set'); process.exit(1); }

async function runScan() {
    console.log(`Starting daily scan - ${new Date().toISOString()}`);
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const prompt = `You are a healthcare labor intelligence analyst. Today is ${today}.
    Search for the LATEST on: new 10-day strike notices at US hospitals, active nurse strikes, authorized strikes, high-pay crisis RN contracts ($3000+/week), upcoming labor actions next 2-4 weeks.
    Return ONLY valid JSON (no markdown):
    {"lastUpdated":"${new Date().toISOString()}","strikes":[{"id":1,"hospital":"Name","city":"City","state":"ST","union":"Union","nurses":1000,"sites":1,"status":"ACTIVE STRIKE","risk":"HIGH","date":"timeline","issues":["issue1"],"notes":"summary","updated":"${new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}","color":"rd"}],"contracts":[{"id":1,"title":"title","loc":"location","hr":"$80-130/hr","wk":"$4800-7800/wk","type":"STRIKE","specs":["ICU"],"start":"start","agency":"agency","hot":true,"note":"note"}],"ticker":["emoji HEADLINE - text"],"outlook":[{"loc":"location","risk":"HIGH","tl":"timeline","p":90}],"insights":[{"icon":"emoji","title":"title","body":"body","color":"#ff4d6d"}]}
    Color codes: rd=#ff4d6d, or=#ff8c42, yw=#ffd60a, gn=#39d353. Include 4-6 strikes, 4-5 contracts, 6-8 ticker items, 4-6 outlook rows, 4-5 insights.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({
                model: 'claude-sonnet-4-20250514', max_tokens: 4000,
                tools: [{ type: "web_search_20250305", name: "web_search" }],
                messages: [{ role: 'user', content: prompt }]
        })
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    const text = data.content.filter(b => b.type === 'text').map(b => b.text).join('');
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const intel = JSON.parse(clean);
    console.log(`Scan complete - ${intel.strikes?.length} strikes, ${intel.contracts?.length} contracts`);

  fs.writeFileSync('src/data.js', `// Auto-generated daily - DO NOT EDIT MANUALLY
  export const INTEL_DATA = ${JSON.stringify(intel, null, 2)};
  export const { lastUpdated, strikes: STRIKES, contracts: CONTRACTS, ticker: TICKER, outlook: OUTLOOK, insights: INSIGHTS } = INTEL_DATA;
  `);
    console.log('src/data.js updated successfully');
}

runScan().catch(e => { console.error('Scan failed:', e.message); process.exit(1); });
