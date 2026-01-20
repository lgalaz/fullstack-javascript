# Configuration, php.ini, and Error Reporting

## php.ini

`php.ini` is the main configuration file for PHP. Some settings can be overridden at runtime with `ini_set` (not all).

```php
<?php

declare(strict_types=1);

ini_set('memory_limit', '256M');
```

## Error Reporting

Use strict error reporting in development and log errors in production.

```php
<?php

declare(strict_types=1);

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
