"""Check timing and metric relationships in the simulator."""

from datetime import datetime, timedelta, timezone

from app.models import DeviceStatus
from app.simulation import generate_snapshot


def test_snapshot_is_stable_within_a_ten_second_window():
    start = datetime(2026, 1, 1, 12, 0, 1, tzinfo=timezone.utc)
    first = generate_snapshot(start)
    same_window = generate_snapshot(start + timedelta(seconds=8))
    next_window = generate_snapshot(start + timedelta(seconds=10))

    assert first == same_window
    assert first[0].last_checked == datetime(2026, 1, 1, 12, 0, tzinfo=timezone.utc)
    assert next_window[0].last_checked == first[0].last_checked + timedelta(seconds=10)


def test_offline_and_warning_metrics_are_consistent():
    snapshot = generate_snapshot(datetime(2026, 1, 1, tzinfo=timezone.utc))
    assert len(snapshot) == 5
    for device in snapshot:
        assert 0 <= device.uptime_percent <= 100
        if device.status is DeviceStatus.OFFLINE:
            assert device.latency_ms is None
            assert device.incoming_mbps == device.outgoing_mbps == 0
        elif device.status is DeviceStatus.WARNING:
            assert device.latency_ms >= 100
        else:
            assert device.latency_ms < 100
        assert device.simulated is True
