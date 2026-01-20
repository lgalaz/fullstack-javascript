# Prototype

## Overview

Creates new objects by copying an existing prototype instance.
In JavaScript, `obj.prototype` is a language mechanism for inheritance, not the design pattern, but both are related in spirit: they encourage reuse of an existing object's structure/behavior rather than building everything from scratch.

## When to use

- Construction is expensive and cloning is cheaper.
- You want to create variants by tweaking a base object.
- You need to avoid hardcoding concrete types.

## Trade-offs

- Cloning can be tricky for deep graphs and references.
- Requires clear copy semantics (deep vs shallow).
- Can hide real dependencies behind copies.
## PHP example

```php
<?php

class Banner
{
    public function __construct(public string $title, public string $color)
    {
    }

    public function __clone(): void
    {
        $this->title .= ' (copy)';
    }
}

$original = new Banner('Sale', 'red');
$copy = clone $original;

echo $original->title . "\n";
echo $copy->title . "\n";
```
