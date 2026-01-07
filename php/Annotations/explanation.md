# Annotations (Attributes)

## Introduction

PHP 8 added native attributes, which are the modern, built-in replacement for docblock annotations. Attributes attach metadata to classes, methods, properties, and parameters, and can be read via reflection.

## Basic Attribute Example

```php
<?php

#[Attribute]
class Route
{
    public function __construct(public string $method, public string $path) {}
}

class UserController
{
    #[Route('GET', '/users/{id}')]
    public function show(int $id): array
    {
        return ['id' => $id];
    }
}
```

## Reading Attributes

```php
$method = new ReflectionMethod(UserController::class, 'show');
$attributes = $method->getAttributes(Route::class);
$route = $attributes[0]->newInstance();
var_dump($route);
// object(Route)#1 (2) { ["method"]=> string(3) "GET" ["path"]=> string(11) "/users/{id}" }
```

## When Attributes Are a Good Idea

- You want first-class, structured metadata instead of docblock parsing.
- You use frameworks that map attributes to routing or validation.

## When to Avoid

- Your target PHP version is below 8.0.
- Simple configuration can live in code or config files.
