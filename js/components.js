// ============================================================
// SPX COMMAND CENTER — components.js
// Heatmap, Screener, Mega-Cap AI, Charts, Watchlist, Settings, Audio
// ============================================================
'use strict';

// ------------------------------------------------------------
// 1. DATA MODELS & STATE
// ------------------------------------------------------------
const INDICES_DATA = {
  SPX: { name: 'S&P 500 Index', price: 5892.40, change: 28.15, pct: 0.48, base: 5864.25 },
  SPY: { name: 'SPDR S&P 500 ETF', price: 588.15, change: 2.85, pct: 0.49, base: 585.30 },
  QQQ: { name: 'Invesco Nasdaq 100', price: 504.60, change: 3.62, pct: 0.72, base: 500.98 },
  DIA: { name: 'Dow Jones ETF', price: 432.80, change: 0.65, pct: 0.15, base: 432.15 },
  VIX: { name: 'Cboe Volatility', price: 14.85, change: -0.49, pct: -3.20, base: 15.34 }
};

const HEATMAP_DATA = [
  {
    sector: 'Technology',
    stocks: [
      { sym: 'MSFT', name: 'Microsoft Corp', price: 428.50, chg: 1.15, cap: '3.18T' },
      { sym: 'AAPL', name: 'Apple Inc', price: 232.10, chg: 0.42, cap: '3.52T' },
      { sym: 'ORCL', name: 'Oracle Corp', price: 178.40, chg: 2.85, cap: '492B' },
      { sym: 'CRM',  name: 'Salesforce', price: 338.20, chg: -0.35, cap: '326B' },
      { sym: 'ADBE', name: 'Adobe Inc', price: 498.60, chg: -1.20, cap: '221B' }
    ]
  },
  {
    sector: 'Semiconductors',
    stocks: [
      { sym: 'NVDA', name: 'NVIDIA Corp', price: 141.25, chg: 3.45, cap: '3.47T' },
      { sym: 'AMD',  name: 'Advanced Micro', price: 156.80, chg: 2.10, cap: '254B' },
      { sym: 'AVGO', name: 'Broadcom Inc', price: 178.90, chg: 1.85, cap: '835B' },
      { sym: 'TSM',  name: 'Taiwan Semi', price: 198.40, chg: 2.60, cap: '1.02T' },
      { sym: 'MU',   name: 'Micron Tech', price: 108.50, chg: 4.15, cap: '120B' },
      { sym: 'ARM',  name: 'Arm Holdings', price: 142.30, chg: 3.80, cap: '148B' }
    ]
  },
  {
    sector: 'AI & Cloud',
    stocks: [
      { sym: 'PLTR', name: 'Palantir Tech', price: 44.80, chg: 5.60, cap: '101B' },
      { sym: 'ANET', name: 'Arista Networks', price: 398.20, chg: 2.40, cap: '125B' },
      { sym: 'CRWD', name: 'CrowdStrike', price: 312.40, chg: 1.90, cap: '76B' },
      { sym: 'SNOW', name: 'Snowflake Inc', price: 122.50, chg: -0.80, cap: '41B' }
    ]
  },
  {
    sector: 'Consumer',
    stocks: [
      { sym: 'AMZN', name: 'Amazon.com Inc', price: 188.60, chg: 1.45, cap: '1.96T' },
      { sym: 'TSLA', name: 'Tesla Inc', price: 218.40, chg: -1.85, cap: '695B' },
      { sym: 'META', name: 'Meta Platforms', price: 582.10, chg: 0.95, cap: '1.47T' },
      { sym: 'GOOGL',name: 'Alphabet Inc', price: 165.30, chg: 0.65, cap: '2.04T' }
    ]
  },
  {
    sector: 'Financials',
    stocks: [
      { sym: 'JPM', name: 'JPMorgan Chase', price: 224.50, chg: 0.85, cap: '638B' },
      { sym: 'BAC', name: 'Bank of America', price: 42.15, chg: 0.30, cap: '328B' },
      { sym: 'GS',  name: 'Goldman Sachs', price: 518.20, chg: 1.10, cap: '168B' },
      { sym: 'V',   name: 'Visa Inc', price: 282.40, chg: 0.25, cap: '578B' }
    ]
  },
  {
    sector: 'Healthcare',
    stocks: [
      { sym: 'LLY', name: 'Eli Lilly & Co', price: 915.20, chg: 1.65, cap: '870B' },
      { sym: 'UNH', name: 'UnitedHealth', price: 582.40, chg: -0.45, cap: '536B' },
      { sym: 'JNJ', name: 'Johnson & Johnson', price: 162.80, chg: -0.15, cap: '392B' }
    ]
  },
  {
    sector: 'Energy',
    stocks: [
      { sym: 'XOM', name: 'Exxon Mobil', price: 121.40, chg: -1.10, cap: '482B' },
      { sym: 'CVX', name: 'Chevron Corp', price: 152.60, chg: -0.95, cap: '280B' }
    ]
  }
];

