// SPX COMMAND CENTER - app.js
'use strict';

const US_HOLIDAYS = [
  '2025-01-01','2025-01-20','2025-02-17','2025-04-18',
  '2025-05-26','2025-06-19','2025-07-04','2025-09-01',
  '2025-11-27','2025-12-25',
  '2026-01-01','2026-01-19','2026-02-16','2026-04-03',
  '2026-05-25','2026-06-19','2026-07-03','2026-09-07',
  '2026-11-26','2026-12-25'
];

const QUOTES = [
  "You have another trading day. Save capital, save your future.",
  "Do not count stones while losing diamonds. Protect what you have.",
  "Your family is more important than any single trade.",
  "Take small profits and stay away in sideways markets.",
  "A blown account cannot trade tomorrow. Survival first.",
  "The market will be open tomorrow. Your capital must be too.",
  "FOMO is the enemy of profit. Wait for the setup.",
  "Revenge trading has never saved a losing day.",
  "One good trade beats three bad ones every time.",
  "Sideways markets kill premium. Cash is a position.",
  "The best trade is sometimes no trade.",
  "Cut losses fast. Let winners run.",
  "Discipline today means capital tomorrow.",
  "Size kills. Small positions survive bad days.",
  "Power hours trap revenge traders. Know when to stop.",
  "Your edge is discipline, not prediction.",
  "Protect your next day. That is how winners think.",
  "When in doubt, stay out.",
  "Time decay never takes a lunch break on 0DTE.",
  "Every champion respects their stop loss."
];

const PHASES = [
  { start:'06:30',end:'07:00',name:'Opening Volatility',desc:'Highest risk - confirm direction before entering',tag:'tag-hot',tagText:'HIGH RISK'},
  { start:'07:00',end:'07:30',name:'Opening Range Forming',desc:'ORB developing - wait for clean breakout with volume',tag:'tag-warn',tagText:'CONFIRM'},
  { start:'07:30',end:'08:30',name:'Primary Trend Window',desc:'Best 0DTE entry window - trend usually established',tag:'tag-ok',tagText:'OPTIMAL'},
  { start:'08:30',end:'10:00',name:'Mid-Morning Drift',desc:'Watch for continuation or reversal - volume fades',tag:'tag-warn',tagText:'CAUTION'},
  { start:'10:00',end:'11:30',name:'Lunch Chop Zone',desc:'Sideways risk - premium burns fast. Cash is position.',tag:'tag-low',tagText:'AVOID'},
  { start:'11:30',end:'12:00',name:'Power Hour Approach',desc:'Volume returning - watch institutional moves',tag:'tag-warn',tagText:'WATCH'},
  { start:'12:00',end:'13:00',name:'Power Hour',desc:'Final surge - defined risk only, extreme time decay',tag:'tag-hot',tagText:'DEFINED RISK'},
];

const ALERT_TIMES = [
  {t:'06:30',l:'OPEN'},{t:'06:45',l:'+15m'},{t:'07:00',l:'+30m'},
  {t:'07:15',l:'+45m'},{t:'07:30',l:'+60m'},{t:'07:45',l:'+75m'},
  {t:'08:00',l:'+90m'},{t:'08:15',l:'+105m'},{t:'08:30',l:'ZONE END'}
];

const NEWS_ITEMS = [
  {cat:'spx',src:'Reuters Markets',title:'S&P 500 Live Coverage',summary:'Live index updates, earnings moves, Fed expectations, Treasury yields and sector rotation.',url:'https://www.reuters.com/markets/',age:'Live'},
  {cat:'spx',src:'CNBC Markets',title:'SPX/SPY Intraday Analysis',summary:'Market wrap-ups, intraday index context, company news. Check if headline is already priced in.',url:'https://www.cnbc.com/markets/',age:'Live'},
  {cat:'spx',src:'MarketWatch',title:'US Stock Market News',summary:'Breaking market news, commodities, currencies, and economic data including SPX and SPY.',url:'https://www.marketwatch.com/',age:'Live'},
  {cat:'spx',src:'Yahoo Finance',title:'Markets Overview & Data',summary:'SPX, SPY, VIX, sector ETFs and individual stock data. Free real-time quotes available.',url:'https://finance.yahoo.com/',age:'Live'},
  {cat:'trump',src:'White House',title:'Official Executive Statements',summary:'Primary source for tariffs, trade policy, executive orders. Compare to market interpretation before reacting.',url:'https://www.whitehouse.gov/briefings-statements/',age:'Primary source'},
  {cat:'trump',src:'AP News',title:'Trump Policy & Washington Coverage',summary:'Independent political reporting on US policy developments affecting markets and regulation.',url:'https://apnews.com/hub/donald-trump',age:'Live'},
  {cat:'fed',src:'Federal Reserve',title:'FOMC Press Releases & Rates',summary:'Official rate decisions and Fed statements. Scheduled events can spike VIX rapidly.',url:'https://www.federalreserve.gov/newsevents/pressreleases.htm',age:'Official'},
  {cat:'fed',src:'BLS.gov',title:'CPI, Jobs & Economic Calendar',summary:'Official release schedule for CPI, employment, PPI. Check times before trading near data releases.',url:'https://www.bls.gov/schedule/',age:'Official'},
  {cat:'tech',src:'Bloomberg Tech',title:'AI & Semiconductor News',summary:'NVDA, AMD, MSFT, GOOGL, META coverage. Tech drives SPX beta - watch these names.',url:'https://www.bloomberg.com/technology',age:'Live'},
  {cat:'spx',src:'Cboe Exchange',title:'SPX Options & VIX Data',summary:'Official SPX product specs, settlement details, VIX data. Always verify contract specs here.',url:'https://www.cboe.com/',age:'Primary source'},
];

