# Security Basics for Web Apps

## XSS and Output Escaping

XSS stands for Cross-Site Scripting. It happens when untrusted input is rendered as HTML or JavaScript.
Use `htmlspecialchars` to encode output.

```php
<?php

declare(strict_types=1);

$name = $_GET['name'] ?? '';

echo htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
```

Note: raw PHP echoes are not escaped by default. You must call htmlspecialchars() (or equivalent) yourself.

Frameworks help:
- Laravel Blade: {{ $var }} is escaped by default; {!! $var !!} outputs raw HTML.
- Symfony typically uses Twig, which auto‑escapes output by default. You opt out with the |raw filter.
- Django: auto‑escapes by default; you opt out with |safe.
- Next.js/React: escapes by default; you opt out with dangerouslySetInnerHTML.
- Vue.js: use v-html
So in plain PHP you must opt in to escaping; many frameworks flip that by default.

## CSRF Protection

CSRF stands for Cross-Site Request Forgery. It tricks a logged-in user into submitting a forged request from another site.
The risk exists because browsers automatically send cookies with requests, so a malicious site can trigger a state-changing POST that includes your session cookie.
A CSRF token works because it is a secret value tied to the user's session and included in the form/body; an attacker cannot read it, so their forged request will be missing the correct token.

```php
<?php

declare(strict_types=1);

session_start();

if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(16));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = $_POST['csrf_token'] ?? '';
    if (!hash_equals($_SESSION['csrf_token'], $token)) {
        http_response_code(403);
        exit('Invalid CSRF token');
    }

    echo 'Form accepted';
    exit;
}

$token = $_SESSION['csrf_token'];

echo "<form method=\"post\">";

echo "<input type=\"hidden\" name=\"csrf_token\" value=\"{$token}\">";

echo "<button>Submit</button>";

echo "</form>";
```

- Same file handles both GET and POST.
- On first GET it creates the token in $_SESSION and outputs the form with the hidden token.
- The form posts back to the same URL (no action), so it hits the same file.
- POST branch compares token and accepts/rejects.
Laravel actually stores the CSRF token in the session. It also sets an XSRF-TOKEN cookie so JavaScript (e.g., Axios) can read it and send it back in the X-XSRF-TOKEN header. That’s for SPA / AJAX convenience and same‑origin protection. 

## Password Hashing

Never store raw passwords. Use `password_hash` to store a one-way hash and `password_verify` to check.
Note: `PASSWORD_DEFAULT` can change over time as PHP upgrades hashing algorithms, so plan for rehashing on login.

```php
<?php

declare(strict_types=1);

// Registration: store this hash in your database.
$storedHash = password_hash('secret-password', PASSWORD_DEFAULT);

// Login: verify the user input against the stored hash.
$loginInput = 'secret-password';

if (password_verify($loginInput, $storedHash)) {
    echo 'Password ok';
}
```

## Beyond the Basics

For session hardening, cookies, crypto, and security headers, see
`php/Security_Sessions_Cookies_Crypto_Headers/explanation.md`.
```
