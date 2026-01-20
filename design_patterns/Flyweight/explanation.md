# Flyweight

## Overview

Shares common state to support large numbers of fine-grained objects efficiently.
Similar idea to memoization, but different goal. Memoization caches results of computations to avoid recomputation; Flyweight shares object instances/state to reduce memory use. Memoization is about speed; Flyweight is about memory and object count.

## When to use

- You have many similar objects and memory is a concern.
- Intrinsic state can be shared across instances.
- You can externalize variable state to callers.

## Trade-offs

- Introduces shared state complexity.
- Externalizing state adds call-site burden.
- Thread safety can be harder to reason about.
## PHP example

```php
<?php

class Character
{
    public function __construct(public string $symbol)
    {
    }
}

class CharacterFactory
{
    /** @var array<string, Character> */
    private array $pool = [];

    public function get(string $symbol): Character
    {
        if (!isset($this->pool[$symbol])) {
            $this->pool[$symbol] = new Character($symbol);
        }

        return $this->pool[$symbol];
    }
}

$factory = new CharacterFactory();
$word = 'balloon';

foreach (str_split($word) as $letter) {
    $char = $factory->get($letter);
    echo $char->symbol;
}

echo "\n";
```
