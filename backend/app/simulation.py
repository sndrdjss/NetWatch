"""Generate reproducible mock values without contacting any device."""

from dataclasses import dataclass
from datetime import datetime, timezone
from ipaddress import IPv4Address
from random import Random

from .models import Device, DeviceStatus, DeviceType


SNAPSHOT_SECONDS = 10
STATUS_SECONDS = 120


@dataclass(frozen=True)
class DeviceSpec:
    device_id: str
    name: str
    kind: DeviceType
    address: str
    usual_status: DeviceStatus
    usual_uptime: float
    traffic_scale: float
    normal_latency: tuple[float, float]


DEVICE_SPECS = (
    DeviceSpec("router-01", "Router-01", DeviceType.ROUTER, "192.0.2.1", DeviceStatus.ONLINE, 99.98, 45, (3, 15)),
    DeviceSpec("switch-01", "Switch-01", DeviceType.SWITCH, "192.0.2.2", DeviceStatus.ONLINE, 99.95, 65, (1, 8)),
    DeviceSpec("server-01", "Server-01", DeviceType.SERVER, "192.0.2.3", DeviceStatus.WARNING, 98.70, 35, (5, 25)),
    DeviceSpec("pc-01", "PC-01", DeviceType.COMPUTER, "192.0.2.4", DeviceStatus.ONLINE, 97.80, 10, (8, 35)),
    DeviceSpec("pc-02", "PC-02", DeviceType.COMPUTER, "192.0.2.5", DeviceStatus.OFFLINE, 95.50, 8, (8, 35)),
)


def _status(spec: DeviceSpec, status_window: int, index: int) -> DeviceStatus:
    """Keep status stable longer than the rapidly changing traffic metrics."""
    chance = Random(status_window * 100 + index).random()
    if spec.usual_status is DeviceStatus.ONLINE:
        if chance < 0.03:
            return DeviceStatus.OFFLINE
        if chance < 0.10:
            return DeviceStatus.WARNING
        return DeviceStatus.ONLINE
    if spec.usual_status is DeviceStatus.WARNING:
        if chance < 0.10:
            return DeviceStatus.OFFLINE
        if chance < 0.75:
            return DeviceStatus.WARNING
        return DeviceStatus.ONLINE
    if chance < 0.75:
        return DeviceStatus.OFFLINE
    if chance < 0.90:
        return DeviceStatus.WARNING
    return DeviceStatus.ONLINE


def generate_snapshot(checked_at: datetime) -> tuple[Device, ...]:
    """Return the same five devices and values for a given 10-second window."""
    if checked_at.tzinfo is None:
        raise ValueError("checked_at must include a timezone")

    snapshot_window = int(checked_at.timestamp()) // SNAPSHOT_SECONDS
    status_window = int(checked_at.timestamp()) // STATUS_SECONDS
    timestamp = datetime.fromtimestamp(snapshot_window * SNAPSHOT_SECONDS, tz=timezone.utc)
    devices = []

    for index, spec in enumerate(DEVICE_SPECS):
        rng = Random(snapshot_window * 100 + index)
        status = _status(spec, status_window, index)
        uptime = round(max(0.0, spec.usual_uptime - rng.uniform(0, 0.08)), 2)

        if status is DeviceStatus.OFFLINE:
            latency = None
            incoming = outgoing = 0.0
        else:
            latency_range = spec.normal_latency if status is DeviceStatus.ONLINE else (100, 250)
            latency = round(rng.uniform(*latency_range), 2)
            traffic_factor = 0.35 if status is DeviceStatus.WARNING else 1.0
            incoming = round(rng.uniform(0.25, 1.0) * spec.traffic_scale * traffic_factor, 2)
            outgoing = round(rng.uniform(0.20, 0.90) * spec.traffic_scale * traffic_factor, 2)

        devices.append(
            Device(
                device_id=spec.device_id,
                device_name=spec.name,
                device_type=spec.kind,
                ip_address=IPv4Address(spec.address),
                status=status,
                latency_ms=latency,
                uptime_percent=uptime,
                incoming_mbps=incoming,
                outgoing_mbps=outgoing,
                last_checked=timestamp,
            )
        )

    return tuple(devices)
