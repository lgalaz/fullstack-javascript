# Date, Time, and Timezones

## Use DateTimeImmutable

`DateTimeImmutable` avoids accidental mutation and is safer for shared values.

```php
<?php

declare(strict_types=1);

$utc = new DateTimeZone('UTC');
$now = new DateTimeImmutable('now', $utc);
$tomorrow = $now->add(new DateInterval('P1D'));
```

## Timezone Discipline

Store timestamps in UTC and convert at the edges (UI, reports).
Avoid mixing server timezone defaults with explicit timezones.

```php
<?php

declare(strict_types=1);

$tz = new DateTimeZone('America/New_York');
$local = new DateTimeImmutable('2025-01-15 09:00:00', $tz);
$utc = $local->setTimezone(new DateTimeZone('UTC'));
```

## Parsing and Validation

Avoid ambiguous formats. Prefer ISO 8601 and validate parsing.

```php
<?php

declare(strict_types=1);

$input = '2025-02-01T12:30:00+00:00';
$dt = DateTimeImmutable::createFromFormat(DateTimeInterface::ATOM, $input);

if ($dt === false) {
    throw new InvalidArgumentException('Invalid timestamp');
}
```

## Durations

Use `DateInterval` for calendar-aware durations (months, days) and `DateTimeImmutable::diff()` for differences.

```php
<?php

declare(strict_types=1);

$start = new DateTimeImmutable('2025-03-01', new DateTimeZone('UTC'));
$plusOneMonth = $start->add(new DateInterval('P1M'));

$end = new DateTimeImmutable('2025-04-15', new DateTimeZone('UTC'));
$difference = $start->diff($end);

echo $difference->days;
```
