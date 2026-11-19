# NetWatch — Network Monitoring Dashboard

NetWatch is a first IT portfolio project for learning network monitoring, Python, web development, and later cloud and cybersecurity concepts. Its MVP will simulate a small network of routers, switches, servers, and computers. The dashboard will show each device's online/offline status, latency, uptime, and network traffic.

**Current status:** Phase 2 — the simulated FastAPI backend is available. The React frontend and SQLite storage are later work.

## Planned technology

| Part | Technology |
| --- | --- |
| Backend API and simulator | Python, FastAPI |
| Local data storage | In-memory snapshots now; SQLite is planned for later |
| Frontend | React, Vite, Tailwind CSS |
| Charts | Recharts |

The project is intended to run locally on Windows 11 in VS Code with 8 GB of RAM. We will use simulated data for the MVP, so no physical network equipment or cloud account is required.

## Proposed project layout

The backend is implemented in Phase 2. The frontend folder below is planned for a later phase.

```text
NetWatch/
├── backend/                 # FastAPI application
│   ├── app/                 # API, simulation, and in-memory store
│   ├── tests/               # Backend tests
│   ├── requirements.txt     # Pinned backend packages
│   └── README.md            # Windows setup and API guide
├── frontend/                # Vite/React application (planned)
│   ├── public/              # Static assets
│   └── src/                 # Pages, components, API client, and styles
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

For Phase 2 setup, run commands, endpoint examples, and tests, see the [backend guide](backend/README.md).

## Roadmap

See [the development plan](docs/DEVELOPMENT_PLAN.md) for the phased build and how each phase will be checked.
