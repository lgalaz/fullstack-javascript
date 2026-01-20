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

## Named Arguments

Named arguments let you pass values by parameter name, improving clarity and allowing you to skip optional parameters.
Mixing named and positional: allowed only if positional come first. Once you use a named argument, all following arguments must be named.

```php
<?php

declare(strict_types=1);

function connect(string $host, int $port = 3306, bool $ssl = false): void {}

connect(host: 'db.local', ssl: true);
```

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

## Null Coalescing Operator and Null Coalescing Assignment

Use `??` when you want an expression fallback without changing the variable; use `??=` when you want to assign the fallback back into the variable only if it is null.
The null coalescing assignment operator (`??=`) sets a variable only when it is `null`. This operator is available in PHP 7.4+ (including PHP 8+). Both `??` and `??=` only check for `null` (not `false`, `0`, or empty strings).

```php
<?php

declare(strict_types=1);

// ?? : read-time fallback
$title = $input['title'] ?? 'Untitled';

// ??= : write-time fallback (sets only if null)
$config['timeout'] ??= 30;

$options = null;
$options ??= ['retry' => 3]; // assigns ['retry' => 3]

$timeout = 0;
$timeout ??= 30; // Stays 0 because it is not null.
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

final class ApiUser implements JsonSerializableUser, HasId {
    public function __construct(private int $id) {}

    public function id(): int {
        return $this->id;
    }

    public function toJson(): string {
        return json_encode(['id' => $this->id], JSON_THROW_ON_ERROR);
    }
}

function serializeUser(JsonSerializableUser&HasId $user): string {
    return $user->toJson();
}

function parseId(string|int $value): int {
    return (int) $value;
}

$user = new ApiUser(123);
echo serializeUser($user);
```

## `static`, `self`, and `parent` Return Types

`self` returns the class where the method is defined. `static` uses late static binding (resolve to the called class at runtime). `parent` refers to the immediate parent class.
Use `static` for fluent APIs that should return the subclass, `self` for exact-class contracts, and `parent` when delegating to a base implementation.

```php
<?php

declare(strict_types=1);

class BaseUser {
    public static function named(string $name): static {
        return new static(); // Returns AdminUser when called as AdminUser::named().
    }

    public function withName(string $name): self {
        return $this; // Returns BaseUser when defined here.
    }
}

class AdminUser extends BaseUser {}

$user = AdminUser::named('alice'); // AdminUser due to late static binding.
$base = (new BaseUser())->withName('bob'); // BaseUser
```

Using `parent` in an override:

```php
<?php

declare(strict_types=1);

class BaseRepo {
    public function reset(): self {
        return $this;
    }
}

class UserRepo extends BaseRepo {
    public function reset(): parent {
        return parent::reset(); // Returns BaseRepo.
    }
}

$repo = (new UserRepo())->reset();
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
