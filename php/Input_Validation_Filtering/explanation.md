# Input Validation and Filtering

## Validate at the Boundary

Validate all external input (HTTP, CLI, queues). Keep validation close to I/O and convert to typed values early.
PHP's filter API (`filter_input`, `filter_var`) provides built-in validators and sanitizers like
`FILTER_VALIDATE_EMAIL` and `FILTER_VALIDATE_INT` for common cases.

```php
<?php

declare(strict_types=1);

$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
if ($email === false) {
    throw new InvalidArgumentException('Invalid email');
}
```

## Normalize Types

Transform input into typed values so the rest of the codebase is predictable.

```php
<?php

declare(strict_types=1);

$amountInput = filter_input(INPUT_POST, 'amount', FILTER_VALIDATE_INT);
if ($amountInput === false) {
    throw new InvalidArgumentException('Invalid amount');
}

$amount = (int) $amountInput; // normalized integer value for downstream logic
```

## Defensive Defaults

Avoid `$_REQUEST`. Prefer explicit sources (`$_GET`, `$_POST`) and whitelist fields.
Because $_REQUEST merges GET, POST, and COOKIE. That makes the input source ambiguous and can allow a less‑trusted source (like a cookie or query string) to override intended data. Using $_GET or $_POST keeps intent clear, reduces attack surface, and makes validation more predictable. Whitelisting fields ensures you only accept expected input.
