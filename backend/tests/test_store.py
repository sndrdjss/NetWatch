"""Verify the in-memory cache changes only at a 10-second boundary."""

from datetime import datetime, timedelta, timezone
from unittest.mock import patch

from app.store import SnapshotStore


def test_store_reuses_and_refreshes_snapshots():
    class Clock:
        current = datetime(2026, 1, 1, 12, 0, 1, tzinfo=timezone.utc)

        @classmethod
        def now(cls, _timezone):
            return cls.current

    store = SnapshotStore()
    with patch("app.store.datetime", Clock):
        first = store.get_snapshot()
        Clock.current += timedelta(seconds=8)
        assert store.get_snapshot() is first

        Clock.current += timedelta(seconds=1)
        second = store.get_snapshot()
        assert second is not first
        assert second[0].last_checked == first[0].last_checked + timedelta(seconds=10)