// STATE
let soundOn = true;
let qIdx = 0;
let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth();
let trades = [];
let sortF = 'date';
let sortD = -1;
let gsUrl = '';
let lastSlot = -1;
let audioCtx = null;
let nFilter = {cat:'all',search:''};

// INIT
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  initGSCode();
  renderAlertGrid();
  renderPhases();
  renderCalendar();
  renderWeekly();
  renderTable();
  renderQuotesPanel();
  buildAnnualCal();
  computeDayStats();
  rotateQ();
  setInterval(tick, 1000);
  setInterval(checkAlerts, 15000);
  setInterval(rotateQ, 30000);
  tick();
  checkAlerts();
  updateCalc();
  updateTrend();
  updateOR();
  updateLimits();
  updateDiscPnl();
  setGSInput();
  renderNews();
  const d = document.getElementById('tf-date');
  if (d) d.value = todayISO();
  const t = document.getElementById('tf-time');
  if (t) t.value = nowPST();
});

// DATE/TIME UTILS
function pstNow() { return new Date(new Date().toLocaleString('en-US',{timeZone:'America/Los_Angeles'})); }
function nyNow() { return new Date(new Date().toLocaleString('en-US',{timeZone:'America/New_York'})); }
function todayISO() { return pstNow().toISOString().slice(0,10); }
function nowPST() {
  const d = pstNow();
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}
function fmtTime(d) {
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
}
function fmtDur(ms) {
  if (ms < 0) ms = 0;
  const s = Math.floor(ms/1000);
  const h = Math.floor(s/3600);
  const m = Math.floor((s%3600)/60);
  const sc = s%60;
  if (h>0) return `${pad(h)}:${pad(m)}:${pad(sc)}`;
  return `${pad(m)}:${pad(sc)}`;
}
function pad(n) { return String(n).padStart(2,'0'); }
function isHoliday(dateStr) { return US_HOLIDAYS.includes(dateStr); }
function isTradingDay(d) {
  const dow = d.getDay();
  if (dow===0||dow===6) return false;
  return !isHoliday(d.toISOString().slice(0,10));
}
function countTradeDays(s,e) {
  let n=0, d=new Date(s);
  while(d<=e){if(isTradingDay(d))n++;d.setDate(d.getDate()+1);}
  return n;
}
function marketOpenClose(d) {
  const y=d.getFullYear(),mo=d.getMonth(),day=d.getDate();
  return {open:new Date(y,mo,day,6,30,0), close:new Date(y,mo,day,13,0,0)};
}

// MAIN TICK
function tick() {
  const pst = pstNow(), ny = nyNow();
  setText('pst-clock', fmtTime(pst));
  setText('ny-clock', fmtTime(ny));
  updateStatus(pst, ny);
  updateTimers(pst);
  updateAlertHL(pst);
  updatePhaseHL(pst);
  updateSidePnl();
}

function updateStatus(pst, ny) {
  const iso = pst.toISOString().slice(0,10);
  const dow = pst.getDay();
  const {open,close} = marketOpenClose(pst);
  const now = pst;
  const isWE = dow===0||dow===6;
  const isHol = isHoliday(iso);
  let status='', phase='', dotColor='#94A3B8';

  if (isWE||isHol) {
    status = isWE ? '⛔ WEEKEND — Market Closed' : '⛔ HOLIDAY — Market Closed';
    phase = 'MARKET CLOSED';
  } else if (now < open) {
    status = '🌅 PRE-MARKET — Opens 6:30 AM PST';
    phase = 'PRE-MARKET';
    dotColor = '#F59E0B';
  } else if (now>=open && now<=close) {
    status = '🟢 MARKET OPEN — Regular Session';
    phase = 'MARKET OPEN';
    dotColor = '#10B981';
  } else {
    status = '🔴 AFTER HOURS';
    phase = 'AFTER HOURS';
    dotColor = '#EF4444';
  }

  setText('zone-status', status);
  setText('zone-label', now>=open&&now<=close ? '⚡ 6:30 AM – 8:30 AM PST · ALERT ZONE' : 'PST Market Clock');
  setText('market-status-text', fmtTime(ny));
  setText('phase-label', phase);
  const dot = document.getElementById('zone-dot');
  if (dot) dot.style.background = dotColor;
}

function updateTimers(pst) {
  const {open,close} = marketOpenClose(pst);
  const now = pst;
  const sinceEl = document.getElementById('time-since-open');
  const closeEl = document.getElementById('time-until-close');
  const badgeEl = document.getElementById('phase-time-badge');

  if (now>=open && now<=close) {
    if(sinceEl){sinceEl.textContent=fmtDur(now-open);sinceEl.className='timer-big green-text';}
    if(closeEl){closeEl.textContent=fmtDur(close-now);closeEl.className=(close-now<1800000)?'timer-big red-text':'timer-big';}
    if(badgeEl) badgeEl.textContent = fmtDur(close-now)+' remaining';
  } else if (now<open) {
    if(sinceEl){sinceEl.textContent='NOT OPEN';sinceEl.className='timer-big';}
    if(closeEl){closeEl.textContent=fmtDur(open-now);closeEl.className='timer-big';}
    if(badgeEl) badgeEl.textContent = 'Opens in '+fmtDur(open-now);
  } else {
    if(sinceEl){sinceEl.textContent='SESSION ENDED';sinceEl.className='timer-big';}
    if(closeEl){closeEl.textContent='CLOSED';closeEl.className='timer-big red-text';}
    if(badgeEl) badgeEl.textContent = 'Market closed';
  }
}