const SCREENER_DATABASE = [
  { sym: 'SOND', name: 'Sonder Holdings', price: 4.85, chg: 38.5, vol: '14.2M', avg13: '2.8M', rvol: 5.07, mcap: '48M', catalyst: 'Strategic Partnership', flags: ['Low Float (3.2M)', 'Dilution Risk'] },
  { sym: 'VRAX', name: 'Virax Biolabs', price: 3.42, chg: 31.2, vol: '22.8M', avg13: '4.1M', rvol: 5.56, mcap: '22M', catalyst: 'FDA Clearance Distribution', flags: ['Micro Float', 'High Spread'] },
  { sym: 'BMR',  name: 'Beamr Imaging', price: 5.60, chg: 27.8, vol: '8.4M', avg13: '1.9M', rvol: 4.42, mcap: '72M', catalyst: 'AI Video Compression Tech', flags: ['Clean Balance Sheet'] },
  { sym: 'HOLO', name: 'MicroCloud Hologram', price: 2.15, chg: 44.2, vol: '45.1M', avg13: '8.2M', rvol: 5.50, mcap: '34M', catalyst: 'Speculative Quantum Patent', flags: ['Past Reverse Split', 'Extreme Risk'] },
  { sym: 'CRKN', name: 'Crown Electrokinetics', price: 2.80, chg: 26.1, vol: '11.5M', avg13: '3.4M', rvol: 3.38, mcap: '39M', catalyst: 'Fiber Infrastructure Contract', flags: ['Dilution Risk'] },
  { sym: 'OPTT', name: 'Ocean Power Tech', price: 3.10, chg: 29.5, vol: '9.8M', avg13: '2.5M', rvol: 3.92, mcap: '41M', catalyst: 'Defense Buoy Order', flags: ['Low Float'] },
  { sym: 'CERO', name: 'CERo Therapeutics', price: 4.15, chg: 33.8, vol: '16.4M', avg13: '3.1M', rvol: 5.29, mcap: '29M', catalyst: 'Phase 1 Oncology Trial', flags: ['Cash Runway < 6mo'] },
  { sym: 'DRUG', name: 'Bright Minds Bio', price: 8.40, chg: 25.4, vol: '6.2M', avg13: '2.1M', rvol: 2.95, mcap: '88M', catalyst: 'Epilepsy Drug Data', flags: ['FDA Volatility'] }
];

const MEGACAP_DATABASE = [
  { sym: 'NVDA', name: 'NVIDIA Corp', price: 141.25, chg: 3.45, chg5d: 6.8, chg20d: 18.2, rvol: 1.45, rsi: 68, ema: 'Bullish (EMA9 > 21)', trend: 'Strong Uptrend', cat: 'semis', distHigh: '-2.1%', earn: 'May 22', catalyst: 'Blackwell GPU volume shipments accelerating' },
  { sym: 'AMD',  name: 'Advanced Micro Devices', price: 156.80, chg: 2.10, chg5d: 4.2, chg20d: 11.5, rvol: 1.20, rsi: 61, ema: 'Bullish (EMA9 > 21)', trend: 'Bullish Momentum', cat: 'semis', distHigh: '-5.4%', earn: 'Apr 30', catalyst: 'MI325X AI accelerator traction in hyperscalers' },
  { sym: 'AVGO', name: 'Broadcom Inc', price: 178.90, chg: 1.85, chg5d: 3.8, chg20d: 9.4, rvol: 1.15, rsi: 64, ema: 'Bullish (EMA9 > 21)', trend: 'Bullish Momentum', cat: 'semis', distHigh: '-3.8%', earn: 'Jun 12', catalyst: 'Custom AI ASIC design pipelines expanding' },
  { sym: 'MSFT', name: 'Microsoft Corp', price: 428.50, chg: 1.15, chg5d: 2.1, chg20d: 5.6, rvol: 0.95, rsi: 58, ema: 'Bullish (EMA9 > 21)', trend: 'Bullish Momentum', cat: 'mag7', distHigh: '-4.1%', earn: 'Apr 25', catalyst: 'Azure AI revenue annualized above $12B' },
  { sym: 'AAPL', name: 'Apple Inc', price: 232.10, chg: 0.42, chg5d: -0.8, chg20d: 3.2, rvol: 0.88, rsi: 52, ema: 'Neutral / Range', trend: 'Consolidation', cat: 'mag7', distHigh: '-3.0%', earn: 'May 02', catalyst: 'Apple Intelligence phased global rollout' },
  { sym: 'AMZN', name: 'Amazon.com Inc', price: 188.60, chg: 1.45, chg5d: 3.1, chg20d: 7.8, rvol: 1.10, rsi: 62, ema: 'Bullish (EMA9 > 21)', trend: 'Bullish Momentum', cat: 'mag7', distHigh: '-2.5%', earn: 'Apr 26', catalyst: 'AWS generative AI revenue triple-digit growth' },
  { sym: 'META', name: 'Meta Platforms', price: 582.10, chg: 0.95, chg5d: 1.8, chg20d: 8.1, rvol: 1.02, rsi: 60, ema: 'Bullish (EMA9 > 21)', trend: 'Bullish Momentum', cat: 'mag7', distHigh: '-3.2%', earn: 'Apr 24', catalyst: 'Llama 3 open models driving ad-targeting gains' },
  { sym: 'GOOGL',name: 'Alphabet Inc', price: 165.30, chg: 0.65, chg5d: 0.4, chg20d: 4.1, rvol: 0.92, rsi: 54, ema: 'Neutral / Range', trend: 'Consolidation', cat: 'mag7', distHigh: '-6.8%', earn: 'Apr 23', catalyst: 'Gemini enterprise integrations and Cloud profit' },
  { sym: 'TSLA', name: 'Tesla Inc', price: 218.40, chg: -1.85, chg5d: -4.5, chg20d: -8.2, rvol: 1.35, rsi: 41, ema: 'Bearish (EMA9 < 21)', trend: 'Bearish Pressure', cat: 'mag7', distHigh: '-18.5%', earn: 'Apr 23', catalyst: 'Robotaxi testing vs EV delivery pressure' },
  { sym: 'PLTR', name: 'Palantir Tech', price: 44.80, chg: 5.60, chg5d: 12.4, chg20d: 28.5, rvol: 2.10, rsi: 74, ema: 'Strong Bullish', trend: 'Strong Uptrend', cat: 'cloud', distHigh: '-0.8%', earn: 'May 06', catalyst: 'AIP bootcamps converting enterprise US deals' },
  { sym: 'MU',   name: 'Micron Technology', price: 108.50, chg: 4.15, chg5d: 8.5, chg20d: 14.8, rvol: 1.60, rsi: 67, ema: 'Bullish (EMA9 > 21)', trend: 'Strong Uptrend', cat: 'semis', distHigh: '-4.2%', earn: 'Jun 26', catalyst: 'HBM3E memory sold out through calendar 2025' },
  { sym: 'ARM',  name: 'Arm Holdings', price: 142.30, chg: 3.80, chg5d: 7.1, chg20d: 16.2, rvol: 1.55, rsi: 66, ema: 'Bullish (EMA9 > 21)', trend: 'Strong Uptrend', cat: 'semis', distHigh: '-5.1%', earn: 'May 08', catalyst: 'v9 architecture royalty rates doubling' },
  { sym: 'ANET', name: 'Arista Networks', price: 398.20, chg: 2.40, chg5d: 5.0, chg20d: 12.0, rvol: 1.18, rsi: 63, ema: 'Bullish (EMA9 > 21)', trend: 'Bullish Momentum', cat: 'cloud', distHigh: '-2.8%', earn: 'May 07', catalyst: '800G Ethernet switching demand for AI clusters' },
  { sym: 'CRWD', name: 'CrowdStrike', price: 312.40, chg: 1.90, chg5d: 3.4, chg20d: 8.9, rvol: 1.05, rsi: 59, ema: 'Bullish (EMA9 > 21)', trend: 'Bullish Momentum', cat: 'cloud', distHigh: '-12.0%', earn: 'Jun 04', catalyst: 'Falcon Flex customer renewal rate at 97%' }
];

