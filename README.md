# SPX Discipline Desk

A static, no-build website for GitHub Pages.

## Files
- `index.html` — page structure
- `styles.css` — responsive gradient/glass UI
- `app.js` — Pacific clock, market countdown, built-in US market-holiday estimate, manual SPX trend context, discipline checks, local journal, CSV export

## Deploy to GitHub Pages
1. Upload all three website files (`index.html`, `styles.css`, `app.js`) to the same folder in your repository.
2. Commit the files to the branch/folder configured in GitHub Pages.
3. Open the published Pages URL.

## Important limitations
- SPX prices are entered manually; no live market-data feed is connected.
- News area provides readable descriptions and links to publisher pages, not live headlines or verified "minutes ago" timestamps. Add a licensed news API or backend RSS proxy for live headlines.
- Market countdown uses standard 9:30 AM–4:00 PM New York time, weekends, and a built-in list of common US equity holidays. It may not reflect special closures or early-close sessions. Verify with the exchange calendar.
- The session lock is a local coaching aid, not a broker-enforced restriction. P&L and trades are manually entered.
- Educational prototype, not financial advice. Options, especially 0DTE options, can lose all premium rapidly.
