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

Plain HTML, CSS, and vanilla JavaScript — no build step or dependencies.

| File | Purpose |
|------|---------|
| `index.html` | Page structure and filter controls |
| `styles.css` | Styling (responsive, mobile-friendly) |
| `app.js` | Fetches from the Bored API and renders suggestions |

### Running it

Open `index.html` directly in a browser, or serve it locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

> Note: Type and Participants are filtered by the API; Max price and
> Kid-friendly are applied client-side since the API doesn't filter on them.
