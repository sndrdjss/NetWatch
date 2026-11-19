"""Cache one in-memory snapshot for each 10-second window."""

from datetime import datetime, timezone
from threading import Lock

from .models import Device
from .simulation import SNAPSHOT_SECONDS, generate_snapshot


class SnapshotStore:
    def __init__(self) -> None:
        self._lock = Lock()
        self._window: int | None = None
        self._devices: tuple[Device, ...] = ()

    def get_snapshot(self) -> tuple[Device, ...]:
        now = datetime.now(timezone.utc)
        window = int(now.timestamp()) // SNAPSHOT_SECONDS
        with self._lock:
            if window != self._window:
                self._devices = generate_snapshot(now)
                self._window = window
            return self._devices
