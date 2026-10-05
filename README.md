# Kiro-workshop
Projects from kiro workshop

## Activity Suggester

A simple web app that suggests activities to beat boredom, powered by the
[Bored API](https://bored-api.appbrewery.com) from The App Brewery.

### Features

- **Surprise me 🎲** — fetches a random activity instantly (also runs on page load).
- **Suggest an activity** — filter by:
  - **Type** (education, recreational, social, DIY, charity, cooking, relaxation, music, busywork)
  - **Participants** (1 to 5+)
  - **Max price** (free → pricey)
  - **Kid-friendly only**
- Results are shown as a card with tags for type, participants, price, duration,
  accessibility, kid-friendliness, and a "Learn more" link when available.
- Graceful handling of no-match and network/API errors.

### Tech

Front-end: plain HTML, CSS, and vanilla JavaScript.
Back-end: a tiny Node server (built-in modules only — no `npm install`).

| File | Purpose |
|------|---------|
| `index.html` | Page structure and filter controls |
| `styles.css` | Styling (responsive, mobile-friendly) |
| `app.js` | Fetches activities from `/api/*` and renders them |
| `server.js` | Serves the files and proxies the Bored API |

### Running it

> **Why a server?** The Bored API doesn't send CORS headers, so a browser
> blocks a page from fetching it directly (you'd see "Failed to fetch").
> `server.js` serves the front-end and proxies the API from the server side,
> which avoids CORS entirely. **Requires Node 18+** (for the built-in `fetch`).

```bash
node server.js
# then open http://localhost:3000
```

That's it — no dependencies to install.

> Note: Type and Participants are filtered by the API; Max price and
> Kid-friendly are applied client-side since the API doesn't filter on them.