let watchlist = JSON.parse(localStorage.getItem('spx_watchlist') || 'null') || [
  { sym: 'SPX', name: 'S&P 500 Index', price: 5892.40, chg: 0.48, vol: '3.8B', rvol: 1.05, trend: 'Bullish', earn: '—' },
  { sym: 'SPY', name: 'SPDR S&P 500 ETF', price: 588.15, chg: 0.49, vol: '64M', rvol: 1.10, trend: 'Bullish', earn: '—' },
  { sym: 'QQQ', name: 'Invesco Nasdaq 100', price: 504.60, chg: 0.72, vol: '42M', rvol: 1.25, trend: 'Bullish', earn: '—' },
  { sym: 'NVDA', name: 'NVIDIA Corp', price: 141.25, chg: 3.45, vol: '58M', rvol: 1.45, trend: 'Strong Up', earn: 'May 22' },
  { sym: 'TSLA', name: 'Tesla Inc', price: 218.40, chg: -1.85, vol: '84M', rvol: 1.35, trend: 'Bearish', earn: 'Apr 23' },
  { sym: 'PLTR', name: 'Palantir Tech', price: 44.80, chg: 5.60, vol: '72M', rvol: 2.10, trend: 'Strong Up', earn: 'May 06' }
];

let chartState = {
  symbol: 'SPX',
  timeframe: '5m',
  isTvEngine: false
};

let currentModalStock = null;

// ------------------------------------------------------------
// 2. TICKER BAR & MARKET REGIME
// ------------------------------------------------------------
function updateIndicesTick() {
  // Realistic micro-tick simulation
  Object.keys(INDICES_DATA).forEach(k => {
    const it = INDICES_DATA[k];
    const delta = (Math.random() - 0.48) * (it.price * 0.0006);
    it.price = parseFloat((it.price + delta).toFixed(2));
    it.change = parseFloat((it.price - it.base).toFixed(2));
    it.pct = parseFloat(((it.change / it.base) * 100).toFixed(2));

    const pEl = document.getElementById(`idx-${k.toLowerCase()}-price`);
    const cEl = document.getElementById(`idx-${k.toLowerCase()}-chg`);
    if (pEl) pEl.textContent = it.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (cEl) {
      cEl.textContent = `${it.change >= 0 ? '+' : ''}${it.pct.toFixed(2)}%`;
      cEl.style.color = it.change >= 0 ? 'var(--green)' : 'var(--red)';
    }
  });

  // Calculate Market Regime from VIX and SPX
  const vix = INDICES_DATA.VIX.price;
  const badge = document.getElementById('vix-regime-badge');
  const txt = document.getElementById('vix-regime-text');
  if (badge && txt) {
    badge.className = 'vix-regime-chip';
    if (vix < 14) {
      badge.classList.add('regime-low');
      txt.textContent = 'LOW VOL · TREND CONTINUATION';
    } else if (vix <= 19) {
      badge.classList.add('regime-normal');
      txt.textContent = 'NORMAL CHOP · CONFIRM ORB';
    } else if (vix <= 26) {
      badge.classList.add('regime-elevated');
      txt.textContent = 'ELEVATED VOL · TIGHT STOPS';
    } else {
      badge.classList.add('regime-high');
      txt.textContent = 'HIGH VOL · REDUCE SIZE / STAND ASIDE';
    }
  }
}

// ------------------------------------------------------------
// 3. MARKET HEATMAP
// ------------------------------------------------------------
let currentHeatmapFilter = 'all';

function renderHeatmap() {
  const container = document.getElementById('heatmap-container');
  if (!container) return;

  const filtered = currentHeatmapFilter === 'all' 
    ? HEATMAP_DATA 
    : HEATMAP_DATA.filter(s => s.sector.toLowerCase().includes(currentHeatmapFilter.toLowerCase()));

  container.innerHTML = filtered.map(sec => {
    const avgChg = (sec.stocks.reduce((acc, s) => acc + s.chg, 0) / sec.stocks.length).toFixed(2);
    const avgColor = avgChg >= 0 ? 'var(--green)' : 'var(--red)';

    const tilesHtml = sec.stocks.map(st => {
      let perfClass = 'tile-perf-flat';
      if (st.chg >= 3.0) perfClass = 'tile-perf-strong-green';
      else if (st.chg >= 1.0) perfClass = 'tile-perf-green';
      else if (st.chg > 0) perfClass = 'tile-perf-light-green';
      else if (st.chg <= -3.0) perfClass = 'tile-perf-strong-red';
      else if (st.chg <= -1.0) perfClass = 'tile-perf-red';
      else if (st.chg < 0) perfClass = 'tile-perf-light-red';

      return `
        <div class="stock-tile ${perfClass}" onclick="openStockModal('${st.sym}')" title="${st.name} · Market Cap: ${st.cap}">
          <div class="tile-sym">${st.sym}</div>
          <div class="tile-chg">${st.chg >= 0 ? '+' : ''}${st.chg.toFixed(2)}%</div>
          <div class="tile-price">$${st.price.toFixed(2)}</div>
        </div>
      `;
    }).join('');

    return `
      <div class="sector-card">
        <div class="sector-head">
          <span class="sector-title">${sec.sector}</span>
          <span class="sector-avg" style="color:${avgColor}">${avgChg >= 0 ? '+' : ''}${avgChg}% Avg</span>
        </div>
        <div class="sector-tiles">${tilesHtml}</div>
      </div>
    `;
  }).join('');
}

