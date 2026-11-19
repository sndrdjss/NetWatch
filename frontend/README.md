# NetWatch frontend

The Phase 3 frontend is a responsive React dashboard for the **simulated** FastAPI monitoring API. Dashboard and Devices work now. Performance, Alerts, Network Topology, and Settings are labeled “Coming soon.”

## Run on Windows 11

Open two PowerShell terminals in VS Code. Start FastAPI in the first terminal:

```powershell
cd C:\xampp\htdocs\NetWatch\backend
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Set up and start the frontend in the second terminal:

```powershell
cd C:\xampp\htdocs\NetWatch\frontend
$env:NPM_CONFIG_OFFLINE = 'false'
npm ci
npm run dev
```

Open <http://127.0.0.1:5173> for Dashboard or <http://127.0.0.1:5173/#/devices> for Devices. The current machine has npm offline mode enabled; the PowerShell setting above changes it only for that terminal. Subsequent runs need only `npm run dev` after dependencies are installed.

The frontend defaults to `/api` and Vite proxies that path to `http://127.0.0.1:8000`. You do not need to change FastAPI CORS for local development. If the backend uses a different local address, copy `.env.example` to `.env` and update `VITE_DEV_API_TARGET`, then restart Vite. `VITE_API_BASE_URL` changes the browser-facing API base path; never put secrets in a `VITE_` variable because Vite exposes them in browser code.

## What to expect

- The API connection indicator in the top bar describes the **backend**, separately from each network device's Online, Warning, or Offline status.
- The dashboard requests `/api/summary`; the Devices page requests `/api/devices`. Both refresh every 10 seconds without overlapping requests.
- The latency and traffic charts contain only summary snapshots successfully received during this browser session. They keep up to 60 points and reset when the page reloads.
- If FastAPI stops after data has loaded, the banner says **“Connection Lost — Showing Last Known Readings”**. Cards, charts, and device readings are labeled **Stale** with the last successful update time. No new chart points appear while summary data is unavailable. The UI returns to Live after successful responses resume.
- If one endpoint fails while the other works, the indicator shows Partial and labels only the affected section stale. An empty device list and unavailable latency show explicit messages instead of invented values.

To inspect the raw API, open <http://127.0.0.1:8000/docs>. To check failure and recovery, leave Vite running, stop FastAPI with `Ctrl+C`, wait 10 seconds, then start FastAPI again.

## Verify the frontend

From `C:\xampp\htdocs\NetWatch\frontend`:

```powershell
npm test
npm run build
```

`npm test` checks the important UI states and history rules. `npm run build` creates an optimized production bundle in the ignored `dist/` folder. Check Dashboard and Devices at desktop and phone widths in your browser. The unfinished sidebar links should lead only to “Coming soon” pages.

## How the React code is organized

```text
src/
├── api/         # Fetch and validate FastAPI JSON
├── components/  # Reusable navigation, badges, cards, table, and charts
├── hooks/       # One polling hook shared across pages
├── pages/       # Dashboard, Devices, and Coming Soon views
├── utils/       # Metric formatting and bounded chart history
├── App.jsx      # Navigation and application shell
└── styles.css   # Tailwind import and dark dashboard styling
```

A **component** is a function that describes part of the screen. **Props** pass data into a component, such as a summary value or whether it is stale. **State** stores values that change over time; `useMonitoring` holds the latest successful API readings and session history. A React **effect** starts polling when the app mounts and cleans up the interval and pending requests when it unmounts. This prevents old requests from updating a screen that is no longer present.
