# Iterator

## Overview

Provides sequential access to elements without exposing the underlying structure.

## When to use

- Collections should expose traversal without leaking representation.
- You need multiple traversal strategies.
- Callers should not manage indexing or state.

## Trade-offs

- Additional objects for iteration state.
- Concurrent modification rules can be tricky.
- May hide performance characteristics.
## PHP example

```php
<?php

class BookCollection implements IteratorAggregate
{
    public function __construct(private array $books)
    {
    }

    public function getIterator(): Traversable
    {
        return new ArrayIterator($this->books);
    }
}

$collection = new BookCollection(['Dune', '1984', 'Foundation']);
foreach ($collection as $book) {
    echo $book . "\n";
}
```