// ALERT GRID
function renderAlertGrid() {
  const g = document.getElementById('alert-grid');
  if(!g) return;
  g.innerHTML = ALERT_TIMES.map((a,i)=>`
    <div class="alert-slot" id="as${i}">
      <div class="alert-slot-time">${a.t} PST</div>
      <div class="alert-slot-label">${a.l}</div>
    </div>`).join('');
}

function updateAlertHL(pst) {
  const tot = pst.getHours()*60+pst.getMinutes();
  ALERT_TIMES.forEach((a,i)=>{
    const [sh,sm]=a.t.split(':').map(Number);
    const slotMin=sh*60+sm;
    const el=document.getElementById(`as${i}`);
    if(!el) return;
    el.className='alert-slot';
    if(tot>=slotMin && tot<slotMin+15){
      el.classList.add('current');
      if(lastSlot!==i){lastSlot=i;playBeep();showDiscModal();}
    } else if(tot<slotMin) el.classList.add('upcoming');
    else el.classList.add('passed');
  });
}

// SOUND
function playBeep() {
  if (!soundOn) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
    const ctx = audioCtx;
    [0,0.3,0.6].forEach(delay=>{
      const osc=ctx.createOscillator();
      const gain=ctx.createGain();
      osc.connect(gain);gain.connect(ctx.destination);
      osc.frequency.value=880;osc.type='sine';
      gain.gain.setValueAtTime(0.3,ctx.currentTime+delay);
      gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+delay+0.25);
      osc.start(ctx.currentTime+delay);osc.stop(ctx.currentTime+delay+0.3);
    });
  } catch(e){}
}
function toggleSound() {
  soundOn=!soundOn;
  const b=document.getElementById('sound-toggle');
  if(b) b.textContent=soundOn?'🔔 Sound ON':'🔕 Sound OFF';
}

// PHASES
function renderPhases() {
  const el=document.getElementById('phases-list');
  if(!el) return;
  el.innerHTML=PHASES.map(p=>`
    <div class="phase-item" id="ph${p.start.replace(':','')}">
      <div class="phase-time">${p.start}–${p.end} PST</div>
      <div><div class="phase-name">${p.name}</div><div class="phase-desc">${p.desc}</div></div>
      <span class="phase-tag ${p.tag}">${p.tagText}</span>
    </div>`).join('');
}
function updatePhaseHL(pst) {
  const tot=pst.getHours()*60+pst.getMinutes();
  PHASES.forEach(p=>{
    const [sh,sm]=p.start.split(':').map(Number);
    const [eh,em]=p.end.split(':').map(Number);
    const el=document.getElementById(`ph${p.start.replace(':','')}`);
    if(!el) return;
    if(tot>=sh*60+sm && tot<eh*60+em) el.classList.add('current-phase');
    else el.classList.remove('current-phase');
  });
}

// QUOTES
function rotateQ() {
  const el=document.getElementById('rotating-quote');
  if(el){el.style.opacity='0';setTimeout(()=>{el.textContent=`"${QUOTES[qIdx]}"`;el.style.opacity='1';},300);}
  const sq=document.getElementById('sidebar-quote');
  if(sq) sq.textContent=QUOTES[qIdx];
  const mq=document.getElementById('modal-quote');
  if(mq) mq.textContent=`"${QUOTES[Math.floor(Math.random()*QUOTES.length)]}"`;
  qIdx=(qIdx+1)%QUOTES.length;
}
function nextQuote(){qIdx=(qIdx+1)%QUOTES.length;rotateQ();}
function renderQuotesPanel() {
  const el=document.getElementById('quotes-list');
  if(!el) return;
  el.innerHTML=QUOTES.slice(0,8).map(q=>`<div class="quote-item">"${q}"</div>`).join('');
}

// DISCIPLINE MODALS
function showDiscModal() {
  const m=document.getElementById('discipline-modal');
  if(m){m.style.display='flex';playBeep();rotateQ();}
}
function disciplineChoice(c) {
  document.getElementById('discipline-modal').style.display='none';
  if(c==='revenge'||c==='fomo') setTimeout(()=>{const m=document.getElementById('loss-modal');if(m)m.style.display='flex';},300);
}
function closeLossModal(){const m=document.getElementById('loss-modal');if(m)m.style.display='none';}
function closeProfitModal(){const m=document.getElementById('profit-modal');if(m)m.style.display='none';}
function runDisciplineCheck(){showDiscModal();}

// DISCIPLINE CHECK
function updateDiscCheck() {
  const items=['dc-sideways','dc-fomo','dc-revenge','dc-average','dc-15min','dc-target'];
  const checked=items.filter(id=>{const el=document.getElementById(id);return el&&el.checked;});
  const coach=document.getElementById('coach-box');
  if(!coach) return;
  if(document.getElementById('dc-target')?.checked||document.getElementById('dc-15min')?.checked)
    coach.innerHTML='<strong style="color:var(--red)">🛑 ACTION REQUIRED</strong><p>CUT the loss or LOCK the profit. Do not wait. Do not hope.</p>';
  else if(document.getElementById('dc-revenge')?.checked||document.getElementById('dc-fomo')?.checked)
    coach.innerHTML='<strong style="color:var(--red)">⚠️ EMOTIONAL TRADING DETECTED</strong><p>Step away. Review rules. Return disciplined.</p>';
  else if(document.getElementById('dc-sideways')?.checked)
    coach.innerHTML='<strong style="color:var(--amber)">⚖️ SIDEWAYS MARKET</strong><p>Cash is a position. Stand aside.</p>';
  else
    coach.innerHTML='<strong>WAIT FOR CONFIRMATION</strong><p>Follow the plan. Opinion is not a signal.</p>';
}
document.addEventListener('change', e=>{if(e.target.closest('.disc-check-item'))updateDiscCheck();});

