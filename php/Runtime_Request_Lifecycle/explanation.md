# Runtime and Request Lifecycle

## What Runs PHP

PHP runs inside a SAPI (Server API, API means Application Programming Interface), which is the interface between PHP and the web server or runtime environment.
Common SAPIs:

- PHP-FPM: FastCGI Process Manager (Fast Common Gateway Interface Process Manager), the most common way to run PHP behind Nginx or Apache.
- CLI: Command Line Interface for scripts and tooling.

## Request/Response Basics

A web request is a single HTTP (Hypertext Transfer Protocol) request that PHP handles, then exits. PHP is stateless by default, meaning memory does not persist across requests unless you use external storage (database, cache, or session).

Note: In PHP-FPM, a pool of worker processes handles requests. Each worker handles one request at a time, then is reused for the next request, so per-request globals should not be treated as long-lived state.

## Superglobals

Superglobals are built-in arrays that contain request data.

- `$_GET`: query string parameters
- `$_POST`: form data
- `$_COOKIE`: cookie values
- `$_SERVER`: request and server metadata
- `$_FILES`: uploaded files
- `$_REQUEST` is also a superglobal. It merges $_GET, $_POST, and $_COOKIE (order controlled by request_order/variables_order in php.ini), so many teams avoid it for clarity.

Example using `filter_input` (a safe input-reading API):

```php
<?php
// public/profile.php

declare(strict_types=1);

$userId = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

if ($userId === null || $userId === false) {
    // HTTP/1.1 400 Bad Request
    // Content-Type: text/html; charset=UTF-8
    // Invalid id

    http_response_code(400);
    echo 'Invalid id';
    exit;
}

// HTTP/1.1 200 OK
// Content-Type: text/html; charset=UTF-8
// Profile for user 123
echo "Profile for user {$userId}";
```

## Sessions

A session stores per-user state on the server and is linked to the client by a cookie.

```php
<?php
// public/login.php

declare(strict_types=1);

session_start();

$_SESSION['user_id'] = 123;

echo 'Logged in';
```