function filterHeatmapSector(sec) {
  currentHeatmapFilter = sec;
  document.querySelectorAll('#heatmap-sector-filters .chart-pill').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.toLowerCase().includes(sec.toLowerCase()) || (sec === 'all' && btn.textContent.includes('All')));
  });
  renderHeatmap();
}

// ------------------------------------------------------------
// 4. MICRO-CAP SCREENER
// ------------------------------------------------------------
function filterScreener() {
  const tbody = document.getElementById('screener-tbody');
  const countDisp = document.getElementById('sc-count-display');
  if (!tbody) return;

  const minGain = parseFloat(document.getElementById('sc-min-gain')?.value || '25');
  const priceRange = document.getElementById('sc-price-range')?.value || '2-9';
  const relVolMin = parseFloat(document.getElementById('sc-rel-vol')?.value || '1.5');
  const search = (document.getElementById('sc-search')?.value || '').toUpperCase().trim();

  const filtered = SCREENER_DATABASE.filter(s => {
    if (s.chg < minGain) return false;
    if (s.rvol < relVolMin) return false;
    if (priceRange === '2-9' && (s.price < 2.0 || s.price > 9.0)) return false;
    if (priceRange === '0-20' && (s.price < 0.0 || s.price > 20.0)) return false;
    if (search && !s.sym.includes(search) && !s.name.toUpperCase().includes(search)) return false;
    return true;
  });

  if (countDisp) countDisp.textContent = `Showing ${filtered.length} matching mover(s)`;

  tbody.innerHTML = filtered.map(s => {
    const flagsHtml = s.flags.map(f => `<span class="tag-badge ${f.includes('Risk') || f.includes('Split') ? 'tag-risk' : 'tag-catalyst'}">${f}</span>`).join(' ');
    return `
      <tr>
        <td><strong style="color:var(--text);letter-spacing:0.04em;">${s.sym}</strong></td>
        <td style="color:var(--text-muted);font-size:0.75rem;">${s.name}</td>
        <td style="font-family:'JetBrains Mono',monospace;font-weight:600;">$${s.price.toFixed(2)}</td>
        <td style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--green);">+${s.chg.toFixed(1)}%</td>
        <td style="font-family:'JetBrains Mono',monospace;">${s.vol}</td>
        <td style="font-family:'JetBrains Mono',monospace;color:var(--text-dim);">${s.avg13}</td>
        <td style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--accent-light);">${s.rvol.toFixed(2)}x</td>
        <td style="color:var(--text-muted);">${s.mcap}</td>
        <td style="font-size:0.75rem;">${s.catalyst}</td>
        <td>${flagsHtml}</td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="openStockModal('${s.sym}')">Details</button>
        </td>
      </tr>
    `;
  }).join('');
}

function refreshScreener() {
  filterScreener();
}

function exportScreenerCSV() {
  let csv = 'Ticker,Company,Price,DailyChangePct,Volume,13DAvgVol,RelVol,MarketCap,Catalyst,RiskFlags\n';
  SCREENER_DATABASE.forEach(s => {
    csv += `"${s.sym}","${s.name}",${s.price},${s.chg},"${s.vol}","${s.avg13}",${s.rvol},"${s.mcap}","${s.catalyst}","${s.flags.join('; ')}"\n`;
  });
  downloadFile('spx_microcap_screener.csv', csv, 'text/csv');
}

// ------------------------------------------------------------
// 5. MEGA-CAP & AI STOCKS
// ------------------------------------------------------------
let currentMegacapFilter = 'all';

function renderMegacap() {
  const container = document.getElementById('megacap-grid');
  if (!container) return;

  const filtered = MEGACAP_DATABASE.filter(s => {
    if (currentMegacapFilter === 'all') return true;
    if (currentMegacapFilter === 'semis' && s.cat === 'semis') return true;
    if (currentMegacapFilter === 'mag7' && s.cat === 'mag7') return true;
    if (currentMegacapFilter === 'cloud' && s.cat === 'cloud') return true;
    if (currentMegacapFilter === 'uptrend' && s.trend.includes('Strong')) return true;
    return false;
  });

  container.innerHTML = filtered.map(s => {
    let trendClass = 'trend-bullish';
    if (s.trend.includes('Strong')) trendClass = 'trend-strong-up';
    else if (s.trend.includes('Consolidation')) trendClass = 'trend-consolidation';
    else if (s.trend.includes('Bearish')) trendClass = 'trend-bearish';

    const chgColor = s.chg >= 0 ? 'var(--green)' : 'var(--red)';

    return `
      <div class="ai-card">
        <div class="ai-card-head">
          <div>
            <div class="ai-ticker">${s.sym}</div>
            <div class="ai-name">${s.name}</div>
          </div>
          <div class="ai-price-box">
            <div class="ai-price">$${s.price.toFixed(2)}</div>
            <div class="ai-chg" style="color:${chgColor}">${s.chg >= 0 ? '+' : ''}${s.chg.toFixed(2)}%</div>
          </div>
        </div>
        <div class="ai-trend-pill ${trendClass}">● ${s.trend}</div>
        <div class="ai-metrics-grid">
          <div class="ai-metric-item"><span class="ai-metric-k">5D Return</span><span class="ai-metric-v" style="color:${s.chg5d >= 0 ? 'var(--green)' : 'var(--red)'}">${s.chg5d >= 0 ? '+' : ''}${s.chg5d}%</span></div>
          <div class="ai-metric-item"><span class="ai-metric-k">20D Return</span><span class="ai-metric-v" style="color:${s.chg20d >= 0 ? 'var(--green)' : 'var(--red)'}">${s.chg20d >= 0 ? '+' : ''}${s.chg20d}%</span></div>
          <div class="ai-metric-item"><span class="ai-metric-k">RSI (14)</span><span class="ai-metric-v" style="color:${s.rsi > 70 ? 'var(--amber)' : s.rsi < 45 ? 'var(--red)' : 'var(--accent-light)'}">${s.rsi}</span></div>
          <div class="ai-metric-item"><span class="ai-metric-k">Rel Volume</span><span class="ai-metric-v">${s.rvol}x</span></div>
          <div class="ai-metric-item"><span class="ai-metric-k">Off High</span><span class="ai-metric-v" style="color:var(--text-dim);">${s.distHigh}</span></div>
          <div class="ai-metric-item"><span class="ai-metric-k">Earnings</span><span class="ai-metric-v">${s.earn}</span></div>
        </div>
        <div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:0.75rem;line-height:1.4;">
          <strong>Catalyst:</strong> ${s.catalyst}
        </div>
        <div style="display:flex;justify-content:space-between;gap:0.5rem;">
          <button class="btn btn-sm btn-outline" style="flex:1;" onclick="openStockModal('${s.sym}')">Quick View</button>
          <button class="btn btn-sm btn-primary" style="flex:1;" onclick="selectChartSymbol('${s.sym}');switchTab('charts');">Chart</button>
        </div>
      </div>
    `;
  }).join('');
}