// TRADING DAYS STATS
function computeDayStats() {
  const today=pstNow();
  const y=today.getFullYear();
  const soy=new Date(y,0,1), eoy=new Date(y,11,31);
  const som=new Date(y,today.getMonth(),1), eom=new Date(y,today.getMonth()+1,0);
  const total=countTradeDays(soy,eoy);
  const elapsed=countTradeDays(soy,today);
  const thisMonth=countTradeDays(som,today);
  const leftMonth=countTradeDays(today,eom)-(isTradingDay(today)?1:0);
  const leftYear=countTradeDays(today,eoy)-(isTradingDay(today)?1:0);

  setText('days-this-year',elapsed);
  setText('days-this-month',thisMonth);
  setText('days-month-label',today.toLocaleString('en-US',{month:'long',year:'numeric'}));
  setText('days-left-month',Math.max(0,leftMonth));
  setText('days-left-year',Math.max(0,leftYear));
  setText('annual-total',total);
  setText('annual-elapsed',elapsed);
  setText('annual-remaining',Math.max(0,total-elapsed));
}

// JOURNAL CRUD
function loadData() {
  try {
    const s=localStorage.getItem('spx_j_v3');
    if(s) trades=JSON.parse(s);
    const g=localStorage.getItem('spx_gs_url');
    if(g) gsUrl=g;
    const l=localStorage.getItem('spx_lim');
    if(l){const lim=JSON.parse(l);
      if(lim.p){const el=document.getElementById('lim-profit');if(el)el.value=lim.p;}
      if(lim.l){const el=document.getElementById('lim-loss');if(el)el.value=lim.l;}
    }
  } catch(e){}
}
function saveData(){try{localStorage.setItem('spx_j_v3',JSON.stringify(trades));}catch(e){}}

function openAddTrade(){
  const p=document.getElementById('add-trade-panel');
  if(p){p.style.display='block';p.scrollIntoView({behavior:'smooth'});}
  const d=document.getElementById('tf-date');if(d)d.value=todayISO();
  const t=document.getElementById('tf-time');if(t)t.value=nowPST();
}
function closeAddTrade(){const p=document.getElementById('add-trade-panel');if(p)p.style.display='none';}

function calcTfPnl(){
  const e=parseFloat(document.getElementById('tf-entry')?.value)||0;
  const x=parseFloat(document.getElementById('tf-exit')?.value)||0;
  const q=parseInt(document.getElementById('tf-contracts')?.value)||1;
  const pnl=(x-e)*q*100;
  const el=document.getElementById('calc-pnl');
  if(el){
    el.textContent=`P&L Preview: ${pnl>=0?'+':''}$${pnl.toFixed(2)} (${q} contract${q>1?'s':''}×$${((x-e)*100).toFixed(2)})`;
    el.style.color=pnl>0?'var(--green)':pnl<0?'var(--red)':'var(--text-muted)';
  }
}

function saveNewTrade(){
  const date=document.getElementById('tf-date')?.value;
  const time=document.getElementById('tf-time')?.value;
  const setup=document.getElementById('tf-setup')?.value;
  const dir=document.getElementById('tf-dir')?.value;
  const entry=parseFloat(document.getElementById('tf-entry')?.value);
  const exit=parseFloat(document.getElementById('tf-exit')?.value);
  const contracts=parseInt(document.getElementById('tf-contracts')?.value)||1;
  const emotion=document.getElementById('tf-emotion')?.value;
  const rule=document.getElementById('tf-rule')?.value;
  const notes=document.getElementById('tf-notes')?.value;
  if(!date||isNaN(entry)||isNaN(exit)){alert('Date, Entry, and Exit are required.');return;}
  const pnl=(exit-entry)*contracts*100;
  const trade={id:Date.now(),date,time,setup,dir,entry,exit,contracts,pnl,emotion,rule,notes};
  trades.push(trade);
  saveData();
  syncGS(trade);
  renderTable();renderCalendar();renderWeekly();updateSidePnl();closeAddTrade();
  const todPnl=getTodayPnl();
  const goal=parseFloat(document.getElementById('lim-profit')?.value)||500;
  const loss=parseFloat(document.getElementById('lim-loss')?.value)||300;
  if(todPnl>=goal){setTimeout(()=>{const m=document.getElementById('profit-modal');if(m)m.style.display='flex';},500);}
  if(todPnl<=-loss){setTimeout(()=>{const m=document.getElementById('loss-modal');if(m)m.style.display='flex';},500);}
}

function getTodayPnl(){return trades.filter(t=>t.date===todayISO()).reduce((s,t)=>s+t.pnl,0);}

function updateSidePnl(){
  const pnl=getTodayPnl();
  const n=trades.filter(t=>t.date===todayISO()).length;
  const el=document.getElementById('spnl-display');
  if(el){el.textContent=`${pnl>=0?'+':''}$${pnl.toFixed(2)}`;el.style.color=pnl>0?'var(--green)':pnl<0?'var(--red)':'var(--text)';}
  const te=document.getElementById('spnl-trades');
  if(te) te.textContent=`${n} trade${n!==1?'s':''} logged`;
}

function deleteTrade(id){
  if(!confirm('Delete trade?'))return;
  trades=trades.filter(t=>t.id!==id);
  saveData();renderTable();renderCalendar();renderWeekly();updateSidePnl();
}
function sortJournal(f){if(sortF===f)sortD*=-1;else{sortF=f;sortD=-1;}renderTable();}
function filterJournal(){renderTable();}

