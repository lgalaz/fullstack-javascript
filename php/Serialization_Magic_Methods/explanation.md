# Serialization and Magic Methods

## Serialization

Prefer JSON for data exchange. Use PHP serialization only for internal storage and never on untrusted input.
`unserialize` on untrusted data is a common security risk (object injection).
Attackers can craft payloads that instantiate classes and trigger magic methods, it can lead to SSRF (Server side request forgery), file access, or worse.

PHP 8+ favors `__serialize()` and `__unserialize()` over the older `Serializable` interface.

```php
<?php

declare(strict_types=1);

final class Token {
    public function __construct(private string $id, private string $secret) {}

    public function __serialize(): array {
        return ['id' => $this->id];
    }

    public function __unserialize(array $data): void {
        $this->id = $data['id'];
        $this->secret = '';
    }
}

// serialize and unserialize are built-in global PHP functions 
$token = new Token('abc123', 's3cr3t');
$serialized = serialize($token);
$restored = unserialize($serialized, ['allowed_classes' => [Token::class]]);
```

## Magic Methods (Use Sparingly)

Magic methods can improve ergonomics but hide behavior.

- `__toString()`: string representation.
- `__invoke()`: call an object like a function.
- `__get()`/`__set()`: dynamic property access (avoid in strict code).
__get()/__set() hides where data is coming from and bypasses normal property visibility and type checks. That makes behavior harder to trace, breaks static analysis/IDE autocomplete, and can introduce subtle bugs (like typos silently creating “virtual” properties). In strict codebases, explicit properties and methods are clearer and safer.
- `__call()`/`__callStatic()`: handle undefined methods.

```php
<?php

declare(strict_types=1);

final class MoneyFormatter {
    public function __invoke(int $cents): string {
        return number_format($cents / 100, 2);
    }
}

$format = new MoneyFormatter();
echo $format(1234); // 12.34
```

Example: `__call()` and `__callStatic()` for dynamic method handling.

```php
<?php

declare(strict_types=1);

final class Logger {
    public function __call(string $name, array $arguments): void {
        echo strtoupper($name) . ': ' . implode(' ', $arguments) . "\n";
    }

    public static function __callStatic(string $name, array $arguments): void {
        echo 'STATIC ' . strtoupper($name) . ': ' . implode(' ', $arguments) . "\n";
    }
}

$log = new Logger();
$log->info('User', 'logged', 'in'); // INFO: User logged in
Logger::debug('Cache', 'miss');     // STATIC DEBUG: Cache miss
```

Example: `__get()` and `__set()` for dynamic properties (use sparingly).

```php
<?php

declare(strict_types=1);

final class Config {
    private array $values = [];

    public function __get(string $name): mixed {
        return $this->values[$name] ?? null;
    }

    public function __set(string $name, mixed $value): void {
        $this->values[$name] = $value;
    }
}

$config = new Config();
$config->timezone = 'UTC';
echo $config->timezone; // UTC
```

Avoid heavy reliance on magic for domain models; explicit methods are easier to trace and test.