function filterMegacap(filter) {
  currentMegacapFilter = filter;
  document.querySelectorAll('#megacap-filters .chart-pill').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('onclick').includes(`'${filter}'`));
  });
  renderMegacap();
}

// ------------------------------------------------------------
// 6. CHARTS & TECHNICAL INDICATORS
// ------------------------------------------------------------
function drawChart() {
  const canvas = document.getElementById('priceCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.parentElement.clientWidth;
  const height = canvas.parentElement.clientHeight;
  canvas.width = width;
  canvas.height = height;

  const showVwap = document.getElementById('chk-vwap')?.checked ?? true;
  const showEma = document.getElementById('chk-ema')?.checked ?? true;
  const showOrb = document.getElementById('chk-orb')?.checked ?? true;
  const showVol = document.getElementById('chk-vol')?.checked ?? true;
  const showRsi = document.getElementById('chk-rsi')?.checked ?? true;

  // Background
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg2').trim() || '#121929';
  ctx.fillRect(0, 0, width, height);

  // Generate realistic candles based on symbol
  const nCandles = 50;
  let basePrice = 5880;
  if (chartState.symbol === 'SPY') basePrice = 588;
  if (chartState.symbol === 'QQQ') basePrice = 504;
  if (chartState.symbol === 'NVDA') basePrice = 140;
  if (chartState.symbol === 'TSLA') basePrice = 218;
  if (chartState.symbol === 'AAPL') basePrice = 232;
  if (chartState.symbol === 'MSFT') basePrice = 428;

  let candles = [];
  let curr = basePrice;
  let seed = chartState.symbol.charCodeAt(0) + chartState.symbol.charCodeAt(1);
  for (let i = 0; i < nCandles; i++) {
    const change = (Math.sin(i * 0.4 + seed) * 0.4 + (Math.random() - 0.48) * 0.6) * (basePrice * 0.003);
    const open = curr;
    const close = curr + change;
    const high = Math.max(open, close) + Math.random() * (basePrice * 0.0015);
    const low = Math.min(open, close) - Math.random() * (basePrice * 0.0015);
    const vol = Math.floor(10000 + Math.random() * 40000);
    candles.push({ open, close, high, low, vol });
    curr = close;
  }

  // Price boundaries
  const highs = candles.map(c => c.high);
  const lows = candles.map(c => c.low);
  const minP = Math.min(...lows) * 0.998;
  const maxP = Math.max(...highs) * 1.002;
  const pRange = maxP - minP;

  const chartBottom = height - (showRsi ? 90 : 30);
  const chartTop = 30;
  const chartHeight = chartBottom - chartTop;

  const getY = (p) => chartBottom - ((p - minP) / pRange) * chartHeight;
  const step = width / (nCandles + 2);

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let i = 1; i <= 4; i++) {
    const gy = chartTop + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(width, gy);
    ctx.stroke();

    const priceLabel = (maxP - (pRange / 5) * i).toFixed(2);
    ctx.fillStyle = '#64748B';
    ctx.font = '10px JetBrains Mono';
    ctx.fillText(priceLabel, width - 60, gy - 4);
  }

  // Draw ORB Lines
  if (showOrb) {
    const orbHigh = Math.max(...candles.slice(0, 15).map(c => c.high));
    const orbLow = Math.min(...candles.slice(0, 15).map(c => c.low));
    const yHigh = getY(orbHigh);
    const yLow = getY(orbLow);

    ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(0, yHigh); ctx.lineTo(width, yHigh); ctx.stroke();

    ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
    ctx.beginPath(); ctx.moveTo(0, yLow); ctx.lineTo(width, yLow); ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(16, 185, 129, 0.8)';
    ctx.fillText('15m OR High', 10, yHigh - 4);
    ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
    ctx.fillText('15m OR Low', 10, yLow + 12);
  }

  // Draw VWAP line
  if (showVwap) {
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    let cumPV = 0, cumV = 0;
    candles.forEach((c, i) => {
      const tp = (c.high + c.low + c.close) / 3;
      cumPV += tp * c.vol;
      cumV += c.vol;
      const vwap = cumPV / cumV;
      const x = (i + 1) * step;
      const y = getY(vwap);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  // Draw EMA 9 line
  if (showEma) {
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    let ema9 = candles[0].close;
    candles.forEach((c, i) => {
      ema9 = c.close * (2 / 10) + ema9 * (1 - 2 / 10);
      const x = (i + 1) * step;
      const y = getY(ema9);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // EMA 21 line
    ctx.strokeStyle = '#818CF8';
    ctx.beginPath();
    let ema21 = candles[0].close;
    candles.forEach((c, i) => {
      ema21 = c.close * (2 / 22) + ema21 * (1 - 2 / 22);
      const x = (i + 1) * step;
      const y = getY(ema21);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  // Draw Candles and Volume
  candles.forEach((c, i) => {
    const x = (i + 1) * step;
    const isGreen = c.close >= c.open;
    const color = isGreen ? '#10B981' : '#EF4444';

    // Volume bar
    if (showVol) {
      const maxVol = 50000;
      const volH = (c.vol / maxVol) * 40;
      ctx.fillStyle = isGreen ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)';
      ctx.fillRect(x - step * 0.35, chartBottom - volH, step * 0.7, volH);
    }

    // Wick
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, getY(c.high));
    ctx.lineTo(x, getY(c.low));
    ctx.stroke();

    // Body
    const yOpen = getY(c.open);
    const yClose = getY(c.close);
    const bodyTop = Math.min(yOpen, yClose);
    const bodyHeight = Math.max(Math.abs(yClose - yOpen), 2);
    ctx.fillStyle = color;
    ctx.fillRect(x - step * 0.35, bodyTop, step * 0.7, bodyHeight);
  });

  // RSI Sub-panel
  if (showRsi) {
    const rsiTop = height - 70;
    const rsiBottom = height - 10;
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(0, rsiTop, width, rsiBottom - rsiTop);

    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath();
    ctx.moveTo(0, rsiTop); ctx.lineTo(width, rsiTop);
    ctx.moveTo(0, rsiTop + 18); ctx.lineTo(width, rsiTop + 18); // 70
    ctx.moveTo(0, rsiTop + 42); ctx.lineTo(width, rsiTop + 42); // 30
    ctx.stroke();

    ctx.fillStyle = '#64748B';
    ctx.fillText('RSI (14)', 10, rsiTop + 12);
    ctx.fillText('70', width - 25, rsiTop + 20);
    ctx.fillText('30', width - 25, rsiTop + 44);

    ctx.strokeStyle = '#A78BFA';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let i = 0; i < nCandles; i++) {
      const rsiVal = 50 + Math.sin(i * 0.3 + seed) * 22;
      const rx = (i + 1) * step;
      const ry = rsiTop + ((100 - rsiVal) / 100) * 60;
      if (i === 0) ctx.moveTo(rx, ry);
      else ctx.lineTo(rx, ry);
    }
    ctx.stroke();
  }

  // Header stats in canvas
  ctx.fillStyle = '#F8FAFC';
  ctx.font = 'bold 12px Inter, sans-serif';
  ctx.fillText(`${chartState.symbol} · ${chartState.timeframe} Intraday · Last: $${curr.toFixed(2)}`, 14, 20);
}

function selectChartSymbol(sym) {
  chartState.symbol = sym;
  document.querySelectorAll('.chart-workspace-container .chart-symbol-pills:first-child .chart-pill').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.trim() === sym);
  });
  if (chartState.isTvEngine) updateTvWidget();
  else drawChart();
}

function selectTimeframe(tf) {
  chartState.timeframe = tf;
  document.querySelectorAll('.chart-workspace-container .chart-symbol-pills:nth-child(2) .chart-pill').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.trim() === tf);
  });
  if (chartState.isTvEngine) updateTvWidget();
  else drawChart();
}

