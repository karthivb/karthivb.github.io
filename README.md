# SPX Command Center · Trading Intelligence & Discipline Dashboard

A high-performance, human-crafted financial intelligence terminal and 0DTE discipline dashboard built with Vanilla HTML5, CSS3, and modern ES6 JavaScript. Designed for static deployment to **GitHub Pages** with zero build dependencies, persistent local storage, and optional real-time **Google Sheets Apps Script** synchronization.

---

## 🏛️ Design Architecture & Philosophy

Built strictly following clean, anti-AI human design aesthetics:
- **Dual Theme Engine**: Slate/Charcoal Dark Theme (`#0F172A`) and Zinc/Slate Warm Light Theme (`#F8FAFC`). No pure black (`#000000`) or pure white (`#FFFFFF`).
- **Glassmorphism 2.0**: Frosted glass styling on primary cards and panels (`backdrop-filter: blur(16px);`, 15% opacity fills, subtle 1px semi-transparent rim border).
- **Restrained Real-World Brand Palettes**: Muted deep indigo (`#4F46E5`), sage green (`#10B981`), amber warning (`#F59E0B`), and coral red (`#EF4444`).
- **Zero Third-Party Build Bloat**: Pure native web standards for instant 60 FPS performance and 100% GitHub Pages static hosting compatibility.

---

## 📂 Project Structure

```
SPX/
├── index.html              # Main application entry point & layout shell
├── README.md               # Complete project documentation & setup guide
├── css/
│   ├── main.css            # Design tokens, reset, typography, and base layout
│   └── components.css      # Heatmap, screener, mega-cap, charts, and modal styles
├── js/
│   ├── app.js              # Core engine: market timers, 15m alerts, journal, news
│   └── components.js       # Heatmap, screener, mega-cap, charts, watchlist, settings
├── docs/                   # (Optional) Architectural reference notes
└── prompt.txt / prompt2.txt# Specification requirements & designer rules
```

---

## 🚀 Key Features

### 1. Home · SPX Command Center
- **Live Indices Ticker**: Real-time tracking for **SPX** (S&P 500 Index), **SPY** (SPDR ETF), **QQQ** (Nasdaq 100), **DIA** (Dow Jones), and **VIX** (Volatility Index).
- **Dynamic Market Regime Detection**: Real-time volatility regime pill (*Low Vol*, *Normal Chop*, *Elevated Vol*, *High Risk*).
- **Precision Market Clocks**: Synchronized Pacific Time (PST) and New York Time (EST/EDT) updating every second.
- **Intraday Session Countdowns**:
  - Live count of **Time Since Regular Market Open** (6:30 AM PST / 9:30 AM EST).
  - Live count of **Time Remaining Until Market Close** (1:00 PM PST / 4:00 PM EST).
- **0DTE Alert Window Grid (6:30 AM – 8:30 AM PST)**:
  - Highlights every 15-minute slot (`06:30`, `06:45`, `07:00`, `07:15`, `07:30`, `07:45`, `08:00`, `08:15`, `08:30`).
  - Pulsing active state with synthetic dual-tone audio chime via Web Audio API.
  - Interactive FOMO / Revenge trade check-in modal to rescue traders from 0DTE options traps.
- **Trader Wisdom & Family Reminders**:
  - Rotating quotes: *"You have another trading day"*, *"Save capital"*, *"Don't count stones while losing diamonds"*, *"You have a family, small profit beats blown account"*.
- **Trading Day Calendar Analytics**: Real-time counter of trading days elapsed this year, trading days remaining, days this month, and US market holidays.

### 2. Market Performance Heatmap
- **Interactive Sector Overview**: Visual performance maps across **Technology**, **Semiconductors**, **AI & Cloud**, **Consumer Discretionary**, **Financials**, **Healthcare**, and **Energy**.
- **Market Cap Sizing & Color Grading**: Proportional tiles with color spectrums ranging from deep green (+3%+) to deep red (-3%+).
- **Click-to-Inspect Modal**: Clicking any stock tile opens an instant stock detail card with a mini price canvas, 13-day volume stats, RSI, and watchlist action.

### 3. Top Movers & Micro-Cap Screener
- **High-Momentum Filtering**: Screens momentum stocks ($2–$9 range) moving +25%+ on unusual volume.
- **13-Trading-Day Rolling Volume**: Compares today's volume against 13-day average volume to calculate true Relative Volume (`rvol`).
- **Risk Warning Guardrails**: Flags low float, overnight dilution risk, past reverse splits, and halt probabilities.
- **Search & CSV Export**: Instant client-side search and 1-click `.csv` download.

### 4. Mega-Cap & AI Stocks on Fire
- Dedicated dashboard tracking: `NVDA`, `AMD`, `AVGO`, `MU`, `TSM`, `ARM`, `MSFT`, `GOOGL`, `META`, `AMZN`, `AAPL`, `PLTR`, `TSLA`, `ORCL`, `ANET`, `CRWD`.
- **Multi-Factor Trend Classification**: Identifies *Strong Uptrend*, *Bullish Momentum*, *Consolidation*, and *Bearish Pressure*.
- **Metrics Grid**: 5-Day return, 20-Day return, 14-period RSI gauge, EMA 9/21 alignment, distance from 52-week high, and upcoming earnings dates.

