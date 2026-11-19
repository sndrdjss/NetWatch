"""Exercise the public API against a fixed simulated snapshot."""

from datetime import datetime, timezone

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.models import DeviceStatus
from app.simulation import generate_snapshot


class FrozenStore:
    def __init__(self) -> None:
        self.devices = generate_snapshot(datetime(2026, 1, 1, tzinfo=timezone.utc))

    def get_snapshot(self):
        return self.devices


@pytest.fixture
def client():
    original_store = app.state.store
    app.state.store = FrozenStore()
    try:
        with TestClient(app) as test_client:
            yield test_client
    finally:
        app.state.store = original_store


def test_api_information_and_health(client):
    information = client.get("/")
    assert information.status_code == 200
    assert information.json()["simulated"] is True

    health = client.get("/health")
    assert health.status_code == 200
    assert health.json() == {"status": "ok"}


def test_device_listing_contains_the_five_fictional_devices(client):
    response = client.get("/api/devices")
    assert response.status_code == 200
    devices = response.json()
    assert [(device["device_name"], device["ip_address"]) for device in devices] == [
        ("Router-01", "192.0.2.1"),
        ("Switch-01", "192.0.2.2"),
        ("Server-01", "192.0.2.3"),
        ("PC-01", "192.0.2.4"),
        ("PC-02", "192.0.2.5"),
    ]
    assert {device["device_type"] for device in devices} == {"router", "switch", "server", "computer"}
    assert all(device["simulated"] is True for device in devices)
    assert all(device["last_checked"].endswith("Z") for device in devices)


def test_device_lookup_and_missing_device(client):
    found = client.get("/api/devices/router-01")
    assert found.status_code == 200
    assert found.json()["device_name"] == "Router-01"

    missing = client.get("/api/devices/unknown-device")
    assert missing.status_code == 404
    assert missing.json() == {"detail": "Device not found"}


def test_summary_matches_the_same_snapshot(client):
    devices = app.state.store.devices
    response = client.get("/api/summary")
    assert response.status_code == 200
    summary = response.json()
    reachable = [device.latency_ms for device in devices if device.latency_ms is not None]

    assert summary["simulated"] is True
    assert summary["total_devices"] == 5
    assert summary["online_devices"] == sum(device.status is DeviceStatus.ONLINE for device in devices)
    assert summary["warning_devices"] == sum(device.status is DeviceStatus.WARNING for device in devices)
    assert summary["offline_devices"] == sum(device.status is DeviceStatus.OFFLINE for device in devices)
    assert summary["average_latency_ms"] == (round(sum(reachable) / len(reachable), 2) if reachable else None)
    assert summary["average_uptime_percent"] == round(sum(device.uptime_percent for device in devices) / 5, 2)
    assert summary["total_incoming_mbps"] == round(sum(device.incoming_mbps for device in devices), 2)
    assert summary["total_outgoing_mbps"] == round(sum(device.outgoing_mbps for device in devices), 2)
    assert summary["last_checked"].endswith("Z")