function toggleChartEngine() {
  chartState.isTvEngine = !chartState.isTvEngine;
  const cBox = document.getElementById('canvas-chart-box');
  const tvBox = document.getElementById('tv-chart-box');
  const btn = document.getElementById('chart-mode-btn');

  if (chartState.isTvEngine) {
    if (cBox) cBox.style.display = 'none';
    if (tvBox) tvBox.style.display = 'block';
    if (btn) btn.textContent = 'Switch to Fast Canvas Chart';
    updateTvWidget();
  } else {
    if (cBox) cBox.style.display = 'block';
    if (tvBox) tvBox.style.display = 'none';
    if (btn) btn.textContent = 'Switch to TradingView Widget';
    drawChart();
  }
}

function updateTvWidget() {
  const iframe = document.getElementById('tv-iframe');
  if (!iframe) return;
  const symMap = { SPX: 'INDEX:SPX', SPY: 'AMEX:SPY', QQQ: 'NASDAQ:QQQ', NVDA: 'NASDAQ:NVDA', TSLA: 'NASDAQ:TSLA', AAPL: 'NASDAQ:AAPL', MSFT: 'NASDAQ:MSFT' };
  const target = symMap[chartState.symbol] || `NASDAQ:${chartState.symbol}`;
  const tfMap = { '1m': '1', '5m': '5', '15m': '15', '1h': '60', '1D': 'D' };
  const interval = tfMap[chartState.timeframe] || '5';
  iframe.src = `https://s.tradingview.com/widgetembed/?frameElementId=tradingview_widget&symbol=${encodeURIComponent(target)}&interval=${interval}&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=[]&theme=dark&style=1&timezone=America%2FNew_York`;
}

// ------------------------------------------------------------
// 7. WATCHLIST
// ------------------------------------------------------------
function renderWatchlist() {
  const tbody = document.getElementById('watchlist-tbody');
  if (!tbody) return;

  tbody.innerHTML = watchlist.map((item, idx) => {
    const chgColor = item.chg >= 0 ? 'var(--green)' : 'var(--red)';
    return `
      <tr>
        <td><strong style="color:var(--text);letter-spacing:0.04em;">${item.sym}</strong></td>
        <td style="color:var(--text-muted);font-size:0.75rem;">${item.name}</td>
        <td style="font-family:'JetBrains Mono',monospace;font-weight:700;">$${item.price.toFixed(2)}</td>
        <td style="font-family:'JetBrains Mono',monospace;font-weight:700;color:${chgColor};">${item.chg >= 0 ? '+' : ''}${item.chg.toFixed(2)}%</td>
        <td style="font-family:'JetBrains Mono',monospace;">${item.vol}</td>
        <td style="font-family:'JetBrains Mono',monospace;color:var(--accent-light);">${item.rvol}x</td>
        <td><span class="tag-badge ${item.trend.includes('Up') || item.trend.includes('Bull') ? 'tag-catalyst' : 'tag-risk'}">${item.trend}</span></td>
        <td style="color:var(--text-dim);">${item.earn}</td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="selectChartSymbol('${item.sym}');switchTab('charts');">Chart</button>
          <button class="btn btn-sm btn-danger" onclick="removeWatchlist(${idx})" style="margin-left:0.3rem;">✕</button>
        </td>
      </tr>
    `;
  }).join('');
}