function getFiltered(){
  const s=document.getElementById('journal-search')?.value.toLowerCase()||'';
  const mf=document.getElementById('journal-month-filter')?.value||'all';
  const rf=document.getElementById('journal-result-filter')?.value||'all';
  return trades.filter(t=>{
    if(s&&!JSON.stringify(t).toLowerCase().includes(s))return false;
    if(mf!=='all'&&!t.date.startsWith(mf))return false;
    if(rf==='profit'&&t.pnl<=0)return false;
    if(rf==='loss'&&t.pnl>=0)return false;
    return true;
  }).sort((a,b)=>{
    let av=a[sortF],bv=b[sortF];
    if(typeof av==='string')av=av.toLowerCase();
    if(typeof bv==='string')bv=bv.toLowerCase();
    return sortD*(av<bv?-1:av>bv?1:0);
  });
}

function renderTable(){
  const tbody=document.getElementById('journal-tbody');
  if(!tbody) return;
  const mf=document.getElementById('journal-month-filter');
  if(mf){
    const months=[...new Set(trades.map(t=>t.date.slice(0,7)))].sort().reverse();
    mf.innerHTML='<option value="all">All Months</option>'+months.map(m=>`<option value="${m}">${new Date(m+'-15').toLocaleString('en-US',{month:'long',year:'numeric'})}</option>`).join('');
  }
  const filtered=getFiltered();
  const footer=document.getElementById('journal-footer');
  if(filtered.length===0){
    tbody.innerHTML=`<tr><td colspan="12" style="text-align:center;color:var(--text-dim);padding:1.5rem;">No trades found. Click + Add Trade.</td></tr>`;
    if(footer) footer.textContent='No trades logged.';
    updateMStats([]);return;
  }
  tbody.innerHTML=filtered.map(t=>`
    <tr>
      <td>${t.date}</td>
      <td style="font-family:'JetBrains Mono',monospace;font-size:0.72rem">${t.time||'—'}</td>
      <td>${t.setup}</td>
      <td><span class="${t.dir==='CALL'?'dir-call':'dir-put'}">${t.dir}</span></td>
      <td style="font-family:'JetBrains Mono',monospace">$${(+t.entry).toFixed(2)}</td>
      <td style="font-family:'JetBrains Mono',monospace">$${(+t.exit).toFixed(2)}</td>
      <td>${t.contracts}</td>
      <td class="${t.pnl>=0?'pnl-pos':'pnl-neg'}">${t.pnl>=0?'+':''}$${(+t.pnl).toFixed(2)}</td>
      <td style="font-size:0.7rem">${t.emotion}</td>
      <td><span class="${t.rule==='yes'?'rule-yes':t.rule==='no'?'rule-no':'rule-partial'}">${t.rule==='yes'?'✓':t.rule==='no'?'✗':'~'}</span></td>
      <td style="font-size:0.7rem;max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${esc(t.notes||'')}">${t.notes||'—'}</td>
      <td><button class="del-btn" onclick="deleteTrade(${t.id})" title="Delete">✕</button></td>
    </tr>`).join('');
  const tot=filtered.reduce((s,t)=>s+t.pnl,0);
  if(footer) footer.textContent=`${filtered.length} trade${filtered.length!==1?'s':''} · Total P&L: ${tot>=0?'+':''}$${tot.toFixed(2)}`;
  updateMStats(trades.filter(t=>t.date.startsWith(`${calYear}-${String(calMonth+1).padStart(2,'0')}`)));
}

function updateMStats(arr){
  const dp={};
  arr.forEach(t=>{dp[t.date]=(dp[t.date]||0)+t.pnl;});
  const pnls=Object.values(dp);
  const tot=pnls.reduce((s,v)=>s+v,0);
  const wins=pnls.filter(v=>v>0).length;
  const losses=pnls.filter(v=>v<0).length;
  const best=pnls.length?Math.max(...pnls):0;
  const worst=pnls.length?Math.min(...pnls):0;
  const wr=pnls.length?Math.round(wins/pnls.length*100):0;
  setText('month-pnl',`${tot>=0?'+':''}$${tot.toFixed(2)}`);
  setText('month-wins',wins);setText('month-losses',losses);
  setText('month-winrate',`${wr}%`);
  setText('month-best',`+$${best.toFixed(2)}`);
  setText('month-worst',`$${worst.toFixed(2)}`);
}

function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

// CALENDAR
function calNav(dir){
  calMonth+=dir;
  if(calMonth<0){calMonth=11;calYear--;}
  if(calMonth>11){calMonth=0;calYear++;}
  renderCalendar();renderWeekly();
}

