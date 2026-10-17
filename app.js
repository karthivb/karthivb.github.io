(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const STORAGE_KEY = "spx-discipline-desk-v2";
  const state = {reviews:[], locked:false, lockReason:""};
  const number = id => { const v=$(id).value.trim(); return v===""?NaN:Number(v); };
  const escapeHtml = s => String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const pacific = (date, options={}) => new Intl.DateTimeFormat("en-US",{timeZone:"America/Los_Angeles",...options}).format(date);
  const easternParts = date => {
    const parts = new Intl.DateTimeFormat("en-US",{timeZone:"America/New_York",year:"numeric",month:"2-digit",day:"2-digit",weekday:"short",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"}).formatToParts(date);
    return Object.fromEntries(parts.map(p=>[p.type,p.value]));
  };
  const ymd = (y,m,d) => `${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const nthWeekday = (year, month, weekday, nth) => {
    const first = new Date(Date.UTC(year,month-1,1));
    return 1 + ((weekday-first.getUTCDay()+7)%7) + (nth-1)*7;
  };
  const lastWeekday = (year, month, weekday) => {
    const last = new Date(Date.UTC(year,month,0));
    return last.getUTCDate()-((last.getUTCDay()-weekday+7)%7);
  };
  const observed = (year,month,day) => {
    const d=new Date(Date.UTC(year,month-1,day)), w=d.getUTCDay();
    if(w===6)d.setUTCDate(d.getUTCDate()-1);
    if(w===0)d.setUTCDate(d.getUTCDate()+1);
    return ymd(d.getUTCFullYear(),d.getUTCMonth()+1,d.getUTCDate());
  };
  const easterSunday = year => {
    const a=year%19,b=Math.floor(year/100),c=year%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),month=Math.floor((h+l-7*m+114)/31),day=((h+l-7*m+114)%31)+1;
    return new Date(Date.UTC(year,month-1,day));
  };
  const holidaysFor = year => {
    const set=new Set([
      observed(year,1,1), ymd(year,1,nthWeekday(year,1,1,3)),
      ymd(year,2,nthWeekday(year,2,1,3)), ymd(year,5,lastWeekday(year,5,1)),
      observed(year,7,4), ymd(year,9,nthWeekday(year,9,1,1)),
      ymd(year,11,nthWeekday(year,11,4,4)), observed(year,12,25)
    ]);
    const goodFriday=easterSunday(year); goodFriday.setUTCDate(goodFriday.getUTCDate()-2);
    set.add(ymd(goodFriday.getUTCFullYear(),goodFriday.getUTCMonth()+1,goodFriday.getUTCDate()));
    // Juneteenth is a US equity-market holiday from 2022 onward.
    if(year>=2022)set.add(observed(year,6,19));
    // One-off national days of mourning or exceptional closures are not predictable here.
    return set;
  };
  const isHoliday = date => holidaysFor(date.getUTCFullYear()).has(ymd(date.getUTCFullYear(),date.getUTCMonth()+1,date.getUTCDate()));
  const dateKeyEastern = date => {const p=easternParts(date);return `${p.year}-${p.month}-${p.day}`;};
  const atEastern = (date, hour, minute) => {
    // Find the UTC instant corresponding to the requested New York wall-clock time.
    const target = new Date(Date.UTC(Number(easternParts(date).year),Number(easternParts(date).month)-1,Number(easternParts(date).day),hour,minute,0));
    let guess=target.getTime();
    for(let i=0;i<3;i++){
      const p=easternParts(new Date(guess));
      const asUTC=Date.UTC(Number(p.year),Number(p.month)-1,Number(p.day),Number(p.hour),Number(p.minute),Number(p.second));
      const desired=Date.UTC(Number(easternParts(date).year),Number(easternParts(date).month)-1,Number(easternParts(date).day),hour,minute,0);
      guess += desired-asUTC;
    }
    return new Date(guess);
  };
  const isTradingDay = date => {
    const p=easternParts(date), key=`${p.year}-${p.month}-${p.day}`;
    return !["Sat","Sun"].includes(p.weekday) && !holidaysFor(Number(p.year)).has(key);
  };
  const nextSession = (now, wantOpen) => {
    const p=easternParts(now), mins=Number(p.hour)*60+Number(p.minute)+Number(p.second)/60;
    const todayOpen=atEastern(now,9,30), todayClose=atEastern(now,16,0), valid=isTradingDay(now);
    if(valid){
      if(wantOpen && now<todayOpen)return todayOpen;
      if(!wantOpen && now<todayClose)return todayClose;
      if(wantOpen && now<todayClose && now>=todayOpen)return now;
    }
    for(let n=1;n<=14;n++){
      const candidate=new Date(now.getTime()+n*86400000);
      if(isTradingDay(candidate))return atEastern(candidate,9,30);
    }
    return atEastern(new Date(now.getTime()+86400000),9,30);
  };
  const duration = ms => {
    const total=Math.max(0,Math.floor(ms/1000)), h=Math.floor(total/3600), m=Math.floor((total%3600)/60), s=total%60;
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  };
  const updateClockAndMarket = () => {
    const now=new Date(), p=easternParts(now), mins=Number(p.hour)*60+Number(p.minute), validDay=isTradingDay(now);
    $("clock").textContent=pacific(now,{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:true});
    $("date").textContent=pacific(now,{weekday:"long",month:"short",day:"numeric",year:"numeric"});
    const open=atEastern(now,9,30), close=atEastern(now,16,0);
    const openMs=open-now, closeMs=close-now;
    let status, detail, closeTitle;
    if(!validDay){
      status=isHoliday(now)?"MARKET HOLIDAY":"MARKET CLOSED";
      detail=isHoliday(now)?"Regular US equity session is scheduled to be closed today.":"Weekend · regular session is closed.";
      closeTitle="Next session opens in";
      $("close-countdown").textContent=duration(nextSession(now,true)-now);
      $("close-detail").textContent="Time until next regular open";
    }else if(now<open){
      status="PRE-MARKET";
      detail="Regular session opens at 9:30 AM New York / 6:30 AM Pacific.";
      closeTitle="Market opens in";
      $("close-countdown").textContent=duration(openMs);
      $("close-detail").textContent="Countdown to regular-session open";
    }else if(now<close){
      status="MARKET OPEN";
      detail="Regular session · closes at 4:00 PM New York / 1:00 PM Pacific.";
      closeTitle="Time until market close";
      $("close-countdown").textContent=duration(closeMs);
      $("close-detail").textContent="HOURS : MINUTES : SECONDS";
    }else{
      status="MARKET CLOSED";
      detail="Today's regular session has ended. The next session countdown is below.";
      closeTitle="Next session opens in";
      $("close-countdown").textContent=duration(nextSession(now,true)-now);
      $("close-detail").textContent="Time until next regular open";
    }
    $("market-status").textContent=status;
    $("market-status-detail").textContent=detail;
    $("countdown-title").textContent=closeTitle;
    $("open-countdown").textContent=duration(nextSession(now,true)-now);
    const next=nextSession(now,true);
    $("open-detail").textContent="Next open · "+new Intl.DateTimeFormat("en-US",{timeZone:"America/Los_Angeles",weekday:"short",month:"short",day:"numeric",hour:"numeric",minute:"2-digit",hour12:true}).format(next)+" Pacific";
    $("session-label").textContent=validDay&&now>=open&&now<close?"Regular US session · OPEN":status;
  };
  const classify = () => {
    const p=number("price"),v=number("vwap"),hi=number("or-high"),lo=number("or-low");
    $("spx-price").textContent=Number.isFinite(p)?p.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";
    $("or-high-display").textContent=Number.isFinite(hi)?hi.toLocaleString("en-US",{maximumFractionDigits:2}):"—";
    $("or-low-display").textContent=Number.isFinite(lo)?lo.toLocaleString("en-US",{maximumFractionDigits:2}):"—";
    const tag=$("trend-state"),ex=$("market-explanation");tag.className="state wait";
    if(![p,v,hi,lo].every(Number.isFinite)||hi<=lo){tag.textContent="UNCERTAIN";ex.textContent="Enter all four values and ensure opening-range high is above low. This prototype has no live market feed.";return"UNCERTAIN";}
    if(p>hi&&p>v){tag.textContent="BULLISH CONTEXT";tag.className="state bull";ex.textContent="Price is above the opening-range high and VWAP. Watch completed candles for a hold; failed breakouts remain possible.";return"BULLISH CONTEXT";}
    if(p<lo&&p<v){tag.textContent="BEARISH CONTEXT";tag.className="state bear";ex.textContent="Price is below the opening-range low and VWAP. Watch completed candles for continuation; bear traps remain possible.";return"BEARISH CONTEXT";}
    tag.textContent="RANGE / UNCERTAIN";ex.textContent="Price is inside the opening range or VWAP and range disagree. Stand aside until price action is clearer.";return"RANGE / UNCERTAIN";
  };
  const flags=()=>["sideways","fomo","revenge","average","lunch"].filter(id=>$(id).checked);
  const updateDiscipline=()=>{
    const pnl=number("pnl"),goal=number("profit-goal"),loss=number("loss-limit"),trades=Number($("trades").value),f=flags();
    let reason="";
    if(Number.isFinite(goal)&&goal>0&&Number.isFinite(pnl)&&pnl>=goal)reason="Daily profit target reached";
    else if(Number.isFinite(loss)&&loss>0&&Number.isFinite(pnl)&&pnl<=-loss)reason="Daily loss limit reached";
    else if(trades>=2)reason="Trade limit reached";
    else if(f.length)reason="Rule triggered: "+f.map(id=>({sideways:"sideways market",fomo:"FOMO",revenge:"revenge trading",average:"averaging down",lunch:"midday no-momentum filter"}[id])).join(", ");
    if(reason){state.locked=true;state.lockReason=reason;}
    if(state.locked){
      $("coach").innerHTML="<strong>SESSION LOCKED · WALK AWAY</strong><p>"+escapeHtml(state.lockReason)+". Verify you are flat, then leave the platform.</p>";
      $("lock-message").textContent="STOP: "+state.lockReason+". This dashboard lock is local only and does not block broker orders.";
      $("lock-message").classList.add("visible");
    }else{
      $("coach").innerHTML="<strong>WAIT FOR CONFIRMATION</strong><p>No stop rule triggered. That does not mean a trade is required. Wait for a tested setup and respect your risk limit.</p>";
      $("lock-message").classList.remove("visible");
    }
    return !state.locked;
  };
  const renderJournal=()=>{
    $("review-count").textContent="Reviews logged: "+state.reviews.length+" · Last review: "+(state.reviews[0]?state.reviews[0].time:"not yet");
    $("journal-empty").style.display=state.reviews.length?"none":"block";
    $("journal-list").innerHTML=state.reviews.slice(0,50).map(r=>`<article class="news-item"><div class="news-source">${escapeHtml(r.time)}</div><div><h3>${escapeHtml(r.trend)} · P&amp;L ${escapeHtml(r.pnl)}</h3><p>${escapeHtml(r.note)}</p><span class="muted small">Price ${escapeHtml(r.price)} · Trades ${escapeHtml(r.trades)} · ${r.locked?"LOCKED":"Not locked"}</span></div></article>`).join("");
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify({reviews:state.reviews}));}catch(_){}
  };
  $("classify").addEventListener("click",classify);
  $("save-review").addEventListener("click",()=>{
    const trend=classify();updateDiscipline();
    const pnl=number("pnl"),price=number("price"),f=flags();
    state.reviews.unshift({time:pacific(new Date(),{hour:"2-digit",minute:"2-digit",second:"2-digit"}),trend,pnl:Number.isFinite(pnl)?pnl:0,price:Number.isFinite(price)?price.toFixed(2):"n/a",trades:$("trades").value,locked:state.locked,note:state.locked?state.lockReason:(f.length?"Flags: "+f.join(", "):"Review logged. Follow plan; no forced trade.")});
    renderJournal();
  });
  $("check-discipline").addEventListener("click",()=>{
    updateDiscipline();
    $("next-prompt").textContent="Discipline check completed at "+pacific(new Date(),{hour:"2-digit",minute:"2-digit",second:"2-digit"})+" Pacific.";
    if("Notification"in window&&Notification.permission==="default")Notification.requestPermission().catch(()=>{});
  });
  $("unlock-session").addEventListener("click",()=>{
    if(confirm("Reset the session lock? Only do this after you have stopped trading and intentionally begin a new session.")){
      state.locked=false;state.lockReason="";updateDiscipline();
    }
  });
  $("reset-market").addEventListener("click",()=>{["price","vwap","or-high","or-low"].forEach(id=>$(id).value="");classify();});
  $("news-filter").addEventListener("input",()=>{
    const q=$("news-filter").value.toLowerCase();
    document.querySelectorAll("#news-list .news-item").forEach(item=>item.style.display=item.textContent.toLowerCase().includes(q)?"grid":"none");
  });
  $("refresh-news").addEventListener("click",()=>{
    $("refresh-news").textContent="Source links ready";
    setTimeout(()=>$("refresh-news").textContent="Reload source links",1200);
  });
  $("export-csv").addEventListener("click",()=>{
    if(!state.reviews.length){alert("No journal entries to export yet.");return;}
    const rows=[["Pacific time","Trend","P&L","Price","Trades","Locked","Note"],...state.reviews.map(r=>[r.time,r.trend,r.pnl,r.price,r.trades,r.locked,r.note])];
    const csv=rows.map(row=>row.map(v=>'"'+String(v??"").replace(/"/g,'""')+'"').join(",")).join("\r\n");
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"}),url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download="spx-discipline-journal.csv";a.click();URL.revokeObjectURL(url);
  });
  try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");if(saved&&Array.isArray(saved.reviews))state.reviews=saved.reviews;}catch(_){}
  renderJournal();classify();updateClockAndMarket();
  setInterval(updateClockAndMarket,1000);
  setInterval(()=>{
    if(state.locked)return;
    const message="10-minute check: target reached? FOMO? Revenge trade? Averaging down? If any rule is broken, stop and step away.";
    $("next-prompt").textContent=message+" · "+pacific(new Date(),{hour:"2-digit",minute:"2-digit",hour12:true})+" Pacific";
    if("Notification"in window&&Notification.permission==="granted"){try{new Notification("SPX discipline check",{body:message});}catch(_){}}
  },10*60*1000);
})();