function addWatchlistFromInput() {
  const input = document.getElementById('wl-input');
  if (!input || !input.value.trim()) return;
  const sym = input.value.trim().toUpperCase();

  // Search if exists
  if (watchlist.some(w => w.sym === sym)) {
    alert(`${sym} is already in your watchlist.`);
    return;
  }

  // Lookup in databases or fallback
  const found = MEGACAP_DATABASE.find(m => m.sym === sym) || SCREENER_DATABASE.find(s => s.sym === sym);
  const newItem = {
    sym,
    name: found ? found.name : `${sym} Equities`,
    price: found ? found.price : 100.0,
    chg: found ? found.chg : 0.5,
    vol: found && found.vol ? found.vol : '1.2M',
    rvol: found && found.rvol ? found.rvol : 1.0,
    trend: found && found.trend ? found.trend : 'Consolidation',
    earn: found && found.earn ? found.earn : '—'
  };

  watchlist.push(newItem);
  saveWatchlist();
  input.value = '';
  renderWatchlist();
}

function removeWatchlist(idx) {
  watchlist.splice(idx, 1);
  saveWatchlist();
  renderWatchlist();
}

function saveWatchlist() {
  localStorage.setItem('spx_watchlist', JSON.stringify(watchlist));
}

function loadWatchlistPreset(type) {
  if (type === 'spx_core') {
    watchlist = [
      { sym: 'SPX', name: 'S&P 500 Index', price: 5892.40, chg: 0.48, vol: '3.8B', rvol: 1.05, trend: 'Bullish', earn: '—' },
      { sym: 'SPY', name: 'SPDR S&P 500 ETF', price: 588.15, chg: 0.49, vol: '64M', rvol: 1.10, trend: 'Bullish', earn: '—' },
      { sym: 'QQQ', name: 'Invesco Nasdaq 100', price: 504.60, chg: 0.72, vol: '42M', rvol: 1.25, trend: 'Bullish', earn: '—' },
      { sym: 'VIX', name: 'Cboe Volatility', price: 14.85, chg: -3.20, vol: '—', rvol: 1.00, trend: 'Bearish Vol', earn: '—' }
    ];
  } else if (type === 'ai_leaders') {
    watchlist = MEGACAP_DATABASE.filter(m => m.cat === 'semis' || m.cat === 'cloud').slice(0, 6).map(m => ({
      sym: m.sym, name: m.name, price: m.price, chg: m.chg, vol: '45M', rvol: m.rvol, trend: m.trend, earn: m.earn
    }));
  } else if (type === 'tech_giants') {
    watchlist = MEGACAP_DATABASE.filter(m => m.cat === 'mag7').slice(0, 6).map(m => ({
      sym: m.sym, name: m.name, price: m.price, chg: m.chg, vol: '30M', rvol: m.rvol, trend: m.trend, earn: m.earn
    }));
  }
  saveWatchlist();
  renderWatchlist();
}

function exportWatchlistCSV() {
  let csv = 'Symbol,Name,Price,ChangePct,Volume,RelVol,Trend,Earnings\n';
  watchlist.forEach(w => {
    csv += `"${w.sym}","${w.name}",${w.price},${w.chg},"${w.vol}",${w.rvol},"${w.trend}","${w.earn}"\n`;
  });
  downloadFile('spx_watchlist.csv', csv, 'text/csv');
}

function exportWatchlistJSON() {
  downloadFile('spx_watchlist.json', JSON.stringify(watchlist, null, 2), 'application/json');
}

function importWatchlistPrompt() {
  const jsonStr = prompt('Paste your Watchlist JSON array:');
  if (!jsonStr) return;
  try {
    const parsed = JSON.parse(jsonStr);
    if (Array.isArray(parsed) && parsed.length > 0) {
      watchlist = parsed;
      saveWatchlist();
      renderWatchlist();
      alert(`Imported ${parsed.length} watchlist symbols successfully.`);
    } else {
      alert('Invalid watchlist format. Must be an array of symbols.');
    }
  } catch (e) {
    alert('JSON parse error. Please verify format.');
  }
}

// ------------------------------------------------------------
// 8. STOCK DETAIL MODAL
// ------------------------------------------------------------
function openStockModal(sym) {
  let item = MEGACAP_DATABASE.find(s => s.sym === sym) || 
             SCREENER_DATABASE.find(s => s.sym === sym) || 
             watchlist.find(s => s.sym === sym) ||
             INDICES_DATA[sym];

  if (!item) {
    item = { sym, name: `${sym} Asset`, price: 100.0, chg: 0.5, mcap: '—', vol: '1.5M', avg13: '1.2M', rvol: 1.25, rsi: 55, trend: 'Neutral' };
  }

  currentModalStock = item;
  setText('sm-ticker', item.sym);
  setText('sm-name', item.name || 'Company Overview');
  setText('sm-price', `$${item.price.toFixed(2)}`);
  
  const chgEl = document.getElementById('sm-chg');
  if (chgEl) {
    chgEl.textContent = `${item.chg >= 0 ? '+' : ''}${item.chg.toFixed(2)}%`;
    chgEl.style.color = item.chg >= 0 ? 'var(--green)' : 'var(--red)';
  }

  setText('sm-mcap', item.mcap || item.cap || '—');
  setText('sm-vol', item.vol || '—');
  setText('sm-13d', item.avg13 || '—');
  setText('sm-relvol', item.rvol ? `${item.rvol}x` : '1.0x');
  setText('sm-rsi', item.rsi ? `${item.rsi}` : '56');
  setText('sm-trend', item.trend || 'Consolidation');

  const inWl = watchlist.some(w => w.sym === item.sym);
  const wBtn = document.getElementById('sm-watchlist-btn');
  if (wBtn) {
    wBtn.textContent = inWl ? '✓ In Watchlist' : '+ Add to Watchlist';
    wBtn.className = inWl ? 'btn btn-good' : 'btn btn-primary';
  }

  const modal = document.getElementById('stock-modal');
  if (modal) modal.style.display = 'flex';

  setTimeout(() => drawModalMiniChart(item), 50);
}

