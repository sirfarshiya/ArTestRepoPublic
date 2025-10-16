import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class ParseUtcDate {
    /**
     * Parses an ISO-8601 timestamp that is expected to be in UTC ("Z" suffix).
     *
     * @param input ISO-8601 timestamp, e.g. "2024-05-20T13:45:00Z".
     * @return the parsed {@link Instant} when parsing succeeds.
     * @throws IllegalArgumentException if the input cannot be parsed as a UTC instant.
     */
    public static Instant parseUtcInstant(String input) {
        try {
            OffsetDateTime dateTime = OffsetDateTime.parse(input, DateTimeFormatter.ISO_OFFSET_DATE_TIME);
            if (!dateTime.getOffset().equals(ZoneOffset.UTC)) {
                throw new IllegalArgumentException("Timestamp is not in UTC: " + input);
            }
            return dateTime.toInstant();
        } catch (DateTimeParseException ex) {
            throw new IllegalArgumentException("Invalid ISO-8601 timestamp: " + input, ex);
        }
    }

    public static void main(String[] args) {
        if (args.length == 0) {
            System.err.println("Usage: java ParseUtcDate <ISO-8601 timestamp>");
            System.exit(1);
        }

        Instant instant = parseUtcInstant(args[0]);
        System.out.println("Parsed instant: " + instant);
    }
}
