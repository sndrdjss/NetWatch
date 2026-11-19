"""Response models shared by the API and simulator."""

from datetime import datetime
from enum import StrEnum
from ipaddress import IPv4Address

from pydantic import BaseModel, Field


class DeviceType(StrEnum):
    ROUTER = "router"
    SWITCH = "switch"
    SERVER = "server"
    COMPUTER = "computer"


class DeviceStatus(StrEnum):
    ONLINE = "Online"
    OFFLINE = "Offline"
    WARNING = "Warning"


class Device(BaseModel):
    device_id: str
    device_name: str
    device_type: DeviceType
    ip_address: IPv4Address
    status: DeviceStatus
    latency_ms: float | None = Field(ge=0)
    uptime_percent: float = Field(ge=0, le=100)
    incoming_mbps: float = Field(ge=0)
    outgoing_mbps: float = Field(ge=0)
    last_checked: datetime
    simulated: bool = True


class Summary(BaseModel):
    total_devices: int
    online_devices: int
    warning_devices: int
    offline_devices: int
    average_latency_ms: float | None
    average_uptime_percent: float
    total_incoming_mbps: float
    total_outgoing_mbps: float
    last_checked: datetime
    simulated: bool = True
