# ArTestRepoPublic

## UTC Date Parsing Examples

This repository now includes examples for parsing UTC (often written as "Z" or "Zulu" time) timestamps in both Java and Python.

### Java (`ParseUtcDate.java`)

Compile and run the Java example:

```bash
javac ParseUtcDate.java
java ParseUtcDate 2024-05-20T13:45:00Z
```

This uses `java.time.OffsetDateTime` to ensure the input timestamp is in UTC and returns an `Instant`.

### Python (`parse_utc_date.py`)

Run the Python script directly:

```bash
python parse_utc_date.py 2024-05-20T13:45:00Z
```

The script returns a timezone-aware `datetime` object that must be in UTC.

## GreenBasket vegetable ordering site

Open `veggie-order-site/index.html` in your browser to try the GreenBasket
ordering experience. The page lets you:

- Choose from a curated list of vegetables with live price calculations.
- Enter customer delivery details and preferred delivery slot.
- Pick a payment method (card, UPI, or cash on delivery) with contextual
  fields for secure collection.
- Generate an on-screen confirmation that summarises the order total and
  delivery information.

Because this is a static demo, the order form does not submit to a backend.
