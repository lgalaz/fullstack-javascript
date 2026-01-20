# Docblock Annotations (Legacy)

## Introduction

Before PHP 8, many frameworks used docblock annotations (comments parsed at runtime) to attach metadata.
PHP 8 introduced native attributes, which are preferred for new code because they are structured and type-safe.

## Docblock Annotation Example

```php
<?php

/**
 * @Route(method="GET", path="/users/{id}")
 */
final class UserController
{
    public function show(int $id): array
    {
        return ['id' => $id];
    }
}
```

## Reading Docblocks

```php
$method = new ReflectionMethod(UserController::class, 'show');
$doc = $method->getDocComment();
var_dump($doc);
```

## When to Use

- You are maintaining legacy systems that rely on docblock parsing.
- You need to support PHP versions that predate attributes.

## Migration Guidance

For new code, use native attributes and reflection (see `php/Attributes_and_Reflection/explanation.md`).