function renderCalendar(){
  const label=document.getElementById('cal-month-label');
  const grid=document.getElementById('cal-grid');
  if(!label||!grid) return;
  const today=pstNow();
  const first=new Date(calYear,calMonth,1);
  const last=new Date(calYear,calMonth+1,0);
  label.textContent=first.toLocaleString('en-US',{month:'long',year:'numeric'});

  const dayMap={};
  const ms=`${calYear}-${String(calMonth+1).padStart(2,'0')}`;
  trades.filter(t=>t.date.startsWith(ms)).forEach(t=>{dayMap[t.date]=(dayMap[t.date]||0)+t.pnl;});

  let h=['Su','Mo','Tu','We','Th','Fr','Sa'].map(d=>`<div class="cal-day-name">${d}</div>`).join('');
  for(let i=0;i<first.getDay();i++) h+=`<div class="cal-day empty"></div>`;
  for(let d=1;d<=last.getDate();d++){
    const ds=`${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dd=new Date(calYear,calMonth,d);
    const isToday=today.getFullYear()===calYear&&today.getMonth()===calMonth&&today.getDate()===d;
    const closed=!isTradingDay(dd);
    const pnl=dayMap[ds];
    let cls='cal-day';
    if(isToday) cls+=' today';
    if(closed) cls+=' market-closed';
    if(pnl!==undefined){if(pnl>0)cls+=' has-profit';else if(pnl<0)cls+=' has-loss';else cls+=' has-even';}
    const title=pnl!==undefined?`${pnl>=0?'+':''}$${pnl.toFixed(2)}`:closed?'Non-trading':'';
    h+=`<div class="${cls}" title="${title}" onclick="calClick('${ds}')">${d}</div>`;
  }
  grid.innerHTML=h;
}

function calClick(ds){switchTab('journal');const s=document.getElementById('journal-search');if(s){s.value=ds;filterJournal();}}

function renderWeekly(){
  const el=document.getElementById('weekly-totals-list');
  if(!el) return;
  const ms=`${calYear}-${String(calMonth+1).padStart(2,'0')}`;
  const mt=trades.filter(t=>t.date.startsWith(ms));
  if(mt.length===0){el.innerHTML='<div class="weekly-row"><span class="weekly-label">No trades this month</span></div>';return;}
  const wm={};
  mt.forEach(t=>{
    const d=new Date(t.date+'T12:00:00');
    const soy=new Date(d.getFullYear(),0,1);
    const wn=Math.ceil((((d-soy)/86400000)+soy.getDay()+1)/7);
    const key=`Week ${wn}`;
    wm[key]=(wm[key]||0)+t.pnl;
  });
  el.innerHTML=Object.entries(wm).map(([w,p])=>`
    <div class="weekly-row">
      <span class="weekly-label">${w}</span>
      <span class="weekly-val ${p>=0?'green-text':'red-text'}">${p>=0?'+':''}$${p.toFixed(2)}</span>
    </div>`).join('');
}

// GOOGLE SHEETS
function initGSCode(){
  const el=document.getElementById('gs-script-code');
  if(!el) return;
  el.value=`function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([data.date,data.time,data.setup,data.dir,
    data.entry,data.exit,data.contracts,data.pnl,
    data.emotion,data.rule,data.notes]);
  return ContentService.createTextOutput(JSON.stringify({status:'ok'}))
    .setMimeType(ContentService.MimeType.JSON);
}
function doGet(e) {
  var data = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getDataRange().getValues();
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}`;
}
function setGSInput(){const el=document.getElementById('gs-url-input');if(el&&gsUrl)el.value=gsUrl;}
function openGoogleSheetSetup(){const p=document.getElementById('gs-setup-panel');if(p){p.style.display='block';p.scrollIntoView({behavior:'smooth'});}}
function closeGSSetup(){const p=document.getElementById('gs-setup-panel');if(p)p.style.display='none';}
function saveGSUrl(){
  const input=document.getElementById('gs-url-input');
  const st=document.getElementById('gs-status');
  if(!input?.value) return;
  gsUrl=input.value.trim();
  localStorage.setItem('spx_gs_url',gsUrl);
  if(st){st.textContent='✓ URL saved. Trades will sync to Google Sheets.';st.style.color='var(--green)';}
}
function syncGS(trade){
  if(!gsUrl) return;
  fetch(gsUrl,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify(trade)}).catch(()=>{});
}

// EXPORT CSV
function exportJournalCSV(){
  if(trades.length===0){alert('No trades to export.');return;}
  const h=['Date','Time','Setup','Dir','Entry','Exit','Qty','PnL','Emotion','Rule','Notes'];
  const rows=trades.map(t=>[t.date,t.time,t.setup,t.dir,t.entry,t.exit,t.contracts,t.pnl.toFixed(2),t.emotion,t.rule,`"${(t.notes||'').replace(/"/g,'""')}"`]);
  const csv=[h,...rows].map(r=>r.join(',')).join('\n');
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
  a.download=`spx-journal-${todayISO()}.csv`;a.click();
}

// CALCULATOR
function updateCalc(){
  const entry=parseFloat(document.getElementById('calc-entry')?.value)||0;
  const exit=parseFloat(document.getElementById('calc-exit')?.value)||0;
  const qty=parseInt(document.getElementById('calc-contracts')?.value)||1;
  const stop=parseFloat(document.getElementById('calc-stop')?.value)||0;
  const target=parseFloat(document.getElementById('calc-target')?.value)||0;
  const gross=(exit-entry)*qty*100;
  const rop=entry>0?((exit-entry)/entry*100):0;
  const maxRisk=stop>0?(entry-stop)*qty*100:entry*qty*100;
  const targetGain=target>0?(target-entry)*qty*100:0;
  const rr=(stop>0&&target>0&&entry>0)?((target-entry)/(entry-stop)).toFixed(2):'—';
  setColor('cr-gross',`${gross>=0?'+':''}$${gross.toFixed(2)}`,gross>=0);
  setColor('cr-rop',`${rop>=0?'+':''}${rop.toFixed(1)}%`,rop>=0);
  setText('cr-risk',`-$${Math.abs(maxRisk).toFixed(2)}`);
  document.getElementById('cr-risk') && (document.getElementById('cr-risk').style.color='var(--red)');
  setText('cr-target',targetGain>0?`+$${targetGain.toFixed(2)}`:'—');
  if(targetGain>0&&document.getElementById('cr-target')) document.getElementById('cr-target').style.color='var(--green)';
  setText('cr-rr',rr!=='—'?`1 : ${rr}`:'—');
}

