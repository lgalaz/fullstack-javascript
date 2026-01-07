# Composer, Autoloading, and PSR

## Composer

Composer is PHP's dependency manager. It installs packages and generates an autoloader.

## Autoloading

Autoloading means classes are loaded automatically when used, instead of manual `require` calls.
Note: Composer can optimize the autoloader (classmap) for production to reduce filesystem lookups.

## PSR-4

PSR means PHP Standards Recommendation. PSRs are published by PHP-FIG (PHP Framework Interop Group). PSR-4 defines how namespaces map to file paths. A namespace is a name prefix that groups related classes. The goal is ecosystem standardization so libraries and frameworks interoperate cleanly. Some projects debate or opt out of specific PSRs, but PSR-4 remains widely used.

Example `composer.json`:

```json
{
  "name": "acme/app",
  "require": {},
  "autoload": {
    "psr-4": {
      "App\\": "src/"
    }
  }
}
```

Example class:

```php
<?php
// src/Email/Sender.php

namespace App\Email;

declare(strict_types=1);

final class Sender {
    public function send(string $to, string $body): void {
        // send email
    }
}
```

Usage (after running `composer dump-autoload`):

```php
<?php

declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';

$sender = new App\Email\Sender();
$sender->send('user@example.com', 'Hello');
```
