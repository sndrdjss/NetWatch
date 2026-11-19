# NetWatch — Network Monitoring Dashboard

NetWatch is a first IT portfolio project for learning network monitoring, Python, web development, and later cloud and cybersecurity concepts. Its MVP will simulate a small network of routers, switches, servers, and computers. The dashboard will show each device's online/offline status, latency, uptime, and network traffic.

**Current status:** Phase 3 — the simulated FastAPI backend and React dashboard are available. SQLite storage is later work.

## Planned technology

| Part | Technology |
| --- | --- |
| Backend API and simulator | Python, FastAPI |
| Local data storage | In-memory snapshots now; SQLite is planned for later |
| Frontend | React, Vite, Tailwind CSS |
| Charts | Recharts, using only received API snapshots |

The project is intended to run locally on Windows 11 in VS Code with 8 GB of RAM. We will use simulated data for the MVP, so no physical network equipment or cloud account is required.

## Proposed project layout

The backend and frontend are implemented locally. The dashboard uses simulated data only.

```text
NetWatch/
├── backend/                 # FastAPI application
│   ├── app/                 # API, simulation, and in-memory store
│   ├── tests/               # Backend tests
│   ├── requirements.txt     # Pinned backend packages
│   └── README.md            # Windows setup and API guide
├── frontend/                # Vite/React application
│   ├── src/                 # Pages, components, polling, and styles
│   ├── package.json         # Pinned frontend packages and commands
│   └── README.md            # Windows setup and UI guide
├── docs/
│   └── DEVELOPMENT_PLAN.md # Milestones and acceptance checks
├── .gitignore
└── README.md
```

The project root is this directory, `NetWatch/`.

## Phase 1 verification

Open the `NetWatch` folder in VS Code and read the three Phase 1 files. In PowerShell, from the project root, you can check them with:

```powershell
Get-Item README.md, .gitignore, docs/DEVELOPMENT_PLAN.md
Get-Content docs/DEVELOPMENT_PLAN.md
git status --short
```

For setup, run commands, endpoints, and tests, see the [backend guide](backend/README.md) and [frontend guide](frontend/README.md). Start FastAPI first, then Vite; open <http://127.0.0.1:5173>.

## Roadmap

See [the development plan](docs/DEVELOPMENT_PLAN.md) for the phased build and how each phase will be checked.