// LIMITS
function updateLimits(){
  const pg=parseFloat(document.getElementById('lim-profit')?.value)||500;
  const ml=parseFloat(document.getElementById('lim-loss')?.value)||300;
  const pnl=parseFloat(document.getElementById('lim-pnl')?.value)||0;
  localStorage.setItem('spx_lim',JSON.stringify({p:pg,l:ml}));
  const bar=document.getElementById('pnl-bar');
  const label=document.getElementById('pnl-bar-label');
  const warn=document.getElementById('limits-warning');
  const range=pg+ml;
  const pct=Math.max(0,Math.min(100,((pnl+ml)/range)*100));
  if(bar) bar.style.width=pct+'%';
  if(label){label.textContent=`${pnl>=0?'+':''}$${pnl.toFixed(2)}`;label.style.color=pnl>=0?'var(--green)':'var(--red)';}
  if(warn){
    if(pnl>=pg){warn.style.display='block';warn.textContent=`🎯 PROFIT TARGET: +$${pnl.toFixed(2)} — Consider locking session`;warn.style.color='var(--green)';warn.style.borderColor='var(--green)';warn.style.background='rgba(16,185,129,0.1)';}
    else if(pnl<=-ml){warn.style.display='block';warn.textContent=`🛑 LOSS LIMIT HIT: $${pnl.toFixed(2)} — STOP TRADING NOW`;warn.style.color='var(--red)';warn.style.borderColor='var(--red)';warn.style.background='rgba(239,68,68,0.1)';}
    else warn.style.display='none';
  }
}

// TREND SCORE
function updateTrend(){
  const checks=[{id:'ts-above-vwap',w:2},{id:'ts-ema-bull',w:2},{id:'ts-rsi-bull',w:1},
    {id:'ts-vol-confirm',w:1},{id:'ts-orb-break',w:2},{id:'ts-above-prev',w:1},{id:'ts-macd-bull',w:1}];
  const max=checks.reduce((s,c)=>s+c.w,0);
  const score=checks.reduce((s,c)=>{const el=document.getElementById(c.id);return s+(el&&el.checked?c.w:0);},0);
  const call=Math.round(score/max*10);
  const put=10-call;
  setText('ts-call-score',`${call}/10`);setText('ts-put-score',`${put}/10`);
  const v=document.getElementById('trend-verdict');
  if(v){
    if(call>=7){v.textContent='📈 Bullish bias — CALL conditions favorable';v.style.color='var(--green)';}
    else if(put>=7){v.textContent='📉 Bearish bias — PUT conditions favorable';v.style.color='var(--red)';}
    else if(call>=5){v.textContent='⚖️ Slight bullish lean — confirm price action';v.style.color='var(--amber)';}
    else if(put>=5){v.textContent='⚖️ Slight bearish lean — confirm price action';v.style.color='var(--amber)';}
    else{v.textContent='⚠️ Mixed signals — Consider staying sidelines';v.style.color='var(--text-muted)';}
  }
}
function updateTrendScore(){updateTrend();}

// OPENING RANGE
function updateOR(){
  const price=parseFloat(document.getElementById('or-price')?.value);
  const high=parseFloat(document.getElementById('or-high')?.value);
  const low=parseFloat(document.getElementById('or-low')?.value);
  const vwap=parseFloat(document.getElementById('or-vwap')?.value);
  if(isNaN(high)||isNaN(low)){setText('orr-range','Enter OR levels');return;}
  const range=high-low;
  setText('orr-range',`${range.toFixed(2)} pts`);
  if(!isNaN(price)){
    const vh=price-high,vl=price-low;
    setColor('orr-vs-high',`${vh>=0?'+':''}${vh.toFixed(2)} (${vh>=0?'ABOVE':'BELOW'})`,vh>=0);
    setColor('orr-vs-low',`${vl>=0?'+':''}${vl.toFixed(2)} (${vl>=0?'ABOVE':'BELOW'})`,vl>=0);
    if(!isNaN(vwap)){const vv=price-vwap;setColor('orr-vs-vwap',`${vv>=0?'+':''}${vv.toFixed(2)} (${vv>=0?'ABOVE VWAP':'BELOW VWAP'})`,vv>=0);}
    if(price>high)setColor('orr-breakout','🚀 BREAKOUT — Above OR High',true);
    else if(price<low)setColor('orr-breakout','📉 BREAKDOWN — Below OR Low',false);
    else{setText('orr-breakout','⚖️ Inside OR — No breakout');document.getElementById('orr-breakout')&&(document.getElementById('orr-breakout').style.color='var(--amber)');}
  }
}

// DISCIPLINE PNL
function updateDiscPnl(){
  const pnl=parseFloat(document.getElementById('disc-pnl')?.value)||0;
  const n=parseInt(document.getElementById('disc-trades')?.value)||0;
  const pg=parseFloat(document.getElementById('lim-profit')?.value)||500;
  const ml=parseFloat(document.getElementById('lim-loss')?.value)||300;
  const bar=document.getElementById('disc-pnl-bar');
  const v=document.getElementById('pnl-verdict');
  const pct=Math.max(0,Math.min(100,((pnl+ml)/(pg+ml))*100));
  if(bar) bar.style.width=pct+'%';
  if(v){
    if(pnl>=pg){v.textContent=`🎯 TARGET: +$${pnl.toFixed(2)} — LOCK SESSION`;v.style.color='var(--green)';}
    else if(pnl<=-ml){v.textContent=`🛑 LOSS LIMIT: $${pnl.toFixed(2)} — STOP NOW`;v.style.color='var(--red)';}
    else if(pnl>0){v.textContent=`📈 Profit: +$${pnl.toFixed(2)} · ${n} trade(s)`;v.style.color='var(--green)';}
    else if(pnl<0){v.textContent=`📉 Loss: $${pnl.toFixed(2)} · ${n} trade(s)`;v.style.color='var(--red)';}
    else{v.textContent=`Flat · ${n} trade(s)`;v.style.color='var(--text-muted)';}
  }
}
function updateDisciplinePnl(){updateDiscPnl();}

