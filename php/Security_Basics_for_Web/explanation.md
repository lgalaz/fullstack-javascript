# Security Basics for Web Apps

## XSS and Output Escaping

XSS stands for Cross-Site Scripting. It happens when untrusted input is rendered as HTML or JavaScript.
Use `htmlspecialchars` to escape output.

```php
<?php

declare(strict_types=1);

$name = $_GET['name'] ?? '';

echo htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
```

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

## Password Hashing

Never store raw passwords. Use `password_hash` to store a one-way hash and `password_verify` to check.
Note: `PASSWORD_DEFAULT` can change over time as PHP upgrades hashing algorithms, so plan for rehashing on login.

```php
<?php

declare(strict_types=1);

$hash = password_hash('secret-password', PASSWORD_DEFAULT);

if (password_verify('secret-password', $hash)) {
    echo 'Password ok';
}
```
