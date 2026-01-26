# Error Handling and Exceptions

## Errors vs Exceptions

An error is a runtime problem (like a type error). An exception is an object you throw and catch to handle failures.
Both implement the `Throwable` interface.

## Try/Catch

```php
<?php

declare(strict_types=1);

function divide(int $a, int $b): float {
    if ($b === 0) {
        throw new InvalidArgumentException('Division by zero');
    }

    return $a / $b;
}

try {
    echo divide(10, 0);
} catch (InvalidArgumentException $e) {
    echo $e->getMessage();
}
```

## Converting Errors to Exceptions

`set_error_handler` lets you turn PHP errors into exceptions for consistent handling.
It is not configurable in `php.ini`; it is configured per request at runtime, and most frameworks set it up for you.
Note: avoid error suppression with `@` in production; it hides failures and makes debugging harder.

Why this is useful:
- A single error model makes failures predictable and easier to test.
- Exceptions can be caught, logged, and handled in one place, instead of mixing warnings and fatal errors.

What happens without exceptions:
- Some errors are warnings/notices and execution continues.
- Fatal errors stop the script and return a 500 error in web contexts.
Where they are logged: PHP writes to the `error_log` file configured in `php.ini`, or to the web server/PHP-FPM logs if `error_log` is not set. In containerized setups, errors often go to stdout/stderr.

Why error suppression exists:
- Historically, it allowed legacy code to attempt optional operations (like reading missing files) without noisy warnings.
- It is still available for backward compatibility, but better patterns exist (explicit checks, exceptions, or error handlers).

```php
<?php

declare(strict_types=1);

set_error_handler(function (int $severity, string $message): bool {
    throw new ErrorException($message, 0, $severity);
});

try {
    echo $undefinedVar;
} catch (ErrorException $e) {
    echo 'Caught: ' . $e->getMessage();
}

// Error suppression example (not recommended):
@$data = file_get_contents('missing.txt');

// With @, the warning is suppressed and you get false instead of a visible warning.
if ($data === false) {
    echo "Read failed, but the warning was hidden.\n";
}
```
```