// TABS
function switchTab(tab){
  document.querySelectorAll('.tab-content').forEach(el=>el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(el=>el.classList.remove('active'));
  const te=document.getElementById(`tab-${tab}`);if(te) te.classList.add('active');
  const ne=document.querySelector(`[data-tab="${tab}"]`);if(ne) ne.classList.add('active');
  if(tab==='journal'){renderCalendar();renderWeekly();renderTable();}
  if(tab==='calendar'){buildAnnualCal();computeDayStats();}
  if(tab==='news'){renderNews();}
  if(tab==='heatmap'&&typeof renderHeatmap==='function'){renderHeatmap();}
  if(tab==='screener'&&typeof filterScreener==='function'){filterScreener();}
  if(tab==='megacap'&&typeof renderMegacap==='function'){renderMegacap();}
  if(tab==='charts'&&typeof drawChart==='function'){setTimeout(drawChart,50);}
  if(tab==='watchlist'&&typeof renderWatchlist==='function'){renderWatchlist();}
  if(tab==='settings'&&typeof loadSettingsUI==='function'){loadSettingsUI();}
}

// THEME
function toggleTheme(){
  const html=document.documentElement;
  const dark=html.getAttribute('data-theme')==='dark';
  html.setAttribute('data-theme',dark?'light':'dark');
  const b=document.getElementById('theme-btn');
  if(b) b.textContent=dark?'🌙 Dark Mode':'☀ Light Mode';
}

// NEWS
function renderNews(){
  const container=document.getElementById('news-list-container');
  if(!container) return;
  const cat=document.getElementById('news-cat-filter')?.value||'all';
  const search=document.getElementById('news-search')?.value.toLowerCase()||'';
  const filtered=NEWS_ITEMS.filter(n=>{
    if(cat!=='all'&&n.cat!==cat) return false;
    if(search&&!JSON.stringify(n).toLowerCase().includes(search)) return false;
    return true;
  });
  container.innerHTML=filtered.map(n=>`
    <div class="news-item-card">
      <div><span class="news-source-tag ${n.cat==='trump'?'trump-tag':''}">${n.src}</span><span style="margin-left:.5rem;font-size:.65rem;color:var(--text-dim)">${n.age}</span></div>
      <div class="news-headline">${n.title}</div>
      <div class="news-summary">${n.summary}</div>
      <div class="news-meta-row"><a href="${n.url}" target="_blank" rel="noopener" class="news-link">→ Read on ${n.src}</a><span>${n.cat.toUpperCase()}</span></div>
    </div>`).join('');
  const st=document.getElementById('news-last-refresh');
  if(st) st.textContent=`Updated: ${new Date().toLocaleTimeString()}`;
  const stt=document.getElementById('news-status-text');
  if(stt) stt.textContent=`${filtered.length} sources · Click links for live content`;
}
function filterNews(){renderNews();}
function refreshNews(){renderNews();}

// ANNUAL CALENDAR
function buildAnnualCal(){
  const container=document.getElementById('annual-calendar-grid');
  if(!container) return;
  const year=new Date().getFullYear();
  const dpMap={};
  trades.forEach(t=>{dpMap[t.date]=(dpMap[t.date]||0)+t.pnl;});
  const todayStr=todayISO();
  container.innerHTML=Array.from({length:12},(_,mi)=>{
    const first=new Date(year,mi,1);
    const last=new Date(year,mi+1,0);
    const mname=first.toLocaleString('en-US',{month:'long'});
    let td=0;
    let h=['Su','Mo','Tu','We','Th','Fr','Sa'].map(d=>`<div class="mmd" style="color:var(--text-dim);font-weight:600;font-size:.6rem">${d}</div>`).join('');
    for(let i=0;i<first.getDay();i++) h+=`<div class="mmd"></div>`;
    for(let d=1;d<=last.getDate();d++){
      const ds=`${year}-${String(mi+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const dd=new Date(year,mi,d);
      const isWE=dd.getDay()===0||dd.getDay()===6;
      const isH=isHoliday(ds);
      const isTrd=!isWE&&!isH;
      if(isTrd) td++;
      const isT=ds===todayStr;
      const pnl=dpMap[ds];
      let cls='mmd';
      if(isT) cls+=' today';
      else if(isH) cls+=' holiday';
      else if(isWE) cls+=' weekend';
      else cls+=' trading';
      if(pnl>0) cls+=' has-profit';
      else if(pnl<0) cls+=' has-loss';
      const title=pnl!==undefined?`$${pnl.toFixed(2)}`:isH?'Holiday':'';
      h+=`<div class="${cls}" title="${title}">${d}</div>`;
    }
    return `<div class="month-mini">
      <div class="month-mini-title">${mname}</div>
      <div class="month-mini-grid">${h}</div>
      <div class="month-mini-stats"><span>${td} trading days</span></div>
    </div>`;
  }).join('');
}

// HELPERS
function setText(id,v){const el=document.getElementById(id);if(el)el.textContent=v;}
function setColor(id,v,positive){
  const el=document.getElementById(id);
  if(!el) return;
  el.textContent=v;
  el.style.color=positive===true?'var(--green)':positive===false?'var(--red)':'';
}
function checkAlerts(){updateAlertHL(pstNow());}

// Start discipline popup every 15 min during market hours
setInterval(()=>{
  const pst=pstNow();
  const tot=pst.getHours()*60+pst.getMinutes();
  if(tot>=390&&tot<=780) showDiscModal();
}, 15*60*1000);
