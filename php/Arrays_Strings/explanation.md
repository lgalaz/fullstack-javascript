# Arrays and Strings

## Arrays

PHP arrays are ordered maps. That means they can act like lists (0, 1, 2) or associative maps (key => value).

```php
<?php

declare(strict_types=1);

$list = ['red', 'green', 'blue'];
$map = ['id' => 1, 'name' => 'Ada'];

foreach ($list as $index => $value) {
    echo "{$index}: {$value}\n";
}

echo $map['name'];
// Output from loop:
// 0: red
// 1: green
// 2: blue
// Output from map:
// Ada
```

Arrays can be nested. Each element can be another array, and different elements can have different keys. This is often called a jagged (or ragged) array. The advantage is flexibility: you can model data where rows have different shapes without forcing a fixed dimension or schema. Example: scraped product rows where some items have `price` and `discount`, while others only have `price`.

```php
<?php

declare(strict_types=1);

$people = [
    ['name' => 'Ada'],
    ['lastname' => 'Galaz', 'name' => 'Luis'],
];

echo $people[0]['name'];
echo $people[1]['lastname'];
```

If you access a missing key, PHP raises a warning and returns `null`. Use the null coalescing operator (`??`) to provide a default: it returns the left value if it is set and not `null`, otherwise it returns the right value.

```php
<?php

declare(strict_types=1);

echo $people[0]['lastname']; // Warning: undefined array key
echo $people[0]['lastname'] ?? 'unknown';
```

Common array operations:

```php
<?php

declare(strict_types=1);

$items = [1, 2, 3, 4];
$even = array_filter($items, fn (int $n): bool => $n % 2 === 0);
$squares = array_map(fn (int $n): int => $n * $n, $items);
$sum = array_reduce($items, fn (int $carry, int $n): int => $carry + $n, 0);

print_r($even);
print_r($squares);
echo $sum;
```

Note: PHP's array function signatures are historically inconsistent (`array_filter($items, $callback)` vs `array_map($callback, $items)` vs `array_reduce($items, $callback, $initial)`). This is mostly legacy from older standard library design and backward compatibility constraints, not a deliberate modern API style. The language is open and long-lived, with many contributors and extensions added over decades, so new APIs often had to fit existing patterns rather than redesign everything. Governance and release coordination also matured over time; by PHP 5 the process was more organized, and later the RFC (Request for Comments) process formalized language changes.

## Strings

Strings are sequences of bytes. For multi-byte text like UTF-8 (Unicode Transformation Format 8-bit), use `mb_*` functions (mb = multibyte). The standard string functions operate on bytes, not characters, so `strlen` counts bytes and can return a larger number for non-ASCII text. The `mb_*` variants understand multibyte encodings and count characters correctly, which matters for validation, slicing, and UI display.

```php
<?php

declare(strict_types=1);

$text = 'Hello, world';
$parts = explode(', ', $text);
$joined = implode(' | ', $parts);

echo $joined . "\n";

echo mb_strlen('cafe');
```
