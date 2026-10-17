# SPX Discipline Desk (v2 file set)
Files: index2.html, styles2.css, app2.js, config.example2.js, README2.md. Open index2.html, or deploy on GitHub Pages (Settings > Pages > deploy from branch; no build step).
Educational tool only: no brokerage connection, no orders, no signals, nothing fabricated.

## Data
Free browsers-only SPX 5-minute data is generally not available (CORS, delayed/redistribution limits). Verify provider terms before use.
- Manual mode (default): enter prices; they are grouped into 5-min candles and labelled MANUAL (no volume, so no VWAP).
- Feed mode: set `dataEndpoint` in config.example2.js (or load a config2.js). Keep API keys in a free serverless proxy (e.g. Cloudflare Workers), never in this repo. Expected JSON: `{source, delayed, prevClose, bars:[{t:ms,o,h,l,c,v}]}`.
- News: set `newsEndpoint` -> `[{title,source,url,publishedAt}]`. Otherwise only official-source links are shown.

## Calendar
Holidays (incl. Good Friday, observed dates) are computed from rules; early closes are flagged as likely. This is NOT authoritative: confirm at nyse.com/markets/hours-calendars.

## Not yet built
Economic-calendar API, automated historical session archive, charts. Journal, P/L and reviews persist in localStorage.
