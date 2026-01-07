# Types and Strict Typing (PHP 8+)

## Scalar and Compound Types

PHP supports scalar types (int, float, string, bool) and compound types (array, object, callable, iterable).

```php
<?php

declare(strict_types=1);

function formatPrice(float $amount, string $currency): string {
    return $currency . ' ' . number_format($amount, 2);
}

echo formatPrice(19.99, 'USD');
```

## Strict Types

`declare(strict_types=1);` disables most implicit type coercion for function arguments and return values.
Type coercion means PHP automatically converts values (for example, a string "123" to an int 123).

Note: strict types are per-file, so mixed strict/non-strict codebases can behave differently across files.

## Nullable Types

A nullable type allows `null` as a valid value.

```php
<?php

declare(strict_types=1);

function findUserName(?int $id): ?string {
    if ($id === null) {
        return null;
    }

    return 'user-' . $id;
}
```

## Union and Intersection Types

A union type allows multiple possible types using `|`. An intersection type requires a value to satisfy all listed interfaces using `&`. An interface is a contract of methods a class must implement.

```php
<?php

declare(strict_types=1);

interface JsonSerializableUser {
    public function toJson(): string;
}

interface HasId {
    public function id(): int;
}

function serializeUser(JsonSerializableUser&HasId $user): string {
    return $user->toJson();
}

function parseId(string|int $value): int {
    return (int) $value;
}
```

## Mixed, Never, and False/True Types

- `mixed` means any type.
- `never` means the function never returns (it always throws or exits). This makes control flow predictable, lets static analyzers flag unreachable code, and documents intent for readers and tooling.
- `false` or `true` can be used as literal types.
RuntimeException is a built-in exception class.

```php
<?php

declare(strict_types=1);

function fail(string $message): never {
    throw new RuntimeException($message);
}

function redirect(string $url): never {
    header("Location: {$url}", true, 302);
    exit;
}

function findUser(int $id): array|false {
    return $id === 1 ? ['id' => 1] : false;
}
```

## Typed Properties and Constructor Promotion

Typed properties enforce property types at runtime. Constructor property promotion lets you declare and initialize properties in the constructor signature.

```php
<?php

declare(strict_types=1);

final class User {
    public function __construct(
        public int $id,
        public string $email,
    ) {}
}
```
