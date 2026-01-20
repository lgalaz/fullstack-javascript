# Security: Sessions, Cookies, Crypto, Headers

## Session Hardening

Regenerate session IDs after login and set strict cookie flags.

```php
<?php

declare(strict_types=1);

session_set_cookie_params([
    'httponly' => true,
    'secure' => true,
    'samesite' => 'Lax',
]);

session_start();
session_regenerate_id(true);
```

## Cookie Flags

Use:
- `HttpOnly`: prevents JavaScript access.
- `Secure`: only over HTTPS.
- `SameSite`: limits cross-site requests.

## Cryptography

Use libsodium for modern crypto primitives. 
Use libsodium when you need cryptography beyond simple hashing: encrypting sensitive data, authenticated encryption, key derivation, password hashing, or signed tokens with modern algorithms. It’s especially advisable for anything security‑critical, internet‑facing, or long‑lived—basically whenever correctness and safe defaults matter more than “quick and easy.”

```php
<?php

declare(strict_types=1);

$key = sodium_crypto_secretbox_keygen();
$nonce = random_bytes(SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
$cipher = sodium_crypto_secretbox('payload', $nonce, $key);
```

Replay prevention with a nonce (HMAC-signed request):
Replays are captured valid requests sent again to repeat an action (e.g., double charges).
Prevent them by adding freshness (nonce/timestamp) so duplicates are rejected.
This fits under cryptography because HMAC provides integrity but not freshness.

```php
<?php

declare(strict_types=1);

// Client side: generate and send nonce + payload + signature
$secret = 'shared-secret';
$payload = 'amount=100';
$nonce = bin2hex(random_bytes(16));
$signature = hash_hmac('sha256', $nonce . '.' . $payload, $secret);
// POST body includes $payload, $nonce, $signature

// Server side: reject reused nonces, then verify signature
$seen = []; // replace with Redis/DB in real apps
if (isset($seen[$nonce])) {
    http_response_code(409);
    exit('Replay detected');
}
$seen[$nonce] = true;

$expected = hash_hmac('sha256', $nonce . '.' . $payload, $secret);
if (!hash_equals($expected, $signature)) {
    http_response_code(401);
    exit('Invalid signature');
}
```

## Secure Headers

Send security headers at the edge or in your app.

```php
<?php

declare(strict_types=1);

header('X-Content-Type-Options: nosniff');
Stops browsers from MIME‑sniffing and interpreting files as a different content type (helps block certain XSS/file‑type confusion attacks).
header('X-Frame-Options: DENY');
Prevents your pages from being embedded in iframes, blocking clickjacking.
header('Referrer-Policy: no-referrer');
Never sends the Referer header, preventing URL leakage to other sites.
header("Content-Security-Policy: default-src 'self'");
Limits what resources can load; here it allows only same‑origin resources by default, reducing XSS impact.
```

## Audit Logging

Log security-relevant actions (auth, permissions, money movement) with immutable, append-only logs.
