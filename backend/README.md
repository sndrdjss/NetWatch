# NetWatch backend

This Phase 2 backend serves **simulated** network monitoring data. It never connects to the fictional `192.0.2.x` device addresses and does not use SQLite.

## Folder structure

```text
backend/
├── app/
│   ├── main.py        # FastAPI routes and dashboard summary
│   ├── models.py      # Device, status, and summary response shapes
│   ├── simulation.py  # Fictional devices and mock metric generation
│   └── store.py       # One in-memory snapshot per 10-second window
├── tests/             # API and simulation checks
├── requirements.txt   # Pinned Python packages
└── README.md          # This guide
```

FastAPI is a Python framework that connects URL paths to Python functions and serializes their return values as HTTP responses. It also generates interactive API documentation at `/docs`. Uvicorn is the web server that runs the FastAPI application.

A REST API exposes resources through URLs and HTTP methods. Here, a browser sends a `GET` request to read a device or summary; the server returns JSON and an HTTP status code. `200` means the request succeeded. `404` means the requested device ID does not exist. These endpoints only read data and do not change it.

## Windows setup

Use PowerShell in VS Code. From the repository root:

```powershell
cd C:\xampp\htdocs\NetWatch\backend
py -3.14 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

The `.venv` folder contains this project's isolated Python and packages. You do not need to activate it because each command uses its Python executable directly. The folder is ignored by Git.

## Start and test

From `C:\xampp\htdocs\NetWatch\backend`:

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Keep that terminal open. `--reload` restarts the local server when code changes. Open <http://127.0.0.1:8000/docs> for FastAPI's interactive endpoint list. The API itself is available at:

| Method and path | Meaning |
| --- | --- |
| `GET /` | API name, version, and simulation label |
| `GET /health` | Backend process status |
| `GET /api/devices` | All five fictional devices |
| `GET /api/devices/{device_id}` | One device, or 404 if unknown |
| `GET /api/summary` | Counts, averages, and traffic totals |

Try these URLs in a browser: <http://127.0.0.1:8000/health>, <http://127.0.0.1:8000/api/devices>, <http://127.0.0.1:8000/api/devices/router-01>, and <http://127.0.0.1:8000/api/summary>. For a 404 example, visit <http://127.0.0.1:8000/api/devices/unknown-device>. Press `Ctrl+C` in the server terminal to stop it.

In a second PowerShell terminal, run the automated tests:

```powershell
cd C:\xampp\htdocs\NetWatch\backend
.\.venv\Scripts\python.exe -m pytest tests -q -p no:cacheprovider
```

The `tests` argument limits discovery to project tests. `-p no:cacheprovider` turns off pytest's optional cache, which is not needed for these checks.

With the pinned package versions, Starlette prints a deprecation warning when its TestClient uses standard `httpx`. The tests still pass; this project keeps `httpx` as requested.

## How simulation works

The five device names and IP addresses are fixed. On the first API request in each 10-second UTC window, the in-memory store generates a snapshot and reuses it for subsequent requests in that window. A seeded random generator makes values repeatable for the same window. Device status changes less often, on 2-minute windows; latency and traffic can change every 10 seconds.

`Online` devices have normal latency and positive traffic. `Warning` devices have elevated latency (100–250 ms) and reduced but positive traffic. `Offline` devices have `null` latency and zero traffic. Uptime percentage is simulated **historical availability**, so an offline device can still have a nonzero uptime percentage. All traffic values are in Mbps, timestamps are UTC, and every device and summary has `simulated: true`.

The summary counts each status, sums incoming and outgoing Mbps, averages uptime across all five devices, and averages latency only for devices with a latency reading. `/health` reports whether the API process responds; it does not claim that all devices are online. Nothing is saved to disk, so restarting the server resets the in-memory cache.
