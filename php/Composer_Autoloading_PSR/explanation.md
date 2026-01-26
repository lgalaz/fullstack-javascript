# Composer, Autoloading, and PSR

## Composer

Composer is PHP's dependency manager. It installs packages and generates an autoloader.

## Autoloading

Autoloading means classes are loaded automatically when used, instead of manual `require` calls.
Note: Composer can optimize the autoloader (classmap) for production to reduce filesystem lookups. (`composer dump-autoload -o (or --optimize)`)

## PSR-4

PSR means PHP Standards Recommendation. PSRs are published by PHP-FIG (PHP Framework Interop Group). PSR-4 defines how namespaces map to file paths. A namespace is a name prefix that groups related classes. The goal is ecosystem standardization so libraries and frameworks interoperate cleanly. Some projects debate or opt out of specific PSRs, but PSR-4 remains widely used.

Example `composer.json`:

```json
{
  "name": "acme/app",
  "require": {
    "php": "^8.2",
    "symfony/console": "^6.4",
    "guzzlehttp/guzzle": "^7.8"
  },
  "require-dev": {
    "phpunit/phpunit": "^10.5",
    "phpstan/phpstan": "^1.11",
    "squizlabs/php_codesniffer": "^3.8"
  },
  "autoload": {
    "psr-4": {
      "App\\": "src/"
    }
  },
  "scripts": {
    "post-autoload-dump": [
      "Illuminate\\Foundation\\ComposerScripts::postAutoloadDump",
      "@php artisan package:discover --ansi"
    ]
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

What `vendor/autoload.php` roughly does (simplified):

```php
<?php

declare(strict_types=1);

require __DIR__ . '/composer/autoload_real.php';

return ComposerAutoloaderInit::getLoader();
```

And the registered autoloader (also simplified):

```php
<?php

declare(strict_types=1);

spl_autoload_register(function (string $class): void {
    $classMap = [
        App\Email\Sender::class => __DIR__ . '/../src/Email/Sender.php',
        // vendor classes...
    ];

    if (isset($classMap[$class])) {
        require $classMap[$class];
    }
});
```

## Other PSRs You Should Know

- PSR-1 / PSR-12: basic and extended coding standards.
- PSR-3: Logger interface.
- PSR-7: HTTP messages (request/response objects).
- PSR-11: Container interface (dependency injection).

## Version Constraints

Use semantic version constraints and commit `composer.lock` for applications.
Lock files ensure reproducible builds and reduce supply chain risk.
