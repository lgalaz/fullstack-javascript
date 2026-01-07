# Attributes and Reflection

## Attributes

An attribute is metadata (data about code) attached to a class, method, property, or function.
Frameworks use attributes for routing, validation, or dependency injection.

## Reflection

Reflection is a way to inspect code structure at runtime.
Note: reflection is powerful but relatively slow, so frameworks often cache reflection results in production.

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
```