function closeStockModal() {
  const modal = document.getElementById('stock-modal');
  if (modal) modal.style.display = 'none';
}

function toggleModalWatchlist() {
  if (!currentModalStock) return;
  const idx = watchlist.findIndex(w => w.sym === currentModalStock.sym);
  if (idx >= 0) {
    watchlist.splice(idx, 1);
  } else {
    watchlist.push({
      sym: currentModalStock.sym,
      name: currentModalStock.name || currentModalStock.sym,
      price: currentModalStock.price,
      chg: currentModalStock.chg,
      vol: currentModalStock.vol || '2M',
      rvol: currentModalStock.rvol || 1.1,
      trend: currentModalStock.trend || 'Consolidation',
      earn: currentModalStock.earn || '—'
    });
  }
  saveWatchlist();
  renderWatchlist();
  openStockModal(currentModalStock.sym);
}

function openStockInCharts() {
  if (!currentModalStock) return;
  closeStockModal();
  selectChartSymbol(currentModalStock.sym);
  switchTab('charts');
}

function drawModalMiniChart(item) {
  const canvas = document.getElementById('modalCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.parentElement.clientWidth;
  const h = canvas.parentElement.clientHeight;
  canvas.width = w;
  canvas.height = h;

  ctx.fillStyle = '#0F172A';
  ctx.fillRect(0, 0, w, h);

  const n = 30;
  let p = item.price * 0.98;
  let points = [];
  for (let i = 0; i < n; i++) {
    p += (Math.random() - 0.48) * (item.price * 0.004);
    points.push(p);
  }
  points[points.length - 1] = item.price;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  ctx.strokeStyle = item.chg >= 0 ? '#10B981' : '#EF4444';
  ctx.lineWidth = 2;
  ctx.beginPath();
  points.forEach((pt, i) => {
    const x = (i / (n - 1)) * (w - 20) + 10;
    const y = h - 15 - ((pt - min) / range) * (h - 30);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Gradient fill under line
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, item.chg >= 0 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)');
  grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
  ctx.fillStyle = grad;
  ctx.lineTo(w - 10, h);
  ctx.lineTo(10, h);
  ctx.closePath();
  ctx.fill();
}

// ------------------------------------------------------------
// 9. WEB AUDIO API SYNTHESIZER
// ------------------------------------------------------------
function playAlertTone() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // Gentle two-tone chime (587Hz -> 880Hz, D5 -> A5)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.00, ctx.currentTime + 0.15);

    gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.15);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.6);
  } catch (e) {
    console.warn('Audio synthesis not permitted without user gesture.', e);
  }
}

// ------------------------------------------------------------
// 10. SETTINGS & STORAGE MANAGEMENT
// ------------------------------------------------------------
function loadSettingsUI() {
  const prov = localStorage.getItem('spx_provider') || 'demo';
  const key = localStorage.getItem('spx_apikey') || '';
  const audio = localStorage.getItem('spx_audio_enabled') || 'true';
  const gs = localStorage.getItem('spx_gs_url') || '';
  const loss = localStorage.getItem('spx_max_loss') || '300';

  if (document.getElementById('set-provider')) document.getElementById('set-provider').value = prov;
  if (document.getElementById('set-apikey')) document.getElementById('set-apikey').value = key;
  if (document.getElementById('set-audio')) document.getElementById('set-audio').value = audio;
  if (document.getElementById('set-gsurl')) document.getElementById('set-gsurl').value = gs;
  if (document.getElementById('set-maxloss')) document.getElementById('set-maxloss').value = loss;
}

function saveSettings() {
  const prov = document.getElementById('set-provider')?.value || 'demo';
  const key = document.getElementById('set-apikey')?.value || '';
  const audio = document.getElementById('set-audio')?.value || 'true';
  const gs = document.getElementById('set-gsurl')?.value || '';
  const loss = document.getElementById('set-maxloss')?.value || '300';

  localStorage.setItem('spx_provider', prov);
  localStorage.setItem('spx_apikey', key);
  localStorage.setItem('spx_audio_enabled', audio);
  localStorage.setItem('spx_gs_url', gs);
  localStorage.setItem('spx_max_loss', loss);

  alert('Settings saved successfully.');
}

function exportBackupJSON() {
  const backup = {
    exportDate: new Date().toISOString(),
    watchlist,
    trades: JSON.parse(localStorage.getItem('spx_trades') || '[]'),
    settings: {
      provider: localStorage.getItem('spx_provider') || 'demo',
      gsUrl: localStorage.getItem('spx_gs_url') || ''
    }
  };
  downloadFile('spx_dashboard_backup.json', JSON.stringify(backup, null, 2), 'application/json');
}

function clearAllData() {
  if (confirm('Are you sure you want to clear all locally saved trades and settings? This cannot be undone.')) {
    localStorage.clear();
    location.reload();
  }
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ------------------------------------------------------------
// 11. INITIALIZATION HOOKS
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  updateIndicesTick();
  setInterval(updateIndicesTick, 1000);
  renderHeatmap();
  filterScreener();
  renderMegacap();
  renderWatchlist();
  setTimeout(drawChart, 100);
  loadSettingsUI();
});
