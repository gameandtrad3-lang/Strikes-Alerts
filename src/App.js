import { useState, useEffect } from "react";
const S={bg:"#06090d",sf:"#0b0f14",pn:"#0f1520",p2:"#131c27",bd:"#1a2535",b2:"#243044",ac:"#00e5ff",rd:"#ff4d6d",yw:"#ffd60a",gn:"#39d353",or:"#ff8c42",tx:"#c9d8e8",t2:"#7a9bb5",mt:"#3d5166"};
const css=`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0}:root{--bg:${S.bg};--sf:${S.sf};--pn:${S.pn};--p2:${S.p2};--bd:${S.bd};--b2:${S.b2};--ac:${S.ac};--rd:${S.rd};--yw:${S.yw};--gn:${S.gn};--or:${S.or};--tx:${S.tx};--t2:${S.t2};--mt:${S.mt};--rdd:rgba(255,77,109,.12);--yd:rgba(255,214,10,.12);--gd:rgba(57,211,83,.12);--od:rgba(255,140,66,.12);--ad:rgba(0,229,255,.12);--fm:'Space Mono',monospace;--fs:'Syne',sans-serif}body{background:var(--bg);color:var(--tx);font-family:var(--fs);min-height:100vh;overflow-x:hidden}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--b2);border-radius:2px}@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`;
const STRIKES=[{id:1,hospital:"Corewell Health East",city:"SE Michigan",state:"MI",union:"Teamsters Local 2024",nurses:10000,sites:9,status:"AUTHORIZED",risk:"HIGH",date:"10-day notice imminent",issues:["Staffing ratios","Fair wages","Health insurance","Safety"],notes:"First contract since Jun 2025. 90% strike vote. No final offer made.",updated:"Mar 21, 2026",c:"rd"},{id:2,hospital:"Brattleboro Memorial Hospital",city:"Brattleboro",state:"VT",union:"Brattleboro Federation of Nurses",nurses:160,sites:1,status:"VOTE PENDING",risk:"MED-HIGH",date:"Vote Mar 23 → Strike ~Apr 2",issues:["3-yr wage freeze","Benefit cuts","$14.5M deficit"],notes:"80%+ signed strike cards. Vote Monday. 10-day notice next if YES.",updated:"Mar 21, 2026",c:"or"},{id:3,hospital:"Henry Ford Genesys Hospital",city:"Grand Blanc",state:"MI",union:"Teamsters Local 332",nurses:400,sites:1,status:"ACTIVE STRIKE",risk:"ACTIVE",date:"~Day 200 ongoing",issues:["Wages","Staffing"],notes:"Joint statement signals optimism but no TA yet.",updated:"Mar 21, 2026",c:"yw"},{id:4,hospital:"NUHW Kaiser Mental Health",city:"Northern CA",state:"CA",union:"NUHW + CNA",nurses:25400,sites:12,status:"ACTIVE STRIKE",risk:"ACTIVE",date:"CNA sympathy Mar 18",issues:["AI","Staffing","Wages"],notes:"2,400 NUHW therapists on strike. 23K CNA sympathy Mar 18.",updated:"Mar 21, 2026",c:"yw"},{id:5,hospital:"BMC South Brockton",city:"Brockton",state:"MA",union:"MNA",nurses:480,sites:1,status:"AUTHORIZED",risk:"MEDIUM",date:"No date set",issues:["Staffing","Retirement","Insurance"],notes:"First contract. Authorized, no walkout scheduled.",updated:"Mar 21, 2026",c:"or"},{id:6,hospital:"Oregon Health & Science Univ.",city:"Portland",state:"OR",union:"ONA + AFSCME",nurses:1700,sites:1,status:"WATCH",risk:"MEDIUM",date:"Vote pending",issues:["Contract","Research workers"],notes:"ONA dispute ongoing. AFSCME vote preparing.",updated:"Mar 21, 2026",c:"yw"}];
const CONTRACTS=[{id:1,title:"Crisis ICU/L&D RN",loc:"SE Michigan",hr:"$80-130/hr",wk:"$4,800-7,800/wk",type:"STRIKE",specs:["ICU","L&D","ER"],start:"Imminent",agency:"Fastaff · Aya · USNursing",hot:true,note:"Pre-position NOW before 10-day notice drops"},{id:2,title:"Strike RN All Specialties",loc:"Grand Blanc MI",hr:"$90-120/hr",wk:"$5,400-7,200/wk",type:"STRIKE",specs:["Med-Surg","ICU","ER"],start:"Active now",agency:"USNursing · Cross Country",hot:false,note:"Genesys ~Day 200. Volume tapering"},{id:3,title:"Crisis RN Behavioral Health",loc:"Northern CA",hr:"$95-115/hr",wk:"$5,700-6,900/wk",type:"CRISIS",specs:["Psych","BH"],start:"Now",agency:"Aya · Vivian · Fastaff",hot:false,note:"25% surge in psych contracts 2026"},{id:4,title:"Rapid Response RN",loc:"Brattleboro VT",hr:"$70-95/hr",wk:"$4,200-5,700/wk",type:"PRE-POSITION",specs:["Med-Surg","ER","ICU"],start:"~Apr 2 if authorized",agency:"Fastaff · White Glove",hot:true,note:"Small hospital 160 RNs. Fast fill"},{id:5,title:"Strike RN NYC Benchmark",loc:"New York City NY",hr:"Up to $161/hr",wk:"$10,500-12,800/wk",type:"CLOSED",specs:["ICU","L&D","ER","OR"],start:"Ended Feb 21 2026",agency:"All major agencies",hot:false,note:"Closed — sets 2026 benchmark"}];
const TICKER=["🔴 COREWELL HEALTH EAST MI — 10,000 RNs — 10-day notice IMMINENT","🟠 BRATTLEBORO VT — Vote results MON MAR 23","✅ KAISER UNAC/UHCP — Ratified Mar 20","✅ NYC NYSNA — Strike ended Feb 21","🟡 HENRY FORD GENESYS MI — Day 200","💰 2026 BENCHMARK: $161/hr · $12,800/wk NYC","⚡ MICHIGAN = #1 DEPLOYMENT ZONE"];
const PLANS=[{id:"nurse",name:"Nurse",price:"$14.99",period:"/mo",desc:"Individual travel & strike nurses",features:["Real-time strike notices","High-pay contracts","2-4 wk outlook","Market intel","Email alerts","Mobile access"],cta:"Start Free Trial",hi:true,badge:"MOST POPULAR"},{id:"agency",name:"Agency",price:"$99",period:"/mo",desc:"Staffing agencies & recruiters",features:["Everything in Nurse","5 team seats","CSV export","Priority alerts","Agency insights","Dedicated support"],cta:"Contact Us",hi:false,badge:null}];
const cc={rd:"#ff4d6d",or:"#ff8c42",yw:"#ffd60a",gn:"#39d353"};
const rc={HIGH:"#ff4d6d",ACTIVE:"#39d353","MED-HIGH":"#ff8c42",MEDIUM:"#ffd60a"};
export default function App(){
  const[tab,setTab]=useState("strikes");
  const[sel,setSel]=useState(null);
  const[filt,setFilt]=useState("ALL");
  const[now,setNow]=useState(new Date());
  const[bill,setBill]=useState("monthly");
  useEffect(()=>{const t=setInterval(()=>setNow(new Date()),30000);return()=>clearInterval(t);},[]);
  const click=s=>setSel(p=>p?.id===s.id?null:s);
  const filtered=filt==="ALL"?STRIKES:STRIKES.filter(s=>s.risk===filt||s.status===filt);
  const ticker=[...TICKER,...TICKER].join(" · ");
  return React.createElement(React.Fragment,null,
    React.createElement("style",null,css),
    React.createElement("div",{style:{minHeight:"100vh",display:"flex",flexDirection:"column"}},
      React.createElement("header",{style:{background:"var(--sf)",borderBottom:"1px solid var(--bd)",padding:"0 24px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between"}},
        React.createElement("div",{style:{display:"flex",alignItems:"center",gap:12}},
          React.createElement("div",{style:{width:34,height:34,borderRadius:6,background:"linear-gradient(135deg,#c0143c,#ff4d6d)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:"#fff"}},"⚕"),
          React.createElement("div",null,
            React.createElement("div",{style:{fontFamily:"var(--fs)",fontSize:16,fontWeight:800,color:"#fff"}},"STRIKE",React.createElement("span",{style:{color:"var(--ac)"}},"INTEL")),
            React.createElement("div",{style:{fontFamily:"var(--fm)",fontSize:9,color:"var(--mt)",letterSpacing:1.5}},"HEALTHCARE LABOR INTELLIGENCE"))),
        React.createElement("div",{style:{display:"flex",alignItems:"center",gap:16}},
          React.createElement("div",{style:{display:"flex",alignItems:"center",gap:6,fontFamily:"var(--fm)",fontSize:10,color:"var(--gn)"}},
            React.createElement("span",{style:{width:6,height:6,borderRadius:"50%",background:"var(--gn)",display:"inline-block",animation:"pulse 1.8s infinite"}}),
            "LIVE"),
          React.createElement("div",{style:{fontFamily:"var(--fm)",fontSize:10,color:"var(--mt)"}},now.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})),
          React.createElement("button",{onClick:()=>setTab("pricing"),style:{background:"var(--ac)",color:"#000",border:"none",borderRadius:5,padding:"7px 14px",fontFamily:"var(--fs)",fontSize:12,fontWeight:700,cursor:"pointer"}},"Subscribe"))),
      React.createElement("div",{style:{background:"var(--sf)",borderBottom:"1px solid var(--bd)",height:36,display:"flex",alignItems:"center",overflow:"hidden"}},
        React.createElement("div",{style:{background:"var(--rd)",color:"#fff",padding:"0 14px",height:"100%",display:"flex",alignItems:"center",fontFamily:"var(--fm)",fontSize:11,fontWeight:700,letterSpacing:1.5,flexShrink:0}},"LIVE"),
        React.createElement("div",{style:{overflow:"hidden",flex:1}},
          React.createElement("div",{style:{display:"inline-block",whiteSpace:"nowrap",animation:"ticker 80s linear infinite",fontFamily:"var(--fm)",fontSize:11,color:"var(--t2)",paddingLeft:20}},ticker))),
      React.createElement("div",{style:{display:"flex",gap:10,padding:"14px 24px",background:"var(--sf)",borderBottom:"1px solid var(--bd)",overflowX:"auto"}},
        ...[{l:"ACTIVE STRIKES",v:"2",s:"Genesys + Kaiser",c:"var(--gn)",d:0},{l:"AUTHORIZED",v:"3",s:"Corewell · BMC · OHSU",c:"var(--rd)",d:60},{l:"VOTES PENDING",v:"1",s:"Brattleboro Mar 23",c:"var(--or)",d:120},{l:"RNs AT RISK",v:"12.7K+",s:"Corewell = 10,000",c:"var(--yw)",d:180},{l:"TOP WEEKLY PAY",v:"$12,800",s:"2026 NYC benchmark",c:"var(--ac)",d:240}].map(x=>
          React.createElement("div",{key:x.l,style:{background:"var(--pn)",border:"1px solid var(--bd)",borderTop:`2px solid ${x.c}`,borderRadius:6,padding:"16px 20px",flex:1,minWidth:150,animation:"fadeUp .5s ease both",animationDelay:`${x.d}ms`}},
            React.createElement("div",{style:{fontFamily:"var(--fm)",fontSize:10,color:"var(--mt)",letterSpacing:1,marginBottom:8}},x.l),
            React.createElement("div",{style:{fontFamily:"var(--fm)",fontSize:24,fontWeight:700,color:x.c,lineHeight:1}},x.v),
            React.createElement("div",{style:{fontFamily:"var(--fs)",fontSize:11,color:"var(--t2)",marginTop:5}},x.s)))),
      React.createElement("div",{style:{display:"flex",padding:"0 24px",background:"var(--sf)",borderBottom:"1px solid var(--bd)",overflowX:"auto"}},
        ...[{id:"strikes",l:"Strike Notices",n:STRIKES.length},{id:"contracts",l:"High-Pay Contracts",n:CONTRACTS.filter(c=>c.type!=="CLOSED").length},{id:"outlook",l:"Outlook",n:null},{id:"insights",l:"Market Intel",n:null},{id:"pricing",l:"💳 Pricing",n:null}].map(t=>
          React.createElement("button",{key:t.id,onClick:()=>setTab(t.id),style:{background:"none",border:"none",cursor:"pointer",padding:"14px 16px",display:"flex",alignItems:"center",gap:6,fontFamily:"var(--fs)",fontSize:13,fontWeight:600,color:tab===t.id?"#fff":"var(--mt)",borderBottom:`2px solid ${tab===t.id?"var(--ac)":"transparent"}`,whiteSpace:"nowrap"}},
            t.l,t.n!==null&&React.createElement("span",{style:{background:tab===t.id?"var(--ad)":"rgba(255,255,255,.05)",color:tab===t.id?"var(--ac)":"var(--mt)",borderRadius:10,padding:"1px 7px",fontFamily:"var(--fm)",fontSize:10,fontWeight:700}},t.n)))),
      React.createElement("main",{style:{flex:1,padding:"24px",maxWidth:1100,width:"100%",margin:"0 auto"}},
        tab==="strikes"&&React.createElement("div",null,
          React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:10}},
            React.createElement("h2",{style:{fontFamily:"var(--fs)",fontSize:13,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"var(--t2)"}},"🚨 Active Disputes & Strike Notices"),
            React.createElement("div",{style:{display:"flex",gap:6,flexWrap:"wrap"}},
              ...["ALL","ACTIVE STRIKE","AUTHORIZED","MED-HIGH","MEDIUM"].map(f=>
                React.createElement("button",{key:f,onClick:()=>setFilt(f),style:{background:filt===f?"var(--ad)":"var(--pn)",border:`1px solid ${filt===f?"var(--ac)":"var(--bd)"}`,color:filt===f?"var(--ac)":"var(--mt)",borderRadius:4,padding:"4px 10px",cursor:"pointer",fontFamily:"var(--fm)",fontSize:9,fontWeight:700}},f)))),
          React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:10}},
            ...filtered.map((s,i)=>{
              const bc=cc[s.c]||"#243044";
              const isSel=sel?.id===s.id;
              const st={AUTHORIZED:{c:"#ff4d6d",b:"rgba(255,77,109,.12)"},"ACTIVE STRIKE":{c:"#39d353",b:"rgba(57,211,83,.12)"},"VOTE PENDING":{c:"#ff8c42",b:"rgba(255,140,66,.12)"},WATCH:{c:"#ffd60a",b:"rgba(255,214,10,.12)"}}[s.status]||{c:"#00e5ff",b:"rgba(0,229,255,.12)"};
              return React.createElement("div",{key:s.id,onClick:()=>click(s),style:{background:isSel?"var(--p2)":"var(--pn)",border:`1px solid ${isSel?bc:"var(--bd)"}`,borderLeft:`3px solid ${bc}`,borderRadius:6,padding:"16px 18px",cursor:"pointer",animation:"fadeUp .45s ease both",animationDelay:`${i*60}ms`}},
                React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:10}},
                  React.createElement("div",null,
                    React.createElement("div",{style:{fontFamily:"var(--fs)",fontSize:15,fontWeight:700,color:"#e8f0f8",marginBottom:4}},s.hospital),
                    React.createElement("div",{style:{fontFamily:"var(--fm)",fontSize:11,color:"var(--t2)"}},s.city,", ",s.state," · ",s.union)),
                  React.createElement("div",{style:{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5,flexShrink:0}},
                    React.createElement("span",{style:{display:"inline-flex",alignItems:"center",gap:5,background:st.b,color:st.c,border:`1px solid ${st.c}33`,borderRadius:3,padding:"3px 9px",fontFamily:"var(--fm)",fontSize:10,fontWeight:700}},
                      s.status==="ACTIVE STRIKE"&&React.createElement("span",{style:{width:6,height:6,borderRadius:"50%",background:st.c,display:"inline-block",animation:"pulse 1.4s infinite"}}),
                      s.status),
                    React.createElement("span",{style:{background:rc[s.risk]+"22",color:rc[s.risk],border:`1px solid ${rc[s.risk]}55`,borderRadius:3,padding:"2px 8px",fontFamily:"var(--fm)",fontSize:10,fontWeight:700,letterSpacing:1}},s.risk))),
                React.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:16,marginBottom:10}},
                  React.createElement("span",{style:{fontFamily:"var(--fm)",fontSize:11}},React.createElement("span",{style:{color:"var(--mt)"}},"RNs "),React.createElement("span",{style:{color:"var(--ac)",fontWeight:700}},s.nurses.toLocaleString())),
                  React.createElement("span",{style:{fontFamily:"var(--fm)",fontSize:11}},React.createElement("span",{style:{color:"var(--mt)"}},"Sites "),React.createElement("span",{style:{color:"var(--ac)",fontWeight:700}},s.sites)),
                  React.createElement("span",{style:{fontFamily:"var(--fm)",fontSize:11,color:bc}},s.date)),
                React.createElement("div",{style:{fontFamily:"var(--fs)",fontSize:12,color:"var(--t2)",lineHeight:1.6}},s.notes),
                isSel&&React.createElement("div",{style:{marginTop:14,paddingTop:14,borderTop:"1px solid var(--bd)"}},
                  React.createElement("div",{style:{fontFamily:"var(--fm)",fontSize:10,color:"var(--mt)",letterSpacing:1,marginBottom:8}},"KEY ISSUES"),
                  React.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:6}},
                    ...s.issues.map(iss=>React.createElement("span",{key:iss,style:{background:"var(--bg)",border:"1px solid var(--b2)",borderRadius:3,padding:"3px 9px",fontFamily:"var(--fm)",fontSize:10,color:"var(--t2)"}},iss)))));
            })),
          React.createElement("div",{style:{marginTop:14,padding:"10px 14px",background:"var(--pn)",border:"1px solid var(--bd)",borderRadius:6,fontFamily:"var(--fm)",fontSize:10,color:"var(--mt)"}},"▸ Tap any card to expand · Sources: NNU, NYSNA, Teamsters, CNA, Nurse.org")),
        tab==="contracts"&&React.createElement("div",null,
          React.createElement("h2",{style:{fontFamily:"var(--fs)",fontSize:13,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"var(--t2)",marginBottom:18}},"💰 High-Pay Strike & Crisis RN Contracts"),
          React.createElement("div",{style:{background:"rgba(255,77,109,.12)",border:"1px solid rgba(255,77,109,.3)",borderRadius:6,padding:"10px 14px",marginBottom:18,fontFamily:"var(--fm)",fontSize:11,color:"var(--rd)"}},"⚡ ALERT: Corewell Health East 10K RNs SE Michigan — pre-position NOW before 10-day notice drops."),
          React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:12}},
            ...CONTRACTS.map((c,i)=>{
              const t={STRIKE:{c:"#ff4d6d",b:"rgba(255,77,109,.12)"},CRISIS:{c:"#ff8c42",b:"rgba(255,140,66,.12)"},"PRE-POSITION":{c:"#00e5ff",b:"rgba(0,229,255,.12)"},CLOSED:{c:"#3d5166",b:"rgba(61,81,102,.15)"}}[c.type];
              return React.createElement("div",{key:c.id,style:{background:"var(--pn)",border:`1px solid ${c.hot?"var(--rd)":"var(--bd)"}`,borderRadius:6,padding:"16px 18px",animation:"fadeUp .45s ease both",animationDelay:`${i*70}ms`,position:"relative",overflow:"hidden",opacity:c.type==="CLOSED"?.55:1}},
                c.hot&&React.createElement("div",{style:{position:"absolute",top:0,right:0,background:"var(--rd)",color:"#fff",fontFamily:"var(--fm)",fontSize:9,fontWeight:700,letterSpacing:1,padding:"3px 10px",borderBottomLeftRadius:6}},"⚡ ACT NOW"),
                React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}},
                  React.createElement("div",null,
                    React.createElement("div",{style:{fontFamily:"var(--fs)",fontSize:14,fontWeight:700,color:"#e8f0f8",marginBottom:3}},c.title),
                    React.createElement("div",{style:{fontFamily:"var(--fm)",fontSize:11,color:"var(--t2)"}},c.loc)),
                  React.createElement("span",{style:{background:t.b,color:t.c,border:`1px solid ${t.c}44`,borderRadius:3,padding:"3px 8px",fontFamily:"var(--fm)",fontSize:10,fontWeight:700,flexShrink:0}},c.type)),
                React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}},
                  React.createElement("div",{style:{background:"var(--bg)",borderRadius:4,padding:"10px 12px"}},
                    React.createElement("div",{style:{fontFamily:"var(--fm)",fontSize:9,color:"var(--mt)",letterSpacing:1,marginBottom:4}},"HOURLY"),
                    React.createElement("div",{style:{fontFamily:"var(--fm)",fontSize:16,fontWeight:700,color:"var(--gn)"}},c.hr)),
                  React.createElement("div",{style:{background:"var(--bg)",borderRadius:4,padding:"10px 12px"}},
                    React.createElement("div",{style:{fontFamily:"var(--fm)",fontSize:9,color:"var(--mt)",letterSpacing:1,marginBottom:4}},"WEEKLY"),
                    React.createElement("div",{style:{fontFamily:"var(--fm)",fontSize:14,fontWeight:700,color:"var(--gn)"}},c.wk))),
                React.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}},
                  ...c.specs.map(sp=>React.createElement("span",{key:sp,style:{background:"rgba(0,229,255,.12)",color:"var(--ac)",border:"1px solid rgba(0,229,255,.33)",borderRadius:3,padding:"2px 7px",fontFamily:"var(--fm)",fontSize:10,fontWeight:700}},sp))),
                React.createElement("div",{style:{fontFamily:"var(--fm)",fontSize:10,color:"var(--t2)",lineHeight:1.7,marginBottom:8}},
                  React.createElement("span",{style:{color:"var(--mt)"}},"START: "),c.start,React.createElement("br"),
                  React.createElement("span",{style:{color:"var(--mt)"}},"AGENCIES: "),c.agency),
                React.createElement("div",{style:{background:c.hot?"rgba(255,77,109,.12)":"rgba(255,255,255,.03)",border:`1px solid ${c.hot?"rgba(255,77,109,.44)":"var(--bd)"}`,borderRadius:4,padding:"7px 10px",fontFamily:"var(--fm)",fontSize:10,color:c.hot?"var(--rd)":"var(--t2)"}},c.note));
            }))),
        tab==="outlook"&&React.createElement("div",null,
          React.createElement("h2",{style:{fontFamily:"var(--fs)",fontSize:13,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"var(--t2)",marginBottom:18}},"📊 2-4 Week Strike Outlook"),
          React.createElement("div",{style:{background:"var(--pn)",border:"1px solid var(--bd)",borderRadius:6,overflow:"hidden"}},
            React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1.4fr 90px 1.5fr 90px",gap:12,padding:"10px 16px",background:"var(--sf)",borderBottom:"1px solid var(--bd)"}},
              ...["LOCATION","RISK","TIMELINE","PROBABILITY"].map(h=>React.createElement("div",{key:h,style:{fontFamily:"var(--fm)",fontSize:9,color:"var(--mt)",letterSpacing:1}},h))),
            ...[{loc:"Corewell Health East MI",risk:"HIGH",tl:"10-day notice any day; strike ~early Apr",p:92},{loc:"Brattleboro Memorial VT",risk:"MED-HIGH",tl:"Vote Mar 23; strike ~Apr 2 if YES",p:70},{loc:"Henry Ford Genesys MI",risk:"ACTIVE",tl:"Ongoing ~Day 200",p:100},{loc:"NUHW Kaiser Mental CA",risk:"ACTIVE",tl:"Ongoing; sympathy possible",p:100},{loc:"BMC South Brockton MA",risk:"MEDIUM",tl:"No date; could escalate",p:45},{loc:"OHSU Portland OR",risk:"MEDIUM",tl:"AFSCME vote pending",p:40}].map((o,idx)=>{
              const color=rc[o.risk]||"#ffd60a";
              return React.createElement("div",{key:o.loc,style:{display:"grid",gridTemplateColumns:"1.4fr 90px 1.5fr 90px",gap:12,alignItems:"center",padding:"12px 16px",borderBottom:"1px solid var(--bd)",background:idx%2===0?"transparent":"rgba(255,255,255,.01)"}},
                React.createElement("div",{style:{fontFamily:"var(--fs)",fontSize:13,color:"var(--tx)"}},o.loc),
                React.createElement("span",{style:{background:color+"22",color,border:`1px solid ${color}55`,borderRadius:3,padding:"2px 8px",fontFamily:"var(--fm)",fontSize:10,fontWeight:700,letterSpacing:1}},o.risk),
                React.createElement("div",{style:{fontFamily:"var(--fm)",fontSize:10,color:"var(--t2)",lineHeight:1.5}},o.tl),
                React.createElement("div",{style:{display:"flex",alignItems:"center",gap:8}},
                  React.createElement("div",{style:{flex:1,height:4,background:"var(--bd)",borderRadius:2,overflow:"hidden"}},
                    React.createElement("div",{style:{height:"100%",width:`${o.p}%`,background:color,borderRadius:2}})),
                  React.createElement("span",{style:{fontFamily:"var(--fm)",fontSize:10,color,minWidth:28}},o.p,"%")));
            })),
          React.createElement("div",{style:{marginTop:14,padding:"12px 16px",background:"rgba(255,214,10,.12)",border:"1px solid rgba(255,214,10,.25)",borderRadius:6,fontFamily:"var(--fm)",fontSize:11,color:"var(--yw)"}},"⚠ NEXT: Brattleboro vote Mar 23 · Corewell 10-day notice (watch daily)")),
        tab==="insights"&&React.createElement("div",null,
          React.createElement("h2",{style:{fontFamily:"var(--fs)",fontSize:13,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"var(--t2)",marginBottom:18}},"⚡ Market Intelligence"),
          React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:10}},
            ...[{icon:"⚡",title:"Michigan is the #1 Deployment Zone",body:"Corewell (10K RNs, 9 hospitals) has 90% strike authorization. Genesys is Day 200. Pre-position with Fastaff, Aya, USNursing now.",color:"#ff4d6d"},{icon:"💰",title:"2026 Pay Benchmarks Reset Upward",body:"NYC strike saw $161/hr and $12,800/week. Kaiser hit $9K/week. These anchor all future deployments.",color:"#39d353"},{icon:"🧠",title:"Psych/Behavioral Health: Hidden Niche",body:"25% surge in psych contracts 2026. NUHW Kaiser dispute drives sustained demand.",color:"#00e5ff"},{icon:"🤖",title:"AI Clauses Now Standard",body:"Every major 2026 contract includes AI protection language. Expect more disputes as AI adoption accelerates.",color:"#ffd60a"},{icon:"📋",title:"First Contracts = Highest Risk",body:"Corewell and BMC South are first-contract disputes — most contentious type. Escalate faster, resolve slower.",color:"#ff8c42"}].map((item,i)=>
              React.createElement("div",{key:i,style:{background:"var(--pn)",border:"1px solid var(--bd)",borderRadius:6,padding:"16px 18px",display:"flex",gap:14,alignItems:"flex-start",animation:"fadeUp .45s ease both",animationDelay:`${i*70}ms`}},
                React.createElement("div",{style:{fontSize:22,flexShrink:0}},item.icon),
                React.createElement("div",null,
                  React.createElement("div",{style:{fontFamily:"var(--fs)",fontSize:13,fontWeight:700,color:item.color,marginBottom:6}},item.title),
                  React.createElement("div",{style:{fontFamily:"var(--fs)",fontSize:12,color:"var(--t2)",lineHeight:1.7}},item.body))))),
        tab==="pricing"&&React.createElement("div",{style:{maxWidth:800,margin:"0 auto"}},
          React.createElement("div",{style:{background:"var(--pn)",border:"1px solid var(--bd)",borderRadius:8,padding:"20px 24px",marginBottom:24,textAlign:"center"}},
            React.createElement("div",{style:{fontFamily:"var(--fs)",fontSize:22,fontWeight:800,color:"#fff",marginBottom:8}},"One deployment pays for ",React.createElement("span",{style:{color:"var(--gn)"}},"3+ years")," of StrikeIntel"),
            React.createElement("div",{style:{fontFamily:"var(--fs)",fontSize:14,color:"var(--t2)"}},"Strike nurses earn $5K-$12.8K/week. At $14.99/mo, it pays for itself in 30 minutes.")),
          React.createElement("div",{style:{display:"flex",justifyContent:"center",marginBottom:24}},
            ...["monthly","annual"].map(b=>React.createElement("button",{key:b,onClick:()=>setBill(b),style:{background:bill===b?"var(--ac)":"var(--pn)",color:bill===b?"#000":"var(--mt)",border:"1px solid var(--bd)",padding:"8px 20px",cursor:"pointer",fontFamily:"var(--fm)",fontSize:11,fontWeight:700,borderRadius:b==="monthly"?"4px 0 0 4px":"0 4px 4px 0"}},b==="monthly"?"MONTHLY":"ANNUAL (SAVE 20%)"))),
          React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:16}},
            ...PLANS.map((p,i)=>{
              const price=bill==="annual"?(p.id==="nurse"?"$11.99":"$79"):p.price;
              return React.createElement("div",{key:p.id,style:{background:p.hi?"var(--p2)":"var(--pn)",border:`2px solid ${p.hi?"var(--ac)":"var(--bd)"}`,borderRadius:10,padding:"24px",position:"relative",boxShadow:p.hi?"0 0 40px rgba(0,229,255,.08)":"none"}},
                p.badge&&React.createElement("div",{style:{position:"absolute",top:-1,right:20,background:"var(--ac)",color:"#000",fontFamily:"var(--fm)",fontSize:9,fontWeight:700,letterSpacing:1,padding:"3px 10px",borderRadius:"0 0 6px 6px"}},p.badge),
                React.createElement("div",{style:{fontFamily:"var(--fs)",fontSize:18,fontWeight:800,color:"#fff",marginBottom:4}},p.name),
                React.createElement("div",{style:{fontFamily:"var(--fs)",fontSize:12,color:"var(--t2)",marginBottom:20}},p.desc),
                React.createElement("div",{style:{display:"flex",alignItems:"baseline",gap:4,marginBottom:20}},
                  React.createElement("span",{style:{fontFamily:"var(--fm)",fontSize:36,fontWeight:700,color:p.hi?"var(--ac)":"#fff"}},price),
                  React.createElement("span",{style:{fontFamily:"var(--fm)",fontSize:13,color:"var(--mt)"}},p.period)),
                React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:10,marginBottom:24}},
                  ...p.features.map(f=>React.createElement("div",{key:f,style:{display:"flex",alignItems:"flex-start",gap:8}},
                    React.createElement("span",{style:{color:"var(--gn)",fontFamily:"var(--fm)",fontSize:12,flexShrink:0}},"✓"),
                    React.createElement("span",{style:{fontFamily:"var(--fs)",fontSize:13,color:"var(--t2)"}},f)))),
                React.createElement("button",{style:{width:"100%",padding:"12px",background:p.hi?"var(--ac)":"transparent",border:`1px solid ${p.hi?"var(--ac)":"var(--b2)"}`,color:p.hi?"#000":"var(--tx)",borderRadius:6,fontFamily:"var(--fs)",fontSize:14,fontWeight:700,cursor:"pointer"}},p.cta));}))))),
      React.createElement("footer",{style:{background:"var(--sf)",borderTop:"1px solid var(--bd)",padding:"10px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6}},
        React.createElement("div",{style:{fontFamily:"var(--fm)",fontSize:10,color:"var(--mt)"}},"StrikeIntel · Healthcare Labor Intelligence · Not legal or financial advice"),
        React.createElement("div",{style:{fontFamily:"var(--fm)",fontSize:10,color:"var(--mt)"}},"Scan: 6-12hr · Powered by Claude AI"))));
}