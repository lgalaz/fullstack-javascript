# Functions, Closures, and Arrow Functions

## Functions

Functions are named blocks of reusable code.

```php
<?php

declare(strict_types=1);

function add(int $a, int $b): int {
    return $a + $b;
}

echo add(2, 3);
```

## Closures

A closure is an anonymous function that can capture variables from its surrounding scope.

Note: `use` captures by value, and `use (&$var)` captures by reference.

```php
<?php

declare(strict_types=1);

$taxRate = 0.2;

$priceWithTax = function (float $price) use ($taxRate): float {
    return $price * (1 + $taxRate);
};

echo $priceWithTax(10.0);
```

Capture by value (the closure keeps the original value):

```php
<?php

declare(strict_types=1);

$count = 1;

$byValue = function () use ($count): int {
    return $count;
};

$count = 2;

echo $byValue(); // 1
```

Capture by reference (the closure sees updates to the variable):

```php
<?php

declare(strict_types=1);

$count = 1;

$byRef = function () use (&$count): int {
    return $count;
};

$count = 2;

echo $byRef(); // 2
```

## Arrow Functions

Arrow functions are a short syntax for closures. They automatically capture variables from the parent scope by value.

```php
<?php

declare(strict_types=1);

$numbers = [1, 2, 3];
$double = array_map(fn (int $n): int => $n * 2, $numbers);

print_r($double);
// Output:
// Array
// (
//     [0] => 2
//     [1] => 4
//     [2] => 6
// )
// print_r is used because echo prints strings, while print_r prints arrays in a readable form.
```

## First-Class Callables

A first-class callable treats a function or method as a value you can pass around.

```php
<?php

declare(strict_types=1);

function greet(string $name): string {
    return "Hello, {$name}";
}

$callable = greet(...);

echo $callable('Ada');
```

Note: the `...` is required for first-class callable syntax. In PHP, `greet` alone would call the function, not reference it. `greet(...)` creates a callable value without invoking it.
