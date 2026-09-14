# InnoGap Dashboard

A React + Vite + Tailwind CSS recreation of the InnoGap dashboard screen.

## Stack
- React.js + Vite
- Tailwind CSS
- Lucide React (icons)

## Setup

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Structure

```
src/
  App.jsx                    # Page layout / composition
  data.js                    # Mock data (recent analyses, steps)
  components/
    Sidebar.jsx               # Left nav + user footer
    PageHeader.jsx             # Welcome heading + notification bell
    StartAnalysisCard.jsx      # "Start a new analysis" CTA
    RecentAnalyses.jsx         # Recent analyses list/table
    HowItWorks.jsx             # 5-step "How it works" strip
```

## Notes
- All data lives in `src/data.js` — swap it for an API call when ready.
- `onStart` and `onSelect` callbacks in `App.jsx` are stubbed with
  `console.log`; wire them to your router/API.
- Colors, icon backgrounds, and badge colors are set as Tailwind utility
  classes so they're easy to tweak in one place (`RESULT_STYLES` in
  `data.js` for badges).
