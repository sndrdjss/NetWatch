"""FastAPI routes for the NetWatch simulator."""

from fastapi import FastAPI, HTTPException, Request

from .models import Device, DeviceStatus, Summary
from .store import SnapshotStore


app = FastAPI(title="NetWatch API", description="Simulated network monitoring data", version="0.1.0")
app.state.store = SnapshotStore()


@app.get("/")
def api_information() -> dict[str, str | bool]:
    return {"name": "NetWatch API", "version": "0.1.0", "data_source": "simulation", "simulated": True}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/devices", response_model=list[Device])
def list_devices(request: Request) -> tuple[Device, ...]:
    return request.app.state.store.get_snapshot()


@app.get("/api/devices/{device_id}", response_model=Device)
def get_device(device_id: str, request: Request) -> Device:
    for device in request.app.state.store.get_snapshot():
        if device.device_id == device_id:
            return device
    raise HTTPException(status_code=404, detail="Device not found")


@app.get("/api/summary", response_model=Summary)
def get_summary(request: Request) -> Summary:
    devices = request.app.state.store.get_snapshot()
    reachable_latencies = [device.latency_ms for device in devices if device.latency_ms is not None]
    return Summary(
        total_devices=len(devices),
        online_devices=sum(device.status is DeviceStatus.ONLINE for device in devices),
        warning_devices=sum(device.status is DeviceStatus.WARNING for device in devices),
        offline_devices=sum(device.status is DeviceStatus.OFFLINE for device in devices),
        average_latency_ms=round(sum(reachable_latencies) / len(reachable_latencies), 2) if reachable_latencies else None,
        average_uptime_percent=round(sum(device.uptime_percent for device in devices) / len(devices), 2),
        total_incoming_mbps=round(sum(device.incoming_mbps for device in devices), 2),
        total_outgoing_mbps=round(sum(device.outgoing_mbps for device in devices), 2),
        last_checked=devices[0].last_checked,
    )
