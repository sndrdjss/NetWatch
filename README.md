# NetWatch — Network Monitoring Dashboard

NetWatch is a first IT portfolio project for learning network monitoring, Python, web development, and later cloud and cybersecurity concepts. Its MVP will simulate a small network of routers, switches, servers, and computers. The dashboard will show each device's online/offline status, latency, uptime, and network traffic.

**Current status:** Phase 1 — project documentation only. There is no runnable application yet.

## Planned technology

| Part | Technology |
| --- | --- |
| Backend API and simulator | Python, FastAPI |
| Local data storage | SQLite |
| Frontend | React, Vite, Tailwind CSS |
| Charts | Recharts |

The project is intended to run locally on Windows 11 in VS Code with 8 GB of RAM. We will use simulated data for the MVP, so no physical network equipment or cloud account is required.

## Proposed project layout

Only `README.md`, `.gitignore`, and `docs/DEVELOPMENT_PLAN.md` are part of Phase 1. The application folders below are a proposal for later phases; they have not been created yet.

```text
NetWatch/
├── backend/                 # FastAPI application (planned)
│   ├── app/                 # API, simulation, and database code
│   └── tests/               # Backend tests
├── frontend/                # Vite/React application (planned)
│   ├── public/              # Static assets
│   └── src/                 # Pages, components, API client, and styles
├── docs/
│   └── DEVELOPMENT_PLAN.md # Milestones and acceptance checks
├── .gitignore
└── README.md
```

The empty `netwatch/` folder already present in the workspace is unused. The project root is this directory, `NetWatch/`.

## Phase 1 verification

Open the `NetWatch` folder in VS Code and read the three Phase 1 files. In PowerShell, from the project root, you can check them with:

```powershell
Get-Item README.md, .gitignore, docs/DEVELOPMENT_PLAN.md
Get-Content docs/DEVELOPMENT_PLAN.md
git status --short
```

There is no install or run command in Phase 1. Dependency setup and application code begin only after Phase 2 is approved.

## Roadmap

See [the development plan](docs/DEVELOPMENT_PLAN.md) for the phased build and how each phase will be checked.
