# Configuration, php.ini, and Error Reporting

## php.ini

`php.ini` is the main configuration file for PHP. Some settings can be overridden at runtime with `ini_set` (not all).

```php
<?php

declare(strict_types=1);

ini_set('memory_limit', '256M');
```

Key details a senior keeps in mind:

- PHP loads multiple ini files: a main `php.ini` plus any `conf.d`/`scan.d` files; order matters. They are normally found in your php installation directory
- Different SAPIs (CLI, FPM, Apache module) can load different ini paths and values.
- `ini_set` only works for `PHP_INI_ALL`/`PHP_INI_USER` settings; `PHP_INI_SYSTEM` and `PHP_INI_PERDIR` require server/FPM config.
- Per-directory overrides exist (`.user.ini` for FPM, `.htaccess`/`php_admin_value` for Apache).
- Use `php --ini` or `phpinfo()` to see exactly what’s loaded.
- Production vs dev settings (display_errors, error_reporting, opcache, memory_limit, timeouts, upload limits) should differ.
  - display_errors: whether PHP shows errors in the HTTP response/CLI output. Usually On in dev, Off in prod.
  - error_reporting: which error levels are reported (e.g., E_ALL). Controls what errors are captured at all.
  - opcache: bytecode cache settings (e.g., opcache.enable) that speed up PHP by caching compiled scripts.
  - memory_limit: max memory a PHP script can use (per request/CLI run).
timeouts: execution/input limits like max_execution_time and max_input_time.
  - upload limits: upload_max_filesize and post_max_size (and often max_file_uploads).
- precedence:
1) php.ini
3) scanned .ini files
4) .user.ini (per‑dir)
4) ini_set() (runtime, for allowed directives)

## Error Reporting

Use strict error reporting in development and log errors in production.

```php
<?php

declare(strict_types=1);

// Applies per-file; affects parameter and return type coercion, not general expressions.
function add(int $a, int $b): int {
    return $a + $b;
}

add('1', 2); // TypeError under strict_types=1; coerces under strict_types=0.

function total(): int {
    return '3'; // TypeError under strict_types=1; coerces under strict_types=0.
}

// Development: show all errors and warnings to aid debugging.
error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('log_errors', '0');

// Production: hide errors from users and log them instead.
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');
```

## Assertions

Assertions are quick, short-lived checks used during development/staging to verify assumptions and invariants.
They are handy during debugging or refactoring when writing a full unit test would be slower than adding an `assert`.
Think of them like a conditional breakpoint: they fire when an assumption is violated.
Validation is for external uncertainty.
Assertions are for internal invariants.
Assertions enforce invariants; validation handles reality.
Assertions are about developer confidence, not safety.
Assertions are for internal invariants, tests are for observable behavior. 
They are there to:
- Catch regressions
- Make assumptions explicit
- Protect refactors

They do not protect production systems from bad input.
Good assertion targets:
- State machines (pending → active)
``` php
function activate(User $user) {
    assert($user->status === 'pending');
    $user->status = 'active';
}
```
- Non-null guarantees
- Monotonic values (balances ≥ 0)
- Ordering assumptions
- Postconditions

In production, assertions can be useful for catching rare, real-world edge cases while you observe live traffic. Example: an assertion that only triggers when a third-party API returns an unexpected payload that never showed up in test data.

Assertions can also provide internal visibility into private state that external tests do not touch. 
Example: after a method mutates private fields, an assertion verifies that related invariants still hold, even though those fields are not exposed by the public API.
Real-life example: a `Cart` recalculates a private `$totalCents` and `$itemCount` after applying discounts; an assertion checks that `$totalCents` equals the sum of line items and that `$itemCount` matches the number of items. Tests can still verify totals through the public API, but the assertion catches inconsistent intermediate state during refactors.

```php
<?php

declare(strict_types=1);

assert($amount >= 0, 'Amount must be non-negative');
```

Note: `zend.assertions` controls whether assertions run in production.
