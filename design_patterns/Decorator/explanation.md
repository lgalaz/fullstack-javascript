# Decorator

## Overview

Adds behavior to objects dynamically by wrapping them.

## When to use

- You need flexible combinations of behaviors.
- Inheritance would lead to many subclasses.
- You want to extend behavior without changing the base class.

## Trade-offs

- Many small wrapper objects can be hard to trace.
- Order of decoration can change behavior.
- Debugging requires inspecting multiple layers.
## PHP example

```php
<?php

interface Coffee
{
    public function cost(): int;
    public function description(): string;
}

class Espresso implements Coffee
{
    public function cost(): int
    {
        return 3;
    }

    public function description(): string
    {
        return 'Espresso';
    }
}

abstract class CoffeeDecorator implements Coffee
{
    public function __construct(protected Coffee $coffee)
    {
    }
}

class MilkDecorator extends CoffeeDecorator
{
    public function cost(): int
    {
        return $this->coffee->cost() + 1;
    }

    public function description(): string
    {
        return $this->coffee->description() . ', milk';
    }
}

class SugarDecorator extends CoffeeDecorator
{
    public function cost(): int
    {
        return $this->coffee->cost() + 1;
    }

    public function description(): string
    {
        return $this->coffee->description() . ', sugar';
    }
}

$coffee = new SugarDecorator(new MilkDecorator(new Espresso()));
echo $coffee->description() . " = $" . $coffee->cost() . "\n";
```
