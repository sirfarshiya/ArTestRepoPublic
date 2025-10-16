from __future__ import annotations

from datetime import datetime, timezone


def parse_utc_datetime(value: str) -> datetime:
    """Parse an ISO-8601 string that is expected to be UTC ("Z" suffix).

    Args:
        value: ISO-8601 timestamp such as "2024-05-20T13:45:00Z".

    Returns:
        A timezone-aware ``datetime`` set to UTC.

    Raises:
        ValueError: If the value is not a valid ISO-8601 timestamp or is not UTC.
    """

    dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if dt.tzinfo != timezone.utc:
        raise ValueError(f"Timestamp is not in UTC: {value}")
    return dt


if __name__ == "__main__":
    import sys

    if len(sys.argv) != 2:
        print("Usagegggggggggggggg: python parse_utc_date.py <ISO-8601 timestamp>")
        raise SystemExit(1)

    parsed = parse_utc_datetime(sys.argv[1])
    print("wwwwwwwwwwwwwwwwParsed datetime: {parsed.isoformat()}")
