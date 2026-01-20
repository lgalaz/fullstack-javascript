# Attributes and Reflection

## Attributes

An attribute is metadata (data about code) attached to a class, method, property, or function.
Frameworks use attributes for routing, validation, or dependency injection.
Attributes are native (PHP 8+), structured, and type-safe compared to docblock annotations.
You define attributes as classes marked with `#[Attribute]` and you can control where they apply
and whether they can be repeated.

Common attribute use cases:
- Routing, validation rules, and DI configuration in frameworks.
- ORM mapping metadata (table/column info).
- Serialization groups or API schema hints.
- Marking sensitive parameters for safer stack traces and logs.

Example attribute declaration with targets and repeatable:

```php
<?php

declare(strict_types=1);

#[Attribute(Attribute::TARGET_METHOD | Attribute::TARGET_CLASS, Attribute::IS_REPEATABLE)]
class Route {
    public function __construct(
        public string $path,
        public string $method = 'GET',
    ) {}
}
```
Attribute::TARGET_METHOD: allow use on methods.
Attribute::TARGET_CLASS: allow use on classes.
Attribute::IS_REPEATABLE: allow the same attribute to be applied multiple times.


Built-in attributes to know:
- `#[Deprecated]` marks code as deprecated.
- `#[SensitiveParameter]` masks argument values in stack traces (useful for secrets).
- `#[ReturnTypeWillChange]` suppresses return-type deprecation notices in legacy code.
- `#[AllowDynamicProperties]` (legacy compatibility).

Example of built-in attributes:

```php
<?php

declare(strict_types=1);

#[Deprecated(message: 'Use NewMailer instead', since: '2.1')]
class LegacyMailer {}

function login(#[SensitiveParameter] string $password): bool {
    return true;
}

#[\SensitiveParameterValue]
final class ApiToken {
    public function __construct(public string $value) {}
}

class LegacyIterator implements IteratorAggregate {
    #[ReturnTypeWillChange]
    public function getIterator() {
        yield 1;
    }
}

#[AllowDynamicProperties]
class LegacyModel {}
```


In larger or enterprise codebases, attributes help centralize validation, auditing, and security boundaries
so frameworks and tooling can enforce rules consistently.

Example of a built-in security attribute:

```php
<?php

declare(strict_types=1);

function login(#[SensitiveParameter] string $password): bool {
    // authentication logic
    return true;
}
```

Examples are usually custom attributes (or framework-provided) that annotate rules and policies. Common ones:

Validation: #[Assert\Email], #[Assert\Length(min: 8)], #[Validate], #[Required].
Auditing: #[Audit], #[LogChange], #[TrackAccess], #[Sensitive] for redaction in logs.
Security boundaries: #[RequiresRole('admin')], #[RequiresPermission('invoices:read')].
Frameworks then read these via reflection and enforce them consistently.

## Reflection

Reflection is a way to inspect code structure at runtime.
Note: reflection is powerful but relatively slow, so frameworks often cache reflection results in production.
Symfony supports attributes heavily (routing, validation, DI, serializer, security), but they are optional; you can still use YAML/XML/PHP config. In production, Symfony typically caches the resolved metadata into compiled PHP arrays under `var/cache/` so it can `require` those files instead of re-reflecting on every request. It do this by running:
`php bin/console cache:warmup` (or `php bin/console cache:clear` which also warms in prod). This generates the compiled metadata in var/cache/.
Cache "warmup" means precomputing those files ahead of time (e.g., during deploy) so the first request doesn't pay the reflection cost.

```php
<?php

declare(strict_types=1);

#[Attribute]
class Route {
    public function __construct(public string $path) {}
}

final class UserController {
    #[Route('/users')]
    public function index(): string {
        return 'list users';
    }
}

$method = new ReflectionMethod(UserController::class, 'index');
$attributes = $method->getAttributes(Route::class);
$route = $attributes[0]->newInstance();

echo $route->path;
// Output:
// /users
```
