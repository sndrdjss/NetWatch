# NetWatch Development Plan

## Goal

Build a beginner-friendly network monitoring dashboard that demonstrates networking concepts through simulated devices. The MVP will show routers, switches, servers, and computers with online/offline status, latency, uptime, and network traffic. Keep it practical for local development on Windows 11 with 8 GB of RAM.

## Phase 1 — Foundation (complete)

- Document the MVP, technology choices, and proposed frontend/backend layout.
- Add a `.gitignore` for local dependencies, generated files, secrets, and SQLite data.
- Review the documentation and confirm the repository has no application code or installed dependencies from this phase.

**Done when:** `README.md`, `.gitignore`, and this plan are present and readable. Phase 1 was approved and completed.

## Phase 2 — Simulated backend (complete)

- Create a small FastAPI application in `backend/` with in-memory snapshots; defer SQLite to a later milestone.
- Define simulated devices and generate changing status, latency, uptime, and traffic values; no real network scans are needed for the MVP.
- Expose read-only endpoints for the device list and dashboard metrics, and document their response shapes.
- Add focused backend tests for API responses and simulation behavior.

**Done when:** the API starts locally, returns all four device types with the required metrics, and its tests pass.

## Phase 3 — Dashboard frontend (current)

- Create a Vite/React application in `frontend/` using Tailwind CSS and Recharts.
- Show device status and metrics in a readable dashboard, with traffic trends in a chart.
- Include loading, empty, and API-error states so the UI remains understandable when data is unavailable.
- Keep last successful readings visibly marked stale during disconnections; chart history contains only received snapshots.

**Done when:** the frontend starts locally and displays the required metrics from the backend.

## Phase 4 — Integration and portfolio polish

- Check the complete local workflow on Windows 11 and document startup commands and configuration.
- Verify that changing simulated values appear in the UI and that offline devices are easy to identify.
- Add a concise architecture explanation and screenshots once the dashboard is working.

**Done when:** a new reader can follow the README to run and understand the MVP.

## Later learning extensions (outside the MVP)

After the local MVP works, evaluate cloud deployment and cybersecurity additions such as authentication, secure configuration, and audit-friendly logging. Choose these based on what the working project needs; they are not part of Phase 1.