### 5. Charts & Technical Analysis Workspace
- **Custom Canvas Candlestick Engine**: Fast 60 FPS HTML5 canvas drawing candles, volume histogram, **VWAP**, **EMA 9**, **EMA 21**, **15-minute Opening Range (ORB)**, and **RSI (14)**.
- **TradingView Interactive Widget Embed**: 1-click toggle to switch between the fast local canvas engine and the full TradingView interactive widget.
- **Timeframe Selectors**: `5m`, `15m`, `1h`, `1D`.

### 6. Custom Watchlist
- Manage and save custom tickers with automatic `localStorage` persistence.
- Pre-built presets: *SPX Core*, *AI Momentum*, and *Mega Tech*.
- Export and import your watchlist in `.csv` or `.json` format.

### 7. 0DTE SPX Trading Tools
- **Intraday Options P&L Calculator**: Models cash-settled European-style SPX contract returns, Return on Premium (RoP), stop-loss risk, and target risk/reward.
- **Daily Limits Guardrail**: Configurable profit targets, daily loss limits, and contract size caps with visual gauge.
- **Trend Score (1–10)**: Weighted checklist scoring VWAP reclaim, EMA alignment, volume confirmation, and breakout state.
- **Opening Range (ORB) Calculator**: Calculates 15-minute high/low breaks and VWAP bias.

### 8. Trading Discipline & Behavioral Guardrails
- **15-Minute Loss Cutter Rule**: Prompts trader to immediately cut losing positions held over 15 minutes to prevent account blowups.
- **Emergency STOP Loss Modal**: Triggers when intraday drawdown exceeds configured stop threshold.
- **Profit Target Lock-In Modal**: Reminds trader to step away when the daily goal is reached.

### 9. Trading Journal with Google Sheets Sync
- **Interactive Calendar**: Shows trade outcome dots (Green = Win, Red = Loss, Gray = Breakeven).
- **Weekly P&L Totals Panel**: Displays weekly aggregates on the right-hand side.
- **Add Trade Modal**: Form logging Setup, Direction, Entry/Exit, Contracts, Emotion (FOMO, Revenge, Disciplined), and Rule Compliance.
- **Export CSV**: 1-click export of complete trade history.
- **Google Sheets Apps Script Integration**: Ready-to-deploy script template and webhook URL field for automated cloud synchronization.

### 10. Trade Calendar & Schedule
- Full annual view of all 12 months with calculated US trading days, NYSE/Nasdaq holidays, and elapsed/remaining counters.

### 11. Market News & Policy Watch
- Curated live market feeds from Reuters, CNBC, Bloomberg, and MarketWatch.
- **Policy Watch Section**: Links to official White House, AP News, Federal Reserve, and BLS release schedules.
- Topic filters: SPX/Markets, Trump/Policy, Fed/Economic, AI/Tech.

### 12. Settings & Data Sources
- Select between High-Fidelity Simulation, Finnhub, or Alpha Vantage.
- Web Audio API chime test button and alert configuration.
- Full backup export (`.json`) and cache reset.

---

## 🔗 Google Sheets Apps Script Setup

To sync your journal entries directly into a Google Sheet:
1. Open a new [Google Sheet](https://sheets.new).
2. Set Row 1 headers:
   `Date | Time | Setup | Direction | Entry | Exit | Contracts | PnL | Emotion | Rule | Notes`
3. Click **Extensions** → **Apps Script**.
4. Paste the following script:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      data.date,
      data.time,
      data.setup,
      data.dir,
      data.entry,
      data.exit,
      data.contracts,
      data.pnl,
      data.emotion,
      data.rule,
      data.notes || ''
    ]);
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```
5. Click **Deploy** → **New deployment**.
6. Select **Web app**, set *Execute as* to **Me**, and *Who has access* to **Anyone**.
7. Copy the Web App URL and paste it in **Settings & Feeds** → **Apps Script Web App URL**.

---

## 💻 Running Locally on Windows

You can run the application directly from your browser:
1. Simply double-click `index.html` in Windows Explorer, or
2. Run a local server via PowerShell / Command Prompt:
   ```powershell
   # Using Node.js
   npx serve .
   # Or using Python
   python -m http.server 8080
   ```
3. Open `http://localhost:8080` in Chrome, Edge, or Firefox.

---

## 🌐 Deploying to GitHub Pages

1. Push your files to your GitHub repository:
   ```bash
   git add .
   git commit -m "Deploy SPX Command Center"
   git push origin main
   ```
2. In your repository on GitHub, navigate to **Settings** → **Pages**.
3. Under **Branch**, select `main` (or your default branch) and folder `/ (root)`.
4. Click **Save**. Your site will be live within seconds at `https://<username>.github.io/<repo>/`.

---

## ⚠️ Risk Disclaimer

*SPX Command Center is an educational trading intelligence and behavioral discipline application. It does not provide financial advice, broker execution, or automated trading signals. 0DTE options carry substantial risk of capital loss. Always practice strict risk management.*
